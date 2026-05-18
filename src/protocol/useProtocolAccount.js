import { useEffect, useMemo, useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { getActiveRoleProfile, setActiveRoleProfile } from '../auth/roleProfileStore.js';
import { fetchProtocolAccount, isRelayerConfigured } from './protocolRelayerClient.js';

function isStellarPublicKey(value) {
  return typeof value === 'string' && /^G[A-Z2-7]{55}$/.test(value);
}

function getEmail(user) {
  return user?.email?.address || user?.google?.email || user?.discord?.email || null;
}

function getWalletAddressFromPrivyWallets(wallets = []) {
  const candidates = wallets
    .flatMap((wallet) => [
      wallet?.address,
      wallet?.walletAddress,
      wallet?.publicKey,
      wallet?.account?.address,
      wallet?.account?.publicKey,
    ])
    .filter(Boolean);

  return candidates.find(isStellarPublicKey) || null;
}

function getWalletAddressFromPrivyUser(user) {
  const linkedAccounts = Array.isArray(user?.linkedAccounts) ? user.linkedAccounts : [];

  const directCandidates = [
    user?.wallet?.address,
    user?.wallet?.walletAddress,
    user?.wallet?.publicKey,
    user?.embeddedWallet?.address,
    user?.embeddedWallet?.walletAddress,
    user?.embeddedWallet?.publicKey,
    user?.smartWallet?.address,
    user?.smartWallet?.walletAddress,
    user?.smartWallet?.publicKey,
  ];

  const linkedCandidates = linkedAccounts.flatMap((account) => [
    account?.address,
    account?.walletAddress,
    account?.publicKey,
    account?.embeddedWallet?.address,
    account?.embeddedWallet?.walletAddress,
    account?.embeddedWallet?.publicKey,
  ]);

  const allCandidates = [...directCandidates, ...linkedCandidates].filter(Boolean);

  return allCandidates.find(isStellarPublicKey) || null;
}

function getFallbackWalletAddress() {
  const fallbackInstitutionWallet = import.meta.env.VITE_INSTITUTION_TEST_WALLET;
  if (isStellarPublicKey(fallbackInstitutionWallet)) return fallbackInstitutionWallet;

  // Fallback hardcoded para testnet — conta relayer do protocolo
  const PROTOCOL_TESTNET_WALLET = 'GAAORWQOQQDSWXLVRRLGWBAMW2LT5IGPBHK6GGVTAX76D2D3QZ22L6CO';
  return PROTOCOL_TESTNET_WALLET;
}

function getProtocolWalletAddress(protocolAccount) {
  const candidates = [
    protocolAccount?.stellarWalletAddress,
    protocolAccount?.walletAddress,
    protocolAccount?.institutionWalletAddress,
    protocolAccount?.companyAddress,
    protocolAccount?.actor?.walletAddress,
    protocolAccount?.actor?.stellarWalletAddress,
  ].filter(Boolean);

  return candidates.find(isStellarPublicKey) || null;
}

export function useProtocolAccount() {
  const { ready, authenticated, user, login, logout, getAccessToken } = usePrivy();
  const { wallets = [] } = useWallets();

  const [protocolAccount, setProtocolAccount] = useState(null);
  const [protocolAccountLoading, setProtocolAccountLoading] = useState(false);
  const [protocolAccountError, setProtocolAccountError] = useState(null);

  const activeRole = useMemo(() => {
    return getActiveRoleProfile()?.role || 'institution';
  }, []);

  const baseAccount = useMemo(() => {
    return {
      ready,
      authenticated,
      privyUserId: user?.id || null,
      email: getEmail(user),
      activeRole,
      login,
      logout,
      getAccessToken,
      setActiveRole: setActiveRoleProfile,
    };
  }, [ready, authenticated, user, activeRole, login, logout, getAccessToken]);

  useEffect(() => {
    let cancelled = false;

    async function loadProtocolAccount() {
      if (!ready || !authenticated || !user?.id) {
        setProtocolAccount(null);
        setProtocolAccountError(null);
        setProtocolAccountLoading(false);
        return;
      }

      if (!isRelayerConfigured()) {
        setProtocolAccount(null);
        setProtocolAccountError('Relayer não configurado.');
        setProtocolAccountLoading(false);
        return;
      }

      try {
        setProtocolAccountLoading(true);
        setProtocolAccountError(null);

        const data = await fetchProtocolAccount({
          ...baseAccount,
          user,
        });

        if (!cancelled) {
          setProtocolAccount(data);
        }
      } catch (error) {
        if (!cancelled) {
          setProtocolAccount(null);
          setProtocolAccountError(
            error instanceof Error
              ? error.message
              : 'Erro ao carregar conta de protocolo.'
          );
        }
      } finally {
        if (!cancelled) {
          setProtocolAccountLoading(false);
        }
      }
    }

    loadProtocolAccount();

    return () => {
      cancelled = true;
    };
  }, [ready, authenticated, user?.id, baseAccount]);

  const protocolWalletAddress = getProtocolWalletAddress(protocolAccount);
  const privyWalletsAddress = getWalletAddressFromPrivyWallets(wallets);
  const privyUserAddress = getWalletAddressFromPrivyUser(user);
  const fallbackWalletAddress = getFallbackWalletAddress();

  const walletAddress =
    protocolWalletAddress ||
    privyWalletsAddress ||
    privyUserAddress ||
    fallbackWalletAddress;

  const walletSource = protocolWalletAddress
    ? 'relayer:protocolAccount'
    : privyWalletsAddress
      ? 'privy:wallets'
      : privyUserAddress
        ? 'privy:user'
        : fallbackWalletAddress
          ? 'env:VITE_INSTITUTION_TEST_WALLET'
          : 'none';

  console.log('[ProtocolAccount]', {
    privyUserId: user?.id || null,
    email: getEmail(user),
    wallets,
    linkedAccounts: user?.linkedAccounts,
    protocolAccount,
    protocolAccountLoading,
    protocolAccountError,
    walletAddress,
    walletSource,
  });

  return {
    ...baseAccount,
    user,
    wallets,
    protocolAccount,
    protocolAccountLoading,
    protocolAccountError,
    walletAddress,
    walletSource,
    hasProtocolWallet: isStellarPublicKey(walletAddress),
    isUsingFallbackWallet: walletSource === 'env:VITE_INSTITUTION_TEST_WALLET',
    isUsingPrivyWallet: walletSource === 'privy:wallets' || walletSource === 'privy:user',
  };
}