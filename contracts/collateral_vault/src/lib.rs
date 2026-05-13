#![no_std]
#![allow(deprecated)] // 🛡️ Silencia avisos do SDK em transição, preservando compatibilidade

use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, panic_with_error, symbol_short, Address,
    Env, IntoVal, Symbol,
};

// =============================================================================
// ERROS
// =============================================================================
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum VaultError {
    NotInitialized = 1,
    Unauthorized = 2,
    InsufficientCollateral = 3,
    AssetLocked = 4,
    InvalidAmount = 5,   // 🛡️ Previne ataques de i128 negativos
    ArithmeticError = 6, // 🛡️ Previne overflow de C-Creds
    InvalidNft = 7,      // 🛡️ O NFT não existe ou não pertence a este utilizador
    AlreadyInitialized = 8,
}

// =============================================================================
// ESTRUTURAS DE DADOS E CHAVES
// =============================================================================
#[contracttype]
#[derive(Clone, Debug)]
pub struct CollateralRecord {
    pub user: Address,
    pub nft_id: u32,
    pub timestamp: u64,
}

#[contracttype]
pub enum DataKey {
    Admin,
    Oracle,
    DnftContract, // 🛡️ Novo: Guardamos o endereço do contrato dNFT para validação cruzada
    Collateral(Address, u32),
    CCredBalance(Address),
    TotalCCred,
}

// 🛡️ Constantes de TTL (Time to Live)
const DAY_IN_LEDGERS: u32 = 17_280;
const INSTANCE_THRESHOLD: u32 = 15 * DAY_IN_LEDGERS;
const INSTANCE_BUMP: u32 = 30 * DAY_IN_LEDGERS;

const PERSISTENT_THRESHOLD: u32 = 30 * DAY_IN_LEDGERS;
const PERSISTENT_BUMP: u32 = 60 * DAY_IN_LEDGERS;

// =========================================================================
// HELPERS DE ESTADO (Impedem perda de dados)
// =========================================================================
fn bump_instance(env: &Env) {
    env.storage()
        .instance()
        .extend_ttl(INSTANCE_THRESHOLD, INSTANCE_BUMP);
}

fn read_ccred_balance(env: &Env, id: &Address) -> i128 {
    let key = DataKey::CCredBalance(id.clone());
    if let Some(bal) = env.storage().persistent().get::<_, i128>(&key) {
        env.storage()
            .persistent()
            .extend_ttl(&key, PERSISTENT_THRESHOLD, PERSISTENT_BUMP);
        bal
    } else {
        0
    }
}

fn write_ccred_balance(env: &Env, id: &Address, amount: i128) {
    let key = DataKey::CCredBalance(id.clone());
    env.storage().persistent().set(&key, &amount);
    env.storage()
        .persistent()
        .extend_ttl(&key, PERSISTENT_THRESHOLD, PERSISTENT_BUMP);
}

fn get_oracle(env: &Env) -> Address {
    env.storage()
        .instance()
        .get(&DataKey::Oracle)
        .unwrap_or_else(|| panic_with_error!(env, VaultError::NotInitialized))
}

// =========================================================================
// CONTRATO PRINCIPAL — RWA VAULT
// =========================================================================
#[contract]
pub struct RwaVault;

#[contractimpl]
impl RwaVault {
    // -------------------------------------------------------------------------
    // INICIALIZAÇÃO
    // -------------------------------------------------------------------------

    pub fn initialize(env: Env, admin: Address, oracle: Address, dnft_contract: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic_with_error!(&env, VaultError::AlreadyInitialized);
        }

