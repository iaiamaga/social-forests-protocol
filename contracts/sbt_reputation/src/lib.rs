#![no_std]
use soroban_sdk::{
    contract, contracterror, contractevent, contractimpl, contracttype, panic_with_error, Address,
    Env,
};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum ContractError {
    NotInitialized = 1,
    AlreadyInitialized = 2,
    NotAuthorized = 3,
    CompanyNotVerified = 4,
    InvalidAmount = 5,
    SoulboundNonTransferable = 6,
    ContractPaused = 7,
}

#[contracttype]
pub enum DataKey {
    Admin,
    Paused,
    VerifiedCompany(Address),
    ImpactPoints(Address),
    TotalDistributed,
}

// ==========================================
// EVENTOS (Padrão Soroban SDK v25+)
// ==========================================

#[contractevent]
pub struct InitializedEvent {
    pub admin: Address,
}

#[contractevent]
pub struct CompanyVerifiedEvent {
    pub company: Address,
}

#[contractevent]
pub struct CompanyRevokedEvent {
    pub company: Address,
}

#[contractevent]
pub struct CashbackDistributedEvent {
    pub company: Address,
    pub user: Address,
    pub amount: i128,
}

#[contractevent]
pub struct PausedEvent {}

#[contractevent]
pub struct UnpausedEvent {}

// ==========================================

#[contract]
pub struct SbtReputationContract;

