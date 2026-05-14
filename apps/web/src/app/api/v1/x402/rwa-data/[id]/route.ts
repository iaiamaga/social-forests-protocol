// =============================================================================
// GET /api/v1/x402/rwa-data/[id]
// Protegido por x402: paga $0.001 USDC → retorna telemetria do dNFT
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { withX402 } from "@x402/next";
import { x402ResourceServer } from "@x402/core/server";
import { ExactStellarScheme } from "@x402/stellar/exact/server";
import { X402_ROUTES, X402_NETWORK } from "@/lib/x402/config";
import { createFacilitatorClient } from "@/lib/x402/middleware";
import {
  Contract,
  TransactionBuilder,
  Networks,
  rpc,
  Account,
  nativeToScVal,
  scValToNative,
} from "@stellar/stellar-sdk";
import { NETWORK_CONFIG, CONTRACT_IDS } from "@/lib/soroban/config";

const routeConfig = X402_ROUTES["GET /api/v1/x402/rwa-data/[id]"];

const facilitator = createFacilitatorClient();
const resourceServer = new x402ResourceServer([facilitator]);
resourceServer.register(X402_NETWORK, new ExactStellarScheme());

/**
 * Handler principal — executado APÓS o pagamento x402 ser verificado.
 */
async function handler(req: NextRequest): Promise<NextResponse> {
  try {
    // Extrai o token ID da URL: /api/v1/x402/rwa-data/[id]
    const url = new URL(req.url);
    const segments = url.pathname.split("/");
    const id = segments[segments.length - 1];
    const tokenId = parseInt(id, 10);

    if (isNaN(tokenId) || tokenId <= 0) {
      return NextResponse.json(
        { error: "Invalid token ID. Must be a positive integer." },
        { status: 400 }
      );
    }

    const server = new rpc.Server(NETWORK_CONFIG.rpcUrl);
    const contract = new Contract(CONTRACT_IDS.mythosVault);

    // Monta a chamada get_dnft(token_id) — read-only
    const call = contract.call("get_dnft", nativeToScVal(tokenId, { type: "u32" }));

    // Usa uma conta dummy para simulação (read-only)
    const dummyAccount = new Account(
      "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF",
      "0"
    );

    const tx = new TransactionBuilder(dummyAccount, {
      fee: "100",
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(call)
      .setTimeout(30)
      .build();

    const result = await server.simulateTransaction(tx);

    if (rpc.Api.isSimulationError(result)) {
      return NextResponse.json(
        { error: "Token not found or contract error" },
        { status: 404 }
      );
    }

    const successResult = result as rpc.Api.SimulateTransactionSuccessResponse;
    const returnValue = successResult.result?.retval;

    if (!returnValue) {
      return NextResponse.json(
        { error: "No data returned for this token ID" },
        { status: 404 }
      );
    }

    const decoded = scValToNative(returnValue);

    return NextResponse.json({
      success: true,
      tokenId,
      data: {
        owner: decoded.owner,
        tier: decoded.tier,
        treeCount: decoded.tree_count,
        phase: decoded.phase,
        biomassKg: decoded.biomass_kg,
        carbonG: decoded.carbon_g,
        birthDate: decoded.birth_date,
      },
      meta: {
        contract: CONTRACT_IDS.mythosVault,
        network: NETWORK_CONFIG.network,
        paidVia: "x402",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const GET = withX402(handler, { accepts: [routeConfig.accepts] }, resourceServer);
