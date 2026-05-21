'use client';

import React, { useState } from 'react';
import EtherfuseCheckout from '../../components/b2b/EtherfuseCheckout';
import CompanyProfile from '../../components/b2b/CompanyProfile';
import CompanyMissions from '../../components/b2b/CompanyMissions';
import B2BLogin from '../../components/b2b/B2BLogin';
import { useLanguage } from '../../context/LanguageContext';

export default function B2BTestPage() {
    const { t, language, setLanguage } = useLanguage();
    const [activeTab, setActiveTab] = useState<'login' | 'onboarding' | 'profile' | 'missions'>('login');
    const [leafBalance, setLeafBalance] = useState(0);

    const handleBuyTrees = () => {
        // Simula a injeção de LEAFs após a compra de árvores RWA
        setLeafBalance(prev => prev + 50000);
        // Opcional: auto-navegar para missões após compra
        setTimeout(() => setActiveTab('missions'), 1500);
    };

    const handleLoginSuccess = () => {
        // Após o login, leva ao dashboard de perfil ou missões
        setActiveTab('profile');
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            background: 'var(--sf-cream)',
            padding: '40px 20px',
            fontFamily: "'Inter', sans-serif"
        }}>
            <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                
                {/* Cabeçalho do Test Sandbox */}
                <div style={{ textAlign: 'center', marginBottom: 30, position: 'relative' }}>
                    <h1 style={{ fontSize: '2rem', color: 'var(--sf-green-primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        B2B Institutional Portal
                    </h1>
                    <p style={{ color: 'var(--sf-gray-text)', fontFamily: "'Space Mono', monospace", fontSize: '0.85rem' }}>
                        End-to-End Flow Simulator
                    </p>

                    {/* Language Selector Global para o Teste */}
                    <div style={{ position: 'absolute', right: 0, top: 0 }}>
                        <select 
                            className="sf-input"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as any)}
                            style={{ padding: '6px 12px', width: 'auto', cursor: 'pointer' }}
                        >
                            <option value="pt">PT</option>
                            <option value="en">EN</option>
                            <option value="es">ES</option>
                            <option value="fr">FR</option>
                            <option value="de">DE</option>
                            <option value="zh">ZH</option>
                            <option value="ja">JA</option>
                        </select>
                    </div>
                </div>

                {/* ── 4 TABS NAVEGAÇÃO ── */}
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: 10, 
                    marginBottom: 30,
                    flexWrap: 'wrap'
                }}>
                    <button 
                        onClick={() => setActiveTab('login')}
                        className={activeTab === 'login' ? 'sf-btn-primary' : 'sf-btn-secondary'}
                        style={{ margin: 0, width: 'auto', padding: '10px 20px' }}
                    >
                        0. {t('tab_login')}
                    </button>
                    <button 
                        onClick={() => setActiveTab('onboarding')}
                        className={activeTab === 'onboarding' ? 'sf-btn-primary' : 'sf-btn-secondary'}
                        style={{ margin: 0, width: 'auto', padding: '10px 20px' }}
                    >
                        1. {t('tab_onboarding')}
                    </button>
                    <button 
                        onClick={() => setActiveTab('profile')}
                        className={activeTab === 'profile' ? 'sf-btn-primary' : 'sf-btn-secondary'}
                        style={{ margin: 0, width: 'auto', padding: '10px 20px' }}
                    >
                        2. {t('tab_profile')}
                    </button>
                    <button 
                        onClick={() => setActiveTab('missions')}
                        className={activeTab === 'missions' ? 'sf-btn-primary' : 'sf-btn-secondary'}
                        style={{ margin: 0, width: 'auto', padding: '10px 20px' }}
                    >
                        3. {t('tab_missions')}
                    </button>
                </div>

                {/* ── CONTEÚDO DAS TABS ── */}
                <div style={{ 
                    boxShadow: '0 10px 40px rgba(26, 107, 60, 0.08)',
                    borderRadius: 8,
                    overflow: 'hidden',
                    background: 'var(--sf-white)'
                }}>
                    {activeTab === 'login' && (
                        <div style={{ maxWidth: 600, margin: '0 auto', border: '1px solid var(--sf-gray-border)' }}>
                            <B2BLogin onLoginSuccess={handleLoginSuccess} />
                        </div>
                    )}

                    {activeTab === 'onboarding' && (
                        <div style={{ maxWidth: 600, margin: '0 auto', border: '1px solid var(--sf-gray-border)' }}>
                            <EtherfuseCheckout />
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div style={{ maxWidth: 600, margin: '0 auto', border: '1px solid var(--sf-gray-border)' }}>
                            <CompanyProfile 
                                companyAddress="GDU5RQ3A4V3X3ZV67I7V6ZQ3ZV67I7V6ZQ3ZV67I7V6ZQ3ZV67I7V6ZQ" 
                                onBuyTrees={handleBuyTrees}
                            />
                        </div>
                    )}

                    {activeTab === 'missions' && (
                        <div style={{ maxWidth: 600, margin: '0 auto', border: '1px solid var(--sf-gray-border)' }}>
                            <CompanyMissions leafBalance={leafBalance} />
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
