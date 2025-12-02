'use client';

import React, { useState } from 'react';
import { X, Mail, Lock, User, Github, Loader2, ArrowLeft, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

type AuthMode = 'login' | 'signup' | 'forgot-password';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    darkMode?: boolean;
    initialMode?: AuthMode;
}

export function AuthModal({ isOpen, onClose, darkMode = false, initialMode = 'login' }: AuthModalProps) {
    const { signIn, signUp, signInWithGoogle, signInWithGithub, resetPassword } = useAuth();
    
    const [mode, setMode] = useState<AuthMode>(initialMode);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            if (mode === 'login') {
                const { error } = await signIn(email, password);
                if (error) {
                    setError(error.message);
                } else {
                    onClose();
                }
            } else if (mode === 'signup') {
                if (password !== confirmPassword) {
                    setError('Passwords do not match');
                    setLoading(false);
                    return;
                }
                if (password.length < 6) {
                    setError('Password must be at least 6 characters');
                    setLoading(false);
                    return;
                }
                const { error } = await signUp(email, password, userName);
                if (error) {
                    setError(error.message);
                } else {
                    setSuccess('Check your email to confirm your account!');
                }
            } else if (mode === 'forgot-password') {
                const { error } = await resetPassword(email);
                if (error) {
                    setError(error.message);
                } else {
                    setSuccess('Check your email for a password reset link!');
                }
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleOAuthSignIn = async (provider: 'google' | 'github') => {
        setLoading(true);
        setError(null);
        
        try {
            const { error } = provider === 'google' 
                ? await signInWithGoogle()
                : await signInWithGithub();
            
            if (error) {
                setError(error.message);
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setUserName('');
        setError(null);
        setSuccess(null);
    };

    const switchMode = (newMode: AuthMode) => {
        resetForm();
        setMode(newMode);
    };

    const bgClass = darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200';
    const textClass = darkMode ? 'text-slate-200' : 'text-slate-800';
    const mutedClass = darkMode ? 'text-slate-400' : 'text-slate-500';
    const inputClass = darkMode 
        ? 'bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500 focus:border-indigo-500' 
        : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500';

    return (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div 
                className={`relative w-full max-w-md mx-4 p-8 rounded-2xl shadow-2xl border ${bgClass}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    aria-label="Close authentication modal"
                    className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
                >
                    <X size={20} className={mutedClass} />
                </button>

                {/* Logo & Title */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-500 rounded-xl text-white">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <h1 className={`text-xl font-bold ${textClass}`}>
                            {mode === 'login' && 'Welcome Back'}
                            {mode === 'signup' && 'Create Account'}
                            {mode === 'forgot-password' && 'Reset Password'}
                        </h1>
                        <p className={`text-sm ${mutedClass}`}>
                            {mode === 'login' && 'Sign in to your workspace'}
                            {mode === 'signup' && 'Join the trading community'}
                            {mode === 'forgot-password' && 'We\'ll send you a reset link'}
                        </p>
                    </div>
                </div>

                {/* Back button for forgot password */}
                {mode === 'forgot-password' && (
                    <button
                        onClick={() => switchMode('login')}
                        className={`flex items-center gap-1 text-sm mb-4 ${mutedClass} hover:text-indigo-500 transition-colors`}
                    >
                        <ArrowLeft size={14} />
                        Back to login
                    </button>
                )}

                {/* Error/Success messages */}
                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm">
                        {success}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === 'signup' && (
                        <div>
                            <label className={`block text-sm font-medium mb-1.5 ${mutedClass}`}>
                                Display Name
                            </label>
                            <div className="relative">
                                <User size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${mutedClass}`} />
                                <input
                                    type="text"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    placeholder="Trader Name"
                                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${inputClass}`}
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className={`block text-sm font-medium mb-1.5 ${mutedClass}`}>
                            Email
                        </label>
                        <div className="relative">
                            <Mail size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${mutedClass}`} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${inputClass}`}
                            />
                        </div>
                    </div>

                    {mode !== 'forgot-password' && (
                        <div>
                            <label className={`block text-sm font-medium mb-1.5 ${mutedClass}`}>
                                Password
                            </label>
                            <div className="relative">
                                <Lock size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${mutedClass}`} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${inputClass}`}
                                />
                            </div>
                        </div>
                    )}

                    {mode === 'signup' && (
                        <div>
                            <label className={`block text-sm font-medium mb-1.5 ${mutedClass}`}>
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${mutedClass}`} />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${inputClass}`}
                                />
                            </div>
                        </div>
                    )}

                    {mode === 'login' && (
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => switchMode('forgot-password')}
                                className={`text-sm ${mutedClass} hover:text-indigo-500 transition-colors`}
                            >
                                Forgot password?
                            </button>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 px-4 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 size={18} className="animate-spin" />}
                        {mode === 'login' && 'Sign In'}
                        {mode === 'signup' && 'Create Account'}
                        {mode === 'forgot-password' && 'Send Reset Link'}
                    </button>
                </form>

                {/* OAuth buttons */}
                {mode !== 'forgot-password' && (
                    <>
                        <div className="relative my-6">
                            <div className={`absolute inset-0 flex items-center`}>
                                <div className={`w-full border-t ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className={`px-4 ${darkMode ? 'bg-slate-900' : 'bg-white'} ${mutedClass}`}>
                                    or continue with
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => handleOAuthSignIn('google')}
                                disabled={loading}
                                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border font-medium transition-all disabled:opacity-50 ${darkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'} ${textClass}`}
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                Google
                            </button>
                            <button
                                type="button"
                                onClick={() => handleOAuthSignIn('github')}
                                disabled={loading}
                                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border font-medium transition-all disabled:opacity-50 ${darkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'} ${textClass}`}
                            >
                                <Github size={20} />
                                GitHub
                            </button>
                        </div>
                    </>
                )}

                {/* Mode switch */}
                <p className={`mt-6 text-center text-sm ${mutedClass}`}>
                    {mode === 'login' ? (
                        <>
                            Don&apos;t have an account?{' '}
                            <button
                                type="button"
                                onClick={() => switchMode('signup')}
                                className="text-indigo-500 hover:text-indigo-600 font-medium"
                            >
                                Sign up
                            </button>
                        </>
                    ) : mode === 'signup' ? (
                        <>
                            Already have an account?{' '}
                            <button
                                type="button"
                                onClick={() => switchMode('login')}
                                className="text-indigo-500 hover:text-indigo-600 font-medium"
                            >
                                Sign in
                            </button>
                        </>
                    ) : null}
                </p>
            </div>
        </div>
    );
}
