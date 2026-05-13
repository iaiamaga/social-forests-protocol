import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';

// Inicializa o SDK da Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2026-04-22.dahlia', // 👈 Corrigido para a versão exata exigida pelo SDK
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

// Trava de Idempotência em memória
const processedEvents = new Set<string>();

export async function POST(req: Request) {
    try {
        const body = await req.text();

        // 👈 Corrigido: headers() agora é assíncrono no Next.js mais recente
        const headersList = await headers();
        const signature = headersList.get('stripe-signature');

        if (!signature) {
            return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
        }

        // VALIDAÇÃO CRIPTOGRÁFICA
        let event: Stripe.Event;
        try {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        } catch (err: any) {
            console.error(`🚨 [SECURITY ALERT] Webhook signature verification failed: ${err.message}`);
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        // TRAVA DE IDEMPOTÊNCIA
        if (processedEvents.has(event.id)) {
            console.log(`⚠️ [IDEMPOTENCY] Evento ${event.id} já foi processado. Ignorando.`);
            return NextResponse.json({ received: true, status: 'already_processed' }, { status: 200 });
        }
        processedEvents.add(event.id); // Registra o evento como processado

        // Roteamento de Ações
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object as Stripe.Checkout.Session;

                const companyId = session.metadata?.companyId || 'UNKNOWN';
                const amountPaid = session.amount_total;

                console.log(`✅ [PAYMENT SUCCESS] Empresa ${companyId} pagou ${amountPaid} centavos.`);
                // Aqui entrará a chamada on-chain no futuro
                break;

            default:
                console.log(`ℹ️ Evento não tratado: ${event.type}`);
        }

        return NextResponse.json({ received: true }, { status: 200 });

    } catch (err: any) {
        console.error(`💥 [WEBHOOK ERROR] Erro interno: ${err.message}`);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}