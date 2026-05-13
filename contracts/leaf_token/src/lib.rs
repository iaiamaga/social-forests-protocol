#![no_std]
#![allow(deprecated)] // 🛡️ Silencia avisos do SDK em transição (preserva compatibilidade com o Frontend)

use soroban_sdk::{
    Address, Env, String, contract, contracterror, contractimpl, contracttype, panic_with_error,
    symbol_short,
};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum TokenError {
    AlreadyInitialized = 1,
    InsufficientBalance = 2,
    InsufficientAllowance = 3,
    MaxSupplyExceeded = 4,
    InvalidAmount = 5, // 🛡️ Nova Trava: Proteção contra números negativos e zero
    NotInitialized = 6,
    NotAuthorized = 7,
    ArithmeticOverflow = 8,
}

#[contracttype]
pub enum DataKey {
    Admin,
    PendingAdmin, // Two-step admin transfer
    Balance(Address),
    Allowance(Address, Address),
    TotalSupply,
}

// 🛡️ Constantes de TTL (Time to Live) - 1 ledger ≈ 5 segundos
const DAY_IN_LEDGERS: u32 = 17_280;

const INSTANCE_THRESHOLD: u32 = 15 * DAY_IN_LEDGERS; // renova se faltar < 15 dias
const INSTANCE_BUMP: u32 = 30 * DAY_IN_LEDGERS; // renova para 30 dias

const BALANCE_THRESHOLD: u32 = 30 * DAY_IN_LEDGERS; // renova se faltar < 30 dias
const BALANCE_BUMP: u32 = 60 * DAY_IN_LEDGERS; // renova para 60 dias

// 1.000.000.000 LEAF × 10_000_000 (7 decimais) = 10_000_000_000_000_000
const MAX_SUPPLY: i128 = 1_000_000_000 * 10_000_000;

// =========================================================================
// FUNÇÕES AUXILIARES DE ESTADO (Impedem a perda de dados e expiração)
// =========================================================================
fn bump_instance(env: &Env) {
    env.storage()
        .instance()
        .extend_ttl(INSTANCE_THRESHOLD, INSTANCE_BUMP);
}

fn read_balance(env: &Env, id: &Address) -> i128 {
    let key = DataKey::Balance(id.clone());
    if let Some(bal) = env.storage().persistent().get::<_, i128>(&key) {
        env.storage()
            .persistent()
            .extend_ttl(&key, BALANCE_THRESHOLD, BALANCE_BUMP);
        bal
    } else {
        0
    }
}

fn write_balance(env: &Env, id: &Address, amount: i128) {
    let key = DataKey::Balance(id.clone());
    env.storage().persistent().set(&key, &amount);
    env.storage()
        .persistent()
        .extend_ttl(&key, BALANCE_THRESHOLD, BALANCE_BUMP);
}

fn read_total_supply(env: &Env) -> i128 {
    env.storage()
        .instance()
        .get(&DataKey::TotalSupply)
        .unwrap_or(0i128)
}

fn get_admin(env: &Env) -> Address {
    env.storage()
        .instance()
        .get(&DataKey::Admin)
        .unwrap_or_else(|| panic_with_error!(env, TokenError::NotInitialized))
}

// =========================================================================
// CONTRATO PRINCIPAL
// =========================================================================
#[contract]
pub struct LeafToken;

