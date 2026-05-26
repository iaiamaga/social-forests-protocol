'use client';
import { useMemo } from 'react';
// Ajuste o caminho abaixo para o seu arquivo de config original
import { CONTRACT_IDS, NETWORK_CONFIG, NETWORK_PASSPHRASE } from '../lib/soroban/config';

import { Client as LeafTokenClient } from '@bindings/leaf_token/src/index';
import { Client as CollateralVaultClient } from '@bindings/master_chief/src/index';
import { Client as GuardianIdClient } from '@bindings/sbt_guardian/src/index';
import { Client as CompanyIdClient } from '@bindings/sbt_empresa/src/index';
import { Client as JourneyOrchestratorClient } from '@bindings/journey_orchestrator/src/index';
import { Client as ForestMythosVaultClient } from '@bindings/forest_mythos_vault/src/index';

export function useSorobanContracts() {
  return useMemo(() => {
    const clientOptions = {
      ...NETWORK_CONFIG,
      networkPassphrase: NETWORK_PASSPHRASE
    };

    return {
      leafToken: new LeafTokenClient({ ...clientOptions, contractId: CONTRACT_IDS.leafToken }),
      collateralVault: new CollateralVaultClient({ ...clientOptions, contractId: CONTRACT_IDS.masterChief }),
      guardianId: new GuardianIdClient({ ...clientOptions, contractId: CONTRACT_IDS.sbtGuardian }),
      companyId: new CompanyIdClient({ ...clientOptions, contractId: CONTRACT_IDS.sbtCompany }),
      journeyOrchestrator: new JourneyOrchestratorClient({ ...clientOptions, contractId: CONTRACT_IDS.journeyOrchestrator }),
      forestMythosVault: new ForestMythosVaultClient({ ...clientOptions, contractId: CONTRACT_IDS.mythosVault }),
    };
  }, []);
}