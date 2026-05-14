// =============================================================================
// POST /api/v1/x402/plant-tree
// Protegido por x402: paga $0.01 USDC → chama journey_orchestrator.plant_tree()
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
  Address,
  nativeToScVal,
} from "@stellar/stellar-sdk";
import { NETWORK_CONFIG, CONTRACT_IDS } from "@/lib/soroban/config";

const routeConfig = X402_ROUTES["POST /api/v1/x402/plant-tree"];

const facilitator = createFacilitatorClient();
const resourceServer = new x402ResourceServer([facilitator]);
resourceServer.register(X402_NETWORK, new ExactStellarScheme());

/**
 * Handler principal — executado APÓS o pagamento x402 ser verificado.
 */
async function handler(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { userAddress, leafCost } = body;

    if (!userAddress || !leafCost) {
      return NextResponse.json(
        { error: "Missing required fields: userAddress, leafCost" },
        { status: 400 }
      );
    }

    const server = new rpc.Server(NETWORK_CONFIG.rpcUrl);
    const contract = new Contract(CONTRACT_IDS.journeyOrchestrator);

    // Monta a chamada plant_tree(user, leaf_cost)
    const call = contract.call(
      "plant_tree",
      new Address(userAddress).toScVal(),
      nativeToScVal(BigInt(leafCost), { type: "i128" })
    );

    const account = await server.getAccount(userAddress);
    const tx = new TransactionBuilder(account, {
      fee: "100",
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(call)
      .setTimeout(300)
      .build();

    const simulated = await server.simulateTransaction(tx);

    if (rpc.Api.isSimulationError(simulated)) {
      return NextResponse.json(
        { error: "Simulation failed", details: simulated },
        { status: 422 }
      );
    }

    const preparedTx = rpc.assembleTransaction(tx, simulated).build();

    return NextResponse.json({
      success: true,
      message: "Payment received. Transaction prepared for signing.",
      transactionXDR: preparedTx.toXDR(),
      network: NETWORK_CONFIG.network,
      contract: CONTRACT_IDS.journeyOrchestrator,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const POST = withX402(handler, { accepts: [routeConfig.accepts] }, resourceServer);
