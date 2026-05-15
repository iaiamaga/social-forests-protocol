#![no_std]
#![deny(unsafe_code)]

use soroban_sdk::{
    contract, contracterror, contractevent, contractimpl, contracttype, panic_with_error, vec,
    Address, Env, IntoVal, Symbol,
};

// =============================================================================
// EVENTOS DE MERCADO (DeFi)
// =============================================================================
#[contractevent(topics = ["master", "inventory_added"])]
pub struct EventInventoryAdded {
    pub company: Address,
    pub units: u32,
}

#[contractevent(topics = ["master", "credit_traded"])]
pub struct EventCreditTraded {
    pub from: Address,
    pub to: Address,
    pub amount: i128,
}

#[contractevent(topics = ["master", "debt_settled"])]
pub struct EventDebtSettled {
    pub company: Address,
    pub amount: i128,
}

// =============================================================================
// ESTRUTURAS E CONTEXTO
// =============================================================================
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CollateralPosition {
    pub total_units: u32, // Qtd de mudas/ativos físicos
    pub asset_type: u32,  // 1=Mogno, 2=Nativas, 3=Solar
    pub last_sync_ledger: u32,
}

#[contracttype]
pub enum DataKey {
    Admin,
    SbtContract,
    Position(Address),
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum MasterError {
    NotInitialized = 1,
    InsufficientCredits = 2,
    Unauthorized = 3,
    ArithmeticOverflow = 4,
    AlreadyInitialized = 5,
}

// 🛡️ Helper para o compilador entender o struct vindo do SBT Empresa
#[contracttype]
pub struct SbtEmpresaRecord {
    pub carbon_seq_g: i128,
    pub c_cred_balance: i128,
    pub c_debt_balance: i128,
    pub biomass_kg: i128,
    pub ods_badges: soroban_sdk::Vec<u32>,
    pub verified: bool,
}

// =============================================================================
// IMPLEMENTAÇÃO DO MASTERCHIEF
// =============================================================================
#[contract]
pub struct CollateralMasterChief;

#[contractimpl]
impl CollateralMasterChief {
    pub fn initialize(env: Env, admin: Address, sbt_contract: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic_with_error!(&env, MasterError::AlreadyInitialized);
        }
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage()
            .instance()
            .set(&DataKey::SbtContract, &sbt_contract);
    }

    /// 1. GESTÃO DE INVENTÁRIO: Adiciona mudas ao lastro da empresa
    pub fn add_inventory(env: Env, company: Address, units: u32, asset_type: u32) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        let key = DataKey::Position(company.clone());
        let mut pos: CollateralPosition =
            env.storage()
                .persistent()
                .get(&key)
                .unwrap_or(CollateralPosition {
                    total_units: 0,
                    asset_type,
                    last_sync_ledger: 0,
                });

        pos.total_units = pos.total_units.checked_add(units).expect("Overflow");
        pos.last_sync_ledger = env.ledger().sequence();

        env.storage().persistent().set(&key, &pos);
        env.storage().persistent().extend_ttl(&key, 30 * 17_280, 60 * 17_280);
        EventInventoryAdded { company, units }.publish(&env);
    }

    /// 2. DEFI MARKETPLACE: Negocia C-Cred excedente entre empresas parceiras
    pub fn trade_credits(env: Env, from: Address, to: Address, amount: i128) {
        from.require_auth();
        let sbt_addr: Address = env.storage().instance().get(&DataKey::SbtContract).unwrap();

        // Consulta o net-zero da vendedora no Cartório (SBT)
        let sbt_from: SbtEmpresaRecord = env.invoke_contract(
            &sbt_addr,
            &Symbol::new(&env, "get_empresa_sbt"),
            vec![&env, from.clone().into_val(&env)],
        );

        // Regra de Ouro: Só vende se (Créditos - Dívida) > amount
        let available = sbt_from
            .c_cred_balance
            .checked_sub(sbt_from.c_debt_balance)
            .unwrap();
        if available < amount {
            panic_with_error!(&env, MasterError::InsufficientCredits);
        }

        // Executa a troca de saldos no Cartório (SBT Empresa)
        env.invoke_contract::<()>(
            &sbt_addr,
            &Symbol::new(&env, "update_credits"),
            vec![&env, from.clone().into_val(&env), (-amount).into_val(&env)],
        );
        env.invoke_contract::<()>(
            &sbt_addr,
            &Symbol::new(&env, "update_credits"),
            vec![&env, to.clone().into_val(&env), amount.into_val(&env)],
        );

        EventCreditTraded { from, to, amount }.publish(&env);
    }

    /// 3. COMPENSAÇÃO: "Aposenta" créditos para abater a dívida ambiental
    pub fn settle_debt(env: Env, company: Address, amount: i128) {
        company.require_auth();
        let sbt_addr: Address = env.storage().instance().get(&DataKey::SbtContract).unwrap();

        let sbt: SbtEmpresaRecord = env.invoke_contract(
            &sbt_addr,
            &Symbol::new(&env, "get_empresa_sbt"),
            vec![&env, company.clone().into_val(&env)],
        );

        if sbt.c_cred_balance < amount {
            panic_with_error!(&env, MasterError::InsufficientCredits);
        }

        // Reduz Crédito e Reduz Dívida simultaneamente no Cartório
        env.invoke_contract::<()>(
            &sbt_addr,
            &Symbol::new(&env, "update_credits"),
            vec![
                &env,
                company.clone().into_val(&env),
                (-amount).into_val(&env),
            ],
        );
        env.invoke_contract::<()>(
            &sbt_addr,
            &Symbol::new(&env, "set_carbon_debt"),
            vec![
                &env,
                company.clone().into_val(&env),
                (sbt.c_debt_balance - amount).into_val(&env),
            ],
        );

        EventDebtSettled { company, amount }.publish(&env);
    }

    pub fn get_position(env: Env, company: Address) -> CollateralPosition {
        env.storage()
            .persistent()
            .get(&DataKey::Position(company))
            .expect("NoPos")
    }
}
