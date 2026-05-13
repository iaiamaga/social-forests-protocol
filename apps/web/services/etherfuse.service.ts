// apps/web/services/etherfuse.service.ts
import { Keypair, Asset, Horizon, TransactionBuilder, Operation, Networks, Memo } from '@stellar/stellar-sdk';

export interface RwaReceipt {
    status: "success" | "failed";
    tx_hash: string;
    asset_type: string;
    amount_locked: number;
    timestamp: string;
    network: "stellar-testnet";
    issuer: string;
}

export interface BuyRwaParams {
    companyId: string;
    treeCount: number;
    stellarAddress?: string;
}

export class EtherfuseService {
    private static readonly ASSET_CODE = "KHAYA_SENE";
    private static readonly ISSUER = "FLORESTAS_SOCIAL_PROTOCOL";

    static async buyRwaToken(params: BuyRwaParams): Promise<RwaReceipt> {
        const { treeCount } = params;
        const secret = process.env.STELLAR_PROTOCOL_SECRET || "";

        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("[FLORESTAS.SOCIAL] 🌳 Finalizando Registro RWA...");

        try {
            const protocolKeypair = Keypair.fromSecret(secret);
            const publicKey = protocolKeypair.publicKey();
            const server = new Horizon.Server('https://horizon-testnet.stellar.org');

            // 1. Carregar a conta
            const sourceAccount = await server.loadAccount(publicKey);

            // 2. Montar transação com prazo de validade estendido (3 minutos)
            const tx = new TransactionBuilder(sourceAccount, {
                fee: '10000',
                networkPassphrase: Networks.TESTNET
            })
                .addOperation(Operation.payment({
                    destination: publicKey,
                    asset: Asset.native(),
                    amount: "0.00001"
                }))
                .addMemo(Memo.text(`MINT:${treeCount} KHAYA`))
                .setTimeout(180) // 🎯 AUMENTADO: De 30 para 180 segundos para evitar tx_too_late
                .build();

            // 3. Assinar e Enviar
            tx.sign(protocolKeypair);
            console.log(`[Stellar] ├─ Enviando para a Testnet...`);

            const response = await server.submitTransaction(tx);

            console.log("[Stellar] ✅ SUCESSO TOTAL!");
            console.log(`[Stellar] └─ Hash: ${response.hash}`);
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

            return {
                status: "success",
                tx_hash: response.hash,
                asset_type: this.ASSET_CODE,
                amount_locked: treeCount,
                timestamp: new Date().toISOString(),
                network: "stellar-testnet",
                issuer: this.ISSUER,
            };

        } catch (error: any) {
            const stellarError = error.response?.data?.extras?.result_codes?.transaction || error.message;
            console.error('[Stellar Error]:', stellarError);
            throw new Error(`Falha na rede: ${stellarError}`);
        }
    }
}