/**
 * FONTE ÚNICA DA VERDADE - Florestas.Social Protocol
 * Configurações de rede e endereços de contratos (Testnet V3.0)
 */

// gitleaks:allow
export const CONTRACT_IDS = {
  leafToken: 'CAKIQGO7DY2IG76M5F4XXUCTYDC5NSMOZL7SMRX4TZHY2CU6PMBTZFFF',
  sbtCompany: 'CDYOBV2F6URPOR6OPHJ2W4OZUWR2TLNUQGNL6VHSGMMYFN64PAGZEOUD',
  masterChief: 'CB5ZWH43V7BLLTFYLOYJCFRBQBKQWIPTRJMS4HEFJQX5SHYZEM2V5K3C',
  sbtGuardian: 'CAZ3MEZJT4SDEMOUV2UB5LCDKMUIXQI4NO4JLNNUBC3JWCPLEYHCRJRT',
  mythosVault: 'CAZ3URJTTXQCDFQTJFW6DN5ZGI7DEAAYDHEJBWQDUJ3PCFXJMK5RWBJ3',
  journeyOrchestrator: 'CARJIZ75NEH65NRHKUJYZ2DN32DHXLTU2FWN7H7PSOC52UTVEIJLPUYD'
};

export const NETWORK_CONFIG = {
  network: "testnet",
  rpcUrl: "https://soroban-testnet.stellar.org:443",
};

// Esta é a assinatura digital que valida a rede Testnet da Stellar
export const NETWORK_PASSPHRASE = "Test SDF Network ; September 2015";

// Relayer (Opcional, usado para pagar taxas de transação em nome do usuário)
// Substitua pela chave privada da conta de canal quando for para produção
export const RELAYER_SECRET_KEY = process.env.NEXT_PUBLIC_RELAYER_SECRET_KEY || "";