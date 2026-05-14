#![no_std]

use soroban_sdk::{
    contract, contracterror, contractevent, contractimpl, contracttype, panic_with_error, Address,
    Env, String,
};

// =============================================================================
// EVENTOS FINANCEIROS (SEP-41)
// =============================================================================
#[contractevent(topics = ["token", "transfer"])]
pub struct EventTransfer {
    pub from: Address,
    pub to: Address,
    pub amount: i128,
}

#[contractevent(topics = ["token", "mint"])]
pub struct EventMint {
    pub to: Address,
    pub amount: i128,
}

#[contractevent(topics = ["token", "burn"])]
pub struct EventBurn {
    pub from: Address,
    pub amount: i128,
}

// =============================================================================
// ESTRUTURAS E ERROS
// =============================================================================
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum TokenError {
    AlreadyInitialized = 1,
    InsufficientBalance = 2,
    Unauthorized = 3,
    NegativeAmount = 4,
}

#[contracttype]
pub enum DataKey {
    Admin,
    Balance(Address),
    Metadata,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct TokenMetadata {
    pub name: String,
    pub symbol: String,
    pub decimals: u32,
}

// =============================================================================
// IMPLEMENTAÇÃO DO TOKEN $LEAF
// =============================================================================
#[contract]
pub struct LeafToken;

#[contractimpl]
impl LeafToken {
    pub fn initialize(env: Env, admin: Address, name: String, symbol: String, decimals: u32) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic_with_error!(&env, TokenError::AlreadyInitialized);
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(
            &DataKey::Metadata,
            &TokenMetadata {
                name,
                symbol,
                decimals,
            },
        );
    }

    /// 1. EMISSÃO (MINT): Usado no On-ramp B2B
    pub fn mint(env: Env, to: Address, amount: i128) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        if amount < 0 {
            panic_with_error!(&env, TokenError::NegativeAmount);
        }

        let balance = Self::balance(env.clone(), to.clone());
        env.storage()
            .persistent()
            .set(&DataKey::Balance(to.clone()), &(balance + amount));

        EventMint { to, amount }.publish(&env);
    }

    /// 2. QUEIMA (BURN): Usado para pagar Plantio/Forja
    pub fn burn(env: Env, from: Address, amount: i128) {
        from.require_auth();
        if amount < 0 {
            panic_with_error!(&env, TokenError::NegativeAmount);
        }

        let balance = Self::balance(env.clone(), from.clone());
        if balance < amount {
            panic_with_error!(&env, TokenError::InsufficientBalance);
        }

        env.storage()
            .persistent()
            .set(&DataKey::Balance(from.clone()), &(balance - amount));
        EventBurn { from, amount }.publish(&env);
    }

    /// 3. TRANSFERÊNCIA (PADRÃO)
    pub fn transfer(env: Env, from: Address, to: Address, amount: i128) {
        from.require_auth();
        if amount < 0 {
            panic_with_error!(&env, TokenError::NegativeAmount);
        }

        let balance_from = Self::balance(env.clone(), from.clone());
        if balance_from < amount {
            panic_with_error!(&env, TokenError::InsufficientBalance);
        }

        let balance_to = Self::balance(env.clone(), to.clone());
        env.storage()
            .persistent()
            .set(&DataKey::Balance(from.clone()), &(balance_from - amount));
        env.storage()
            .persistent()
            .set(&DataKey::Balance(to.clone()), &(balance_to + amount));

        EventTransfer { from, to, amount }.publish(&env);
    }

    pub fn balance(env: Env, id: Address) -> i128 {
        env.storage()
            .persistent()
            .get(&DataKey::Balance(id))
            .unwrap_or(0)
    }

    // --- FUNÇÕES DE METADADOS ---
    pub fn name(env: Env) -> String {
        env.storage()
            .instance()
            .get::<_, TokenMetadata>(&DataKey::Metadata)
            .unwrap()
            .name
    }

    pub fn symbol(env: Env) -> String {
        env.storage()
            .instance()
            .get::<_, TokenMetadata>(&DataKey::Metadata)
            .unwrap()
            .symbol
    }

    pub fn decimals(env: Env) -> u32 {
        env.storage()
            .instance()
            .get::<_, TokenMetadata>(&DataKey::Metadata)
            .unwrap()
            .decimals
    }
}
