'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

interface B2BLoginProps {
    onLoginSuccess: () => void;
}

export default function B2BLogin({ onLoginSuccess }: B2BLoginProps) {
    const { t } = useLanguage();
    const { connectFreighter } = useAuth();
    
    const [loginDoc, setLoginDoc] = useState('');
    const [loginPwd, setLoginPwd] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

    const handleWeb2Login = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        
        // Simulação de autenticação de conta digital / email
        setTimeout(() => {
            setStatus('idle');
            onLoginSuccess();
        }, 1500);
    };

    const handleWeb3Login = async () => {
        setStatus('loading');
        try {
            await connectFreighter();
            onLoginSuccess();
        } catch (err) {
            console.error('Falha no login web3', err);
            setStatus('error');
        }
    };

    return (
        <div style={{ width: '100%', margin: '0 auto' }}>
            <div className="sf-card" style={{ borderTop: 'none', padding: '40px 20px', minHeight: 400 }}>
                
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{ fontSize: '3rem', marginBottom: 16 }}>🏢</div>
                    <h2 className="sf-heading" style={{ fontSize: '1.4rem', color: 'var(--sf-brown-dark)', marginBottom: 8 }}>
                        {t('login_title')}
                    </h2>
                    <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.8rem', color: 'var(--sf-gray-text)' }}>
                        {t('login_desc')}
                    </p>
                </div>

                {status === 'loading' ? (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                            <div className="sf-spinner" />
                        </div>
                        <p className="sf-mono" style={{ fontSize: '0.75rem', color: 'var(--sf-gray-text)' }}>
                            {t('login_sim_msg')}
                        </p>
                    </div>
                ) : (
                    <div style={{ maxWidth: 320, margin: '0 auto' }}>
                        
                        <form onSubmit={handleWeb2Login} style={{ marginBottom: 24 }}>
                            <div style={{ marginBottom: 16 }}>
                                <label className="sf-label" style={{ display: 'block', marginBottom: 6, color: 'var(--sf-brown-dark)' }}>
                                    {t('login_doc')}
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="sf-input"
                                    value={loginDoc}
                                    onChange={e => setLoginDoc(e.target.value)}
                                />
                            </div>

                            <div style={{ marginBottom: 24 }}>
                                <label className="sf-label" style={{ display: 'block', marginBottom: 6, color: 'var(--sf-brown-dark)' }}>
                                    {t('login_pwd')}
                                </label>
                                <input
                                    type="password"
                                    required
                                    className="sf-input"
                                    value={loginPwd}
                                    onChange={e => setLoginPwd(e.target.value)}
                                />
                            </div>

                            <button type="submit" className="sf-btn-primary">
                                {t('btn_login')}
                            </button>
                        </form>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0' }}>
                            <div style={{ flex: 1, height: 1, background: 'var(--sf-gray-border)' }} />
                            <span className="sf-mono" style={{ fontSize: '0.6rem', color: 'var(--sf-gray-text)' }}>OR</span>
                            <div style={{ flex: 1, height: 1, background: 'var(--sf-gray-border)' }} />
                        </div>

                        <button 
                            type="button" 
                            className="sf-btn-secondary" 
                            onClick={handleWeb3Login}
                        >
                            {t('btn_freighter')}
                        </button>

                    </div>
                )}
            </div>
        </div>
    );
}
