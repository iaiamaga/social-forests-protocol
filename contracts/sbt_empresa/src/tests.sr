#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Env, Address};

fn setup() -> (Env, CompanySbtClient<'static>, Address, Address) {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register(CompanySbt, ());
    let client = CompanySbtClient::new(&env, &contract_id);
    
    let admin = Address::generate(&env);
    let oracle = Address::generate(&env);
    
    client.initialize(&admin, &oracle);
    
    (env, client, admin, oracle)
}

#[test]
fn test_register_and_get_company() {
    let (env, client, _, _) = setup();
    let company = Address::generate(&env);
    
    client.register_company(&company);
    
    let sbt = client.get_empresa_sbt(&company).unwrap();
    assert_eq!(sbt.verified_by_vereda, false);
    assert_eq!(sbt.co2e_tonnes, 0);
}

#[test]
fn test_oracle_verification_and_metrics() {
    let (env, client, _, _oracle) = setup();
    let company = Address::generate(&env);
    
    client.register_company(&company);
    
    // Oráculo Vereda verifica a empresa
    client.verify_company(&company);
    
    // Atualiza métricas
    client.update_environmental_metrics(&company, &100, &50);
    
    let sbt = client.get_empresa_sbt(&company).unwrap();
    assert_eq!(sbt.verified_by_vereda, true);
    assert_eq!(sbt.co2e_tonnes, 100);
    assert_eq!(sbt.native_species_count, 50);
}

#[test]
#[should_panic]
fn test_revoked_sbt_cannot_update_metrics() {
    let (env, client, _, _oracle) = setup();
    let company = Address::generate(&env);
    
    client.register_company(&company);
    
    // Revoga o selo por irregularidade
    let reason = soroban_sdk::String::from_str(&env, "Irregularidade Juridica");
    client.revoke_sbt(&company, &reason);
    
    // Tentar atualizar CO2 após revogação deve falhar (Panic)
    client.update_environmental_metrics(&company, &50, &10);
}