'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface CompanyMissionsProps {
    leafBalance: number;
}

export default function CompanyMissions({ leafBalance }: CompanyMissionsProps) {
    const { t } = useLanguage();
    const [missionName, setMissionName] = useState('');
    const [missionDesc, setMissionDesc] = useState('');
    const [missionReward, setMissionReward] = useState('100');
    const [activeMissions, setActiveMissions] = useState<any[]>([]);

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        setActiveMissions([
            { name: missionName, desc: missionDesc, reward: missionReward, id: Date.now() },
            ...activeMissions
        ]);
        setMissionName('');
        setMissionDesc('');
        setMissionReward('100');
    };

    return (
        <div style={{ width: '100%', margin: '0 auto' }}>
            <div className="sf-card" style={{ borderTop: 'none', minHeight: 400 }}>
                {/* Header Section */}
                <div style={{ background: 'var(--sf-cream-dark)', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="sf-label" style={{ color: 'var(--sf-gray-text)' }}>
                        {t('mission_title')}
                    </span>
                    <span className="sf-badge-green">
                        {t('leafs_avail')}: {leafBalance.toLocaleString()}
                    </span>
                </div>

                {/* State: Locked (No LEAFs) */}
                {leafBalance === 0 ? (
                    <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 20 }}>🔒</div>
                        <h3 className="sf-heading" style={{ color: 'var(--sf-brown-dark)', marginBottom: 12 }}>
                            {t('locked_missions')}
                        </h3>
                        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.8rem', color: 'var(--sf-gray-text)', maxWidth: 400, margin: '0 auto' }}>
                            {t('locked_desc')}
                        </p>
                    </div>
                ) : (
                    /* State: Unlocked (Has LEAFs) */
                    <div style={{ padding: 20 }}>
                        <form onSubmit={handleCreate} style={{ marginBottom: 40 }}>
                            <h3 className="sf-heading" style={{ fontSize: '1.2rem', color: 'var(--sf-green-primary)', marginBottom: 20 }}>
                                {t('create_mission')}
                            </h3>

                            <div style={{ marginBottom: 14 }}>
                                <label className="sf-label" style={{ display: 'block', marginBottom: 6, color: 'var(--sf-brown-dark)' }}>
                                    {t('miss_name')}
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="sf-input"
                                    value={missionName}
                                    onChange={e => setMissionName(e.target.value)}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 20 }}>
                                <div style={{ flex: '2 1 200px' }}>
                                    <label className="sf-label" style={{ display: 'block', marginBottom: 6, color: 'var(--sf-brown-dark)' }}>
                                        {t('miss_desc')}
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="sf-input"
                                        value={missionDesc}
                                        onChange={e => setMissionDesc(e.target.value)}
                                    />
                                </div>
                                <div style={{ flex: '1 1 100px' }}>
                                    <label className="sf-label" style={{ display: 'block', marginBottom: 6, color: 'var(--sf-brown-dark)' }}>
                                        {t('miss_reward')}
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="10"
                                        step="10"
                                        className="sf-input"
                                        value={missionReward}
                                        onChange={e => setMissionReward(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="sf-btn-primary" style={{ background: 'var(--sf-green-dark)' }}>
                                {t('btn_launch')}
                            </button>
                        </form>

                        {/* Lista de Missões Ativas */}
                        {activeMissions.length > 0 && (
                            <div>
                                <span className="sf-label" style={{ color: 'var(--sf-gray-text)', display: 'block', marginBottom: 10 }}>
                                    Campanhas Ativas
                                </span>
                                {activeMissions.map(m => (
                                    <div key={m.id} className="sf-card-elevated" style={{ padding: '12px 16px', marginBottom: 10 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <h4 className="sf-heading" style={{ fontSize: '0.9rem', color: 'var(--sf-brown-dark)', margin: '0 0 4px' }}>
                                                    {m.name}
                                                </h4>
                                                <p className="sf-mono" style={{ fontSize: '0.7rem', color: 'var(--sf-gray-text)', margin: 0 }}>
                                                    {m.desc}
                                                </p>
                                            </div>
                                            <div className="sf-badge-yellow">
                                                {m.reward} LEAFs
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
