// =============================================================================
// POST /api/v1/etherfuse
// Webhook para integração Etherfuse RWA — recebe notificação de pagamento
// e aciona o mint on-chain via journey_orchestrator.
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { EtherfuseService } from '@/lib/services/etherfuse.service';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { stellarAddress, treeCount, companyId } = body;

        if (!stellarAddress || !treeCount) {
            return NextResponse.json(
                { error: 'Missing required fields: stellarAddress, treeCount' },
                { status: 400 }
            );
        }

        // Aciona o serviço Etherfuse para registrar o RWA on-chain
        const receipt = await EtherfuseService.buyRwaToken({
            companyId: companyId || 'default',
            treeCount: Number(treeCount),
            stellarAddress,
        });

        console.log(`[Protocolo SFP] ✅ RWA Registado: ${receipt.tx_hash}`);

        return NextResponse.json({
            success: true,
            receipt,
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('[Protocolo SFP] ❌ Falha na emissão via Etherfuse:', message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
