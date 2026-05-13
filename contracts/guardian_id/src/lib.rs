#![no_std]
#![allow(deprecated)] // 🛡️ Silencia avisos de eventos antigos do SDK

use soroban_sdk::{
    Address, Env, contract, contracterror, contractimpl, contracttype, panic_with_error,
    symbol_short,
};

// =============================================================================
// ERROS DE AUDITORIA (v14.1)
// =============================================================================
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum SbtError {
    NotInitialized = 1,
    AlreadyInitialized = 2,
    SbtNotFound = 3,
    NonTransferable = 4,    // 🛡️ Erro #4 do Doc: O token não pode ser movido
    InvalidAmount = 5,      // 🛡️ Erro #15 do Doc: Previne XP 0
    ArithmeticOverflow = 6, // 🛡️ Erro #14 do Doc: Previne quebra matemática
    Unauthorized = 7,
}

// =============================================================================
// ESTRUTURAS DE DADOS (DRE B2C)
// =============================================================================
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SbtRecord {
    pub user: Address,
    pub xp: u32,
    pub level: u32,
    pub era: u32, // 🛡️ Adicionado: O controlo das 7 Eras de gamificação
}

#[contracttype]
pub enum DataKey {
    Admin,
    Sbt(Address),
}

// 🛡️ Constantes de Imortalidade (TTL)
const DAY_IN_LEDGERS: u32 = 17_280;
const INSTANCE_THRESHOLD: u32 = 15 * DAY_IN_LEDGERS;
const INSTANCE_BUMP: u32 = 30 * DAY_IN_LEDGERS;

const PERSISTENT_THRESHOLD: u32 = 30 * DAY_IN_LEDGERS;
const PERSISTENT_BUMP: u32 = 60 * DAY_IN_LEDGERS;

// =========================================================================
// HELPERS DE ESTADO
// =========================================================================
fn bump_instance(env: &Env) {
    env.storage()
        .instance()
        .extend_ttl(INSTANCE_THRESHOLD, INSTANCE_BUMP);
}

fn read_sbt(env: &Env, user: &Address) -> Option<SbtRecord> {
    let key = DataKey::Sbt(user.clone());
    if let Some(record) = env.storage().persistent().get::<_, SbtRecord>(&key) {
        env.storage()
            .persistent()
            .extend_ttl(&key, PERSISTENT_THRESHOLD, PERSISTENT_BUMP);
        Some(record)
    } else {
        None
    }
}

fn write_sbt(env: &Env, user: &Address, record: &SbtRecord) {
    let key = DataKey::Sbt(user.clone());
    env.storage().persistent().set(&key, record);
    env.storage()
        .persistent()
        .extend_ttl(&key, PERSISTENT_THRESHOLD, PERSISTENT_BUMP);
}

// =========================================================================
// CONTRATO PRINCIPAL — REPUTATION SBT (Soulbound Token)
// =========================================================================
#[contract]
pub struct ReputationSbt;

