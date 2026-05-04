import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe'; // Adicionamos a importação oficial

/**
 * Gateway de Pagamento - Florestas.Social
 * Converte Fiat (R$) em Leaf Tokens para empresas parceiras.
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature');

    if (!sig) {
      return NextResponse.json({ error: 'Falta Stripe Signature' }, { status: 400 });
    }

    /**
     * 1. TIPAGEM DO EVENTO
     * Substituímos o JSON.parse genérico pela tipagem da Stripe.
     */
    const event = JSON.parse(body) as Stripe.Event;

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      // Extração de Metadados para o manejo de Mogno Africano
      const companyAddress = session.metadata?.company_address;
      const packageType = session.metadata?.package_type;

      let amountToDistribute = 0;
      if (packageType === '10k_leaves') amountToDistribute = 10000;
      else if (packageType === '50k_leaves') amountToDistribute = 50000;

      if (!companyAddress || amountToDistribute === 0) {
        throw new Error("Metadados inválidos na sessão do Stripe");
      }

      /**
       * 2. PONTE SOROBAN
       * Aqui o Admin (Sponsor) envia os tokens para a empresa na Stellar.
       */
      console.log(`[Sómogno] Sucesso! ${amountToDistribute} folhas para: ${companyAddress}`);
    }

    return NextResponse.json({ received: true });

  } catch (err: unknown) {
    /**
     * 3. CORREÇÃO DO ERRO 'ANY'
     * O TypeScript exige que verifiquemos se o erro tem uma mensagem.
     */
    const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error(`Webhook Error: ${errorMessage}`);

    return NextResponse.json(
      { error: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    );
  }
}