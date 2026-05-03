#![no_std]

use soroban_sdk::{
    Address, Env, contract, contracterror, contractevent, contractimpl, contracttype,
    panic_with_error,
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

#[contractevent(topics = ["sbt", "mint"], data_format = "single-value")]
pub struct EventSbtMinted {
    pub user: Address,
}

#[contractevent(topics = ["sbt", "xp_add"])]
pub struct EventXpAdded {
    pub user: Address,
    pub amount: u32,
}

#[contractevent(topics = ["sbt", "lvl_up"])]
pub struct EventLevelUp {
    pub user: Address,
    pub level: u32,
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

    pub fn create_sbt(env: Env, user: Address) {
        user.require_auth();
        let key = DataKey::Sbt(user.clone());
        if env.storage().persistent().has(&key) {
            panic_with_error!(&env, SbtError::SbtAlreadyExists);
        }

        let record = SbtRecord {
            user: user.clone(),
            xp: 0,
            level: 1,
        };
        env.storage().persistent().set(&key, &record);
        // FIX: Impede que o SBT expire (TTL)
        env.storage().persistent().extend_ttl(&key, 17_280, 518_400);

        EventSbtMinted { user }.publish(&env);
    }

    pub fn add_xp(env: Env, user: Address, amount: u32) {
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .unwrap_or_else(|| panic_with_error!(&env, SbtError::NotInitialized));
        admin.require_auth();

        let key = DataKey::Sbt(user.clone());
        let mut sbt: SbtRecord = env
            .storage()
            .persistent()
            .get(&key)
            .unwrap_or_else(|| panic_with_error!(&env, SbtError::SbtNotFound));

        sbt.xp += amount;

        // FIX: Cap de nível no 50 conforme a v14.1
        let new_level = ((sbt.xp / 500) + 1).min(50);

        if new_level > sbt.level {
            sbt.level = new_level;
            EventLevelUp {
                user: user.clone(),
                level: sbt.level,
            }
            .publish(&env);
        }

        env.storage().persistent().set(&key, &sbt);
        // FIX: Renovação do tempo de vida dos dados
        env.storage().persistent().extend_ttl(&key, 17_280, 518_400);

        EventXpAdded { user, amount }.publish(&env);
    }

    pub fn get_sbt(env: Env, user: Address) -> Option<SbtRecord> {
        env.storage().persistent().get(&DataKey::Sbt(user))
    }
}

#[cfg(test)]
mod tests;
