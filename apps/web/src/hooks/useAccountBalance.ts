'use client';

import { useState, useEffect, useCallback } from 'react';
import * as StellarSdk from '@stellar/stellar-sdk';
import { FLORESTAS_CONFIG } from '@/lib/soroban/config';

const server = new StellarSdk.rpc.Server(FLORESTAS_CONFIG.rpcUrl);

interface AccountBalances {
  asset_type: string;
  balance: string;
}

interface StellarAccountResponse {
  _raw: {
    balances: AccountBalances[];
  };
}

export function useAccountBalance(publicKey: string | null) {
  const [leafBalance, setLeafBalance] = useState<string>("0.00");
  const [xlmBalance, setXlmBalance] = useState<string>("0.00");
  const [isLoading, setIsLoading] = useState(false);

  const fetchBalance = useCallback(async () => {
    if (!publicKey) return;

    try {
      setIsLoading(true);
      const contractId = FLORESTAS_CONFIG.contracts.leafToken;
      const contract = new StellarSdk.Contract(contractId);

      const accountData = (await server.getAccount(publicKey)) as unknown as StellarAccountResponse;

      /**
       * CORREÇÃO: Removido 'any'. 
       * Convertemos para 'unknown' e depois para o tipo 'Account' do SDK.
       */
      const tx = new StellarSdk.TransactionBuilder(accountData as unknown as StellarSdk.Account, {
        fee: '100',
        networkPassphrase: StellarSdk.Networks.TESTNET
      })
        .addOperation(contract.call('balance', new StellarSdk.Address(publicKey).toScVal()))
        .setTimeout(30)
        .build();

      const response = await server.simulateTransaction(tx);
      if (StellarSdk.rpc.Api.isSimulationSuccess(response) && response.result) {
        const rawLeaf = StellarSdk.scValToNative(response.result.retval);
        setLeafBalance((Number(rawLeaf) / 10_000_000).toFixed(2));
      }

      if (accountData?._raw?.balances) {
        const native = accountData._raw.balances.find(b => b.asset_type === 'native');
        if (native) setXlmBalance(Number(native.balance).toFixed(2));
      }

    } catch (e) {
      console.error("Erro ao sincronizar saldos:", e);
    } finally {
      setIsLoading(false);
    }
  }, [publicKey]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBalance();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchBalance]);

  return { leafBalance, xlmBalance, isLoading, refresh: fetchBalance };
}