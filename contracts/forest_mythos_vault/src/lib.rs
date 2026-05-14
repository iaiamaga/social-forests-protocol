#![no_std]

use soroban_sdk::{
    contract, contracterror, contractevent, contractimpl, contracttype, panic_with_error, Address,
    Env, Vec,
};

// =============================================================================
// EVENTOS BIOLÓGICOS (dNFT)
// =============================================================================
#[contractevent(topics = ["dnft", "mint"])]
pub struct EventDnftMinted {
    pub owner: Address,
    pub token_id: u32,
}

#[contractevent(topics = ["dnft", "forged"])]
pub struct EventDnftForged {
    pub owner: Address,
    pub new_token_id: u32,
    pub tree_count: u32,
}

#[contractevent(topics = ["dnft", "growth"])]
pub struct EventDnftGrown {
    pub token_id: u32,
    pub biomass_kg: u32,
    pub phase: u32,
}

// =============================================================================
// ESTRUTURAS E ERROS
// =============================================================================
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum DnftError {
    AlreadyInitialized = 1,
    TokenNotFound = 2,
    Unauthorized = 3,
    PhaseLocked = 4, // 🛡️ Lock de 90 dias (Anti-Flipping)
    InvalidTier = 5, // Tentativa de forja ilegal
    ArithmeticOverflow = 6,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct DnftRecord {
    pub owner: Address,
    pub tier: u32,       // 1=Comum, 2=Raro, 3=Épico, 4=Lenda
    pub tree_count: u32, // Quantas árvores reais este NFT representa
    pub phase: u32,      // 1=Plantio, 2=Crescimento, ..., 6=Liquidação
    pub biomass_kg: u32, // Telemetria do Oráculo
    pub carbon_g: u32,   // Telemetria do Oráculo
    pub birth_date: u64, // Timestamp do plantio
}

#[contracttype]
pub enum DataKey {
    Admin,
    Oracle,
    TokenCounter,
    Token(u32),
}

// 🛡️ TTL - Preservação de Ativos RWAs
const DAY_IN_LEDGERS: u32 = 17_280;
const LOCK_PERIOD: u64 = 90 * 24 * 60 * 60; // 90 dias em segundos

fn bump_instance(env: &Env) {
    env.storage()
        .instance()
        .extend_ttl(30 * DAY_IN_LEDGERS, 60 * DAY_IN_LEDGERS);
}

// =============================================================================
// IMPLEMENTAÇÃO DO MOTOR dNFT
// =============================================================================
#[contract]
pub struct ForestMythosVault;

#[contractimpl]
impl ForestMythosVault {
    pub fn initialize(env: Env, admin: Address, oracle: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic_with_error!(&env, DnftError::AlreadyInitialized);
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Oracle, &oracle);
        env.storage().instance().set(&DataKey::TokenCounter, &0u32);
        bump_instance(&env);
    }

    /// 1. MINT: Nascimento da árvore (Fase 1 - Trancada)
    pub fn mint_dnft(env: Env, to: Address) -> u32 {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        let counter: u32 = env
            .storage()
            .instance()
            .get(&DataKey::TokenCounter)
            .unwrap_or(0);
        let token_id = counter.checked_add(1).unwrap();

        let record = DnftRecord {
            owner: to.clone(),
            tier: 1,
            tree_count: 1,
            phase: 1,
            biomass_kg: 0,
            carbon_g: 0,
            birth_date: env.ledger().timestamp(),
        };

        env.storage()
            .persistent()
            .set(&DataKey::Token(token_id), &record);
        env.storage()
            .instance()
            .set(&DataKey::TokenCounter, &token_id);

        EventDnftMinted {
            owner: to,
            token_id,
        }
        .publish(&env);
        token_id
    }

    /// 2. FORJA: Fusão Biológica (Queima N tokens para evoluir Tier)
    pub fn forge_dnft(env: Env, user: Address, ids: Vec<u32>) -> u32 {
        user.require_auth();
        if ids.len() < 2 {
            panic_with_error!(&env, DnftError::InvalidTier);
        }

        let mut total_trees: u32 = 0;
        let mut base_tier: u32 = 0;

        for id in ids.iter() {
            let key = DataKey::Token(id);
            let record: DnftRecord = env
                .storage()
                .persistent()
                .get(&key)
                .unwrap_or_else(|| panic_with_error!(&env, DnftError::TokenNotFound));

            if record.owner != user {
                panic_with_error!(&env, DnftError::Unauthorized);
            }
            if record.phase == 1 {
                panic_with_error!(&env, DnftError::PhaseLocked);
            }

            if base_tier == 0 {
                base_tier = record.tier;
            } else if record.tier != base_tier {
                panic_with_error!(&env, DnftError::InvalidTier);
            }

            total_trees = total_trees.checked_add(record.tree_count).unwrap();
            env.storage().persistent().remove(&key); // Destrói para fundir
        }

        let counter: u32 = env
            .storage()
            .instance()
            .get(&DataKey::TokenCounter)
            .unwrap();
        let new_id = counter.checked_add(1).unwrap();

        let new_record = DnftRecord {
            owner: user.clone(),
            tier: base_tier.checked_add(1).unwrap(),
            tree_count: total_trees,
            phase: 2, // Árvore forjada já é madura
            biomass_kg: 0,
            carbon_g: 0,
            birth_date: env.ledger().timestamp(),
        };

        env.storage()
            .persistent()
            .set(&DataKey::Token(new_id), &new_record);
        env.storage()
            .instance()
            .set(&DataKey::TokenCounter, &new_id);

        EventDnftForged {
            owner: user,
            new_token_id: new_id,
            tree_count: total_trees,
        }
        .publish(&env);
        new_id
    }

    /// 3. PROOF OF GROWTH: Oráculo injeta dados reais
    pub fn process_oracle_report(env: Env, token_id: u32, biomass: u32, carbon: u32, phase: u32) {
        let oracle: Address = env.storage().instance().get(&DataKey::Oracle).unwrap();
        oracle.require_auth();

        let mut record = Self::get_dnft(env.clone(), token_id);
        record.biomass_kg = record.biomass_kg.checked_add(biomass).unwrap();
        record.carbon_g = record.carbon_g.checked_add(carbon).unwrap();
        if phase > record.phase {
            record.phase = phase;
        }

        env.storage()
            .persistent()
            .set(&DataKey::Token(token_id), &record);
        EventDnftGrown {
            token_id,
            biomass_kg: record.biomass_kg,
            phase: record.phase,
        }
        .publish(&env);
    }

    /// 4. TRANSFERÊNCIA: Com verificação de Lock Temporal
    pub fn transfer_dnft(env: Env, from: Address, to: Address, token_id: u32) {
        from.require_auth();
        let mut record = Self::get_dnft(env.clone(), token_id);

        if record.owner != from {
            panic_with_error!(&env, DnftError::Unauthorized);
        }

        // 🛡️ Verificação de Lock de 90 dias
        let age = env
            .ledger()
            .timestamp()
            .checked_sub(record.birth_date)
            .unwrap();
        if record.phase == 1 && age < LOCK_PERIOD {
            panic_with_error!(&env, DnftError::PhaseLocked);
        }

        record.owner = to;
        env.storage()
            .persistent()
            .set(&DataKey::Token(token_id), &record);
    }

    pub fn get_dnft(env: Env, token_id: u32) -> DnftRecord {
        env.storage()
            .persistent()
            .get(&DataKey::Token(token_id))
            .unwrap_or_else(|| panic_with_error!(&env, DnftError::TokenNotFound))
    }
}
