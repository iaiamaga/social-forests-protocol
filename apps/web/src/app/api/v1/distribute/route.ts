// apps/web/src/app/api/v1/distribute/route.ts
// Endpoint de Protocolo — Vinculação de Saldo $LEAF a Campanhas e Produtos
//
// Fluxo Futuro (Stellar Anchors / SEP-0031):
//   1. Empresa chama este endpoint com o payload de campanha.
//   2. O backend valida o saldo da empresa no rwa_vault (Soroban).
//   3. Uma instrução Stellar é gerada para reservar os $LEAF na campanha.
//   4. Um QR Code é gerado com o hash da transação como código único.
//   5. Consumidor escaneia → /resgate?code=<hash> → /api/v1/resgate valida e envia.

import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

const IS_DEV = process.env.NODE_ENV === 'development';

interface DistributeBody {
  type: 'NEW' | 'LINK';
  leafAmount: number;
  companyId: string;
  totalScans?: number;
  productId?: string;
}

export async function POST(req: NextRequest) {
  try {
    console.log(`[API /v1/distribute] 📡 Requisição recebida${IS_DEV ? ' [DEV MODE]' : ''}`);

    const body = await req.json() as DistributeBody;
    const { type, leafAmount, companyId, totalScans, productId } = body;

    // ── Validação ────────────────────────────────────────────────────────────
    if (!IS_DEV) {
      if (!companyId || typeof companyId !== 'string') {
        return NextResponse.json(
          { error: 'Campo obrigatório ausente: companyId' },
          { status: 400 }
        );
      }
    }

    if (!type || !['NEW', 'LINK'].includes(type)) {
      return NextResponse.json(
        { error: 'Campo inválido: type deve ser "NEW" ou "LINK"' },
        { status: 400 }
      );
    }

    if (!leafAmount || typeof leafAmount !== 'number' || leafAmount < 1) {
      return NextResponse.json(
        { error: 'Campo inválido: leafAmount deve ser >= 1' },
        { status: 400 }
      );
    }

    if (type === 'NEW' && (!totalScans || totalScans < 1)) {
      return NextResponse.json(
        { error: 'Campo obrigatório para campanha NEW: totalScans >= 1' },
        { status: 400 }
      );
    }

    if (type === 'LINK' && (!productId || typeof productId !== 'string' || !productId.trim())) {
      return NextResponse.json(
        { error: 'Campo obrigatório para tipo LINK: productId' },
        { status: 400 }
      );
    }

    // ── Log estruturado ──────────────────────────────────────────────────────
    console.log(`[API /v1/distribute]  ├─ companyId:   ${companyId}`);
    console.log(`[API /v1/distribute]  ├─ type:        ${type}`);
    console.log(`[API /v1/distribute]  ├─ leafAmount:  ${leafAmount} $LEAF/scan`);
    if (type === 'NEW') console.log(`[API /v1/distribute]  ├─ totalScans:  ${totalScans}`);
    if (type === 'LINK') console.log(`[API /v1/distribute]  └─ productId:   ${productId}`);

    // ── SIMULAÇÃO: Reserva no rwa_vault (Soroban) ────────────────────────────
    // TODO: Substituir por chamada real ao contrato Soroban via Stellar SDK
    //   const vault = new SorobanClient(...);
    //   await vault.reserveLeaf({ companyId, amount: leafAmount * totalScans });
    await new Promise(resolve => setTimeout(resolve, 800));

    // ── Geração do ID de Campanha e URL do QR Code ───────────────────────────
    const campaignId = `camp_${randomUUID().replace(/-/g, '').slice(0, 12)}`;
    const qrCodeUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://florestas.social'}/resgate?code=${campaignId}`;

    console.log(`[API /v1/distribute] ✅ Campanha criada: ${campaignId}`);

    return NextResponse.json(
      {
        success: true,
        dev_mode: IS_DEV,
        campaignId,
        qrCodeUrl,
        metadata: {
          type,
          leafPerScan: leafAmount,
          ...(type === 'NEW' && { totalScans }),
          ...(type === 'LINK' && { productId }),
          companyId,
          createdAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    );

  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Erro interno do servidor';
    console.error(`[API /v1/distribute] ❌ Erro: ${errorMessage}`);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
