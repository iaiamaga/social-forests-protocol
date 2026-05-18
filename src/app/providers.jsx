import React from "react";
import { PrivyProvider } from "@privy-io/react-auth";

const privyAppId = import.meta.env.VITE_PRIVY_APP_ID;

export function AppProviders({ children }) {
  if (!privyAppId) {
    console.warn("VITE_PRIVY_APP_ID não configurado no .env");
  }

  return (
    <PrivyProvider
      appId={privyAppId || "missing-privy-app-id"}
      config={{
        loginMethods: ["email", "sms", "wallet"],
        appearance: {
          theme: "light",
          accentColor: "#2f6b3f",
          showWalletLoginFirst: false,
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
          supportedChains: [{ type: "ed25519" }],
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}