        admin.require_auth();

        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Oracle, &oracle);
        env.storage()
            .instance()
            .set(&DataKey::DnftContract, &dnft_contract);
        env.storage().instance().set(&DataKey::TotalCCred, &0i128);

        bump_instance(&env);
    }

    // -------------------------------------------------------------------------
    // GESTÃO DE COLATERAL (NFT)
    // -------------------------------------------------------------------------

    pub fn deposit_dnft(env: Env, user: Address, nft_id: u32) {
        bump_instance(&env);
        user.require_auth();

        let dnft_address: Address = env
            .storage()
            .instance()
            .get(&DataKey::DnftContract)
            .unwrap_or_else(|| panic_with_error!(&env, VaultError::NotInitialized));

        let nft_owner: Address = env.invoke_contract(
            &dnft_address,
            &Symbol::new(&env, "get_owner"),
            soroban_sdk::vec![&env, nft_id.into_val(&env)],
        );

        if nft_owner != user {
            panic_with_error!(&env, VaultError::InvalidNft);
        }

        let key = DataKey::Collateral(user.clone(), nft_id);

        if env.storage().persistent().has(&key) {
            panic_with_error!(&env, VaultError::AssetLocked);
        }

        let record = CollateralRecord {
            user: user.clone(),
            nft_id,
            timestamp: env.ledger().timestamp(),
        };

        env.storage().persistent().set(&key, &record);
        env.storage()
            .persistent()
            .extend_ttl(&key, PERSISTENT_THRESHOLD, PERSISTENT_BUMP);

        env.events()
            .publish((symbol_short!("deposit"), user), nft_id);
    }

    pub fn withdraw_dnft(env: Env, user: Address, nft_id: u32) {
        bump_instance(&env);
        user.require_auth();

        let key = DataKey::Collateral(user.clone(), nft_id);

        if !env.storage().persistent().has(&key) {
            panic_with_error!(&env, VaultError::InsufficientCollateral);
        }

        env.storage().persistent().remove(&key);
        env.events()
            .publish((symbol_short!("withdraw"), user), nft_id);
    }

    // -------------------------------------------------------------------------
    // CRÉDITOS DE CARBONO (C-CRED)
    // -------------------------------------------------------------------------

    pub fn mint_c_cred(env: Env, user: Address, amount: i128) {
        if amount <= 0 {
            panic_with_error!(&env, VaultError::InvalidAmount);
        }

        bump_instance(&env);
        get_oracle(&env).require_auth();

        let current_bal = read_ccred_balance(&env, &user);
        let new_bal = current_bal
            .checked_add(amount)
            .unwrap_or_else(|| panic_with_error!(&env, VaultError::ArithmeticError));

        write_ccred_balance(&env, &user, new_bal);

        let total_key = DataKey::TotalCCred;
        let total: i128 = env.storage().instance().get(&total_key).unwrap_or(0i128);
        let new_total = total
            .checked_add(amount)
            .unwrap_or_else(|| panic_with_error!(&env, VaultError::ArithmeticError));

        env.storage().instance().set(&total_key, &new_total);

        env.events()
            .publish((symbol_short!("mint_cc"), user), amount);
    }

    pub fn burn_c_cred(env: Env, user: Address, amount: i128) {
        if amount <= 0 {
            panic_with_error!(&env, VaultError::InvalidAmount);
        }

        bump_instance(&env);
        user.require_auth();

        let current_bal = read_ccred_balance(&env, &user);

        if current_bal < amount {
            panic_with_error!(&env, VaultError::InsufficientCollateral);
        }

        let new_bal = current_bal
            .checked_sub(amount)
            .unwrap_or_else(|| panic_with_error!(&env, VaultError::ArithmeticError));

        write_ccred_balance(&env, &user, new_bal);

        let total_key = DataKey::TotalCCred;
        let total: i128 = env.storage().instance().get(&total_key).unwrap_or(0i128);

        env.storage().instance().set(&total_key, &(total - amount));

        env.events()
            .publish((symbol_short!("burn_cc"), user), amount);
    }

    pub fn get_ccred_balance(env: Env, user: Address) -> i128 {
        bump_instance(&env);
        read_ccred_balance(&env, &user)
    }
}

