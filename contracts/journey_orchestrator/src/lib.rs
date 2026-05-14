#![no_std]

use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, vec, Address, Env, IntoVal, String,
    Symbol, Vec,
};

// =============================================================================
// ESTRUTURAS DE DADOS
// =============================================================================
#[contracttype]
pub enum DataKey {
    Admin,
    LeafToken,
    SbtGuardian,
    SbtCompany,
    MasterChief,
    MythosVault,
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum OrchestratorError {
    AlreadyInitialized = 1,
    Unauthorized = 2,
}

// =============================================================================
// IMPLEMENTAÇÃO DO MAESTRO
// =============================================================================
#[contract]
pub struct JourneyOrchestrator;

#[contractimpl]
impl JourneyOrchestrator {
    /// Inicializa a Orquestra com os IDs de todos os contratos core
    pub fn initialize(
        env: Env,
        admin: Address,
        leaf: Address,
        sbt_g: Address,
        sbt_c: Address,
        master: Address,
        mythos: Address,
    ) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("ALREADY_INIT");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::LeafToken, &leaf);
        env.storage().instance().set(&DataKey::SbtGuardian, &sbt_g);
        env.storage().instance().set(&DataKey::SbtCompany, &sbt_c);
        env.storage().instance().set(&DataKey::MasterChief, &master);
        env.storage().instance().set(&DataKey::MythosVault, &mythos);
    }

    // ── FLUXO B2B: ONBOARDING INSTITUCIONAL (Via x402 / API) ──────────
    pub fn institutional_onboarding(
        env: Env,
        company: Address,
        units: u32,
        carbon_debt: i128,
        notary_hash: String,
        leaf_cashback: i128,
    ) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        let sbt_c: Address = env.storage().instance().get(&DataKey::SbtCompany).unwrap();
        let master: Address = env.storage().instance().get(&DataKey::MasterChief).unwrap();
        let leaf: Address = env.storage().instance().get(&DataKey::LeafToken).unwrap();

        // 1. Ativa o SBT Empresa (Verificação Jurídica)
        env.invoke_contract::<()>(
            &sbt_c,
            &Symbol::new(&env, "verify_company"),
            vec![
                &env,
                company.clone().into_val(&env),
                notary_hash.into_val(&env),
            ],
        );

        // 2. Define a Dívida de Carbono inicial
        env.invoke_contract::<()>(
            &sbt_c,
            &Symbol::new(&env, "set_carbon_debt"),
            vec![
                &env,
                company.clone().into_val(&env),
                carbon_debt.into_val(&env),
            ],
        );

        // 3. Aloca Ativos Físicos no MasterChief Manager
        env.invoke_contract::<()>(
            &master,
            &Symbol::new(&env, "add_inventory"),
            vec![
                &env,
                company.clone().into_val(&env),
                units.into_val(&env),
                1u32.into_val(&env),
            ],
        );

        // 4. Emite $LEAF para a empresa distribuir aos clientes
        env.invoke_contract::<()>(
            &leaf,
            &Symbol::new(&env, "mint"),
            vec![&env, company.into_val(&env), leaf_cashback.into_val(&env)],
        );
    }

    // ── FLUXO B2C: HERO JOURNEY (Plantio Direto) ─────────────────────────
    pub fn plant_tree(env: Env, user: Address, leaf_cost: i128) {
        user.require_auth();

        let leaf: Address = env.storage().instance().get(&DataKey::LeafToken).unwrap();
        let mythos: Address = env.storage().instance().get(&DataKey::MythosVault).unwrap();
        let sbt_g: Address = env.storage().instance().get(&DataKey::SbtGuardian).unwrap();

        // 1. Queima as Folhas do utilizador
        env.invoke_contract::<()>(
            &leaf,
            &Symbol::new(&env, "burn"),
            vec![&env, user.clone().into_val(&env), leaf_cost.into_val(&env)],
        );

        // 2. Gera a Árvore de Mogno (dNFT)
        env.invoke_contract::<u32>(
            &mythos,
            &Symbol::new(&env, "mint_dnft"),
            vec![&env, user.clone().into_val(&env)],
        );

        // 3. Credita XP de Guardião (100 XP por muda)
        env.invoke_contract::<u32>(
            &sbt_g,
            &Symbol::new(&env, "add_xp"),
            vec![&env, user.into_val(&env), 100u32.into_val(&env)],
        );
    }

    // ── FLUXO B2C: FORJA MÍTICA (Merge de RWAs) ──────────────────────────
    pub fn forge_mythos(env: Env, user: Address, ids: Vec<u32>, fee: i128) {
        user.require_auth();

        let leaf: Address = env.storage().instance().get(&DataKey::LeafToken).unwrap();
        let mythos: Address = env.storage().instance().get(&DataKey::MythosVault).unwrap();
        let sbt_g: Address = env.storage().instance().get(&DataKey::SbtGuardian).unwrap();

        // 1. Paga taxa de forja em $LEAF
        env.invoke_contract::<()>(
            &leaf,
            &Symbol::new(&env, "burn"),
            vec![&env, user.clone().into_val(&env), fee.into_val(&env)],
        );

        // 2. Executa a Forja no Motor dNFT
        env.invoke_contract::<u32>(
            &mythos,
            &Symbol::new(&env, "forge_dnft"),
            vec![&env, user.clone().into_val(&env), ids.into_val(&env)],
        );

        // 3. Bónus de XP por Evolução (500 XP)
        env.invoke_contract::<u32>(
            &sbt_g,
            &Symbol::new(&env, "add_xp"),
            vec![&env, user.into_val(&env), 500u32.into_val(&env)],
        );
    }
}
