// ============================================================
// Social Forest Protocol — RWA Vault Contract
// Token: Social Forest Leaf (LEAF) + B2B Community Yield
// Padrão: SEP-41 (Stellar Token Interface)
// Segurança: Certora Soroban Audit Guide Compliant
// ============================================================
#![no_std]

use soroban_sdk::{
    contract, contracterror, contractevent, contractimpl, contracttype, panic_with_error, token,
    Address, Env, String,
};

// ─────────────────────────────────────────────
// Supply Cap
// ─────────────────────────────────────────────

/// 100 milhões de LEAF com 7 casas decimais
const MAX_SUPPLY: i128 = 100_000_000 * 10_000_000;

// ─────────────────────────────────────────────
// Chaves de Storage com namespace tipado        [T1-T2]
// ─────────────────────────────────────────────

#[contracttype]
pub enum DataKey {
    Admin,
    Paused,
    TotalSupply,
    Balance(Address),
    Allowance(Address, Address),
    // Novas chaves para o Impacto B2B
    CommunityFund,
    YieldBps,
}

// ─────────────────────────────────────────────
// Erros do Contrato (alargado)                 [T1-T2]
// ─────────────────────────────────────────────

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum ContractError {
    NotInitialized = 1,
    AlreadyInitialized = 2,
    NotAuthorized = 3,
    CompanyNotVerified = 4,
    InsufficientBalance = 5,
    ArithmeticOverflow = 6,
    SupplyCapExceeded = 7,
    ContractPaused = 8,
    BatchTooLarge = 9,
    InvalidAmount = 10,
    InsufficientAllowance = 11,
    CommunityFundNotSet = 12, // Erro novo para o Fundo de Mudas
}

// ─────────────────────────────────────────────
// Estrutura de Eventos (Padrão SDK 25)
// ─────────────────────────────────────────────

#[contractevent]
pub struct PausedEvent {}

#[contractevent]
pub struct UnpausedEvent {}

#[contractevent]
pub struct MintEvent {
    #[topic]
    pub to: Address,
    pub amount: i128,
}

#[contractevent]
pub struct BurnEvent {
    #[topic]
    pub from: Address,
    pub amount: i128,
}

#[contractevent]
pub struct ApproveEvent {
    #[topic]
    pub from: Address,
    #[topic]
    pub spender: Address,
    pub amount: i128,
}

#[contractevent]
pub struct TransferEvent {
    #[topic]
    pub from: Address,
    #[topic]
    pub to: Address,
    pub amount: i128,
}

#[contractevent]
pub struct TransferFromEvent {
    #[topic]
    pub spender: Address,
    #[topic]
    pub from: Address,
    #[topic]
    pub to: Address,
    pub amount: i128,
}

// NOVO EVENTO: Auditoria de Fomento Local (Vereda Verify)
#[contractevent]
pub struct CommunityYieldEvent {
    #[topic]
    pub from: Address,
    pub amount: i128,
}

// ─────────────────────────────────────────────
// Helpers internos
// ─────────────────────────────────────────────

fn get_balance(env: &Env, addr: &Address) -> i128 {
    env.storage()
        .persistent()
        .get::<_, i128>(&DataKey::Balance(addr.clone()))
        .unwrap_or(0)
}

/// Grava saldo e faz TTL bump (~30 dias)       [T8]
fn set_balance(env: &Env, addr: &Address, amount: i128) {
    let key = DataKey::Balance(addr.clone());
    env.storage().persistent().set(&key, &amount);
    env.storage().persistent().extend_ttl(&key, 17_280, 518_400);
}

fn get_allowance(env: &Env, owner: &Address, spender: &Address) -> i128 {
    env.storage()
        .persistent()
        .get::<_, i128>(&DataKey::Allowance(owner.clone(), spender.clone()))
        .unwrap_or(0)
}

/// Grava allowance e faz TTL bump             [T8]
fn set_allowance(env: &Env, owner: &Address, spender: &Address, amount: i128) {
    let key = DataKey::Allowance(owner.clone(), spender.clone());
    env.storage().persistent().set(&key, &amount);
    env.storage().persistent().extend_ttl(&key, 17_280, 518_400);
}