#[contractimpl]
impl ReputationSbt {
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic_with_error!(&env, SbtError::AlreadyInitialized);
        }
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
        bump_instance(&env);
    }

    /// 🛡️ O Bloqueio Absoluto (Princípio Soulbound)
    /// Se qualquer protocolo tentar transferir esta identidade, a transação aborta.
    pub fn transfer(env: Env, _from: Address, _to: Address, _amount: i128) {
        panic_with_error!(&env, SbtError::NonTransferable);
    }

    /// Distribui XP de reputação (Substitui 'distribute_green_cashback' para alinhar com v14.1)
    pub fn add_xp(env: Env, user: Address, amount: u32) {
        if amount == 0 {
            panic_with_error!(&env, SbtError::InvalidAmount);
        }
        bump_instance(&env);

        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .unwrap_or_else(|| panic_with_error!(&env, SbtError::NotInitialized));
        admin.require_auth();

        let mut sbt = read_sbt(&env, &user).unwrap_or(SbtRecord {
            user: user.clone(),
            xp: 0,
            level: 1,
            era: 1,
        });

        let old_level = sbt.level;
        let old_era = sbt.era;

        // 🛡️ Matemática Segura
        sbt.xp = sbt
            .xp
            .checked_add(amount)
            .unwrap_or_else(|| panic_with_error!(&env, SbtError::ArithmeticOverflow));

        // Fórmula v14.1: Nível sobe a cada 500 XP (Máximo: Nível 50)
        sbt.level = (sbt.xp / 500 + 1).min(50);

        // Progressão de Eras: A cada 7 níveis, sobe 1 Era (Máximo: 7 Eras)
        sbt.era = ((sbt.level - 1) / 7 + 1).min(7);

        write_sbt(&env, &user, &sbt);

        // 📡 Eventos Tipados para o Frontend atualizar a UI em tempo real
        env.events()
            .publish((symbol_short!("xp_add"), user.clone()), amount);

        if sbt.level > old_level {
            env.events().publish(
                (symbol_short!("sbt_lvl"), user.clone()),
                (old_level, sbt.level),
            );
        }

        if sbt.era > old_era {
            env.events()
                .publish((symbol_short!("era_up"), user.clone()), (old_era, sbt.era));
        }
    }

    pub fn get_sbt(env: Env, user: Address) -> SbtRecord {
        bump_instance(&env);
        read_sbt(&env, &user).unwrap_or_else(|| panic_with_error!(&env, SbtError::SbtNotFound))
    }
}

// =============================================================================
// TESTES (A Prova Matemática da Identidade)
// =============================================================================

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::{Env, testutils::Address as _};

    fn setup() -> (Env, ReputationSbtClient<'static>, Address, Address) {
        let env = Env::default();
        env.mock_all_auths();

        let admin = Address::generate(&env);
        let user = Address::generate(&env);

        let contract_id = env.register(ReputationSbt, ());
        let client = ReputationSbtClient::new(&env, &contract_id);

        client.initialize(&admin);

        (env, client, admin, user)
    }

    #[test]
    fn test_add_xp_and_level_progression() {
        let (_env, sbt_client, _admin, user) = setup();

        // 1. Testa inicialização nula para o Nível 1
        sbt_client.add_xp(&user, &499);
        let sbt_1 = sbt_client.get_sbt(&user);
        assert_eq!(sbt_1.level, 1);
        assert_eq!(sbt_1.era, 1);

        // 2. Testa quebra do threshold (500 XP) para Nível 2
        sbt_client.add_xp(&user, &2); // Total 501
        let sbt_2 = sbt_client.get_sbt(&user);
        assert_eq!(sbt_2.level, 2);

        // 3. Testa salto massivo de Era (Level 8 = Era 2)
        sbt_client.add_xp(&user, &3500); // Total > 4000
        let sbt_3 = sbt_client.get_sbt(&user);
        assert_eq!(sbt_3.level, 9);
        assert_eq!(sbt_3.era, 2);
    }

    #[test]
    #[should_panic(expected = "NonTransferable")]
    fn test_soulbound_transfer_fails() {
        let (_env, sbt_client, _admin, user) = setup();
        let hacker = Address::generate(&_env);

        // Tentativa de roubar/transferir o SBT (Bloqueio absoluto)
        sbt_client.transfer(&user, &hacker, &1);
    }

    #[test]
    #[should_panic(expected = "InvalidAmount")]
    fn test_add_zero_xp_fails() {
        let (_env, sbt_client, _admin, user) = setup();
        sbt_client.add_xp(&user, &0);
    }

    #[test]
    #[should_panic(expected = "SbtNotFound")]
    fn test_get_nonexistent_sbt_fails() {
        let (_env, sbt_client, _admin, _user) = setup();
        let ghost = Address::generate(&_env);
        sbt_client.get_sbt(&ghost);
    }
}
