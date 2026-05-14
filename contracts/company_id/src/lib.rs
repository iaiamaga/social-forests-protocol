#![no_std]

use soroban_sdk::{
    contract, contracterror, contractevent, contractimpl, contracttype, panic_with_error, vec,
    Address, Env, String, Vec,
};

// =============================================================================
// EVENTOS INSTITUCIONAIS
// =============================================================================
#[contractevent(topics = ["sbt", "verified"])]
pub struct EventCompanyVerified {
    pub company: Address,
}

#[contractevent(topics = ["sbt", "debt_update"])]
pub struct EventDebtUpdated {
    pub company: Address,
    pub new_debt: i128,
}

#[contractevent(topics = ["sbt", "credit_update"])]
pub struct EventCreditUpdated {
    pub company: Address,
    pub credit_change: i128,
}

#[contractevent(topics = ["sbt", "badge_added"])]
pub struct EventBadgeAdded {
    pub company: Address,
    pub ods_id: u32,
}

// =============================================================================
// ESTRUTURAS E ERROS
// =============================================================================
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum SbtError {
    AlreadyInitialized = 1,
    NotInitialized = 2,
    Unauthorized = 3,
    SbtNotFound = 4,
    ArithmeticOverflow = 5,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SbtEmpresaRecord {
    pub carbon_seq_g: i128,   // Impacto ambiental bruto
    pub c_cred_balance: i128, // Ativo financeiro (Créditos)
    pub c_debt_balance: i128, // Passivo financeiro (Dívida de Carbono)
    pub biomass_kg: i128,
    pub ods_badges: Vec<u32>, // Selos da ONU
    pub verified: bool,       // Carimbo Vereda Verify
}

#[contracttype]
pub enum DataKey {
    Admin,
    Oracle,
    Empresa(Address),
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
pub struct CompanySbt;

#[contractimpl]
impl CompanySbt {
    pub fn initialize(env: Env, admin: Address, oracle: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic_with_error!(&env, SbtError::AlreadyInitialized);
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Oracle, &oracle);
        bump_instance(&env);
    }

    /// O Oráculo Vereda injeta a dívida (C-Debt) baseada na pegada anual da empresa.
    pub fn set_carbon_debt(env: Env, company: Address, amount: i128) {
        let oracle: Address = env.storage().instance().get(&DataKey::Oracle).unwrap();
        oracle.require_auth();

        // 🛠️ Correção: self -> Self:: e passando env
        let mut sbt = Self::get_empresa_sbt(env.clone(), company.clone());
        sbt.c_debt_balance = amount;

        env.storage()
            .persistent()
            .set(&DataKey::Empresa(company.clone()), &sbt);
        env.storage().persistent().extend_ttl(
            &DataKey::Empresa(company.clone()),
            TTL_THRESHOLD,
            TTL_BUMP,
        );

        EventDebtUpdated {
            company,
            new_debt: amount,
        }
        .publish(&env);
    }

    /// Atualiza o balanço de créditos (C-Cred).
    pub fn update_credits(env: Env, company: Address, amount: i128) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        // 🛠️ Correção: self -> Self::
        let mut sbt = Self::get_empresa_sbt(env.clone(), company.clone());
        sbt.c_cred_balance = sbt
            .c_cred_balance
            .checked_add(amount)
            .unwrap_or_else(|| panic_with_error!(&env, SbtError::ArithmeticOverflow));

        env.storage()
            .persistent()
            .set(&DataKey::Empresa(company.clone()), &sbt);
        EventCreditUpdated {
            company,
            credit_change: amount,
        }
        .publish(&env);
    }

    /// Onboarding oficial da empresa com prova jurídica.
    pub fn verify_company(env: Env, company: Address, _notary_hash: String) {
        let oracle: Address = env.storage().instance().get(&DataKey::Oracle).unwrap();
        oracle.require_auth();

        let data = SbtEmpresaRecord {
            carbon_seq_g: 0,
            c_cred_balance: 0,
            c_debt_balance: 0,
            biomass_kg: 0,
            ods_badges: vec![&env],
            verified: true,
        };

        env.storage()
            .persistent()
            .set(&DataKey::Empresa(company.clone()), &data);
        env.storage().persistent().extend_ttl(
            &DataKey::Empresa(company.clone()),
            TTL_THRESHOLD,
            TTL_BUMP,
        );

        EventCompanyVerified { company }.publish(&env);
    }

    /// Atribui selos da ONU conforme metas atingidas.
    pub fn add_ods_badge(env: Env, company: Address, ods_id: u32) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        // 🛠️ Correção: self -> Self::
        let mut sbt = Self::get_empresa_sbt(env.clone(), company.clone());
        if !sbt.ods_badges.contains(&ods_id) {
            sbt.ods_badges.push_back(ods_id);
            env.storage()
                .persistent()
                .set(&DataKey::Empresa(company.clone()), &sbt);
            EventBadgeAdded { company, ods_id }.publish(&env);
        }
    }

    pub fn is_verified(env: Env, company: Address) -> bool {
        match env
            .storage()
            .persistent()
            .get::<_, SbtEmpresaRecord>(&DataKey::Empresa(company))
        {
            Some(data) => data.verified,
            None => false,
        }
    }

    pub fn get_empresa_sbt(env: Env, company: Address) -> SbtEmpresaRecord {
        bump_instance(&env);
        env.storage()
            .persistent()
            .get(&DataKey::Empresa(company))
            .unwrap_or_else(|| panic_with_error!(&env, SbtError::SbtNotFound))
    }
}