#[contractimpl]
impl LeafToken {
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic_with_error!(&env, TokenError::AlreadyInitialized);
        }
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::TotalSupply, &0i128);
        bump_instance(&env);
    }

    pub fn name(env: Env) -> String {
        bump_instance(&env);
        String::from_str(&env, "Social Forest Leaf Token")
    }

    pub fn symbol(env: Env) -> String {
        bump_instance(&env);
        String::from_str(&env, "LEAF")
    }

    pub fn decimals(env: Env) -> u32 {
        bump_instance(&env);
        7
    }

    pub fn balance(env: Env, id: Address) -> i128 {
        bump_instance(&env);
        read_balance(&env, &id)
    }

    pub fn total_supply(env: Env) -> i128 {
        bump_instance(&env);
        read_total_supply(&env)
    }

    pub fn mint(env: Env, to: Address, amount: i128) {
        if amount <= 0 {
            panic_with_error!(&env, TokenError::InvalidAmount);
        }
        bump_instance(&env);
        get_admin(&env).require_auth();

        let current_supply = read_total_supply(&env);
        let new_supply = current_supply
            .checked_add(amount)
            .unwrap_or_else(|| panic_with_error!(&env, TokenError::ArithmeticOverflow));

        if new_supply > MAX_SUPPLY {
            panic_with_error!(&env, TokenError::MaxSupplyExceeded);
        }

        let current_balance = read_balance(&env, &to);
        let new_balance = current_balance
            .checked_add(amount)
            .unwrap_or_else(|| panic_with_error!(&env, TokenError::ArithmeticOverflow));

        write_balance(&env, &to, new_balance);
        env.storage()
            .instance()
            .set(&DataKey::TotalSupply, &new_supply);

        env.events().publish((symbol_short!("mint"),), (to, amount));
    }

    pub fn burn(env: Env, from: Address, amount: i128) {
        if amount <= 0 {
            panic_with_error!(&env, TokenError::InvalidAmount);
        }
        bump_instance(&env);
        from.require_auth();

        let current_balance = read_balance(&env, &from);
        if current_balance < amount {
            panic_with_error!(&env, TokenError::InsufficientBalance);
        }

        let current_supply = read_total_supply(&env);

        write_balance(&env, &from, current_balance - amount);
        env.storage()
            .instance()
            .set(&DataKey::TotalSupply, &(current_supply - amount));

        env.events()
            .publish((symbol_short!("burn"),), (from, amount));
    }

    pub fn transfer(env: Env, from: Address, to: Address, amount: i128) {
        if amount <= 0 {
            panic_with_error!(&env, TokenError::InvalidAmount);
        }
        bump_instance(&env);
        from.require_auth();

        let from_bal = read_balance(&env, &from);
        if from_bal < amount {
            panic_with_error!(&env, TokenError::InsufficientBalance);
        }

        let to_bal = read_balance(&env, &to);
        let new_to_bal = to_bal
            .checked_add(amount)
            .unwrap_or_else(|| panic_with_error!(&env, TokenError::ArithmeticOverflow));

        write_balance(&env, &from, from_bal - amount);
        write_balance(&env, &to, new_to_bal);

        env.events()
            .publish((symbol_short!("transfer"),), (from, to, amount));
    }

    pub fn approve(
        env: Env,
        from: Address,
        spender: Address,
        amount: i128,
        expiration_ledger: u32,
    ) {
        if amount < 0 {
            panic_with_error!(&env, TokenError::InvalidAmount);
        }
        bump_instance(&env);
        from.require_auth();

        let key = DataKey::Allowance(from.clone(), spender.clone());

        if amount == 0 {
            env.storage().temporary().remove(&key);
        } else {
            env.storage().temporary().set(&key, &amount);
            let current_ledger = env.ledger().sequence();
            if expiration_ledger > current_ledger {
                let live_for = expiration_ledger - current_ledger;
                env.storage()
                    .temporary()
                    .extend_ttl(&key, live_for, live_for);
            }
        }

        env.events().publish(
            (symbol_short!("approve"),),
            (from, spender, amount, expiration_ledger),
        );
    }

    pub fn allowance(env: Env, from: Address, spender: Address) -> i128 {
        bump_instance(&env);
        let key = DataKey::Allowance(from, spender);
        env.storage().temporary().get(&key).unwrap_or(0i128)
    }

    pub fn transfer_from(env: Env, spender: Address, from: Address, to: Address, amount: i128) {
        if amount <= 0 {
            panic_with_error!(&env, TokenError::InvalidAmount);
        }
        bump_instance(&env);
        spender.require_auth();

        let allowance_key = DataKey::Allowance(from.clone(), spender.clone());
        let current_allowance: i128 = env
            .storage()
            .temporary()
            .get(&allowance_key)
            .unwrap_or(0i128);

        if current_allowance < amount {
            panic_with_error!(&env, TokenError::InsufficientAllowance);
        }

        let from_bal = read_balance(&env, &from);
        if from_bal < amount {
            panic_with_error!(&env, TokenError::InsufficientBalance);
        }

        let to_bal = read_balance(&env, &to);
        let new_to_bal = to_bal
            .checked_add(amount)
            .unwrap_or_else(|| panic_with_error!(&env, TokenError::ArithmeticOverflow));

        env.storage()
            .temporary()
            .set(&allowance_key, &(current_allowance - amount));

        write_balance(&env, &from, from_bal - amount);
        write_balance(&env, &to, new_to_bal);

        env.events()
            .publish((symbol_short!("xfer_from"),), (spender, from, to, amount));
    }

    pub fn propose_admin(env: Env, new_admin: Address) {
        bump_instance(&env);
        get_admin(&env).require_auth();
        env.storage()
            .instance()
            .set(&DataKey::PendingAdmin, &new_admin);

        env.events()
            .publish((symbol_short!("prop_adm"),), (new_admin,));
    }

    pub fn accept_admin(env: Env) {
        bump_instance(&env);
        let pending: Address = env
            .storage()
            .instance()
            .get(&DataKey::PendingAdmin)
            .unwrap_or_else(|| panic_with_error!(&env, TokenError::NotAuthorized));

        pending.require_auth();

        env.storage().instance().set(&DataKey::Admin, &pending);
        env.storage().instance().remove(&DataKey::PendingAdmin);

        env.events()
            .publish((symbol_short!("new_admin"),), (pending,));
    }

    pub fn admin(env: Env) -> Address {
        bump_instance(&env);
        get_admin(&env)
    }
}

