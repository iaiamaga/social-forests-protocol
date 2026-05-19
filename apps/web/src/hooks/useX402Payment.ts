'use client';

import { useState, useCallback } from "react";
import { isConnected, getAddress, signTransaction } from "@stellar/freighter-api";
import { NETWORK_PASSPHRASE } from "@/lib/soroban/config";

export function useX402Payment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const payAndCall = useCallback(async (endpoint: string, body: any) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/v1/x402/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.status === 402) {
        const paymentHeader = res.headers.get("X-Payment");
        if (!paymentHeader) throw new Error("Instruções de pagamento não encontradas");

        const { transaction: xdr } = JSON.parse(paymentHeader);
        const { address } = await getAddress();

        const { signedTxXdr } = await signTransaction(xdr, {
          address: address!,
          networkPassphrase: NETWORK_PASSPHRASE,
        });

        const finalRes = await fetch(`/api/v1/x402/${endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Payment-Signature": JSON.stringify({ transaction: signedTxXdr })
          },
          body: JSON.stringify(body),
        });

        return await finalRes.json();
      }

      return await res.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { payAndCall, loading, error };
}