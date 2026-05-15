// apps/web/src/lib/soroban/transactions.ts
import { rpc, TransactionBuilder, Networks, Contract, Address, nativeToScVal } from '@stellar/stellar-sdk';
import * as freighter from '@stellar/freighter-api';
import { CONTRACT_IDS, NETWORK_CONFIG } from './config';

// Agora usamos rpc.Server nas versões mais novas da Stellar SDK
const server = new rpc.Server(NETWORK_CONFIG.rpcUrl);

export async function forgeTreeTransaction(userPublicKey: string) {
    try {
        const account = await server.getAccount(userPublicKey);
        const contract = new Contract(CONTRACT_IDS.journeyOrchestrator);
        const userAddressScVal = new Address(userPublicKey).toScVal();
        const leafCost = BigInt(1000_0000000); // 100 LEAF (7 decimais)

        let tx = new TransactionBuilder(account, {
            fee: "10000",
            networkPassphrase: Networks.TESTNET,
        })
            .addOperation(contract.call(
                "plant_tree",
                userAddressScVal,
                nativeToScVal(leafCost, { type: "i128" })
            ))
            .setTimeout(60)
            .build();

        const simulated = await server.simulateTransaction(tx);

        if (!rpc.Api.isSimulationSuccess(simulated)) {
            console.error("Erro na simulação:", simulated);
            throw new Error("A simulação falhou. Verifique se você tem 100 LEAF e XLM para o gás.");
        }

        // A versão nova do assembleTransaction requer o networkPassphrase no meio
        tx = rpc.assembleTransaction(tx, simulated).build();
        // Atualizado: Freighter agora pede networkPassphrase explicitamente
        const signResponse = await freighter.signTransaction(tx.toXDR(), {
            networkPassphrase: Networks.TESTNET
        });

        // Atualizado: Lida com a nova estrutura de resposta em objeto da Freighter
        if (typeof signResponse === 'object' && 'error' in signResponse && signResponse.error) {
            throw new Error(signResponse.error);
        }

        const signedXdr = typeof signResponse === 'object' && 'signedTxXdr' in signResponse
            ? signResponse.signedTxXdr
            : signResponse;

        if (typeof signedXdr !== 'string') {
            throw new Error("Assinatura cancelada ou formato inválido.");
        }

        const txToSubmit = TransactionBuilder.fromXDR(signedXdr, Networks.TESTNET);
        const sendResponse = await server.sendTransaction(txToSubmit);

        return sendResponse.hash;
    } catch (error) {
        console.error("Erro ao forjar árvore:", error);
        throw error;
    }
}