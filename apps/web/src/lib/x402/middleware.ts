// =============================================================================
// x402 — Middleware helper para Next.js API Routes
// =============================================================================

import { HTTPFacilitatorClient } from "@x402/core/server";
import {
  X402_FACILITATOR_URL,
  X402_FACILITATOR_API_KEY,
} from "./config";

/**
 * Cria o cliente do facilitador x402 com autenticação.
 */
export function createFacilitatorClient(): HTTPFacilitatorClient {
  if (X402_FACILITATOR_API_KEY) {
    return new HTTPFacilitatorClient({
      url: X402_FACILITATOR_URL,
      createAuthHeaders: async () => {
        const headers = { Authorization: `Bearer ${X402_FACILITATOR_API_KEY}` };
        return { verify: headers, settle: headers, supported: headers };
      },
    });
  }

  return new HTTPFacilitatorClient({
    url: X402_FACILITATOR_URL,
  });
}