fn get_admin(env: &Env) -> Address {
    env.storage()
        .instance()
        .get::<_, Address>(&DataKey::Admin)
        .unwrap_or_else(|| panic_with_error!(env, ContractError::NotInitialized))
}

fn get_total_supply(env: &Env) -> i128 {
    env.storage()
        .instance()
        .get::<_, i128>(&DataKey::TotalSupply)
        .unwrap_or(0)
}

/// Guard de pausa — rejeita todas as escritas [T6]
fn assert_not_paused(env: &Env) {
    if env
        .storage()
        .instance()
        .get::<_, bool>(&DataKey::Paused)
        .unwrap_or(false)
    {
        panic_with_error!(env, ContractError::ContractPaused);
    }
}

// ─────────────────────────────────────────────
// Definição do Contrato
// ─────────────────────────────────────────────

#[contract]
pub struct MognoVault;

#[contractimpl]
impl MognoVault {
    // ───── Inicialização ─────────────────────

    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic_with_error!(env, ContractError::AlreadyInitialized);
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Paused, &false);
        env.storage().instance().set(&DataKey::TotalSupply, &0i128);
        env.storage().instance().extend_ttl(17_280, 518_400); // [T8]
    }

    // ───── Configuração de Impacto (Community Yield) ─────

    /// Define a carteira que vai receber a verba das mudas e a percentagem (em basis points)
    pub fn set_community_params(env: Env, fund_address: Address, bps: u32) {
        let admin = get_admin(&env);
        admin.require_auth();

        // 10000 BPS = 100%
        if bps > 10000 {
            panic_with_error!(&env, ContractError::InvalidAmount);
        }

        env.storage()
            .instance()
            .set(&DataKey::CommunityFund, &fund_address);
        env.storage().instance().set(&DataKey::YieldBps, &bps);
    }

    // ───── Investimento com Impacto B2B ──────────────────

    /// A empresa deposita um token de pagamento (ex: USDC) e recebe LEAF.
    /// O contrato retém automaticamente a fração para o fundo local de mudas.
    pub fn invest_with_impact(env: Env, investor: Address, payment_token: Address, amount: i128) {
        assert_not_paused(&env);
        if amount <= 0 {
            panic_with_error!(env, ContractError::InvalidAmount);
        }
        investor.require_auth();

        // Resgatar os parâmetros do fundo
        let fund_address: Address = env
            .storage()
            .instance()
            .get(&DataKey::CommunityFund)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::CommunityFundNotSet));
        let bps: u32 = env
            .storage()
            .instance()
            .get(&DataKey::YieldBps)
            .unwrap_or(0);

        // Matemática do Split: Separar o valor das mudas do investimento principal
        let community_share = (amount * (bps as i128)) / 10000;
        let investment_share = amount - community_share;

        let client = token::Client::new(&env, &payment_token);

        // 1. Enviar a taxa de fomento diretamente para o Fundo (Mudas para o Ceará)
        if community_share > 0 {
            client.transfer(&investor, &fund_address, &community_share);
            CommunityYieldEvent {
                from: investor.clone(),
                amount: community_share,
            }
            .publish(&env);
        }

        // 2. Reter o investimento principal no Vault do Florestas.Social
        if investment_share > 0 {
            client.transfer(
                &investor,
                &env.current_contract_address(),
                &investment_share,
            );
        }

        // 3. Mintar o Token LEAF (Mogno) para o investidor, equivalente à sua fatia
        let current_supply = get_total_supply(&env);
        let new_supply = current_supply
            .checked_add(investment_share)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::ArithmeticOverflow));

        if new_supply > MAX_SUPPLY {
            panic_with_error!(env, ContractError::SupplyCapExceeded);
        }

        let current_balance = get_balance(&env, &investor);
        let new_balance = current_balance
            .checked_add(investment_share)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::ArithmeticOverflow));

        set_balance(&env, &investor, new_balance);
        env.storage()
            .instance()
            .set(&DataKey::TotalSupply, &new_supply);

        MintEvent {
            to: investor,
            amount: investment_share,
        }
        .publish(&env);
        env.storage().instance().extend_ttl(17_280, 518_400);
    }

    // ───── Emergency Pause                    [T6] ─────────

    pub fn pause(env: Env) {
        let admin = get_admin(&env);
        admin.require_auth();
        env.storage().instance().set(&DataKey::Paused, &true);
        PausedEvent {}.publish(&env); // [T3] NOVO PADRÃO
        env.storage().instance().extend_ttl(17_280, 518_400); // [T8]
    }

    pub fn unpause(env: Env) {
        let admin = get_admin(&env);
        admin.require_auth();
        env.storage().instance().set(&DataKey::Paused, &false);
        UnpausedEvent {}.publish(&env); // [T3] NOVO PADRÃO
        env.storage().instance().extend_ttl(17_280, 518_400); // [T8]
    }

    // ───── Admin Functions ───────────────────

    pub fn admin_mint(env: Env, to: Address, amount: i128) {
        assert_not_paused(&env); // [T6]
        if amount <= 0 {
            panic_with_error!(env, ContractError::InvalidAmount);
        }
        let admin = get_admin(&env);
        admin.require_auth();

        let current_supply = get_total_supply(&env);
        let new_supply = current_supply
            .checked_add(amount)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::ArithmeticOverflow)); // [T4]
        if new_supply > MAX_SUPPLY {
            panic_with_error!(env, ContractError::SupplyCapExceeded); // [T5]
        }

        let current = get_balance(&env, &to);
        let new_balance = current
            .checked_add(amount)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::ArithmeticOverflow));
        set_balance(&env, &to, new_balance);

        env.storage()
            .instance()
            .set(&DataKey::TotalSupply, &new_supply);

        MintEvent { to, amount }.publish(&env); // [T3] NOVO PADRÃO
        env.storage().instance().extend_ttl(17_280, 518_400); // [T8]
    }

    pub fn admin_burn(env: Env, from: Address, amount: i128) {
        assert_not_paused(&env); // [T6]
        if amount <= 0 {
            panic_with_error!(env, ContractError::InvalidAmount);
        }
        let admin = get_admin(&env);
        admin.require_auth();

        let current = get_balance(&env, &from);
        if current < amount {
            panic_with_error!(env, ContractError::InsufficientBalance);
        }
        let new_balance = current
            .checked_sub(amount)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::ArithmeticOverflow)); // [T4]
        set_balance(&env, &from, new_balance);

        let current_supply = get_total_supply(&env);
        let new_supply = current_supply
            .checked_sub(amount)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::ArithmeticOverflow));
        env.storage()
            .instance()
            .set(&DataKey::TotalSupply, &new_supply);

        BurnEvent { from, amount }.publish(&env); // [T3] NOVO PADRÃO
        env.storage().instance().extend_ttl(17_280, 518_400); // [T8]
    }

    // ───── SEP-41: Token Metadata ─────────────

    pub fn decimals(_env: Env) -> u32 {
        7
    }

    pub fn name(env: Env) -> String {
        String::from_str(&env, "Social Forest Leaf")
    }

    pub fn symbol(env: Env) -> String {
        String::from_str(&env, "LEAF")
    }

    // ───── SEP-41: Balance & Supply ──────────

    pub fn balance(env: Env, id: Address) -> i128 {
        get_balance(&env, &id)
    }

    pub fn total_supply(env: Env) -> i128 {
        get_total_supply(&env)
    }

    // ───── SEP-41: Allowance & Transfer ──────

    pub fn approve(
        env: Env,
        from: Address,
        spender: Address,
        amount: i128,
        _expiration_ledger: u32,
    ) {
        assert_not_paused(&env); // [T6]
        if amount < 0 {
            panic_with_error!(env, ContractError::InvalidAmount);
        }
        from.require_auth();
        set_allowance(&env, &from, &spender, amount);

        ApproveEvent {
            from,
            spender,
            amount,
        }
        .publish(&env); // [T3] NOVO PADRÃO

        env.storage().instance().extend_ttl(17_280, 518_400); // [T8]
    }

    pub fn allowance(env: Env, from: Address, spender: Address) -> i128 {
        get_allowance(&env, &from, &spender)
    }

    pub fn transfer(env: Env, from: Address, to: Address, amount: i128) {
        assert_not_paused(&env); // [T6]
        if amount <= 0 {
            panic_with_error!(env, ContractError::InvalidAmount);
        }
        from.require_auth();

        let from_balance = get_balance(&env, &from);
        if from_balance < amount {
            panic_with_error!(env, ContractError::InsufficientBalance);
        }

        let new_from = from_balance
            .checked_sub(amount)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::ArithmeticOverflow));
        let to_balance = get_balance(&env, &to);
        let new_to = to_balance
            .checked_add(amount)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::ArithmeticOverflow));

        set_balance(&env, &from, new_from);
        set_balance(&env, &to, new_to);

        TransferEvent { from, to, amount }.publish(&env); // [T3] NOVO PADRÃO
        env.storage().instance().extend_ttl(17_280, 518_400); // [T8]
    }

    pub fn transfer_from(env: Env, spender: Address, from: Address, to: Address, amount: i128) {
        assert_not_paused(&env); // [T6]
        if amount <= 0 {
            panic_with_error!(env, ContractError::InvalidAmount);
        }
        spender.require_auth();

        let cur_allowance = get_allowance(&env, &from, &spender);
        if cur_allowance < amount {
            panic_with_error!(env, ContractError::InsufficientAllowance);
        }
        let from_balance = get_balance(&env, &from);
        if from_balance < amount {
            panic_with_error!(env, ContractError::InsufficientBalance);
        }

        let new_allowance = cur_allowance
            .checked_sub(amount)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::ArithmeticOverflow));
        let new_from = from_balance
            .checked_sub(amount)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::ArithmeticOverflow));
        let to_balance = get_balance(&env, &to);
        let new_to = to_balance
            .checked_add(amount)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::ArithmeticOverflow));

        set_allowance(&env, &from, &spender, new_allowance);
        set_balance(&env, &from, new_from);
        set_balance(&env, &to, new_to);

        TransferFromEvent {
            spender,
            from,
            to,
            amount,
        }
        .publish(&env); // [T3] NOVO PADRÃO
        env.storage().instance().extend_ttl(17_280, 518_400); // [T8]
    }
}

