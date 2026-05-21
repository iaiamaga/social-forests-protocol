'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

type CheckoutStatus = 'idle' | 'provisioning' | 'success' | 'error';

interface EtherfuseOrder {
    destination_wallet: string;
    currency: string;
    company_name: string;
    cnpj: string;
    company_type: string;
    email: string;
    telefone: string;
    status: string;
}

export default function EtherfuseCheckout() {
    const { t, language, setLanguage } = useLanguage();
    const [formData, setFormData] = useState({ 
        companyName: '', 
        cnpj: '', 
        companyType: 'DIGITAL',
        email: '',
        telefone: ''
    });
    const [status, setStatus] = useState<CheckoutStatus>('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const [order, setOrder] = useState<EtherfuseOrder | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('provisioning');
        setErrorMsg('');

        try {
            const response = await fetch('/api/v1/etherfuse', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success && data.etherfuseOrder) {
                setOrder(data.etherfuseOrder);
                setStatus('success');
            } else {
                setErrorMsg(data.error || 'Erro ao processar registro.');
                setStatus('error');
            }
        } catch {
            setErrorMsg('Falha na comunicação com o servidor.');
            setStatus('error');
        }
    };

    return (
        <div style={{ width: '100%', margin: '0 auto' }}>
            {/* ── Top Bar ── */}
            <div className="sf-topbar">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span>≡ Social Forests</span>
                    <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>B2B</span>
                </div>
                
                {/* Language Selector */}
                <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as any)}
                    style={{
                        background: 'transparent',
                        color: 'var(--sf-white)',
                        border: '1px solid var(--sf-white)',
                        padding: '2px 8px',
                        fontSize: '0.7rem',
                        fontFamily: "'Space Mono', monospace",
                        cursor: 'pointer',
                        outline: 'none'
                    }}
                >
                    <option value="pt" style={{color: '#000'}}>PT</option>
                    <option value="en" style={{color: '#000'}}>EN</option>
                    <option value="es" style={{color: '#000'}}>ES</option>
                    <option value="fr" style={{color: '#000'}}>FR</option>
                    <option value="de" style={{color: '#000'}}>DE</option>
                    <option value="zh" style={{color: '#000'}}>ZH</option>
                    <option value="ja" style={{color: '#000'}}>JA</option>
                </select>
            </div>

            <div className="sf-card" style={{ borderTop: 'none' }}>
                {/* ── STEP 1: Formulário ── */}
                {(status === 'idle' || status === 'error') && (
                    <form onSubmit={handleSubmit}>
                        {/* Section Header */}
                        <div style={{ background: 'var(--sf-cream-dark)', padding: '14px 20px' }}>
                            <span className="sf-label" style={{ color: 'var(--sf-gray-text)' }}>
                                {t('section_registry')}
                            </span>
                        </div>

                        <div style={{ padding: 20 }}>
                            <h2 className="sf-heading" style={{ fontSize: '1.1rem', marginBottom: 4, color: 'var(--sf-brown-dark)' }}>
                                {t('b2b_title')}
                            </h2>
                            <p style={{ fontSize: '0.75rem', color: 'var(--sf-gray-text)', marginBottom: 20, fontFamily: "'Space Mono', monospace" }}>
                                {t('b2b_desc')}
                            </p>

                            {/* Categoria da Empresa */}
                            <div style={{ marginBottom: 14 }}>
                                <label className="sf-label" style={{ display: 'block', marginBottom: 6, color: 'var(--sf-brown-dark)' }}>
                                    {t('label_nature')}
                                </label>
                                <select
                                    className="sf-input"
                                    value={formData.companyType}
                                    onChange={e => setFormData({ ...formData, companyType: e.target.value })}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <option value="PEQUENA">{t('opt_pequena')}</option>
                                    <option value="INDUSTRIA">{t('opt_industria')}</option>
                                    <option value="SERVICOS">{t('opt_servicos')}</option>
                                    <option value="DIGITAIS">{t('opt_servicos_digitais')}</option>
                                    <option value="EMPREENDEDOR">{t('opt_empreendedor')}</option>
                                </select>
                            </div>

                            {/* Razão Social */}
                            <div style={{ marginBottom: 14 }}>
                                <label className="sf-label" style={{ display: 'block', marginBottom: 6, color: 'var(--sf-brown-dark)' }}>
                                    {t('label_name')}
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="sf-input"
                                    value={formData.companyName}
                                    onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                                />
                            </div>

                            {/* CNPJ */}
                            <div style={{ marginBottom: 14 }}>
                                <label className="sf-label" style={{ display: 'block', marginBottom: 6, color: 'var(--sf-brown-dark)' }}>
                                    {t('label_doc')}
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="00.000.000/0001-00"
                                    className="sf-input"
                                    value={formData.cnpj}
                                    onChange={e => setFormData({ ...formData, cnpj: e.target.value })}
                                />
                            </div>

                            {/* Nova Linha: Email e Telefone (Lado a Lado em Desktop se houver espaço) */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
                                <div style={{ flex: '1 1 180px' }}>
                                    <label className="sf-label" style={{ display: 'block', marginBottom: 6, color: 'var(--sf-brown-dark)' }}>
                                        {t('label_email')}
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="contato@empresa.com"
                                        className="sf-input"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div style={{ flex: '1 1 150px' }}>
                                    <label className="sf-label" style={{ display: 'block', marginBottom: 6, color: 'var(--sf-brown-dark)' }}>
                                        {t('label_phone')}
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="+55 11 99999-9999"
                                        className="sf-input"
                                        value={formData.telefone}
                                        onChange={e => setFormData({ ...formData, telefone: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Error */}
                            {status === 'error' && (
                                <div style={{
                                    padding: '10px 14px',
                                    marginBottom: 16,
                                    background: '#FDF2F2',
                                    border: '1.5px solid #E8C8C8',
                                    fontFamily: "'Space Mono', monospace",
                                    fontSize: '0.7rem',
                                    color: 'var(--sf-red)',
                                }}>
                                    {errorMsg}
                                </div>
                            )}

                            <button type="submit" className="sf-btn-primary">
                                {t('btn_generate')}
                            </button>
                        </div>
                    </form>
                )}

                {/* ── STEP 1.5: Processamento ── */}
                {status === 'provisioning' && (
                    <div style={{ padding: '48px 20px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                            <div className="sf-spinner" />
                        </div>
                        <p className="sf-heading" style={{ fontSize: '0.85rem', color: 'var(--sf-brown-dark)', marginBottom: 8 }}>
                            {t('provisioning')}
                        </p>
                        <p className="sf-mono" style={{ fontSize: '0.7rem', color: 'var(--sf-gray-text)' }}>
                            {t('prov_desc')}
                        </p>
                    </div>
                )}

                {/* ── STEP 2: Sucesso + On-Ramp ── */}
                {status === 'success' && order && (
                    <div>
                        {/* Badge de Sucesso */}
                        <div style={{ background: 'var(--sf-green-primary)', padding: '14px 20px' }}>
                            <span className="sf-label" style={{ color: 'var(--sf-white)' }}>
                                {t('success_badge')}
                            </span>
                        </div>

                        <div style={{ padding: 20 }}>
                            {/* Wallet Address */}
                            <div style={{ marginBottom: 20 }}>
                                <span className="sf-label" style={{ color: 'var(--sf-gray-text)', display: 'block', marginBottom: 6 }}>
                                    {t('wallet_label')} ({order.company_type})
                                </span>
                                <div style={{
                                    background: 'var(--sf-cream)',
                                    border: '1.5px solid var(--sf-gray-border)',
                                    padding: '10px 14px',
                                    fontFamily: "'Space Mono', monospace",
                                    fontSize: '0.6rem',
                                    color: 'var(--sf-brown-dark)',
                                    wordBreak: 'break-all',
                                    lineHeight: 1.6,
                                }}>
                                    {order.destination_wallet}
                                </div>
                            </div>

                            {/* Status Cards */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
                                <div className="sf-badge-green" style={{ textAlign: 'center', padding: '8px 6px' }}>
                                    {t('status_sbt')}
                                </div>
                                <div className="sf-badge-green" style={{ textAlign: 'center', padding: '8px 6px' }}>
                                    {t('status_lastro')}
                                </div>
                            </div>

                            {/* Etherfuse Info */}
                            <div style={{
                                background: 'var(--sf-cream-dark)',
                                border: '1.5px solid var(--sf-gray-border)',
                                padding: '12px 14px',
                                marginBottom: 20,
                            }}>
                                <span className="sf-label" style={{ color: 'var(--sf-green-primary)', display: 'block', marginBottom: 4 }}>
                                    {t('infra_label')}
                                </span>
                                <p style={{
                                    fontFamily: "'Space Mono', monospace",
                                    fontSize: '0.65rem',
                                    color: 'var(--sf-gray-text)',
                                    lineHeight: 1.5,
                                    margin: 0,
                                }}>
                                    {t('infra_desc')}
                                </p>
                            </div>

                            {/* CTA */}
                            <button
                                className="sf-btn-secondary"
                                onClick={() =>
                                    window.open(
                                        `https://ramp.etherfuse.com/buy?address=${order.destination_wallet}&currency=${order.currency}`,
                                        '_blank'
                                    )
                                }
                            >
                                {t('btn_fiat')}
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Bottom Nav ── */}
                <div className="sf-bottom-nav">
                    <div className="sf-bottom-nav-item active">
                        <span style={{ fontSize: 16 }}>🏠</span>
                        <span>{t('nav_field')}</span>
                    </div>
                    <div className="sf-bottom-nav-item">
                        <span style={{ fontSize: 16 }}>📦</span>
                        <span>{t('nav_assets')}</span>
                    </div>
                    <div className="sf-bottom-nav-item">
                        <span style={{ fontSize: 16 }}>📊</span>
                        <span>{t('nav_impact')}</span>
                    </div>
                    <div className="sf-bottom-nav-item">
                        <span style={{ fontSize: 16 }}>🏛</span>
                        <span>{t('nav_vault')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}