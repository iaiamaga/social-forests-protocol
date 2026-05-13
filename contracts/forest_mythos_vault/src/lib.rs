#![no_std]
#![allow(deprecated)]

use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, panic_with_error, Address, Env, String,
};

// ==============================================================================
// 1. ESTRUTURAS DE ESTÁGIO (Mythos da Floresta)
// ==============================================================================

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DNftStage {
    AwakeningSeed = 1,  // Fase 1: A Semente do Despertar
    RunicSentinel = 2,  // Fase 2: O Sentinela Rúnico
    AncestralTitan = 3, // Fase 3: O Titã Ancestral
    ForestSpirit = 4,   // Fase 4: O Espírito da Floresta
    LegendaryRelic = 5, // Fase 5: O Relicário Lendário
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct DNftRecord {
    pub owner: Address,
    pub stage: DNftStage,
    pub ipfs_uri: String,
    pub minted_at: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SbtRecord {
    pub corporate_owner: Address,
    pub farmer_address: Address,
    pub native_species: String,
}

#[contracttype]
pub enum DataKey {
    OracleAdmin,
    TotalDNfts,
    DNft(u32),
    Sbt(u32),
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum ProtocolError {
    NotInitialized = 1,
    AlreadyInitialized = 2,
    NotFound = 3,
    Unauthorized = 4,
}

// 🛡️ Constantes de Imortalidade (TTL)
const DAY_IN_LEDGERS: u32 = 17_280;
const INSTANCE_THRESHOLD: u32 = 15 * DAY_IN_LEDGERS;
const INSTANCE_BUMP: u32 = 30 * DAY_IN_LEDGERS;
const PERSISTENT_THRESHOLD: u32 = 30 * DAY_IN_LEDGERS;
const PERSISTENT_BUMP: u32 = 60 * DAY_IN_LEDGERS;

// ==============================================================================
// HELPERS
// ==============================================================================
fn bump_instance(env: &Env) {
    env.storage()
        .instance()
        .extend_ttl(INSTANCE_THRESHOLD, INSTANCE_BUMP);
}

// ==============================================================================
// 2. O PROTOCOLO REFORMULADO
// ==============================================================================

#[contract]
pub struct FlorestasProtocol;

#[contractimpl]
impl FlorestasProtocol {
    pub fn initialize(env: Env, oracle_admin: Address) {
        if env.storage().instance().has(&DataKey::OracleAdmin) {
            panic_with_error!(&env, ProtocolError::AlreadyInitialized);
        }
        oracle_admin.require_auth();
        env.storage()
            .instance()
            .set(&DataKey::OracleAdmin, &oracle_admin);
        env.storage().instance().set(&DataKey::TotalDNfts, &0u32);
        bump_instance(&env);
    }

    /// 🌳 FORJA VINCULADA: Une o dNFT (Comercial) ao SBT (Impacto Nativo)
    pub fn forge_mythic_pair(
        env: Env,
        buyer: Address,
        farmer: Address,
        initial_uri: String,
        native_species: String,
    ) -> u32 {
        bump_instance(&env);
        buyer.require_auth();

        let mut current_id: u32 = env
            .storage()
            .instance()
            .get(&DataKey::TotalDNfts)
            .unwrap_or(0);
        current_id += 1;

        let new_dnft = DNftRecord {
            owner: buyer.clone(),
            stage: DNftStage::AwakeningSeed,
            ipfs_uri: initial_uri,
            minted_at: env.ledger().timestamp(),
        };

        let new_sbt = SbtRecord {
            corporate_owner: buyer.clone(),
            farmer_address: farmer,
            native_species,
        };

        // 🛡️ Gravação com renovação de TTL
        let dnft_key = DataKey::DNft(current_id);
        let sbt_key = DataKey::Sbt(current_id);

        env.storage().persistent().set(&dnft_key, &new_dnft);
        env.storage()
            .persistent()
            .extend_ttl(&dnft_key, PERSISTENT_THRESHOLD, PERSISTENT_BUMP);

        env.storage().persistent().set(&sbt_key, &new_sbt);
        env.storage()
            .persistent()
            .extend_ttl(&sbt_key, PERSISTENT_THRESHOLD, PERSISTENT_BUMP);

        env.storage()
            .instance()
            .set(&DataKey::TotalDNfts, &current_id);

        current_id
    }

    pub fn evolve_stage(env: Env, dnft_id: u32, new_stage: DNftStage, new_ipfs_uri: String) {
        bump_instance(&env);
        let oracle: Address = env
            .storage()
            .instance()
            .get(&DataKey::OracleAdmin)
            .unwrap_or_else(|| panic_with_error!(&env, ProtocolError::NotInitialized));
        oracle.require_auth();

        let key = DataKey::DNft(dnft_id);
        let mut dnft: DNftRecord = env
            .storage()
            .persistent()
            .get(&key)
            .unwrap_or_else(|| panic_with_error!(&env, ProtocolError::NotFound));

        dnft.stage = new_stage;
        dnft.ipfs_uri = new_ipfs_uri;

        env.storage().persistent().set(&key, &dnft);
        env.storage()
            .persistent()
            .extend_ttl(&key, PERSISTENT_THRESHOLD, PERSISTENT_BUMP);
    }

    // --------------------------------------------------------------------------
    // LEITURA SEGURA (Sem Panics descontrolados)
    // --------------------------------------------------------------------------

    pub fn get_dnft(env: Env, dnft_id: u32) -> DNftRecord {
        env.storage()
            .persistent()
            .get(&DataKey::DNft(dnft_id))
            .unwrap_or_else(|| panic_with_error!(&env, ProtocolError::NotFound))
    }

    pub fn get_sbt(env: Env, dnft_id: u32) -> SbtRecord {
        env.storage()
            .persistent()
            .get(&DataKey::Sbt(dnft_id))
            .unwrap_or_else(|| panic_with_error!(&env, ProtocolError::NotFound))
    }
}

// ==============================================================================
// TESTES
// ==============================================================================
#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test_mythic_forge() {
        let env = Env::default();
        env.mock_all_auths();

        let admin = Address::generate(&env);
        let buyer = Address::generate(&env);
        let farmer = Address::generate(&env);

        let contract_id = env.register(FlorestasProtocol, ());
        let client = FlorestasProtocolClient::new(&env, &contract_id);

        client.initialize(&admin);

        let uri = String::from_str(&env, "ipfs://seed");
        let species = String::from_str(&env, "Ipê Amarelo");

        let id = client.forge_mythic_pair(&buyer, &farmer, &uri, &species);

        let dnft = client.get_dnft(&id);
        assert_eq!(dnft.stage, DNftStage::AwakeningSeed);

        let sbt = client.get_sbt(&id);
        assert_eq!(sbt.native_species, species);
    }
}