// =============================================================================
// TESTES
// =============================================================================

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::{Env, testutils::Address as _};

    fn setup() -> (Env, soroban_sdk::Address, soroban_sdk::Address) {
        let env = Env::default();
        env.mock_all_auths();

        // 🎯 CORREÇÃO AQUI: Nova sintaxe do Soroban SDK para testes
        let cid = env.register(LeafToken, ());

        let client = LeafTokenClient::new(&env, &cid);
        let admin = soroban_sdk::Address::generate(&env);
        client.initialize(&admin);
        (env, cid, admin)
    }

    // ── Inicialização ──────────────────────────────────────────────────────

    #[test]
    fn test_initialize_sets_admin_and_zero_supply() {
        let (env, cid, admin) = setup();
        let client = LeafTokenClient::new(&env, &cid);
        assert_eq!(client.admin(), admin);
        assert_eq!(client.total_supply(), 0);
    }

    #[test]
    #[should_panic]
    fn test_double_initialize_fails() {
        let (env, cid, _) = setup();
        let client = LeafTokenClient::new(&env, &cid);
        let other = soroban_sdk::Address::generate(&env);
        client.initialize(&other); // AlreadyInitialized
    }

    // ── Metadados ─────────────────────────────────────────────────────────

    #[test]
    fn test_metadata() {
        let (env, cid, _) = setup();
        let client = LeafTokenClient::new(&env, &cid);
        assert_eq!(client.decimals(), 7);
        assert_eq!(client.symbol(), soroban_sdk::String::from_str(&env, "LEAF"));
        assert_eq!(
            client.name(),
            soroban_sdk::String::from_str(&env, "Social Forest Leaf Token")
        );
    }

    // ── Mint ──────────────────────────────────────────────────────────────

    #[test]
    fn test_mint_updates_balance_and_supply() {
        let (env, cid, _) = setup();
        let client = LeafTokenClient::new(&env, &cid);
        let user = soroban_sdk::Address::generate(&env);

        client.mint(&user, &1_000_0000000);
        assert_eq!(client.balance(&user), 1_000_0000000);
        assert_eq!(client.total_supply(), 1_000_0000000);
    }

    #[test]
    fn test_mint_accumulates() {
        let (env, cid, _) = setup();
        let client = LeafTokenClient::new(&env, &cid);
        let user = soroban_sdk::Address::generate(&env);

        client.mint(&user, &500_0000000);
        client.mint(&user, &300_0000000);
        assert_eq!(client.balance(&user), 800_0000000);
        assert_eq!(client.total_supply(), 800_0000000);
    }

    #[test]
    #[should_panic]
    fn test_mint_zero_fails() {
        let (env, cid, _) = setup();
        let client = LeafTokenClient::new(&env, &cid);
        let user = soroban_sdk::Address::generate(&env);
        client.mint(&user, &0); // InvalidAmount
    }

    #[test]
    #[should_panic]
    fn test_mint_negative_fails() {
        let (env, cid, _) = setup();
        let client = LeafTokenClient::new(&env, &cid);
        let user = soroban_sdk::Address::generate(&env);
        client.mint(&user, &-1); // InvalidAmount
    }

    #[test]
    #[should_panic]
    fn test_mint_exceeds_max_supply() {
        let (env, cid, _) = setup();
        let client = LeafTokenClient::new(&env, &cid);
        let user = soroban_sdk::Address::generate(&env);
        client.mint(&user, &(MAX_SUPPLY + 1)); // MaxSupplyExceeded
    }

    // ── Transfer ──────────────────────────────────────────────────────────

    #[test]
    fn test_transfer_updates_both_balances() {
        let (env, cid, _) = setup();
        let client = LeafTokenClient::new(&env, &cid);
        let alice = soroban_sdk::Address::generate(&env);
        let bob = soroban_sdk::Address::generate(&env);

        client.mint(&alice, &5_000_0000000);
        client.transfer(&alice, &bob, &2_000_0000000);

        assert_eq!(client.balance(&alice), 3_000_0000000);
        assert_eq!(client.balance(&bob), 2_000_0000000);
        // Supply não muda em transfer
        assert_eq!(client.total_supply(), 5_000_0000000);
    }

    #[test]
    #[should_panic]
    fn test_transfer_insufficient_balance_fails() {
        let (env, cid, _) = setup();
        let client = LeafTokenClient::new(&env, &cid);
        let alice = soroban_sdk::Address::generate(&env);
        let bob = soroban_sdk::Address::generate(&env);
        client.mint(&alice, &100_0000000);
        client.transfer(&alice, &bob, &200_0000000); // InsufficientBalance
    }

    // ── Burn ──────────────────────────────────────────────────────────────

    #[test]
    fn test_burn_reduces_balance_and_supply() {
        let (env, cid, _) = setup();
        let client = LeafTokenClient::new(&env, &cid);
        let user = soroban_sdk::Address::generate(&env);

        client.mint(&user, &1_000_0000000);
        client.burn(&user, &400_0000000);

        assert_eq!(client.balance(&user), 600_0000000);
        assert_eq!(client.total_supply(), 600_0000000);
    }

    #[test]
    #[should_panic]
    fn test_burn_more_than_balance_fails() {
        let (env, cid, _) = setup();
        let client = LeafTokenClient::new(&env, &cid);
        let user = soroban_sdk::Address::generate(&env);
        client.mint(&user, &100_0000000);
        client.burn(&user, &200_0000000); // InsufficientBalance
    }

    // ── Allowances ────────────────────────────────────────────────────────

    #[test]
    fn test_approve_and_transfer_from() {
        let (env, cid, _) = setup();
        let client = LeafTokenClient::new(&env, &cid);
        let alice = soroban_sdk::Address::generate(&env);
        let bob = soroban_sdk::Address::generate(&env);
        let charlie = soroban_sdk::Address::generate(&env);

        client.mint(&alice, &1_000_0000000);

        let expiry = env.ledger().sequence() + 1_000;
        client.approve(&alice, &bob, &500_0000000, &expiry);
        assert_eq!(client.allowance(&alice, &bob), 500_0000000);

        client.transfer_from(&bob, &alice, &charlie, &300_0000000);
        assert_eq!(client.balance(&alice), 700_0000000);
        assert_eq!(client.balance(&charlie), 300_0000000);
        assert_eq!(client.allowance(&alice, &bob), 200_0000000);
    }

    #[test]
    #[should_panic]
    fn test_transfer_from_exceeds_allowance_fails() {
        let (env, cid, _) = setup();
        let client = LeafTokenClient::new(&env, &cid);
        let alice = soroban_sdk::Address::generate(&env);
        let bob = soroban_sdk::Address::generate(&env);
        let charlie = soroban_sdk::Address::generate(&env);

        client.mint(&alice, &1_000_0000000);
        let expiry = env.ledger().sequence() + 1_000;
        client.approve(&alice, &bob, &100_0000000, &expiry);
        client.transfer_from(&bob, &alice, &charlie, &200_0000000); // InsufficientAllowance
    }

    #[test]
    fn test_approve_zero_revokes_allowance() {
        let (env, cid, _) = setup();
        let client = LeafTokenClient::new(&env, &cid);
        let alice = soroban_sdk::Address::generate(&env);
        let bob = soroban_sdk::Address::generate(&env);

        client.mint(&alice, &1_000_0000000);
        let expiry = env.ledger().sequence() + 1_000;
        client.approve(&alice, &bob, &500_0000000, &expiry);
        assert_eq!(client.allowance(&alice, &bob), 500_0000000);

        client.approve(&alice, &bob, &0, &expiry);
        assert_eq!(client.allowance(&alice, &bob), 0);
    }

    // ── Two-step admin ────────────────────────────────────────────────────

    #[test]
    fn test_two_step_admin_transfer() {
        let (env, cid, _) = setup();
        let client = LeafTokenClient::new(&env, &cid);
        let new_admin = soroban_sdk::Address::generate(&env);

        client.propose_admin(&new_admin);
        client.accept_admin();

        assert_eq!(client.admin(), new_admin);
    }

    #[test]
    #[should_panic]
    fn test_accept_admin_without_propose_fails() {
        let (env, cid, _) = setup();
        let client = LeafTokenClient::new(&env, &cid);
        client.accept_admin(); // NotAuthorized — sem pending_admin
    }
}
