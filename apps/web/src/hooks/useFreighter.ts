'use client';

import { useState, useEffect, useCallback } from 'react';
import * as freighter from '@stellar/freighter-api';

interface FreighterResponse {
    address?: string;
    error?: string;
    isConnected?: boolean;
    isAllowed?: boolean;
}

export function useFreighter() {
    const [publicKey, setPublicKey] = useState<string | null>(null);
    const [hasFreighter, setHasFreighter] = useState<boolean>(false);

    const connect = useCallback(async () => {
        try {
            const accessResponse = (await freighter.requestAccess()) as FreighterResponse;
            const pubKey = typeof accessResponse === 'object' && accessResponse !== null
                ? accessResponse.address
                : (accessResponse as unknown as string);

            if (typeof pubKey === 'string') {
                setPublicKey(pubKey);
                return pubKey;
            }
            return null;
        } catch (error) {
            console.error("Erro ao conectar carteira:", error);
            return null;
        }
    }, []);

    useEffect(() => {
        const checkFreighter = async () => {
            try {
                const connResponse = (await freighter.isConnected()) as FreighterResponse;
                const isConn = typeof connResponse === 'object' ? !!connResponse.isConnected : !!connResponse;
                setHasFreighter(isConn);

                if (isConn) {
                    const allowedResponse = (await freighter.isAllowed()) as FreighterResponse;
                    const isUserAllowed = typeof allowedResponse === 'object' ? !!allowedResponse.isAllowed : !!allowedResponse;

                    if (isUserAllowed) {
                        const accessResponse = (await freighter.requestAccess()) as FreighterResponse;
                        const pubKey = typeof accessResponse === 'object' && accessResponse !== null
                            ? accessResponse.address
                            : (accessResponse as unknown as string);

                        if (typeof pubKey === 'string') {
                            setPublicKey(pubKey);
                        }
                    }
                }
            } catch (e) {
                console.error("Erro na verificação da Freighter:", e);
            }
        };
        void checkFreighter();
    }, []);

    return { publicKey, hasFreighter, connect };
}