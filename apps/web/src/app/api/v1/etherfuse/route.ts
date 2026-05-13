// apps/web/src/app/api/v1/etherfuse/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { EtherfuseService } from '@/../../services/etherfuse.service';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27' as any,
});

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error('❌ Erro na assinatura do Webhook:', err.message);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // 🎯 O GATILHO: Quando o pagamento é concluído com sucesso
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        // Recuperamos os metadados guardados na rota de criação da sessão
        const stellarAddress = session.metadata?.stellarAddress;
        const treeCount = Number(session.metadata?.treeCount);
        const companyId = session.metadata?.companyId || 'N/A';

        if (stellarAddress && treeCount) {
            try {
                // 🚀 INTEGRAÇÃO: Transforma o pagamento em RWA via Etherfuse
                const receipt = await EtherfuseService.buyRwaToken({
                    companyId,
                    treeCount,
                    stellarAddress
                });

                console.log(`[Protocolo SFP] ✅ RWA Registado: ${receipt.tx_hash}`);
                // FUTURO: Aqui gravaríamos o tx_hash na base de dados Supabase da empresa
            } catch (error) {
                console.error('[Protocolo SFP] ❌ Falha na emissão via Etherfuse:', error);
            }
        }
    }

    return NextResponse.json({ received: true });
}