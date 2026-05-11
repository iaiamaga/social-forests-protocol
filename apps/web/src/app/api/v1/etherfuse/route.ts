// apps/web/src/app/api/v1/etherfuse/route.ts
// Endpoint de Protocolo — Aquisição de Ativos RWA via Etherfuse

import { NextRequest, NextResponse } from 'next/server';
import { EtherfuseService } from '../../../../../services/etherfuse.service';

const IS_DEV = process.env.NODE_ENV === 'development';

export async function POST(req: NextRequest) {
    try {
        console.log(`[API /v1/etherfuse] 📡 Requisição recebida${IS_DEV ? ' [DEV MODE]' : ''}`);

        const body = await req.json();
        const { companyId, trees_bought } = body as {
            companyId: string;
            trees_bought: number;
        };

        // Em produção, valide os dados de entrada obrigatoriamente
        if (!IS_DEV) {
            if (!companyId || typeof companyId !== 'string') {
                return NextResponse.json(
                    { error: 'Campo obrigatório ausente: companyId' },
                    { status: 400 }
                );
            }
            if (!trees_bought || typeof trees_bought !== 'number' || trees_bought < 1) {
                return NextResponse.json(
                    { error: 'Campo inválido: trees_bought deve ser um inteiro >= 1' },
                    { status: 400 }
                );
            }
        }

        // Em Dev Mode, usa valores padrão se os campos estiverem ausentes
        const resolvedCompanyId = companyId ?? 'DEV_COMPANY_MOCK';
        const resolvedTreeCount = trees_bought ?? 1;

        console.log(`[API /v1/etherfuse]  ├─ companyId:   ${resolvedCompanyId}`);
        console.log(`[API /v1/etherfuse]  └─ trees_bought: ${resolvedTreeCount}`);

        const receipt = await EtherfuseService.buyRwaToken(resolvedCompanyId, resolvedTreeCount);

        return NextResponse.json(
            {
                success: true,
                dev_mode: IS_DEV,
                receipt,
            },
            { status: 200 }
        );

    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Erro interno do servidor';
        console.error(`[API /v1/etherfuse] ❌ Erro: ${errorMessage}`);
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}
