'use client';

import { useState, useCallback } from 'react';
import * as StellarSdk from '@stellar/stellar-sdk';
import { signTransaction, setAllowed } from "@stellar/freighter-api";
import { rpcServer, NETWORK } from '@/lib/soroban/config';

export function useHeroState(address: string | null) {
  const [isForging, setIsForging] = useState(false);

  const forgeTree = useCallback(async () => {
    if (!address) return;
    setIsForging(true);

    try {
      // 1. Permissão de conexão com a carteira
      await setAllowed();

      // IDs dos contratos (Token LEAF e Protocolo Florestas)
      const TOKEN_ID = 'CBBECVILQYMFY3FQ3EEKQYGY3AIW2MVVQLSDXWSYPLITZXCF4SPHZPSL';
      const PROTOCOL_ID = 'CBNPPKTNIO3GRMDMSFK2YLBDBMYM3CPG6KY7XER6KBYD56UV3W4WH72X';

      // ==============================================================
      // PASSO 1: O PAGAMENTO (Transferência de 100 LEAF para o protocolo)
      // ==============================================================
      const tokenContract = new StellarSdk.Contract(TOKEN_ID);
      const paymentOp = tokenContract.call('transfer',
        StellarSdk.nativeToScVal(address, { type: 'address' }),
        StellarSdk.nativeToScVal(PROTOCOL_ID, { type: 'address' }),
        StellarSdk.nativeToScVal('1000000000', { type: 'i128' }) // <-- CORREÇÃO: 9 zeros para 100 LEAF exatos
      );

      let source = await rpcServer.getAccount(address);
      let tx1 = new StellarSdk.TransactionBuilder(source, {
        fee: '10000',
        networkPassphrase: NETWORK.networkPassphrase,
      }).addOperation(paymentOp).setTimeout(60).build();

      let preparedTx1 = await rpcServer.prepareTransaction(tx1);
      let result1 = await signTransaction(preparedTx1.toXDR(), { networkPassphrase: NETWORK.networkPassphrase, address });
      let signedXdr1 = typeof result1 === 'string' ? result1 : (result1 as any).signedTxXdr;

      if (!signedXdr1) throw new Error("Assinatura do pagamento cancelada.");

      let transaction1 = StellarSdk.TransactionBuilder.fromXDR(signedXdr1, NETWORK.networkPassphrase);
      let sendResult1 = await rpcServer.sendTransaction(transaction1);

      if (sendResult1.status !== 'PENDING') {
        throw new Error("Falha no envio do pagamento.");
      }

      // Pausa estratégica de 4 segundos para a rede validar o Bloco 
      // e evitar conflito de Sequence Number na carteira
      await new Promise(resolve => setTimeout(resolve, 4000));

      // ==============================================================
      // PASSO 2: A FORJA (Registro do RWA do Mogno-Africano)
      // ==============================================================
      const protocolContract = new StellarSdk.Contract(PROTOCOL_ID);
      const forgeOp = protocolContract.call('forge_common_rwa',
        StellarSdk.nativeToScVal(address, { type: 'address' })
      );

      // BEM IMPORTANTE: Pegamos a conta novamente para atualizar o Sequence Number!
      source = await rpcServer.getAccount(address);
      let tx2 = new StellarSdk.TransactionBuilder(source, {
        fee: '10000',
        networkPassphrase: NETWORK.networkPassphrase,
      }).addOperation(forgeOp).setTimeout(60).build();

      let preparedTx2 = await rpcServer.prepareTransaction(tx2);
      let result2 = await signTransaction(preparedTx2.toXDR(), { networkPassphrase: NETWORK.networkPassphrase, address });
      let signedXdr2 = typeof result2 === 'string' ? result2 : (result2 as any).signedTxXdr;

      if (!signedXdr2) throw new Error("Assinatura da forja cancelada.");

      let transaction2 = StellarSdk.TransactionBuilder.fromXDR(signedXdr2, NETWORK.networkPassphrase);
      let sendResult2 = await rpcServer.sendTransaction(transaction2);

      if (sendResult2.status === 'PENDING') {
        alert("🌳 SUCESSO TOTAL!\n100 LEAFs consumidos e a sua primeira muda de Mogno foi registrada na blockchain.");
      }

    } catch (e: any) {
      console.error("Erro no fluxo de forja:", e);
      alert("A operação falhou: " + (e.message || "Verifique o console."));
    } finally {
      setIsForging(false);
    }
  }, [address]);

  return { isForging, forgeTree };
}