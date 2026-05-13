// apps/web/src/app/api/v1/checkout/session/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Inicializa a Stripe com a chave secreta que está no seu .env.local
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27' as any,
});

export async function POST(req: NextRequest) {
    try {
        const { quantity, address, companyId } = await req.json();

        // Configuração do Produto: Mogno Africano (Khaya senegalensis)
        // Preço unitário: R$ 500,00 (representado em centavos: 50000)
        const unitPrice = 50000;

        console.log(`[Stripe] 💳 Criando sessão para ${quantity} árvores. Carteira: ${address}`);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'brl',
                        product_data: {
                            name: 'Bosque de Mogno Africano (RWA)',
                            description: 'Ativo biológico lastreado via protocolo Florestas.Social & Etherfuse.',
                        },
                        unit_amount: unitPrice,
                    },
                    quantity: quantity,
                },
            ],
            mode: 'payment',

            // URLs para onde o usuário volta após o pagamento
            success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/empresa/dashboard?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout?canceled=true`,

            // 🎯 METADADOS: Isso é enviado para o Webhook para o Mint na Stellar
            metadata: {
                stellarAddress: address,
                treeCount: quantity.toString(),
                companyId: companyId || 'empresa_marata_demo',
            },
        });

        // Retorna a URL da Stripe para o seu frontend redirecionar o usuário
        return NextResponse.json({ url: session.url });

    } catch (error: any) {
        console.error('[Stripe Session Error]:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}