'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    // Função para navegar para as áreas específicas
    const handleNavigation = (path: string) => {
        setIsModalOpen(false);
        router.push(path);
    };

    return (
        <main className="min-h-screen bg-[#FDFBF9] text-[#26170E] font-sans flex flex-col relative">

            {/* HEADER */}
            <header className="p-6 flex justify-between items-center border-b border-[#E5E7EB]">
                <h1 className="text-2xl font-mono font-bold tracking-tight text-[#2D5A27]">
                    FLORESTAS.SOCIAL
                </h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-2 bg-[#2D5A27] text-white font-mono font-bold rounded hover:bg-[#1E3D1A] transition-all"
                >
                    Acessar Plataforma
                </button>
            </header>

            {/* HERO SECTION */}
            <section className="flex-grow flex flex-col items-center justify-center p-8 text-center space-y-8">
                <h2 className="text-4xl md:text-6xl font-mono font-bold max-w-4xl leading-tight">
                    Converta Crescimento Biológico em Ativo Digital
                </h2>
                <p className="text-lg md:text-xl max-w-2xl text-[#4A3728]">
                    Protocolo ReFi na rede Stellar. Conectando sustentabilidade corporativa ao impacto direto do consumidor.
                </p>

                {/* WIDGET DE CAPTURA DE CÓDIGO (RESGATE) */}
                <div className="w-full max-w-md p-6 mt-8 bg-white border border-[#2D5A27] rounded-lg shadow-sm">
                    <h3 className="text-lg font-bold mb-4 font-mono text-[#2D5A27]">Resgatar Impacto</h3>
                    <input
                        type="text"
                        placeholder="Insira seu código..."
                        className="w-full p-3 mb-4 font-mono border border-gray-300 rounded focus:border-[#2D5A27] outline-none"
                    />
                    <button className="w-full py-3 bg-[#26170E] text-white font-mono font-bold rounded hover:bg-black transition-all">
                        Coletar Árvore
                    </button>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="p-8 border-t border-[#E5E7EB] text-center text-sm font-mono text-gray-500">
                © 2026 Florestas.Social | Infraestrutura Stellar / Soroban | Auditoria Vereda Verify
            </footer>

            {/* MODAL DE LOGIN */}
            {isModalOpen && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
                    <div className="bg-[#FDFBF9] p-8 rounded-xl shadow-2xl w-full max-w-md border border-[#2D5A27]">
                        <h3 className="text-2xl font-mono font-bold text-center mb-6 text-[#2D5A27]">
                            Selecione seu Perfil
                        </h3>

                        <div className="flex flex-col gap-4">
                            <button
                                onClick={() => handleNavigation('/login/usuario')}
                                className="w-full py-4 px-6 text-left border border-[#E5E7EB] bg-white hover:border-[#2D5A27] hover:bg-[#F3F4F6] rounded transition-all flex justify-between items-center"
                            >
                                <div>
                                    <strong className="block font-mono text-lg text-[#26170E]">Usuário Guardião</strong>
                                    <span className="text-sm text-gray-500">Carteira Cripto ou Google</span>
                                </div>
                                <span className="text-[#2D5A27] font-bold">→</span>
                            </button>

                            <button
                                onClick={() => handleNavigation('/login/empresa')}
                                className="w-full py-4 px-6 text-left border border-[#E5E7EB] bg-white hover:border-[#2D5A27] hover:bg-[#F3F4F6] rounded transition-all flex justify-between items-center"
                            >
                                <div>
                                    <strong className="block font-mono text-lg text-[#26170E]">Portal Corporativo</strong>
                                    <span className="text-sm text-gray-500">E-mail Corporativo ou Carteira</span>
                                </div>
                                <span className="text-[#2D5A27] font-bold">→</span>
                            </button>

                            <button
                                onClick={() => handleNavigation('/login/admin')}
                                className="w-full py-4 px-6 text-left border border-[#E5E7EB] bg-white hover:border-[#2D5A27] hover:bg-[#F3F4F6] rounded transition-all flex justify-between items-center"
                            >
                                <div>
                                    <strong className="block font-mono text-lg text-[#26170E]">Administração</strong>
                                    <span className="text-sm text-gray-500">Acesso Restrito ao Protocolo</span>
                                </div>
                                <span className="text-[#2D5A27] font-bold">→</span>
                            </button>
                        </div>

                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="mt-6 w-full text-center text-sm font-mono text-gray-500 hover:text-red-500"
                        >
                            Cancelar e Fechar
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}