import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { code, userId } = await req.json();

        console.log(`[Protocolo Resgate] 🔐 Tentativa de resgate do código: ${code}`);

        // LOGICA DE ESCALABILIDADE:
        // 1. Verificar no banco se o 'code' existe e está ativo.
        // 2. Verificar se o 'code' já foi usado (para evitar gasto duplo).
        // 3. Identificar qual empresa é a dona desse código (ex: Maratá).

        // Simulação de verificação
        if (code === 'INVALIDO') {
            return NextResponse.json({ error: "Este código não é válido ou já expirou." }, { status: 400 });
        }

        // SIMULAÇÃO DE BLOCKCHAIN (STELLAR):
        // Aqui o backend dispararia a transação de envio de $LEAF para a carteira do usuário.
        console.log(`[Stellar] 🚀 Enviando 10 $LEAF para o usuário ${userId}`);

        return NextResponse.json({
            success: true,
            transactionId: 'stellar_tx_resgate_' + Math.random().toString(36).substring(7)
        });

    } catch (err) {
        return NextResponse.json({ error: "Erro interno no servidor de resgate." }, { status: 500 });
    }
}