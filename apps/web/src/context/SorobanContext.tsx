'use client';

import { createContext, useContext, useMemo, ReactNode } from 'react';

// Agora apontando diretamente para o index.ts dentro da pasta src de cada binding
import { Client as LeafTokenClient } from '../lib/soroban/bindings/leaf_token/src/index';
import { Client as MasterChiefClient } from '../lib/soroban/bindings/master_chief/src/index';
import { Client as SbtEmpresaClient } from '../lib/soroban/bindings/sbt_empresa/src/index';
import { Client as SbtGuardianClient } from '../lib/soroban/bindings/sbt_guardian/src/index';
import { Client as MythosVaultClient } from '../lib/soroban/bindings/forest_mythos_vault/src/index';
import { Client as JourneyOrchestratorClient } from '../lib/soroban/bindings/journey_orchestrator/src/index';

import { NETWORK_CONFIG, CONTRACT_IDS, NETWORK_PASSPHRASE } from '../lib/soroban/config';

const sorobanConfig = {
    ...NETWORK_CONFIG,
    networkPassphrase: NETWORK_PASSPHRASE,
};

interface SorobanContextType {
    leafToken: LeafTokenClient;
    sbtCompany: SbtEmpresaClient;
    masterChief: MasterChiefClient;
    sbtGuardian: SbtGuardianClient;
    mythosVault: MythosVaultClient;
    journeyOrchestrator: JourneyOrchestratorClient;
}

const SorobanContext = createContext<SorobanContextType | null>(null);

export function SorobanProvider({ children }: { children: ReactNode }) {
    const clients = useMemo(() => ({
        leafToken: new LeafTokenClient({ ...sorobanConfig, contractId: CONTRACT_IDS.leafToken }),
        sbtCompany: new SbtEmpresaClient({ ...sorobanConfig, contractId: CONTRACT_IDS.sbtCompany }),
        masterChief: new MasterChiefClient({ ...sorobanConfig, contractId: CONTRACT_IDS.masterChief }),
        sbtGuardian: new SbtGuardianClient({ ...sorobanConfig, contractId: CONTRACT_IDS.sbtGuardian }),
        mythosVault: new MythosVaultClient({ ...sorobanConfig, contractId: CONTRACT_IDS.mythosVault }),
        journeyOrchestrator: new JourneyOrchestratorClient({ ...sorobanConfig, contractId: CONTRACT_IDS.journeyOrchestrator }),
    }), []);

    return (
        <SorobanContext.Provider value={clients}>
            {children}
        </SorobanContext.Provider>
    );
}

export const useSoroban = () => {
    const context = useContext(SorobanContext);
    if (!context) throw new Error("useSoroban deve ser usado dentro de um SorobanProvider");
    return context;
};