// apps/web/src/lib/soroban/config.ts

export const FLORESTAS_CONFIG = {
  network: "testnet",
  rpcUrl: "https://soroban-testnet.stellar.org",
  contracts: {
    // Motor econômico ($LEAF)
    leafToken: "CD7NBJTUCFPVWWQW7I4LM7GOTX7VBDHNP3TGN4IQFQHUEGY7GOBQVSJX",

    // Cofre RWA (Lastro do Mogno)
    rwaVault: "CDI4A5EY6SMUYD7PGSV3SASRXCXCPZQXGHN4EUB3Q7Y2HDC6APNKJM3L",

    // Maestro (Hero Journey - Orquestrador)
    heroJourney: "CDIUZBFDX3H3PA6L2FTTABRVMXQ7GOJ3RGTSQPRVDNMPVXIU6A62SXBD",

    // NOVO: Reputação SBT (Nível de Manejo)
    sbtReputation: "CD7ZXUKD5E5HBKECXSPHA5NJ4NUDYEIF537N5VBLI6Z3AXDXJAQAMAO7"
  },
  adminAddress: "GAG6GXCMAHKBHZLGFOMG2XZUX4W4ETLOPJ6YB6VSJOPOYLWORQLF3XI6"
};