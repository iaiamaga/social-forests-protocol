import { CONTRACT_IDS, STELLAR_NETWORKS } from './contracts.js';

export function getRelayerBaseUrl() {
  return String(import.meta.env.VITE_PROTOCOL_RELAYER_URL || '').replace(/\/$/, '');
}

export function isRelayerConfigured() {
  return Boolean(getRelayerBaseUrl());
}

async function getPrivyToken(account) {
  if (typeof account?.getAccessToken !== 'function') return null;

  try {
    return await account.getAccessToken();
  } catch {
    return null;
  }
}

function buildActor(account = {}) {
  return {
    privyUserId: account?.privyUserId || account?.user?.id || null,
    email: account?.email || account?.user?.email?.address || null,
    walletAddress: account?.walletAddress || null,
    stellarWalletAddress: account?.stellarWalletAddress || null,
    activeRole: account?.activeRole || null,
  };
}

function getJsonSafe(response) {
  return response.json().catch(() => null);
}

/**
 * Busca uma conta institucional/protocolo no relayer.
 *
 * Importante:
 * - Esse endpoint é auxiliar.
 * - Se o relayer ainda não tiver /v1/protocol/account publicado, ele pode retornar 404.
 * - 404 aqui NÃO deve quebrar a jornada, porque o frontend ainda pode usar:
 *   1. wallet da Privy
 *   2. wallet do user.linkedAccounts
 *   3. VITE_INSTITUTION_TEST_WALLET como fallback temporário
 */
export async function fetchProtocolAccount(account = {}) {
  const baseUrl = getRelayerBaseUrl();

  if (!baseUrl) {
    return null;
  }

  const token = await getPrivyToken(account);

  const response = await fetch(`${baseUrl}/v1/protocol/account`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      actor: buildActor(account),
    }),
  });

  if (response.status === 404) {
    console.warn('[ProtocolRelayer] /v1/protocol/account não encontrado no relayer. Seguindo sem conta carregada pelo backend.');
    return null;
  }

  const data = await getJsonSafe(response);

  if (!response.ok || data?.ok === false) {
    console.warn('[ProtocolRelayer] Não foi possível carregar conta de protocolo.', {
      status: response.status,
      data,
    });

    return null;
  }

  return data?.account || data?.protocolAccount || data || null;
}

export async function callProtocolRelayer(action, payload, account) {
  const baseUrl = getRelayerBaseUrl();

  if (!baseUrl) {
    throw new Error('Relayer do protocolo não configurado. Defina VITE_PROTOCOL_RELAYER_URL na Vercel para executar contratos reais.');
  }

  const token = await getPrivyToken(account);

  const response = await fetch(`${baseUrl}${action.relayerPath}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Florestas-Action': action.id,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      actionId: action.id,
      network: {
        name: STELLAR_NETWORKS.testnet.name,
        passphrase: STELLAR_NETWORKS.testnet.passphrase,
        rpcUrl: STELLAR_NETWORKS.testnet.rpcUrl,
      },
      contracts: {
        orchestrator: CONTRACT_IDS.FINAL_ORCHESTRATOR,
        companySbt: CONTRACT_IDS.COMPANY_SBT,
        masterChief: CONTRACT_IDS.MASTERCHIEF_COLLATERAL,
        leafToken: CONTRACT_IDS.LEAF_TOKEN,
        mythosVault: CONTRACT_IDS.MYTHOS_VAULT,
        guardianSbt: CONTRACT_IDS.GUARDIAN_SBT,
      },
      method: action.orchestratorMethod,
      actor: buildActor(account),
      payload,
      idempotencyKey: payload?.idempotencyKey,
    }),
  });

  const data = await getJsonSafe(response);

  if (!response.ok || data?.ok === false) {
    console.error('[ProtocolRelayer] Falha ao executar ação no protocolo.', {
      status: response.status,
      actionId: action.id,
      relayerPath: action.relayerPath,
      data,
    });

    throw new Error(
      data?.message ||
        data?.error ||
        data?.details?.message ||
        'Não foi possível concluir a ação no protocolo.'
    );
  }

  return data || { ok: true };
}