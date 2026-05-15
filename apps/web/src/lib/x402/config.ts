// =============================================================================
// x402 — Configuração Centralizada (Social Forests Protocol)
// =============================================================================

import { CONTRACT_IDS, NETWORK_CONFIG } from "../soroban/config";

/**
 * Endereço Stellar que recebe os pagamentos USDC via x402.
 * Validado em runtime quando uma rota x402 é chamada.
 */
export const X402_PAY_TO: string =
  process.env.NEXT_PUBLIC_X402_PAY_TO ?? "";

/** Validates X402_PAY_TO is set. Call from route handlers, not at module load. */
export function assertX402Configured(): void {
  if (!X402_PAY_TO) {
    throw new Error(
      "[x402] NEXT_PUBLIC_X402_PAY_TO not configured. Set it in .env.local"
    );
  }
}

/**
 * URL do facilitador x402 (OpenZeppelin Relayer on Stellar).
 * Testnet: https://channels.openzeppelin.com/x402/testnet
 * Mainnet: https://channels.openzeppelin.com/x402
 */
export const X402_FACILITATOR_URL =
  process.env.NEXT_PUBLIC_X402_FACILITATOR_URL ??
  "https://channels.openzeppelin.com/x402/testnet";

/**
 * API Key do facilitador (gerada em channels.openzeppelin.com/testnet/gen)
 */
export const X402_FACILITATOR_API_KEY =
  process.env.X402_FACILITATOR_API_KEY ?? "";

/**
 * Rede Stellar no formato CAIP-2 usado pelo x402.
 */
export const X402_NETWORK: "stellar:testnet" | "stellar:pubnet" =
  NETWORK_CONFIG.network === "testnet" ? "stellar:testnet" : "stellar:pubnet";

/**
 * Preços por endpoint (em USDC).
 */
export const X402_PRICES = {
  plantTree: "$0.01",
  forgeMythos: "$0.05",
  rwaData: "$0.001",
} as const;

/**
 * Mapeamento de rotas protegidas → configuração x402.
 */
export const X402_ROUTES = {
  "POST /api/v1/x402/plant-tree": {
    accepts: {
      scheme: "exact" as const,
      price: X402_PRICES.plantTree,
      network: X402_NETWORK,
      payTo: X402_PAY_TO,
    },
    description: "Plant a Mogno tree — burns $LEAF and mints a dNFT",
    mimeType: "application/json",
  },
  "POST /api/v1/x402/forge-mythos": {
    accepts: {
      scheme: "exact" as const,
      price: X402_PRICES.forgeMythos,
      network: X402_NETWORK,
      payTo: X402_PAY_TO,
    },
    description: "Forge multiple dNFTs into a higher-tier Mythos NFT",
    mimeType: "application/json",
  },
  "GET /api/v1/x402/rwa-data/[id]": {
    accepts: {
      scheme: "exact" as const,
      price: X402_PRICES.rwaData,
      network: X402_NETWORK,
      payTo: X402_PAY_TO,
    },
    description: "RWA telemetry data — biomass, carbon, phase",
    mimeType: "application/json",
  },
} as const;

/**
 * IDs dos contratos usados nos endpoints x402.
 */
export const X402_CONTRACTS = {
  journeyOrchestrator: CONTRACT_IDS.journeyOrchestrator,
  mythosVault: CONTRACT_IDS.mythosVault,
  leafToken: CONTRACT_IDS.leafToken,
} as const;
