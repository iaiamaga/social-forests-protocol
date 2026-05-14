// =============================================================================
// useX402Payment — Hook React para pagamentos x402 via Freighter
// =============================================================================
// Fluxo:
// 1. Cliente chama o endpoint protegido → recebe 402 com instruções
// 2. Assina a autorização Soroban via Freighter
// 3. Reenvia o request com o header de pagamento
// 4. Recebe a resposta com a transação preparada
// =============================================================================

"use client";

import { useState, useCallback } from "react";
import {
  isConnected as checkConnection,
  getAddress,
  signTransaction,
} from "@stellar/freighter-api";

export type X402Endpoint = "plant-tree" | "forge-mythos" | "rwa-data";

interface X402PaymentState {
  loading: boolean;
  error: string | null;
  transactionXDR: string | null;
  response: Record<string, unknown> | null;
}

interface UseX402PaymentReturn extends X402PaymentState {
  payAndCall: (
    endpoint: X402Endpoint,
    options?: {
      method?: "GET" | "POST";
      body?: Record<string, unknown>;
      pathParam?: string;
    }
  ) => Promise<Record<string, unknown> | null>;
  reset: () => void;
}

const BASE_URL = "/api/v1/x402";

/**
 * Hook que encapsula o fluxo completo de pagamento x402 no frontend.
 *
 * Uso:
 * ```tsx
 * const { payAndCall, loading, error, response } = useX402Payment();
 *
 * const handlePlant = async () => {
 *   await payAndCall("plant-tree", {
 *     method: "POST",
 *     body: { userAddress: "G...", leafCost: 1000_0000000 }
 *   });
 * };
 * ```
 */
export function useX402Payment(): UseX402PaymentReturn {
  const [state, setState] = useState<X402PaymentState>({
    loading: false,
    error: null,
    transactionXDR: null,
    response: null,
  });

  const reset = useCallback(() => {
    setState({ loading: false, error: null, transactionXDR: null, response: null });
  }, []);

  const payAndCall = useCallback(
    async (
      endpoint: X402Endpoint,
      options?: {
        method?: "GET" | "POST";
        body?: Record<string, unknown>;
        pathParam?: string;
      }
    ): Promise<Record<string, unknown> | null> => {
      setState({ loading: true, error: null, transactionXDR: null, response: null });

      try {
        // 1. Verifica conexão com Freighter
        const { isConnected } = await checkConnection();
        if (!isConnected) {
          throw new Error("Freighter wallet not connected. Please install and connect Freighter.");
        }

        const { address: publicKey, error: accessError } = await getAddress();
        if (accessError || !publicKey) {
          throw new Error("Could not retrieve public key from Freighter.");
        }

        // 2. Monta a URL do endpoint
        const path = options?.pathParam
          ? `${BASE_URL}/${endpoint}/${options.pathParam}`
          : `${BASE_URL}/${endpoint}`;

        const method = options?.method ?? "POST";

        // 3. Primeira chamada — espera receber 402 com instruções de pagamento
        const firstResponse = await fetch(path, {
          method,
          headers: { "Content-Type": "application/json" },
          body: method === "POST" ? JSON.stringify(options?.body ?? {}) : undefined,
        });

        // Se não for 402, pode ser erro ou já está liberado
        if (firstResponse.status !== 402) {
          if (firstResponse.ok) {
            const data = await firstResponse.json();
            setState({ loading: false, error: null, transactionXDR: null, response: data });
            return data;
          }
          const errorData = await firstResponse.json().catch(() => ({}));
          throw new Error(
            (errorData as { error?: string }).error ??
              `Unexpected status: ${firstResponse.status}`
          );
        }

        // 4. Extrai instruções de pagamento do header X-Payment
        const paymentHeader = firstResponse.headers.get("X-Payment");
        if (!paymentHeader) {
          throw new Error("Server returned 402 but no X-Payment header found.");
        }

        const paymentInstructions = JSON.parse(paymentHeader);

        // 5. Monta a transação de pagamento e assina via Freighter
        const { transaction: paymentTxXDR } = paymentInstructions;

        if (!paymentTxXDR) {
          throw new Error("Payment instructions missing transaction XDR.");
        }

        // Assina via Freighter (v6 API)
        const { signedTxXdr, error: signError } = await signTransaction(
          paymentTxXDR,
          {
            address: publicKey,
            networkPassphrase: "Test SDF Network ; September 2015",
          }
        );

        if (signError || !signedTxXdr) {
          throw new Error("Transaction signing failed or was rejected by user.");
        }

        // 6. Reenvia o request com o pagamento assinado
        const paidResponse = await fetch(path, {
          method,
          headers: {
            "Content-Type": "application/json",
            "X-Payment-Signature": JSON.stringify({
              ...paymentInstructions,
              transaction: signedTxXdr,
            }),
          },
          body: method === "POST" ? JSON.stringify(options?.body ?? {}) : undefined,
        });

        if (!paidResponse.ok) {
          const errorData = await paidResponse.json().catch(() => ({}));
          throw new Error(
            (errorData as { error?: string }).error ??
              `Payment accepted but request failed: ${paidResponse.status}`
          );
        }

        const responseData = await paidResponse.json();

        setState({
          loading: false,
          error: null,
          transactionXDR: responseData.transactionXDR ?? null,
          response: responseData,
        });

        return responseData;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown payment error";
        setState({ loading: false, error: message, transactionXDR: null, response: null });
        return null;
      }
    },
    []
  );

  return { ...state, payAndCall, reset };
}
