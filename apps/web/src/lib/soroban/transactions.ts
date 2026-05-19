// apps/web/src/lib/soroban/transactions.ts
import { rpc, TransactionBuilder, Networks, Contract, Address, nativeToScVal } from '@stellar/stellar-sdk';
import * as freighter from '@stellar/freighter-api';
import { CONTRACT_IDS, NETWORK_CONFIG, NETWORK_PASSPHRASE } from './config';

const server = new rpc.Server(NETWORK_CONFIG.rpcUrl);

export async function forgeTreeTransaction(userPublicKey: string) {
    try {
        const account = await server.getAccount(userPublicKey);
        const contract = new Contract(CONTRACT_IDS.journeyOrchestrator);
        const userAddressScVal = new Address(userPublicKey).toScVal();
        const leafCost = BigInt(1000_0000000);

        // 1. Criar transação base
        let tx = new TransactionBuilder(account, {
            fee: "10000",
            networkPassphrase: NETWORK_PASSPHRASE,
        })
            .addOperation(contract.call(
                "plant_tree",
                userAddressScVal,
                nativeToScVal(leafCost, { type: "i128" }) // Correção: "i128" para Soroban
            ))
            .setTimeout(60)
            .build();

        // 2. Simular para obter o footprint e CPU/Memoria
        const simulated = await server.simulateTransaction(tx);
        if (!rpc.Api.isSimulationSuccess(simulated)) {
            throw new Error("Simulação falhou: " + JSON.stringify(simulated));
        }

        // 3. Montar transação com dados da simulação
        tx = rpc.assembleTransaction(tx, simulated).build();

        // 4. Assinar com Freighter
        const signResponse = await freighter.signTransaction(tx.toXDR(), {
            networkPassphrase: NETWORK_PASSPHRASE
        });

        if (typeof signResponse !== 'object' || !('signedTxXdr' in signResponse)) {
            throw new Error("Assinatura falhou ou foi cancelada.");
        }

        // AQUI ESTÁ O PULO DO GATO:
        // Em vez de enviar direto, podes precisar de enviar este signedTxXdr
        // para o teu backend aplicar o Fee Bump.
        return signResponse.signedTxXdr;

    } catch (error) {
        console.error("Erro no fluxo Soroban:", error);
        throw error;
    }
}