// ─────────────────────────────────────────────
// Testes                                       [T9]
// ─────────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::testutils::Address as _;
    use soroban_sdk::Env;

    fn setup() -> (Env, MognoVaultClient<'static>, Address, Address) {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register(MognoVault, ());
        let client = MognoVaultClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let user = Address::generate(&env);

        client.initialize(&admin);

        (env, client, admin, user)
    }

    #[test]
    fn test_admin_mint_increases_balance() {
        let (_env, client, _admin, user) = setup();
        assert_eq!(client.balance(&user), 0);
        let amount: i128 = 100 * 10_000_000;
        client.admin_mint(&user, &amount);
        assert_eq!(client.balance(&user), amount);
    }

    #[test]
    fn test_admin_mint_accumulates() {
        let (_env, client, _admin, user) = setup();
        client.admin_mint(&user, &10_000_000);
        client.admin_mint(&user, &20_000_000);
        assert_eq!(client.balance(&user), 30_000_000);
    }

    #[test]
    fn test_transfer_moves_tokens() {
        let (env, client, _admin, sender) = setup();
        let receiver = Address::generate(&env);
        client.admin_mint(&sender, &50_000_000);
        client.transfer(&sender, &receiver, &20_000_000);
        assert_eq!(client.balance(&sender), 30_000_000);
        assert_eq!(client.balance(&receiver), 20_000_000);
    }

    #[test]
    #[should_panic]
    fn test_transfer_fails_on_insufficient_balance() {
        let (env, client, _admin, sender) = setup();
        let receiver = Address::generate(&env);
        client.admin_mint(&sender, &5_000_000);
        client.transfer(&sender, &receiver, &10_000_000);
    }

    #[test]
    fn test_token_metadata() {
        let (_env, client, _admin, _user) = setup();
        assert_eq!(client.decimals(), 7u32);
        let _ = client.name();
        let _ = client.symbol();
    }

    #[test]
    fn test_approve_and_transfer_from() {
        let (env, client, _admin, owner) = setup();
        let spender = Address::generate(&env);
        let receiver = Address::generate(&env);
        client.admin_mint(&owner, &100_000_000);
        client.approve(&owner, &spender, &50_000_000, &1_000_000u32);
        client.transfer_from(&spender, &owner, &receiver, &30_000_000);
        assert_eq!(client.balance(&owner), 70_000_000);
        assert_eq!(client.balance(&receiver), 30_000_000);
        assert_eq!(client.allowance(&owner, &spender), 20_000_000);
    }

    #[test]
    #[should_panic]
    fn test_double_initialize_fails() {
        let (_env, client, admin, _user) = setup();
        client.initialize(&admin);
    }

    #[test]
    fn test_admin_mint_authorized() {
        let (_env, client, _admin, user) = setup();
        client.admin_mint(&user, &10_000_000i128);
        assert_eq!(client.balance(&user), 10_000_000i128);
    }

    #[test]
    #[should_panic]
    fn test_admin_mint_unauthorized() {
        let env = Env::default();
        let contract_id = env.register(MognoVault, ());
        let client = MognoVaultClient::new(&env, &contract_id);
        let admin = Address::generate(&env);
        let user = Address::generate(&env);
        client.initialize(&admin);
        client.admin_mint(&user, &100_000_000i128);
    }

    #[test]
    #[should_panic]
    fn test_supply_cap_exceeded() {
        let (_env, client, _admin, user) = setup();
        let half_max: i128 = 50_000_000 * 10_000_000;
        client.admin_mint(&user, &half_max);
        client.admin_mint(&user, &half_max);
        client.admin_mint(&user, &1i128);
    }

    #[test]
    fn test_transfer_happy_path() {
        let (env, client, _admin, sender) = setup();
        let receiver = Address::generate(&env);
        client.admin_mint(&sender, &100_000_000i128);
        client.transfer(&sender, &receiver, &40_000_000i128);
        assert_eq!(client.balance(&sender), 60_000_000i128);
        assert_eq!(client.balance(&receiver), 40_000_000i128);
    }

    #[test]
    #[should_panic]
    fn test_transfer_insufficient_balance() {
        let (env, client, _admin, sender) = setup();
        let receiver = Address::generate(&env);
        client.admin_mint(&sender, &1_000_000i128);
        client.transfer(&sender, &receiver, &9_000_000i128);
    }

    #[test]
    #[should_panic]
    fn test_allowance_exhausted() {
        let (env, client, _admin, owner) = setup();
        let spender = Address::generate(&env);
        let receiver = Address::generate(&env);
        client.admin_mint(&owner, &100_000_000i128);
        client.approve(&owner, &spender, &30_000_000i128, &1_000_000u32);
        client.transfer_from(&spender, &owner, &receiver, &30_000_000i128);
        client.transfer_from(&spender, &owner, &receiver, &1_000_000i128);
    }

    #[test]
    #[should_panic]
    fn test_pause_blocks_transfers() {
        let (env, client, _admin, sender) = setup();
        let receiver = Address::generate(&env);
        client.admin_mint(&sender, &100_000_000i128);
        client.pause();
        client.transfer(&sender, &receiver, &50_000_000i128);
    }

    #[test]
    fn test_unpause_restores_transfers() {
        let (env, client, _admin, sender) = setup();
        let receiver = Address::generate(&env);
        client.admin_mint(&sender, &100_000_000i128);
        client.pause();
        client.unpause();
        client.transfer(&sender, &receiver, &50_000_000i128);
        assert_eq!(client.balance(&receiver), 50_000_000i128);
    }

    #[test]
    fn test_total_supply_tracking() {
        let (_env, client, _admin, user) = setup();
        assert_eq!(client.total_supply(), 0);
        client.admin_mint(&user, &100_000_000i128);
        assert_eq!(client.total_supply(), 100_000_000i128);
        client.admin_burn(&user, &30_000_000i128);
        assert_eq!(client.total_supply(), 70_000_000i128);
    }
}
