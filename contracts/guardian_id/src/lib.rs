#![no_std]

use soroban_sdk::{
    contract, contracterror, contractevent, contractimpl, contracttype, panic_with_error, Address,
    Env,
};

// =============================================================================
// EVENTOS DE REPUTAÇÃO (Padrão Stellar Yardstick)
// =============================================================================
#[contractevent(topics = ["reputation", "xp_gained"])]
pub struct EventXpGained {
    pub user: Address,
    pub total_xp: u32,
}

#[contractevent(topics = ["reputation", "level_up"])]
pub struct EventLevelUp {
    pub user: Address,
    pub new_level: u32,
    pub era: u32,
}

// =============================================================================
// ESTRUTURAS E ERROS
// =============================================================================
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum GuardianError {
    AlreadyInitialized = 1,
    NotInitialized = 2,
    Unauthorized = 3,
    SoulboundToken = 4, // 🛡️ Bloqueio de transferência
    ArithmeticOverflow = 5,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct GuardianSbt {
    pub level: u32,
    pub xp: u32,
    pub era: u32, // 1=Semente, 2=Broto, 3=Muda, 4=Jovem, 5=Adulta, 6=Guardião, 7=Lenda
    pub join_date: u64,
}

#[contracttype]
pub enum DataKey {
    Admin,
    UserSbt(Address),
}

const DAY_IN_LEDGERS: u32 = 17_280;
const TTL_THRESHOLD: u32 = 30 * DAY_IN_LEDGERS;
const TTL_BUMP: u32 = 60 * DAY_IN_LEDGERS;

fn bump_instance(env: &Env) {
    env.storage().instance().extend_ttl(TTL_THRESHOLD, TTL_BUMP);
}

// =============================================================================
// IMPLEMENTAÇÃO DO CONTRATO
// =============================================================================
#[contract]
pub struct GuardianIdContract;

#[contractimpl]
impl GuardianIdContract {
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic_with_error!(&env, GuardianError::AlreadyInitialized);
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        bump_instance(&env);
    }

    /// Atribui XP ao utilizador (chamado pelo Orquestrador)
    pub fn add_xp(env: Env, user: Address, amount: u32) -> u32 {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        let mut sbt = env
            .storage()
            .persistent()
            .get(&DataKey::UserSbt(user.clone()))
            .unwrap_or(GuardianSbt {
                level: 1,
                xp: 0,
                era: 1,
                join_date: env.ledger().timestamp(),
            });

        sbt.xp = sbt
            .xp
            .checked_add(amount)
            .unwrap_or_else(|| panic_with_error!(&env, GuardianError::ArithmeticOverflow));

        // Lógica de Level Up: 1000 XP por nível
        let new_level = (sbt.xp / 1000) + 1;

        if new_level > sbt.level {
            sbt.level = new_level;
            // Evolução biológica entre as 7 Eras
            sbt.era = match sbt.level {
                1..=5 => 1,   // Semente de Mudança
                6..=15 => 2,  // Broto de Esperança
                16..=25 => 3, // Muda de Impacto
                26..=35 => 4, // Árvore Jovem
                36..=45 => 5, // Árvore Adulta
                46..=49 => 6, // Guardião da Floresta
                _ => 7,       // Guardião da Eternidade (Lenda)
            };
            EventLevelUp {
                user: user.clone(),
                new_level: sbt.level,
                era: sbt.era,
            }
            .publish(&env);
        }

        env.storage()
            .persistent()
            .set(&DataKey::UserSbt(user.clone()), &sbt);
        env.storage().persistent().extend_ttl(
            &DataKey::UserSbt(user.clone()),
            TTL_THRESHOLD,
            TTL_BUMP,
        );

        EventXpGained {
            user,
            total_xp: sbt.xp,
        }
        .publish(&env);

        sbt.level
    }

    pub fn get_sbt(env: Env, user: Address) -> GuardianSbt {
        env.storage()
            .persistent()
            .get(&DataKey::UserSbt(user))
            .unwrap_or_else(|| panic_with_error!(&env, GuardianError::NotInitialized))
    }

    /// 🛡️ SOULBOUND ENFORCEMENT
    pub fn transfer(env: Env, _from: Address, _to: Address, _amount: i128) {
        panic_with_error!(&env, GuardianError::SoulboundToken);
    }
}