#[contractimpl]
impl SbtReputationContract {
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic_with_error!(&env, ContractError::AlreadyInitialized);
        }
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Paused, &false);
        env.storage()
            .instance()
            .set(&DataKey::TotalDistributed, &0i128);
        env.storage().instance().extend_ttl(100_000, 100_000);

        // Emissão do evento no novo padrão
        InitializedEvent {
            admin: admin.clone(),
        }
        .publish(&env);
    }

    pub fn register_company(env: Env, company: Address) {
        Self::assert_admin(&env);
        Self::assert_not_paused(&env);
        env.storage()
            .persistent()
            .set(&DataKey::VerifiedCompany(company.clone()), &true);
        env.storage().persistent().extend_ttl(
            &DataKey::VerifiedCompany(company.clone()),
            200_000,
            200_000,
        );

        CompanyVerifiedEvent {
            company: company.clone(),
        }
        .publish(&env);
    }

    pub fn revoke_company(env: Env, company: Address) {
        Self::assert_admin(&env);
        env.storage()
            .persistent()
            .set(&DataKey::VerifiedCompany(company.clone()), &false);

        CompanyRevokedEvent {
            company: company.clone(),
        }
        .publish(&env);
    }

    /// Distribui pontos de impacto — validação dupla: auth + whitelist on-chain.
    pub fn distribute_green_cashback(env: Env, company: Address, user: Address, amount: i128) {
        company.require_auth();
        Self::assert_not_paused(&env);

        if amount <= 0 {
            panic_with_error!(&env, ContractError::InvalidAmount);
        }

        let is_verified: bool = env
            .storage()
            .persistent()
            .get(&DataKey::VerifiedCompany(company.clone()))
            .unwrap_or(false);

        if !is_verified {
            panic_with_error!(&env, ContractError::CompanyNotVerified);
        }

        let current: i128 = env
            .storage()
            .persistent()
            .get(&DataKey::ImpactPoints(user.clone()))
            .unwrap_or(0);

        let new_total = current
            .checked_add(amount)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::InvalidAmount));

        env.storage()
            .persistent()
            .set(&DataKey::ImpactPoints(user.clone()), &new_total);
        env.storage().persistent().extend_ttl(
            &DataKey::ImpactPoints(user.clone()),
            100_000,
            100_000,
        );

        let total: i128 = env
            .storage()
            .instance()
            .get(&DataKey::TotalDistributed)
            .unwrap_or(0);
        env.storage()
            .instance()
            .set(&DataKey::TotalDistributed, &(total + amount));
        env.storage().instance().extend_ttl(100_000, 100_000);

        CashbackDistributedEvent {
            company: company.clone(),
            user: user.clone(),
            amount,
        }
        .publish(&env);
    }

    pub fn get_user_impact(env: Env, user: Address) -> i128 {
        env.storage()
            .persistent()
            .get(&DataKey::ImpactPoints(user))
            .unwrap_or(0)
    }

    pub fn total_distributed(env: Env) -> i128 {
        env.storage()
            .instance()
            .get(&DataKey::TotalDistributed)
            .unwrap_or(0)
    }

    /// INVARIANTE CRÍTICA: Pontos são Soulbound — SEMPRE falha.
    pub fn transfer_reputation(_env: Env, _from: Address, _to: Address, _amount: i128) {
        panic!("SoulboundNonTransferable: impact points cannot be transferred");
    }

    pub fn pause(env: Env) {
        Self::assert_admin(&env);
        env.storage().instance().set(&DataKey::Paused, &true);
        PausedEvent {}.publish(&env);
    }

    pub fn unpause(env: Env) {
        Self::assert_admin(&env);
        env.storage().instance().set(&DataKey::Paused, &false);
        UnpausedEvent {}.publish(&env);
    }

    fn assert_admin(env: &Env) {
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .unwrap_or_else(|| panic_with_error!(env, ContractError::NotInitialized));
        admin.require_auth();
    }

    fn assert_not_paused(env: &Env) {
        if env
            .storage()
            .instance()
            .get(&DataKey::Paused)
            .unwrap_or(false)
        {
            panic_with_error!(env, ContractError::ContractPaused);
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    fn setup() -> (Env, soroban_sdk::Address, soroban_sdk::Address) {
        let env = Env::default();
        env.mock_all_auths();

        let cid = env.register(SbtReputationContract, ());

        let client = SbtReputationContractClient::new(&env, &cid);
        let admin = soroban_sdk::Address::generate(&env);
        client.initialize(&admin);
        (env, cid, admin)
    }

    #[test]
    fn test_cashback_verified() {
        let (env, cid, _) = setup();
        let client = SbtReputationContractClient::new(&env, &cid);
        let co = soroban_sdk::Address::generate(&env);
        let user = soroban_sdk::Address::generate(&env);
        client.register_company(&co);
        client.distribute_green_cashback(&co, &user, &1000);
        assert_eq!(client.get_user_impact(&user), 1000);
        assert_eq!(client.total_distributed(), 1000);
    }

    #[test]
    #[should_panic]
    fn test_cashback_unverified_fails() {
        let (env, cid, _) = setup();
        let client = SbtReputationContractClient::new(&env, &cid);
        let bad = soroban_sdk::Address::generate(&env);
        let user = soroban_sdk::Address::generate(&env);
        client.distribute_green_cashback(&bad, &user, &500);
    }

    #[test]
    #[should_panic]
    fn test_soulbound_never_transfers() {
        let (env, cid, _) = setup();
        let client = SbtReputationContractClient::new(&env, &cid);
        let a = soroban_sdk::Address::generate(&env);
        let b = soroban_sdk::Address::generate(&env);
        client.transfer_reputation(&a, &b, &100);
    }

    #[test]
    fn test_accumulation() {
        let (env, cid, _) = setup();
        let client = SbtReputationContractClient::new(&env, &cid);
        let co = soroban_sdk::Address::generate(&env);
        let user = soroban_sdk::Address::generate(&env);
        client.register_company(&co);
        client.distribute_green_cashback(&co, &user, &300);
        client.distribute_green_cashback(&co, &user, &700);
        assert_eq!(client.get_user_impact(&user), 1000);
    }

    #[test]
    #[should_panic]
    fn test_pause_blocks_cashback() {
        let (env, cid, _) = setup();
        let client = SbtReputationContractClient::new(&env, &cid);
        let co = soroban_sdk::Address::generate(&env);
        let user = soroban_sdk::Address::generate(&env);
        client.register_company(&co);
        client.pause();
        client.distribute_green_cashback(&co, &user, &500);
    }
}
