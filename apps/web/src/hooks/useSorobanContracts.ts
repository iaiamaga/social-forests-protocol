'use client';

import { useMemo } from 'react';
import { Client as LeafTokenClient } from '../lib/soroban/bindings/leaf_token/src/index';
import { Client as MasterChiefClient } from '../lib/soroban/bindings/master_chief/src/index';
import { Client as SbtEmpresaClient } from '../lib/soroban/bindings/sbt_empresa/src/index';
import { Client as SbtGuardianClient } from '../lib/soroban/bindings/sbt_guardian/src/index';
import { Client as MythosVaultClient } from '../lib/soroban/bindings/forest_mythos_vault/src/index';
import { Client as JourneyOrchestratorClient } from '../lib/soroban/bindings/journey_orchestrator/src/index';

import { NETWORK_CONFIG, CONTRACT_IDS, NETWORK_PASSPHRASE } from '../lib/soroban/config';

// Interface exportada para estar disponível no page.tsx
export interface DnftRecord {
  biomass_kg: number;
  birth_date: number;
  carbon_g: number;
  owner: string;
  phase: number;
  tier: number;
  tree_count: number;
}

export function useSorobanContracts() {
  return useMemo(() => {
    const config = { ...NETWORK_CONFIG, networkPassphrase: NETWORK_PASSPHRASE };
    return {
      leafToken: new LeafTokenClient({ ...config, contractId: CONTRACT_IDS.leafToken }),
      sbtCompany: new SbtEmpresaClient({ ...config, contractId: CONTRACT_IDS.sbtCompany }),
      masterChief: new MasterChiefClient({ ...config, contractId: CONTRACT_IDS.masterChief }),
      sbtGuardian: new SbtGuardianClient({ ...config, contractId: CONTRACT_IDS.sbtGuardian }),
      mythosVault: new MythosVaultClient({ ...config, contractId: CONTRACT_IDS.mythosVault }),
      journeyOrchestrator: new JourneyOrchestratorClient({ ...config, contractId: CONTRACT_IDS.journeyOrchestrator }),
    };
  }, []);
}