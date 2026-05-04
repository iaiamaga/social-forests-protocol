#![no_std]

use soroban_sdk::{
    Address, Env, contract, contracterror, contractimpl, contracttype, panic_with_error,
};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum SbtError {
    AlreadyInitialized = 1,
    SbtAlreadyExists = 2,
    SbtNotFound = 3,
    NotInitialized = 4,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct SbtRecord {
    pub user: Address,
    pub xp: u32,
    pub level: u32,
}

#[contracttype]
pub enum DataKey {
    Admin,
    Sbt(Address),
}

#[contract]
pub struct ReputationSbt;

#[contractimpl]
impl ReputationSbt {
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic_with_error!(&env, SbtError::AlreadyInitialized);
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
    }

    /// Distribui XP de reputação baseado no cashback de manejo ambiental (Mogno Africano).
    pub fn distribute_green_cashback(env: Env, admin: Address, user: Address, amount: u32) {
        admin.require_auth();

        let key = DataKey::Sbt(user.clone());
        let mut sbt: SbtRecord = env.storage().persistent().get(&key).unwrap_or(SbtRecord {
            user: user.clone(),
            xp: 0,
            level: 1,
        });

        sbt.xp += amount;
        // Lógica de progressão: Nível sobe a cada 500 XP, limitado ao nível 50.
        sbt.level = ((sbt.xp / 500) + 1).min(50);

        env.storage().persistent().set(&key, &sbt);

        // Estende o tempo de vida dos dados na rede Stellar (TTL)
        env.storage().persistent().extend_ttl(&key, 17_280, 518_400);
    }

    pub fn get_sbt(env: Env, user: Address) -> Option<SbtRecord> {
        env.storage().persistent().get(&DataKey::Sbt(user))
    }
}
