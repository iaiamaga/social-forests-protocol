'use client';

import React, { useState, useEffect } from 'react';
import { useSorobanContracts } from '../../hooks/useSorobanContracts';
import { useLanguage } from '../../context/LanguageContext';

export default function ESGCompanyDashboard({ companyAddress }: { companyAddress: string }) {
    const { companyId, collateralVault } = useSorobanContracts();
    const { t } = useLanguage();
    const [companyData, setCompanyData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchCompanyData = async () => {
            try {
                const sbtRes = await companyId.get_empresa_sbt({ company: companyAddress });

                let treeCount = 0;
                try {
                    const posRes = await collateralVault.get_position({ company: companyAddress });
                    if (posRes && posRes.result) {
                        treeCount = posRes.result.total_units;
                    }
                } catch { /* sem posição ainda */ }

                if (sbtRes && sbtRes.result) {
                    const record = sbtRes.result;
                    setCompanyData({
                        is_verified: record.verified,
                        co2e_tonnes: Number(record.carbon_seq_g || 0) / 1_000_000,
                        tree_count: treeCount,
                        ods_badges_count: record.ods_badges ? record.ods_badges.length : 0,
                        c_cred: Number(record.c_cred_balance || 0),
                        c_debt: Number(record.c_debt_balance || 0),
                    });
                }
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchCompanyData();
    }, [companyAddress, companyId, collateralVault]);

    // ─── Loading ──────────────────────────────────────────────
    if (loading) {
        return (
            <div style={{ width: '100%', margin: '0 auto' }}>
                <div className="sf-topbar">
                    <span>≡ Social Forests</span>
                </div>
                <div className="sf-card" style={{ borderTop: 'none', padding: '48px 20px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                        <div className="sf-spinner" />
                    </div>
                    <p className="sf-mono" style={{ fontSize: '0.75rem', color: 'var(--sf-gray-text)' }}>
                        Carregando...
                    </p>
                </div>
            </div>
        );
    }

    // ─── Erro ─────────────────────────────────────────────────
    if (error || !companyData) {
        return (
            <div style={{ width: '100%', margin: '0 auto' }}>
                <div className="sf-topbar">
                    <span>≡ Social Forests</span>
                </div>
                <div className="sf-card" style={{ borderTop: 'none', padding: '32px 20px', textAlign: 'center' }}>
                    <p className="sf-mono" style={{ fontSize: '0.75rem', color: 'var(--sf-red)' }}>
                        Failed to load ESG data.
                    </p>
                </div>
            </div>
        );
    }

    const cCredYield = companyData.c_debt > 0
        ? ((companyData.c_cred / companyData.c_debt) * 100).toFixed(1)
        : '0.0';

    return (
        <div style={{ width: '100%', margin: '0 auto' }}>
            {/* ── Top Bar ── */}
            <div className="sf-topbar">
                <span>≡ Social Forests</span>
                <span style={{ fontSize: '0.7rem' }}>ESG</span>
            </div>

            <div className="sf-card" style={{ borderTop: 'none' }}>

                {/* ── Portfolio Overview ── */}
                <div style={{ background: 'var(--sf-cream-dark)', padding: '12px 20px' }}>
                    <span className="sf-label" style={{ color: 'var(--sf-gray-text)' }}>
                        {t('overview')}
                    </span>
                </div>

                <div className="sf-metric-row">
                    <div className="sf-metric-cell">
                        <span className="sf-label" style={{ color: 'var(--sf-gray-text)', display: 'block', marginBottom: 6 }}>
                            {t('carbon_seq')}
                        </span>
                        <span className="sf-heading" style={{ fontSize: '1.1rem', color: 'var(--sf-brown-dark)' }}>
                            {companyData.co2e_tonnes.toFixed(2)}
                        </span>
                        <span className="sf-mono" style={{ fontSize: '0.6rem', color: 'var(--sf-gray-text)', display: 'block' }}>
                            tCO2e
                        </span>
                    </div>

                    <div className="sf-metric-cell">
                        <span className="sf-label" style={{ color: 'var(--sf-gray-text)', display: 'block', marginBottom: 6 }}>
                            {t('trees')}
                        </span>
                        <span className="sf-heading" style={{ fontSize: '1.1rem', color: 'var(--sf-brown-dark)' }}>
                            {companyData.tree_count}
                        </span>
                        <span className="sf-mono" style={{ fontSize: '0.6rem', color: 'var(--sf-gray-text)', display: 'block' }}>
                            Mogno
                        </span>
                    </div>

                    <div className="sf-metric-cell">
                        <span className="sf-label" style={{ color: 'var(--sf-gray-text)', display: 'block', marginBottom: 6 }}>
                            {t('yield')}
                        </span>
                        <span className="sf-heading" style={{ fontSize: '1.1rem', color: 'var(--sf-green-primary)' }}>
                            +{cCredYield}%
                        </span>
                        <span className="sf-mono" style={{ fontSize: '0.6rem', color: 'var(--sf-gray-text)', display: 'block' }}>
                            net-zero
                        </span>
                    </div>
                </div>

                {/* ── Mogno Card ── */}
                <div style={{ padding: 20 }}>
                    <span className="sf-label" style={{ color: 'var(--sf-gray-text)', display: 'block', marginBottom: 10 }}>
                        {t('rwa_title')}
                    </span>

                    <div className="sf-card-elevated" style={{ display: 'flex', overflow: 'hidden' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/mogno-seedling.png"
                            alt="Mogno Africano"
                            style={{ width: 140, height: 140, objectFit: 'cover' }}
                        />
                        <div style={{ padding: '14px 16px', flex: 1 }}>
                            <div className="sf-badge-green" style={{ display: 'inline-block', marginBottom: 8 }}>
                                RWA Fraction
                            </div>
                            <p className="sf-heading" style={{ fontSize: '0.8rem', color: 'var(--sf-brown-dark)', margin: '0 0 6px' }}>
                                Mogno Africano
                            </p>
                            <p className="sf-mono" style={{ fontSize: '0.65rem', color: 'var(--sf-gray-text)', margin: '0 0 4px' }}>
                                {companyData.tree_count} unidades lastro
                            </p>
                            <p className="sf-mono" style={{ fontSize: '0.65rem', color: 'var(--sf-gray-text)', margin: 0 }}>
                                Asset Type: 1 (Khaya)
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── ODS Badges ── */}
                <div style={{ padding: '0 20px 20px' }}>
                    <span className="sf-label" style={{ color: 'var(--sf-gray-text)', display: 'block', marginBottom: 10 }}>
                        {t('ods_title')}
                    </span>
                    <div style={{ display: 'flex', gap: 8 }}>
                        {companyData.ods_badges_count > 0 ? (
                            Array.from({ length: companyData.ods_badges_count }).map((_, i) => (
                                <div key={i} className="sf-badge-yellow" style={{ borderRadius: 2 }}>
                                    ODS {i + 1}
                                </div>
                            ))
                        ) : (
                            <span className="sf-mono" style={{ fontSize: '0.7rem', color: 'var(--sf-gray-text)' }}>
                                -
                            </span>
                        )}
                    </div>
                </div>

                {/* ── Auditor Badge ── */}
                <div style={{ padding: '0 20px 20px' }}>
                    {companyData.is_verified ? (
                        <div className="sf-verified-badge">
                            {t('verified_ok')}
                        </div>
                    ) : (
                        <div className="sf-pending-badge">
                            {t('verified_pend')}
                        </div>
                    )}
                </div>

                {/* ── Bottom Nav ── */}
                <div className="sf-bottom-nav">
                    <div className="sf-bottom-nav-item">
                        <span style={{ fontSize: 16 }}>🌿</span>
                        <span>{t('nav_field')}</span>
                    </div>
                    <div className="sf-bottom-nav-item active">
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