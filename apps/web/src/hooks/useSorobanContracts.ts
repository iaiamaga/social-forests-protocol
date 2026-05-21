'use client';

import { useMemo } from 'react';
import { Client as LeafTokenClient } from '../lib/soroban/bindings/leaf_token/src/index';
import { Client as CollateralVaultClient } from '../lib/soroban/bindings/master_chief/src/index';
import { Client as GuardianIdClient } from '../lib/soroban/bindings/sbt_guardian/src/index';
import { Client as CompanyIdClient } from '../lib/soroban/bindings/sbt_empresa/src/index';
import { Client as JourneyOrchestratorClient } from '../lib/soroban/bindings/journey_orchestrator/src/index';
import { Client as ForestMythosVaultClient } from '../lib/soroban/bindings/forest_mythos_vault/src/index';

import { NETWORK_CONFIG, CONTRACT_IDS, NETWORK_PASSPHRASE } from '../lib/soroban/config';

export type { DnftRecord } from '../lib/soroban/bindings/forest_mythos_vault/src/index';

export function useSorobanContracts() {
  return useMemo(() => {
    const config = { ...NETWORK_CONFIG, networkPassphrase: NETWORK_PASSPHRASE };
    return {
      leafToken: new LeafTokenClient({ ...config, contractId: CONTRACT_IDS.leafToken }),
      collateralVault: new CollateralVaultClient({ ...config, contractId: CONTRACT_IDS.masterChief }),
      guardianId: new GuardianIdClient({ ...config, contractId: CONTRACT_IDS.sbtGuardian }),
      companyId: new CompanyIdClient({ ...config, contractId: CONTRACT_IDS.sbtCompany }),
      journeyOrchestrator: new JourneyOrchestratorClient({ ...config, contractId: CONTRACT_IDS.journeyOrchestrator }),
      forestMythosVault: new ForestMythosVaultClient({ ...config, contractId: CONTRACT_IDS.mythosVault }),
    };
  }, []);
}