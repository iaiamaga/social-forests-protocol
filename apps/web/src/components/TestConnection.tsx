'use client';
import { useEffect, useState } from 'react';
import { useSorobanContracts } from '../hooks/useSorobanContracts';

export function TestConnection() {
    const { journeyOrchestrator } = useSorobanContracts();
    const [msg, setMsg] = useState('Verificando...');

    useEffect(() => {
        // Lista todas as propriedades (funções) do contrato no console do navegador
        const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(journeyOrchestrator));
        console.log("FUNÇÕES DO CONTRATO:", methods);
        setMsg("Verifique o CONSOLE do navegador (F12).");
    }, [journeyOrchestrator]);

    return (
        <div style={{ padding: '20px', background: 'white', color: 'black', fontSize: '24px' }}>
            {msg}
        </div>
    );
}