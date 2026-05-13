#![no_std]
#![allow(deprecated)]

use soroban_sdk::{
    contract, contracterror, contractevent, contractimpl, contracttype, panic_with_error, Address,
    Env,
}; // 🧹 Limpeza: Removido 'symbol_short'

// =============================================================================
// INTERFACES DOS CONTRATOS EXTERNOS
// =============================================================================
mod leaf_token {
    soroban_sdk::contractimport!(file = "../../target/wasm32v1-none/release/leaf_token.wasm");
}
mod rwa_vault {
    // 🛡️ Garanta que o nome do arquivo aqui seja collateral_vault.wasm
    soroban_sdk::contractimport!(file = "../../target/wasm32v1-none/release/collateral_vault.wasm");
}

// =============================================================================
// ESTRUTURAS DE DADOS E CHAVES
// =============================================================================
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum Rarity {
    Plantador,
    Cultivador,
    Guardiao,
    Protetor,
    Lenda,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct CompanyBadge {
    pub company: Address,
    pub total_leaves_distributed: i128,
    pub ods_score: u32,
    pub lenda_bonus: bool,
}

#[contracttype]
pub enum DataKey {
    Admin,
    LeafToken,
    RwaVault,
    NFTCounter,
    NFTOwner(u32),
    NFTRarity(u32),
    Partner(Address),
    MissionPool(Address),
    CompanyBadge(Address),
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum ContractError {
    NotInitialized = 1,
    AlreadyInitialized = 2,
    Unauthorized = 3,
    InsufficientLeaves = 4,
    MissionPoolEmpty = 5,
    CompanyNotPartner = 6,
    NftNotOwned = 7,
    AlreadyLenda = 8,
    InvalidAmount = 9,
    ArithmeticOverflow = 10,
}

#[contractevent(topics = ["nft", "forge"])]
pub struct EventNftForged {
    pub user: Address,
    pub nft_id: u32,
}

#[contractevent(topics = ["nft", "evolve"])]
pub struct EventNftEvolved {
    pub user: Address,
    pub nft_id: u32,
    pub new_rarity: Rarity,
}

// 🛡️ Constantes e TTL
const FORGE_COST: i128 = 1000_0000;
const DAY_IN_LEDGERS: u32 = 17_280;
const INSTANCE_THRESHOLD: u32 = 15 * DAY_IN_LEDGERS;
const INSTANCE_BUMP: u32 = 30 * DAY_IN_LEDGERS;
const PERSISTENT_THRESHOLD: u32 = 30 * DAY_IN_LEDGERS;
const PERSISTENT_BUMP: u32 = 60 * DAY_IN_LEDGERS;

fn bump_instance(env: &Env) {
    env.storage()
        .instance()
        .extend_ttl(INSTANCE_THRESHOLD, INSTANCE_BUMP);
}

// =========================================================================
// CONTRATO PRINCIPAL
// =========================================================================
#[contract]
pub struct HeroJourney;

#[contractimpl]
impl HeroJourney {
    pub fn initialize(env: Env, admin: Address, leaf_token: Address, rwa_vault: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic_with_error!(env, ContractError::AlreadyInitialized);
        }
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage()
            .instance()
            .set(&DataKey::LeafToken, &leaf_token);
        env.storage().instance().set(&DataKey::RwaVault, &rwa_vault);
        env.storage().instance().set(&DataKey::NFTCounter, &0u32);
        bump_instance(&env);
    }

    pub fn register_partner(env: Env, admin: Address, company: Address) {
        bump_instance(&env);
        admin.require_auth();
        let stored_admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        if admin != stored_admin {
            panic_with_error!(env, ContractError::Unauthorized);
        }

        let key = DataKey::Partner(company.clone());
        env.storage().persistent().set(&key, &true);
        env.storage()
            .persistent()
            .extend_ttl(&key, PERSISTENT_THRESHOLD, PERSISTENT_BUMP);

        let badge = CompanyBadge {
            company: company.clone(),
            total_leaves_distributed: 0,
            ods_score: 0,
            lenda_bonus: false,
        };
        let badge_key = DataKey::CompanyBadge(company);
        env.storage().persistent().set(&badge_key, &badge);
        env.storage()
            .persistent()
            .extend_ttl(&badge_key, PERSISTENT_THRESHOLD, PERSISTENT_BUMP);
    }

    pub fn deposit_mission_funds(env: Env, company: Address, amount: i128) {
        if amount <= 0 {
            panic_with_error!(env, ContractError::InvalidAmount);
        }
        bump_instance(&env);
        company.require_auth();

        let leaf_address: Address = env.storage().instance().get(&DataKey::LeafToken).unwrap();
        let leaf_client = leaf_token::Client::new(&env, &leaf_address);
        leaf_client.transfer(&company, &env.current_contract_address(), &amount);

        let pool_key = DataKey::MissionPool(company.clone());
        let current_pool: i128 = env.storage().persistent().get(&pool_key).unwrap_or(0);
        let new_pool = current_pool.checked_add(amount).unwrap();
        env.storage().persistent().set(&pool_key, &new_pool);
        env.storage()
            .persistent()
            .extend_ttl(&pool_key, PERSISTENT_THRESHOLD, PERSISTENT_BUMP);
    }

    pub fn forge_dnft(env: Env, user: Address) -> u32 {
        bump_instance(&env);
        user.require_auth();

        let leaf_address: Address = env.storage().instance().get(&DataKey::LeafToken).unwrap();
        let vault_address: Address = env.storage().instance().get(&DataKey::RwaVault).unwrap();
        let leaf_client = leaf_token::Client::new(&env, &leaf_address);
        let vault_client = rwa_vault::Client::new(&env, &vault_address);

        leaf_client.burn(&user, &FORGE_COST);

        let current_id: u32 = env
            .storage()
            .instance()
            .get(&DataKey::NFTCounter)
            .unwrap_or(0);
        let nft_id = current_id + 1;
        env.storage().instance().set(&DataKey::NFTCounter, &nft_id);

        env.storage()
            .persistent()
            .set(&DataKey::NFTOwner(nft_id), &user);
        env.storage()
            .persistent()
            .set(&DataKey::NFTRarity(nft_id), &Rarity::Plantador);

        vault_client.deposit_dnft(&user, &nft_id);
        EventNftForged { user, nft_id }.publish(&env);
        nft_id
    }

    pub fn evolve_nft(env: Env, user: Address, nft_id: u32) -> Rarity {
        bump_instance(&env);
        user.require_auth();

        let owner: Address = env
            .storage()
            .persistent()
            .get(&DataKey::NFTOwner(nft_id))
            .unwrap();
        if owner != user {
            panic_with_error!(env, ContractError::NftNotOwned);
        }

        let rarity_key = DataKey::NFTRarity(nft_id);
        let current_rarity: Rarity = env.storage().persistent().get(&rarity_key).unwrap();
        if current_rarity == Rarity::Lenda {
            panic_with_error!(env, ContractError::AlreadyLenda);
        }

        let cost = match current_rarity {
            Rarity::Plantador => 150_0000,
            Rarity::Cultivador => 300_0000,
            Rarity::Guardiao => 600_0000,
            Rarity::Protetor => 1000_0000,
            _ => 0,
        };

        let leaf_address: Address = env.storage().instance().get(&DataKey::LeafToken).unwrap();
        let leaf_client = leaf_token::Client::new(&env, &leaf_address);
        leaf_client.burn(&user, &cost);

        let new_rarity = match current_rarity {
            Rarity::Plantador => Rarity::Cultivador,
            Rarity::Cultivador => Rarity::Guardiao,
            Rarity::Guardiao => Rarity::Protetor,
            Rarity::Protetor => Rarity::Lenda,
            _ => current_rarity,
        };

        env.storage().persistent().set(&rarity_key, &new_rarity);
        EventNftEvolved {
            user,
            nft_id,
            new_rarity: new_rarity.clone(),
        }
        .publish(&env);
        new_rarity
    }

    pub fn get_nft_rarity(env: Env, nft_id: u32) -> Rarity {
        env.storage()
            .persistent()
            .get(&DataKey::NFTRarity(nft_id))
            .unwrap()
    }
}

// =============================================================================
// TESTES
// =============================================================================
#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env}; // 🧹 Limpeza: Removido 'IntoVal'

    #[contract]
    pub struct MockLeaf;
    #[contractimpl]
    impl MockLeaf {
        pub fn burn(_e: Env, _f: Address, _a: i128) {}
        pub fn transfer(_e: Env, _f: Address, _t: Address, _a: i128) {}
    }

    #[contract]
    pub struct MockVault;
    #[contractimpl]
    impl MockVault {
        pub fn deposit_dnft(_e: Env, _u: Address, _n: u32) {}
    }

    fn setup() -> (Env, HeroJourneyClient<'static>, Address, Address) {
        let env = Env::default();
        env.mock_all_auths();
        let admin = Address::generate(&env);
        let user = Address::generate(&env);
        let leaf = env.register(MockLeaf, ());
        let vault = env.register(MockVault, ());
        let hero_id = env.register(HeroJourney, ());
        let client = HeroJourneyClient::new(&env, &hero_id);
        client.initialize(&admin, &leaf, &vault);
        (env, client, admin, user)
    }

    #[test]
    fn test_flow() {
        let (env, hero, admin, user) = setup();
        let company = Address::generate(&env);
        hero.register_partner(&admin, &company);
        hero.deposit_mission_funds(&company, &5000_0000);
        let nft_id = hero.forge_dnft(&user);
        assert_eq!(nft_id, 1);
        assert_eq!(hero.get_nft_rarity(&nft_id), Rarity::Plantador);
    }
}
