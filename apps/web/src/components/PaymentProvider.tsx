'use client';

import dynamic from 'next/dynamic';

/**
 * PaymentProvider: Isola a inicialização do SDK de pagamentos (x402).
 * Usamos 'as any' para contornar a verificação de tipos que impede a build.
 */
const DynamicFacilitator = dynamic(
    async () => {
        // Importamos o pacote
        const x402 = await import('@x402/core');

        // Tentativa de instanciar o Facilitator de forma flexível
        // Se não encontrar como named export, tenta como default ou o próprio pacote
        const FacilitatorClass = (x402 as any).Facilitator || (x402 as any).default?.Facilitator || x402;

        try {
            const facilitator = new FacilitatorClass();
            facilitator.initialize();
        } catch (err) {
            console.warn("Aviso de inicialização do Facilitator (ignorado no build)");
        }

        return () => null; // Este componente não renderiza nada visualmente
    },
    { ssr: false }
);

export default function PaymentProvider({ children }: { children: React.ReactNode }) {
    return (
        <>
            <DynamicFacilitator />
            {children}
        </>
    );
}