// =============================================================================
// TESTES
// =============================================================================

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    pub mod dnft_mock {
        use soroban_sdk::{contract, contractimpl, Address, Env};

        #[contract]
        pub struct DnftMock;

        #[contractimpl]
        impl DnftMock {
            pub fn get_owner(env: Env, _nft_id: u32) -> Address {
                env.storage().instance().get(&0).unwrap()
            }
            pub fn set_owner(env: Env, owner: Address) {
                env.storage().instance().set(&0, &owner);
            }
        }
    }

    fn setup() -> (
        Env,
        RwaVaultClient<'static>,
        Address,
        Address,
        Address,
        Address,
    ) {
        let env = Env::default();
        env.mock_all_auths();

        let admin = Address::generate(&env);
        let oracle = Address::generate(&env);
        let user = Address::generate(&env);

        let dnft_id = env.register(dnft_mock::DnftMock, ());
        let dnft_client = dnft_mock::DnftMockClient::new(&env, &dnft_id);
        dnft_client.set_owner(&user);

        let vault_id = env.register(RwaVault, ());
        let vault_client = RwaVaultClient::new(&env, &vault_id);
        vault_client.initialize(&admin, &oracle, &dnft_id);

        (env, vault_client, admin, oracle, user, dnft_id)
    }

    #[test]
    fn test_deposit_and_withdraw_legitimate_owner() {
        let (_env, vault, _admin, _oracle, user, _dnft) = setup();

        vault.deposit_dnft(&user, &99);
        vault.withdraw_dnft(&user, &99);
    }

    #[test]
    #[should_panic(expected = "InvalidNft")]
    fn test_deposit_fails_if_not_owner() {
        let (env, vault, _admin, _oracle, _user, _dnft) = setup();
        let hacker = Address::generate(&env);
        vault.deposit_dnft(&hacker, &99);
    }

    #[test]
    #[should_panic(expected = "AssetLocked")]
    fn test_double_deposit_fails() {
        let (_env, vault, _admin, _oracle, user, _dnft) = setup();
        vault.deposit_dnft(&user, &99);
        vault.deposit_dnft(&user, &99);
    }

    #[test]
    fn test_mint_and_burn_c_cred() {
        let (env, vault, _admin, oracle, user, _dnft) = setup();

        vault
            .mock_auths(&[soroban_sdk::testutils::MockAuth {
                address: &oracle,
                invoke: &soroban_sdk::testutils::MockAuthInvoke {
                    contract: &vault.address,
                    fn_name: "mint_c_cred",
                    args: soroban_sdk::vec![&env, user.into_val(&env), 5000i128.into_val(&env)],
                    sub_invokes: &[],
                },
            }])
            .mint_c_cred(&user, &5000);

        assert_eq!(vault.get_ccred_balance(&user), 5000);

        vault
            .mock_auths(&[soroban_sdk::testutils::MockAuth {
                address: &user,
                invoke: &soroban_sdk::testutils::MockAuthInvoke {
                    contract: &vault.address,
                    fn_name: "burn_c_cred",
                    args: soroban_sdk::vec![&env, user.into_val(&env), 2000i128.into_val(&env)],
                    sub_invokes: &[],
                },
            }])
            .burn_c_cred(&user, &2000);

        assert_eq!(vault.get_ccred_balance(&user), 3000);
    }

    #[test]
    #[should_panic(expected = "InvalidAmount")]
    fn test_mint_negative_c_cred_fails() {
        let (env, vault, _admin, oracle, user, _dnft) = setup();

        vault
            .mock_auths(&[soroban_sdk::testutils::MockAuth {
                address: &oracle,
                invoke: &soroban_sdk::testutils::MockAuthInvoke {
                    contract: &vault.address,
                    fn_name: "mint_c_cred",
                    args: soroban_sdk::vec![&env, user.into_val(&env), (-500i128).into_val(&env)],
                    sub_invokes: &[],
                },
            }])
            .mint_c_cred(&user, &-500);
    }

    #[test]
    #[should_panic(expected = "InvalidAmount")]
    fn test_burn_negative_c_cred_fails() {
        let (env, vault, _admin, oracle, user, _dnft) = setup();

        vault
            .mock_auths(&[soroban_sdk::testutils::MockAuth {
                address: &oracle,
                invoke: &soroban_sdk::testutils::MockAuthInvoke {
                    contract: &vault.address,
                    fn_name: "mint_c_cred",
                    args: soroban_sdk::vec![&env, user.into_val(&env), 1000i128.into_val(&env)],
                    sub_invokes: &[],
                },
            }])
            .mint_c_cred(&user, &1000);

        vault
            .mock_auths(&[soroban_sdk::testutils::MockAuth {
                address: &user,
                invoke: &soroban_sdk::testutils::MockAuthInvoke {
                    contract: &vault.address,
                    fn_name: "burn_c_cred",
                    args: soroban_sdk::vec![&env, user.into_val(&env), (-100i128).into_val(&env)],
                    sub_invokes: &[],
                },
            }])
            .burn_c_cred(&user, &-100);
    }

    #[test]
    #[should_panic(expected = "InsufficientCollateral")]
    fn test_burn_more_than_balance_fails() {
        let (env, vault, _admin, oracle, user, _dnft) = setup();

        vault
            .mock_auths(&[soroban_sdk::testutils::MockAuth {
                address: &oracle,
                invoke: &soroban_sdk::testutils::MockAuthInvoke {
                    contract: &vault.address,
                    fn_name: "mint_c_cred",
                    args: soroban_sdk::vec![&env, user.into_val(&env), 100i128.into_val(&env)],
                    sub_invokes: &[],
                },
            }])
            .mint_c_cred(&user, &100);

        vault
            .mock_auths(&[soroban_sdk::testutils::MockAuth {
                address: &user,
                invoke: &soroban_sdk::testutils::MockAuthInvoke {
                    contract: &vault.address,
                    fn_name: "burn_c_cred",
                    args: soroban_sdk::vec![&env, user.into_val(&env), 500i128.into_val(&env)],
                    sub_invokes: &[],
                },
            }])
            .burn_c_cred(&user, &500);
    }
}
