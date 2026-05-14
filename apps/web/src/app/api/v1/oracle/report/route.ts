// =============================================================================
// POST /api/v1/oracle/report
// Oracle Service — Injeta dados de telemetria (biomassa, carbono, fase)
// no contrato forest_mythos_vault via process_oracle_report()
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import {
  Contract,
  TransactionBuilder,
  Networks,
  Keypair,
  rpc,
  nativeToScVal,
} from "@stellar/stellar-sdk";
import { NETWORK_CONFIG, CONTRACT_IDS } from "@/lib/soroban/config";

/**
 * Payload esperado do serviço de telemetria (satélite/IA):
 * {
 *   tokenId: number,
 *   biomassKg: number,
 *   carbonG: number,
 *   phase: number,
 *   oracleSecret: string  // Chave secreta do oráculo (env var em produção)
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tokenId, biomassKg, carbonG, phase, oracleSecret } = body;

    // Validação
    if (!tokenId || biomassKg == null || carbonG == null || !phase) {
      return NextResponse.json(
        { error: "Missing fields: tokenId, biomassKg, carbonG, phase" },
        { status: 400 }
      );
    }

    // Autenticação do oráculo via secret key
    const secret = oracleSecret || process.env.ORACLE_SECRET_KEY;
    if (!secret) {
      return NextResponse.json(
        { error: "Oracle not configured. Set ORACLE_SECRET_KEY." },
        { status: 503 }
      );
    }

    const oracleKeypair = Keypair.fromSecret(secret);
    const oraclePublicKey = oracleKeypair.publicKey();

    const server = new rpc.Server(NETWORK_CONFIG.rpcUrl);
    const contract = new Contract(CONTRACT_IDS.mythosVault);

    // Monta a chamada process_oracle_report(token_id, biomass, carbon, phase)
    const call = contract.call(
      "process_oracle_report",
      nativeToScVal(Number(tokenId), { type: "u32" }),
      nativeToScVal(Number(biomassKg), { type: "u32" }),
      nativeToScVal(Number(carbonG), { type: "u32" }),
      nativeToScVal(Number(phase), { type: "u32" })
    );

    const account = await server.getAccount(oraclePublicKey);
    const tx = new TransactionBuilder(account, {
      fee: "10000",
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(call)
      .setTimeout(120)
      .build();

    const simulated = await server.simulateTransaction(tx);

    if (rpc.Api.isSimulationError(simulated)) {
      return NextResponse.json(
        { error: "Simulation failed", details: simulated },
        { status: 422 }
      );
    }

    // Assemble e assina com a chave do oráculo
    const preparedTx = rpc.assembleTransaction(tx, simulated).build();
    preparedTx.sign(oracleKeypair);

    // Submete on-chain
    const sendResponse = await server.sendTransaction(preparedTx);

    if (sendResponse.status === "ERROR") {
      return NextResponse.json(
        { error: "Transaction submission failed", details: sendResponse },
        { status: 500 }
      );
    }

    // Aguarda confirmação
    let getResponse = await server.getTransaction(sendResponse.hash);
    while (getResponse.status === "NOT_FOUND") {
      await new Promise((r) => setTimeout(r, 1000));
      getResponse = await server.getTransaction(sendResponse.hash);
    }

    if (getResponse.status === "SUCCESS") {
      return NextResponse.json({
        success: true,
        txHash: sendResponse.hash,
        tokenId,
        report: { biomassKg, carbonG, phase },
      });
    }

    return NextResponse.json(
      { error: "Transaction failed on-chain", status: getResponse.status },
      { status: 500 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
