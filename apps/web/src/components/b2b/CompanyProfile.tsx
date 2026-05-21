'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import ESGCompanyDashboard from './ESGCompanyDashboard';

interface CompanyProfileProps {
    companyAddress: string;
    onBuyTrees: () => void;
}

export default function CompanyProfile({ companyAddress, onBuyTrees }: CompanyProfileProps) {
    const { t } = useLanguage();
    const [buying, setBuying] = useState(false);

    const handleBuy = () => {
        setBuying(true);
        // Simula o tempo de transação no Soroban / Etherfuse
        setTimeout(() => {
            setBuying(false);
            onBuyTrees(); // Callback para injetar LEAFs no state pai
        }, 3000);
    };

    return (
        <div style={{ width: '100%', margin: '0 auto' }}>
            <div className="sf-card" style={{ borderTop: 'none', marginBottom: 20 }}>
                <div style={{ background: 'var(--sf-cream-dark)', padding: '14px 20px' }}>
                    <span className="sf-label" style={{ color: 'var(--sf-gray-text)' }}>
                        {t('profile_title')}
                    </span>
                </div>
                
                <div style={{ padding: 20 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
                        <div style={{ flex: '1 1 200px' }}>
                            <span className="sf-label" style={{ color: 'var(--sf-gray-text)', display: 'block', marginBottom: 4 }}>
                                {t('label_name')}
                            </span>
                            <span className="sf-heading" style={{ fontSize: '1.2rem', color: 'var(--sf-brown-dark)' }}>
                                EcoBrand Digital Ltd.
                            </span>
                        </div>
                        <div style={{ flex: '1 1 150px' }}>
                            <span className="sf-label" style={{ color: 'var(--sf-gray-text)', display: 'block', marginBottom: 4 }}>
                                {t('label_nature')}
                            </span>
                            <span className="sf-mono" style={{ fontSize: '0.8rem', color: 'var(--sf-brown-dark)' }}>
                                SERVIÇOS DIGITAIS
                            </span>
                        </div>
                    </div>
                </div>

                {/* Bloco de RWA / Tesouraria */}
                <div style={{ borderTop: '1px solid var(--sf-gray-border)', padding: 20, background: 'var(--sf-cream)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                        <div>
                            <span className="sf-label" style={{ color: 'var(--sf-green-primary)', display: 'block', marginBottom: 6 }}>
                                Etherfuse RWA Treasury
                            </span>
                            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', color: 'var(--sf-gray-text)', margin: 0, maxWidth: 300 }}>
                                {t('locked_desc')}
                            </p>
                        </div>
                        <button 
                            onClick={handleBuy}
                            disabled={buying}
                            className="sf-btn-primary" 
                            style={{ margin: 0, width: 'auto', padding: '12px 24px' }}
                        >
                            {buying ? t('buy_sim_loading') : t('btn_buy_trees')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Reutiliza o ESG Dashboard existente em baixo do perfil */}
            <ESGCompanyDashboard companyAddress={companyAddress} />
        </div>
    );
}
