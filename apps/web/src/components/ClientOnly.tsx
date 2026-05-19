'use client';

import { useState, useEffect } from 'react';

/**
 * Este componente impede que qualquer código dentro dele seja executado no servidor.
 * Ele só será renderizado quando o navegador do cliente estiver pronto.
 */
export default function ClientOnly({ children }: { children: React.ReactNode }) {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted) {
        return null;
    }

    return <>{children}</>;
}