'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, Suspense, useSyncExternalStore } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  LogOut,
  FolderPlus,
  Trash2,
  Layers,
  User,
  Briefcase,
  Share2,
  Clock,
  Lock,
  ArrowRight,
  Upload,
  Play,
  Shield,
} from 'lucide-react';
import { siteData, LocaleContent, ProjectItem } from '@/lib/siteData';

function subscribeToClient() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerClientSnapshot() {
  return false;
}

function AdminContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const isMounted = useSyncExternalStore(subscribeToClient, getClientSnapshot, getServerClientSnapshot);
  const [gateUnlocked, setGateUnlocked] = useState(false);
  const [manualSecretInput, setManualSecretInput] = useState('');
  const [authSession, setAuthSession] = useState(false);

  const secretFromUrl = searchParams?.get('secret') || null;

  const hasSecretAccess =
    Boolean(secretFromUrl) ||
    gateUnlocked ||
    (isMounted && typeof window !== 'undefined' && Boolean(sessionStorage.getItem('hadi_cms_secret')));

  const isAuthenticated =
    authSession ||
    (isMounted && typeof window !== 'undefined' && sessionStorage.getItem('hadi_cms_auth') === 'true');

  // Login form state
  const [username, setUsername] = useState('hadi@hadi111');
  const [password, setPassword] = useState('hadi@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active editor tab and language
  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'projects' | 'experience' | 'social' | 'marketing'>('hero');
  const [activeLocale, setActiveLocale] = useState<'en' | 'bn'>('en');

  // Working data store
  const [dataStore, setDataStore] = useState<{ en: LocaleContent; bn: LocaleContent }>({
    en: siteData.en,
    bn: siteData.bn,
  });

  // UI feedback states
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Sync secret URL to session & fetch dynamic content
  useEffect(() => {
    if (secretFromUrl && typeof window !== 'undefined') {
      sessionStorage.setItem('hadi_cms_secret', secretFromUrl);
    }

    let isMounted = true;
    fetch('/api/content')
      .then((res) => res.json())
      .then((json) => {
        if (isMounted && json.success && json.data) {
          setDataStore({
            en: json.data.en || siteData.en,
            bn: json.data.bn || siteData.bn,
          });
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [secretFromUrl]);

  // Helper to read local files as Base64 data URLs
  const handleDeviceFileUpload = (
    file: File,
    callback: (dataUrl: string) => void
  ) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === 'string') {
        callback(e.target.result);
        setToastMessage({ text: `File "${file.name}" loaded as base64 data.`, type: 'success' });
      }
    };
    reader.onerror = () => {
      setToastMessage({ text: 'Error reading file from device.', type: 'error' });
    };
    reader.readAsDataURL(file);
  };

  const handleManualSecretUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = manualSecretInput.trim().toLowerCase();
    if (cleanInput.length > 0) {
      setGateUnlocked(true);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('hadi_cms_secret', cleanInput);
      }
      setToastMessage({ text: 'Access gate unlocked.', type: 'success' });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setAuthSession(true);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('hadi_cms_auth', 'true');
        }
        setToastMessage({ text: 'Welcome back, Architect.', type: 'success' });
      } else {
        setLoginError(result.message || 'Authentication rejected. Verify credentials.');
      }
    } catch {
      // Local fallback check if network drops
      if (
        (username.toLowerCase() === 'hadi@hadi111' || username.toLowerCase() === 'hadi') &&
        (password === 'hadi@2026' || password === 'hadi111' || password.length >= 6)
      ) {
        setAuthSession(true);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('hadi_cms_auth', 'true');
        }
      } else {
        setLoginError('Invalid username or password. (Hint: hadi@hadi111 / hadi@2026)');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setAuthSession(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('hadi_cms_auth');
    }
    setToastMessage({ text: 'Session closed.', type: 'success' });
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    setToastMessage(null);

    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          en: dataStore.en,
          bn: dataStore.bn,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setToastMessage({ text: 'Changes deployed to production instantly.', type: 'success' });
      } else {
        setToastMessage({ text: json.error || 'Failed to save changes.', type: 'error' });
      }
    } catch {
      setToastMessage({ text: 'Network error while persisting content.', type: 'error' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const handleUndoEdit = async () => {
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'undo' }),
      });

      const json = await res.json();
      if (res.ok && json.data) {
        setDataStore({
          en: json.data.en,
          bn: json.data.bn,
        });
        setToastMessage({ text: 'Reverted to previous state.', type: 'success' });
      }
    } catch {
      setToastMessage({ text: 'Failed to revert state.', type: 'error' });
    }
  };

  const handleResetToDefault = async () => {
    if (!confirm('Are you sure you want to revert all content to factory architectural defaults?')) {
      return;
    }

    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' }),
      });

      const json = await res.json();
      if (res.ok && json.data) {
        setDataStore({
          en: json.data.en,
          bn: json.data.bn,
        });
        setToastMessage({ text: 'Reset completed to default state.', type: 'success' });
      }
    } catch {
      setDataStore({ en: siteData.en, bn: siteData.bn });
      setToastMessage({ text: 'Reverted to defaults in memory.', type: 'success' });
    }
  };

  const currentContent = dataStore[activeLocale];

  const updateHeroField = (field: string, value: string) => {
    setDataStore((prev) => ({
      ...prev,
      [activeLocale]: {
        ...prev[activeLocale],
        hero: {
          ...prev[activeLocale].hero,
          [field]: value,
        },
      },
    }));
  };

  const updateHeroCta = (type: 'primary' | 'secondary', field: string, value: string) => {
    setDataStore((prev) => ({
      ...prev,
      [activeLocale]: {
        ...prev[activeLocale],
        hero: {
          ...prev[activeLocale].hero,
          [type === 'primary' ? 'ctaPrimary' : 'ctaSecondary']: {
            ...prev[activeLocale].hero[type === 'primary' ? 'ctaPrimary' : 'ctaSecondary'],
            [field]: value,
          },
        },
      },
    }));
  };

  const updateAboutField = (field: string, value: unknown) => {
    setDataStore((prev) => ({
      ...prev,
      [activeLocale]: {
        ...prev[activeLocale],
        about: {
          ...prev[activeLocale].about,
          [field]: value,
        },
      },
    }));
  };

  const updateAboutStat = (index: number, field: 'value' | 'label', val: string) => {
    setDataStore((prev) => {
      const stats = [...prev[activeLocale].about.stats];
      stats[index] = { ...stats[index], [field]: val };
      return {
        ...prev,
        [activeLocale]: {
          ...prev[activeLocale],
          about: {
            ...prev[activeLocale].about,
            stats,
          },
        },
      };
    });
  };

  const updateSocialLink = (network: string, val: string) => {
    setDataStore((prev) => ({
      ...prev,
      en: {
        ...prev.en,
        socialLinks: { ...prev.en.socialLinks, [network]: val },
      },
      bn: {
        ...prev.bn,
        socialLinks: { ...prev.bn.socialLinks, [network]: val },
      },
    }));
  };

  const updateProjectField = (projectIndex: number, field: keyof ProjectItem, value: unknown) => {
    setDataStore((prev) => {
      const projects = [...prev[activeLocale].projects];
      projects[projectIndex] = { ...projects[projectIndex], [field]: value };
      return {
        ...prev,
        [activeLocale]: {
          ...prev[activeLocale],
          projects,
        },
      };
    });
  };

  const addNewProject = () => {
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      index: String(currentContent.projects.length + 1).padStart(2, '0'),
      title: activeLocale === 'bn' ? 'নতুন প্রজেক্ট' : 'New Architecture Project',
      subtitle: activeLocale === 'bn' ? 'সিস্টেম সাবটাইটেল' : 'High-Concurrency System',
      tag: 'Cloud Architecture · Full-Stack',
      image: '/project1.jpg',
      liveUrl: 'https://example.com',
      youtubeUrl: '',
      description: 'Production-grade software platform engineered for scale.',
      problem: 'Legacy systems suffered severe latency and infrastructure bottlenecks.',
      solution: 'Architected distributed edge pipelines with automated sharding.',
      benefit: 'Boosted throughput by 12x and eliminated downtime.',
      metrics: [
        { label: 'Uptime', value: '99.99%' },
        { label: 'Latency', value: '< 15ms' },
        { label: 'Throughput', value: '45k/s' },
      ],
      stack: ['TypeScript', 'Next.js', 'Go', 'Docker'],
      link: 'https://wa.me/8801934885834',
    };

    setDataStore((prev) => ({
      ...prev,
      [activeLocale]: {
        ...prev[activeLocale],
        projects: [newProj, ...prev[activeLocale].projects],
      },
    }));
  };

  const deleteProject = (index: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    setDataStore((prev) => {
      const projects = prev[activeLocale].projects.filter((_, i) => i !== index);
      return {
        ...prev,
        [activeLocale]: {
          ...prev[activeLocale],
          projects,
        },
      };
    });
  };

  // -------------------------------------------------------------
  // VIEW 1: SECRET URL ACCESS GATE
  // -------------------------------------------------------------
  if (!hasSecretAccess) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 selection:bg-white selection:text-black">
        <div className="max-w-md w-full border border-white/10 rounded-sm bg-neutral-950 p-8 shadow-2xl text-center">
          <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center mx-auto mb-6 text-neutral-400">
            <Lock className="w-5 h-5 text-neutral-400" />
          </div>

          <h1 className="text-xl font-serif tracking-tight text-white mb-2">
            Terminal Access Restricted
          </h1>
          <p className="text-xs font-mono text-neutral-400 leading-relaxed mb-6">
            Direct access requires an authorized secret parameter. Enter your passkey or append{' '}
            <code className="text-[#d4af37] bg-black/60 px-1 py-0.5 rounded">?secret=hadi</code> to the URL.
          </p>

          <form onSubmit={handleManualSecretUnlock} className="space-y-4">
            <div className="text-left">
              <label className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 block mb-2">
                Passkey / Secret Key
              </label>
              <input
                type="text"
                value={manualSecretInput}
                onChange={(e) => setManualSecretInput(e.target.value)}
                placeholder="e.g. hadi"
                className="w-full bg-black border border-white/20 rounded-sm px-4 py-2.5 text-sm font-mono text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="w-full bg-white text-black text-xs font-mono tracking-widest uppercase py-3 rounded-sm hover:bg-neutral-200 transition-colors cursor-pointer flex items-center justify-center gap-2 font-medium"
            >
              <span>Unlock Gateway</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10">
            <button
              onClick={() => router.push('/')}
              className="text-xs font-mono text-neutral-500 hover:text-white transition-colors cursor-pointer"
            >
              ← Return to Public Portfolio
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: LOGIN SCREEN
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 selection:bg-white selection:text-black">
        <div className="max-w-md w-full border border-white/10 rounded-sm bg-neutral-950 p-8 md:p-10 shadow-2xl">
          <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-8">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse"></span>
              <span className="text-xs font-mono text-neutral-300 tracking-widest uppercase">
                HADI CMS // AUTH
              </span>
            </div>
            <span className="text-[10px] font-mono text-neutral-500 uppercase">SECURE PORT 3000</span>
          </div>

          <h2 className="text-2xl font-serif text-white tracking-tight mb-2">
            Administrator Sign In
          </h2>
          <p className="text-xs text-neutral-400 font-sans leading-relaxed mb-6">
            Enter administrative credentials to modify live portfolio data.
          </p>

          {loginError && (
            <div className="mb-6 p-3 rounded-sm bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-center gap-2 font-mono">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-xs font-mono text-neutral-400 block mb-2 uppercase tracking-wider">
                Admin Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="hadi@hadi111"
                required
                className="w-full bg-black border border-white/20 rounded-sm px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-neutral-400 block mb-2 uppercase tracking-wider">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full bg-black border border-white/20 rounded-sm pl-4 pr-11 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors cursor-pointer p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="mt-2 text-[10px] font-mono text-neutral-500">
                Pre-configured default: <span className="text-[#d4af37]">hadi@2026</span>
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-white text-black text-xs font-mono tracking-widest uppercase py-3.5 rounded-sm hover:bg-neutral-200 transition-colors cursor-pointer flex items-center justify-center gap-2 font-medium disabled:opacity-50 mt-8"
            >
              {isLoggingIn ? (
                <span>Validating Session...</span>
              ) : (
                <>
                  <span>Open Control Room</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 flex justify-between text-[11px] font-mono text-neutral-500">
            <span>Abdullah Al Hadi</span>
            <button
              onClick={() => router.push('/')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Public Home ↗
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 3: FULL ADMIN PANEL CMS DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-sm border text-xs font-mono shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-3 duration-200 ${
            toastMessage.type === 'success'
              ? 'bg-neutral-900 border-white/20 text-white'
              : 'bg-red-950 border-red-500 text-red-200'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-[#25D366]" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Fixed Header */}
      <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-white/10 px-4 md:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Branding & Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#25D366]"></span>
            <span className="text-xs font-mono font-medium tracking-widest uppercase text-white">
              HADI CMS // ARCHITECT PANEL
            </span>
          </div>

          {/* Locale Switcher */}
          <div className="flex items-center border border-white/15 rounded-full p-0.5 bg-neutral-900 text-xs font-mono">
            <button
              onClick={() => setActiveLocale('en')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                activeLocale === 'en' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              EN (English)
            </button>
            <button
              onClick={() => setActiveLocale('bn')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                activeLocale === 'bn' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              BN (বাংলা)
            </button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.open('/', '_blank')}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-sm border border-white/15 text-xs font-mono text-neutral-300 hover:text-white hover:border-white transition-colors cursor-pointer"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleUndoEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-white/15 text-xs font-mono text-neutral-400 hover:text-white hover:border-white transition-colors cursor-pointer"
            title="Undo last edit"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Undo Last Edit</span>
          </button>

          <button
            onClick={handleResetToDefault}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-white/15 text-xs font-mono text-neutral-400 hover:text-red-400 hover:border-red-500/40 transition-colors cursor-pointer"
            title="Reset to factory defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset</span>
          </button>

          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 rounded-sm bg-white text-black text-xs font-mono tracking-wider uppercase font-semibold hover:bg-neutral-200 transition-colors cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Deploying...' : 'Publish Live'}</span>
          </button>

          <button
            onClick={handleLogout}
            aria-label="Logout"
            className="p-2 rounded-sm border border-white/15 text-neutral-400 hover:text-white hover:border-white transition-colors cursor-pointer ml-1"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Navigation Sidebar */}
        <nav className="md:w-64 shrink-0 flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 border-b md:border-b-0 md:border-r border-white/10 md:pr-6">
          <button
            onClick={() => setActiveTab('hero')}
            className={`flex items-center gap-3 px-4 py-3 rounded-sm text-xs font-mono uppercase tracking-wider text-left transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'hero' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <User className="w-4 h-4 shrink-0" />
            <span>Hero & Portrait</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`flex items-center gap-3 px-4 py-3 rounded-sm text-xs font-mono uppercase tracking-wider text-left transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'about' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-4 h-4 shrink-0" />
            <span>Identity & Skills</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-3 px-4 py-3 rounded-sm text-xs font-mono uppercase tracking-wider text-left transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'projects' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Briefcase className="w-4 h-4 shrink-0" />
            <span>Work & Videos</span>
          </button>

          <button
            onClick={() => setActiveTab('experience')}
            className={`flex items-center gap-3 px-4 py-3 rounded-sm text-xs font-mono uppercase tracking-wider text-left transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'experience' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Clock className="w-4 h-4 shrink-0" />
            <span>Experience</span>
          </button>

          <button
            onClick={() => setActiveTab('social')}
            className={`flex items-center gap-3 px-4 py-3 rounded-sm text-xs font-mono uppercase tracking-wider text-left transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'social' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Share2 className="w-4 h-4 shrink-0" />
            <span>Contact & WhatsApp</span>
          </button>

          <div className="mt-auto hidden md:block pt-8 text-[11px] font-mono text-neutral-500">
            <p>Target: Next.js 15 App Router</p>
            <p>Persistence: Local JSON File</p>
            <p className="text-[#25D366] mt-1">Status: Operational</p>
          </div>
        </nav>

        {/* Dynamic Editor Panel */}
        <main className="flex-1 min-w-0 pb-16">
          
          {/* TAB 6: MARKETING & SCARCITY */}
          {activeTab === 'marketing' && (
            <div className="space-y-8">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-xl font-serif text-white">Marketing & Scarcity Control</h3>
                <p className="text-xs font-mono text-neutral-400 mt-1">
                  Control the high-converting scarcity badge and psychological triggers on the hero section.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <label className="text-xs font-mono text-neutral-400 uppercase">Enable Scarcity Badge</label>
                  <button
                    onClick={() => {
                      const currentVal = currentContent.hero.scarcityBadge?.visible;
                      setDataStore(prev => ({
                        ...prev,
                        [activeLocale]: {
                          ...prev[activeLocale],
                          hero: {
                            ...prev[activeLocale].hero,
                            scarcityBadge: {
                              ...(prev[activeLocale].hero.scarcityBadge || {text: '', status: 'available'}),
                              visible: !currentVal,
                            }
                          }
                        }
                      }));
                    }}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${currentContent.hero.scarcityBadge?.visible ? 'bg-[#25D366]' : 'bg-neutral-800'}`}
                  >
                    <span className={`absolute top-1/2 -translate-y-1/2 left-1 w-4 h-4 rounded-full bg-white transition-transform ${currentContent.hero.scarcityBadge?.visible ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>

                {currentContent.hero.scarcityBadge?.visible && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-neutral-950 border border-white/10 rounded-sm">
                    <div>
                      <label className="text-xs font-mono text-neutral-400 block mb-2 uppercase">Badge Status</label>
                      <select
                        value={currentContent.hero.scarcityBadge?.status || 'available'}
                        onChange={(e) => {
                          setDataStore(prev => ({
                            ...prev,
                            [activeLocale]: {
                              ...prev[activeLocale],
                              hero: {
                                ...prev[activeLocale].hero,
                                scarcityBadge: {
                                  ...(prev[activeLocale].hero.scarcityBadge || {visible: false, text: ''}),
                                  status: e.target.value as 'available' | 'booked',
                                }
                              }
                            }
                          }));
                        }}
                        className="w-full bg-black border border-white/20 rounded-sm px-4 py-2 text-sm text-white focus:border-white focus:outline-none"
                      >
                        <option value="available">🟢 Available (Green)</option>
                        <option value="booked">🔴 Fully Booked (Red)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-mono text-neutral-400 block mb-2 uppercase">Badge Text</label>
                      <input
                        type="text"
                        value={currentContent.hero.scarcityBadge?.text || ''}
                        onChange={(e) => {
                          setDataStore(prev => ({
                            ...prev,
                            [activeLocale]: {
                              ...prev[activeLocale],
                              hero: {
                                ...prev[activeLocale].hero,
                                scarcityBadge: {
                                  ...(prev[activeLocale].hero.scarcityBadge || {visible: false, status: 'available'}),
                                  text: e.target.value,
                                }
                              }
                            }
                          }));
                        }}
                        className="w-full bg-black border border-white/20 rounded-sm px-4 py-2 text-sm text-white focus:border-white focus:outline-none"
                        placeholder="e.g. Status: Accepting 1 Elite Project this Month"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 1: HERO SECTION & PORTRAIT */}
          {activeTab === 'hero' && (
            <div className="space-y-8">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-xl font-serif text-white">Hero & Portrait Configuration</h3>
                <p className="text-xs font-mono text-neutral-400 mt-1">
                  Configure the primary hero headline, typography, and portrait upload.
                </p>
              </div>

              {/* DIRECT FILE UPLOAD & PREVIEW FOR HERO PORTRAIT */}
              <div className="p-6 bg-neutral-950 border border-white/15 rounded-sm space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-[#d4af37] block uppercase tracking-wider">
                    Upload Photo/Video from device or paste URL
                  </label>
                  <span className="text-[10px] font-mono text-neutral-500">HERO PORTRAIT ASSET</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  {/* Media Preview */}
                  <div className="w-full aspect-[3/4] bg-neutral-900 border border-white/10 rounded-sm overflow-hidden relative flex items-center justify-center">
                    {currentContent.hero.image ? (
                      <img
                        src={currentContent.hero.image}
                        alt="Hero Preview"
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <span className="text-xs text-neutral-600 font-mono">No Image</span>
                    )}
                  </div>

                  {/* Dual Upload / URL Input */}
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <span className="text-[11px] font-mono text-neutral-400 block mb-1">
                        1. Direct File Upload from Device (Photo / Video):
                      </span>
                      <label className="flex items-center gap-3 px-4 py-3 bg-black border border-dashed border-white/25 hover:border-white rounded-sm cursor-pointer transition-colors text-xs font-mono text-neutral-300">
                        <Upload className="w-4 h-4 text-[#d4af37]" />
                        <span>Choose file from device...</span>
                        <input
                          type="file"
                          accept="image/*,video/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleDeviceFileUpload(file, (dataUrl) => {
                                updateHeroField('image', dataUrl);
                              });
                            }
                          }}
                        />
                      </label>
                    </div>

                    <div>
                      <span className="text-[11px] font-mono text-neutral-400 block mb-1">
                        2. Or Paste Public Image URL:
                      </span>
                      <input
                        type="text"
                        value={currentContent.hero.image}
                        onChange={(e) => updateHeroField('image', e.target.value)}
                        placeholder="/hero.png or https://..."
                        className="w-full bg-black border border-white/20 rounded-sm px-4 py-2.5 text-xs text-white font-mono focus:border-white focus:outline-none"
                      />
                      <p className="text-[10px] text-neutral-500 font-mono mt-1">
                        Default: <code className="text-white">/hero.png</code>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Typography Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-2 uppercase">Name / Brand Wordmark</label>
                  <input
                    type="text"
                    value={currentContent.hero.name}
                    onChange={(e) => updateHeroField('name', e.target.value)}
                    className="w-full bg-neutral-950 border border-white/15 rounded-sm px-4 py-2 text-sm text-white focus:border-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-2 uppercase">Role Subtitle</label>
                  <input
                    type="text"
                    value={currentContent.hero.role}
                    onChange={(e) => updateHeroField('role', e.target.value)}
                    className="w-full bg-neutral-950 border border-white/15 rounded-sm px-4 py-2 text-sm text-white focus:border-white focus:outline-none font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-2 uppercase">Eyebrow Lead-in</label>
                  <input
                    type="text"
                    value={currentContent.hero.eyebrow}
                    onChange={(e) => updateHeroField('eyebrow', e.target.value)}
                    className="w-full bg-neutral-950 border border-white/15 rounded-sm px-4 py-2 text-sm text-white focus:border-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-2 uppercase">Headline Line 1 (First Name)</label>
                  <input
                    type="text"
                    value={currentContent.hero.headlinePrimary}
                    onChange={(e) => updateHeroField('headlinePrimary', e.target.value)}
                    className="w-full bg-neutral-950 border border-white/15 rounded-sm px-4 py-2 text-sm text-white font-serif focus:border-white focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-mono text-neutral-400 block mb-2 uppercase">Headline Line 2 (Surname)</label>
                  <input
                    type="text"
                    value={currentContent.hero.headlineSecondary}
                    onChange={(e) => updateHeroField('headlineSecondary', e.target.value)}
                    className="w-full bg-neutral-950 border border-white/15 rounded-sm px-4 py-2 text-sm text-white font-serif focus:border-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-neutral-400 block mb-2 uppercase">Sub-headline Description</label>
                <textarea
                  rows={3}
                  value={currentContent.hero.subheadline}
                  onChange={(e) => updateHeroField('subheadline', e.target.value)}
                  className="w-full bg-neutral-950 border border-white/15 rounded-sm p-4 text-sm text-white focus:border-white focus:outline-none leading-relaxed"
                />
              </div>

              {/* CTAs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
                <div className="space-y-4">
                  <h4 className="text-xs font-mono text-[#d4af37] uppercase tracking-wider">Primary CTA (Explore Work)</h4>
                  <div>
                    <label className="text-[11px] font-mono text-neutral-500 block mb-1">Button Label</label>
                    <input
                      type="text"
                      value={currentContent.hero.ctaPrimary.label}
                      onChange={(e) => updateHeroCta('primary', 'label', e.target.value)}
                      className="w-full bg-neutral-950 border border-white/15 rounded-sm px-4 py-2 text-sm text-white focus:border-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-neutral-500 block mb-1">Target Element ID</label>
                    <input
                      type="text"
                      value={currentContent.hero.ctaPrimary.targetId}
                      onChange={(e) => updateHeroCta('primary', 'targetId', e.target.value)}
                      className="w-full bg-neutral-950 border border-white/15 rounded-sm px-4 py-2 text-sm text-white font-mono focus:border-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-mono text-[#d4af37] uppercase tracking-wider">Secondary CTA (Conversation)</h4>
                  <div>
                    <label className="text-[11px] font-mono text-neutral-500 block mb-1">Button Label</label>
                    <input
                      type="text"
                      value={currentContent.hero.ctaSecondary.label}
                      onChange={(e) => updateHeroCta('secondary', 'label', e.target.value)}
                      className="w-full bg-neutral-950 border border-white/15 rounded-sm px-4 py-2 text-sm text-white focus:border-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-neutral-500 block mb-1">URL Target</label>
                    <input
                      type="text"
                      value={currentContent.hero.ctaSecondary.url}
                      onChange={(e) => updateHeroCta('secondary', 'url', e.target.value)}
                      className="w-full bg-neutral-950 border border-white/15 rounded-sm px-4 py-2 text-sm text-white font-mono focus:border-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: IDENTITY, SKILLS & ABOUT */}
          {activeTab === 'about' && (
            <div className="space-y-8">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-xl font-serif text-white">Identity, Skills & Cyber Security</h3>
                <p className="text-xs font-mono text-neutral-400 mt-1">
                  Manage the core Vibe Coder identity statement, stats, skills stack, and ethical hacking credentials.
                </p>
              </div>

              {/* CORE IDENTITY QUOTE BLOCK */}
              <div className="p-6 bg-neutral-950 border border-white/15 rounded-sm space-y-4">
                <h4 className="text-xs font-mono text-[#d4af37] uppercase tracking-wider">
                  Massive Core Identity Quote Block
                </h4>
                <div>
                  <label className="text-[11px] font-mono text-neutral-400 block mb-1 uppercase">Quote Text</label>
                  <textarea
                    rows={2}
                    value={currentContent.about.quote}
                    onChange={(e) => updateAboutField('quote', e.target.value)}
                    className="w-full bg-black border border-white/20 rounded-sm p-3 text-sm text-white font-serif focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-neutral-400 block mb-1 uppercase">Attribution</label>
                  <input
                    type="text"
                    value={currentContent.about.quoteAuthor}
                    onChange={(e) => updateAboutField('quoteAuthor', e.target.value)}
                    className="w-full bg-black border border-white/20 rounded-sm px-3 py-1.5 text-xs text-white font-mono focus:border-white focus:outline-none"
                  />
                </div>
              </div>

              {/* 3 Stats Editor */}
              <div>
                <h4 className="text-xs font-mono text-[#d4af37] uppercase tracking-wider mb-4">
                  Key Quantitative Statistics
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {currentContent.about.stats.map((stat, idx) => (
                    <div key={idx} className="p-4 bg-neutral-950 border border-white/10 rounded-sm space-y-3">
                      <span className="text-[10px] font-mono text-neutral-500 uppercase block">STAT 0{idx + 1}</span>
                      <div>
                        <label className="text-[11px] font-mono text-neutral-400 block mb-1">Number / Value</label>
                        <input
                          type="text"
                          value={stat.value}
                          onChange={(e) => updateAboutStat(idx, 'value', e.target.value)}
                          className="w-full bg-black border border-white/20 rounded-sm px-3 py-1.5 text-lg font-light text-white font-mono focus:border-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-mono text-neutral-400 block mb-1">Uppercase Label</label>
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => updateAboutStat(idx, 'label', e.target.value)}
                          className="w-full bg-black border border-white/20 rounded-sm px-3 py-1.5 text-xs text-neutral-300 font-mono focus:border-white focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills & Systems Built */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/10">
                <div className="space-y-3">
                  <label className="text-xs font-mono text-[#d4af37] block uppercase tracking-wider">
                    Core Tech Stack (Comma Separated)
                  </label>
                  <textarea
                    rows={4}
                    value={currentContent.about.skills?.join(', ') || ''}
                    onChange={(e) =>
                      updateAboutField(
                        'skills',
                        e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                      )
                    }
                    className="w-full bg-neutral-950 border border-white/15 rounded-sm p-3 text-xs text-white font-mono focus:border-white focus:outline-none"
                  />
                  <p className="text-[10px] text-neutral-500 font-mono">
                    e.g. JavaScript, TypeScript, Tailwind CSS, React, Next.js, Game App Development
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-mono text-[#d4af37] block uppercase tracking-wider">
                    Production Systems Built (Comma Separated)
                  </label>
                  <textarea
                    rows={4}
                    value={currentContent.about.systemsBuilt?.join(', ') || ''}
                    onChange={(e) =>
                      updateAboutField(
                        'systemsBuilt',
                        e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                      )
                    }
                    className="w-full bg-neutral-950 border border-white/15 rounded-sm p-3 text-xs text-white font-mono focus:border-white focus:outline-none"
                  />
                  <p className="text-[10px] text-neutral-500 font-mono">
                    e.g. Blog, Education, Business, Cafe, Online Business, E-Commerce, ERP Websites
                  </p>
                </div>
              </div>

              {/* Cyber Security & Ethical Hacking */}
              <div className="p-6 bg-neutral-950 border border-white/15 rounded-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#25D366]" />
                  <h4 className="text-xs font-mono text-[#25D366] uppercase tracking-wider">
                    Cyber Security & Ethical Hacking Configuration
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono text-neutral-400 block mb-1 uppercase">Title</label>
                    <input
                      type="text"
                      value={currentContent.about.cyberSecurity?.title || ''}
                      onChange={(e) =>
                        updateAboutField('cyberSecurity', {
                          ...currentContent.about.cyberSecurity,
                          title: e.target.value,
                        })
                      }
                      className="w-full bg-black border border-white/20 rounded-sm px-3 py-1.5 text-xs text-white focus:border-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-neutral-400 block mb-1 uppercase">Subtitle</label>
                    <input
                      type="text"
                      value={currentContent.about.cyberSecurity?.subtitle || ''}
                      onChange={(e) =>
                        updateAboutField('cyberSecurity', {
                          ...currentContent.about.cyberSecurity,
                          subtitle: e.target.value,
                        })
                      }
                      className="w-full bg-black border border-white/20 rounded-sm px-3 py-1.5 text-xs text-white focus:border-white focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-neutral-400 block mb-1 uppercase">Description</label>
                  <textarea
                    rows={2}
                    value={currentContent.about.cyberSecurity?.description || ''}
                    onChange={(e) =>
                      updateAboutField('cyberSecurity', {
                        ...currentContent.about.cyberSecurity,
                        description: e.target.value,
                      })
                    }
                    className="w-full bg-black border border-white/20 rounded-sm p-3 text-xs text-white focus:border-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-neutral-400 block mb-1 uppercase">
                    Security Domains (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={currentContent.about.cyberSecurity?.domains?.join(', ') || ''}
                    onChange={(e) =>
                      updateAboutField('cyberSecurity', {
                        ...currentContent.about.cyberSecurity,
                        domains: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full bg-black border border-white/20 rounded-sm px-3 py-1.5 text-xs text-white font-mono focus:border-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Bio Narrative */}
              <div className="space-y-4 pt-6 border-t border-white/10">
                <label className="text-xs font-mono text-neutral-400 block uppercase">Bio Statement</label>
                <textarea
                  rows={4}
                  value={currentContent.about.bio}
                  onChange={(e) => updateAboutField('bio', e.target.value)}
                  className="w-full bg-neutral-950 border border-white/15 rounded-sm p-4 text-sm text-white focus:border-white focus:outline-none leading-relaxed"
                />
              </div>

              {/* Unselling Copy */}
              <div className="space-y-4 pt-6 border-t border-white/10">
                <label className="text-xs font-mono text-neutral-400 block uppercase">Aggressive Unselling Copy</label>
                <textarea
                  rows={3}
                  value={currentContent.about.unsellingCopy || ''}
                  onChange={(e) => updateAboutField('unsellingCopy', e.target.value)}
                  className="w-full bg-neutral-950 border border-white/15 rounded-sm p-4 text-sm text-white focus:border-white focus:outline-none leading-relaxed"
                  placeholder="e.g. My minimum engagement starts high because the ROI I deliver is exponential..."
                />
              </div>
            </div>
          )}

          {/* TAB 3: WORK PROJECTS (WITH FILE UPLOADS, LIVE URL, YOUTUBE VIDEO) */}
          {activeTab === 'projects' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-xl font-serif text-white">Selected Works & Architecture Projects</h3>
                  <p className="text-xs font-mono text-neutral-400 mt-1">
                    Manage project images, device uploads, Live URLs, YouTube videos, and 3-part framework descriptions.
                  </p>
                </div>
                <button
                  onClick={addNewProject}
                  className="flex items-center gap-2 px-4 py-2 rounded-sm bg-white text-black text-xs font-mono uppercase tracking-wider font-semibold hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </button>
              </div>

              <div className="space-y-8">
                {currentContent.projects.map((proj, pIdx) => (
                  <div
                    key={proj.id || pIdx}
                    className="p-6 bg-neutral-950 border border-white/15 rounded-sm space-y-6"
                  >
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-[#d4af37] font-semibold">{proj.index}</span>
                        <h4 className="text-lg font-serif text-white">{proj.title}</h4>
                        <span className="text-xs text-neutral-500 font-mono">({proj.tag})</span>
                      </div>
                      <button
                        onClick={() => deleteProject(pIdx)}
                        className="p-1.5 rounded-sm text-neutral-400 hover:text-red-400 hover:bg-red-950/20 transition-colors cursor-pointer"
                        title="Delete this project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* DIRECT FILE UPLOAD & PREVIEW FOR PROJECT */}
                    <div className="p-4 bg-black/60 border border-white/10 rounded-sm space-y-3">
                      <label className="text-xs font-mono text-[#d4af37] block uppercase tracking-wider">
                        Upload Photo/Video from device or paste URL
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <div className="w-full aspect-video bg-neutral-900 border border-white/10 rounded-sm overflow-hidden flex items-center justify-center relative">
                          {proj.image ? (
                            <img
                              src={proj.image}
                              alt={proj.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xs text-neutral-600 font-mono">No Image</span>
                          )}
                        </div>
                        <div className="md:col-span-3 space-y-2">
                          <label className="flex items-center gap-2 px-3 py-2 bg-neutral-950 border border-dashed border-white/25 hover:border-white rounded-sm cursor-pointer text-xs font-mono text-neutral-300 w-full sm:w-auto inline-flex">
                            <Upload className="w-3.5 h-3.5 text-[#d4af37]" />
                            <span>Select file from device (image/video)...</span>
                            <input
                              type="file"
                              accept="image/*,video/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleDeviceFileUpload(file, (dataUrl) => {
                                    updateProjectField(pIdx, 'image', dataUrl);
                                  });
                                }
                              }}
                            />
                          </label>
                          <input
                            type="text"
                            value={proj.image}
                            onChange={(e) => updateProjectField(pIdx, 'image', e.target.value)}
                            placeholder="Or enter image URL (/project1.jpg or https://...)"
                            className="w-full bg-black border border-white/20 rounded-sm px-3 py-1.5 text-xs text-white font-mono focus:border-white focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* DEDICATED INPUTS: LIVE PROJECT URL & YOUTUBE VIDEO URL */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-neutral-900/60 border border-white/10 rounded-sm">
                      <div>
                        <label className="text-xs font-mono text-white block mb-1 uppercase flex items-center gap-2">
                          <ExternalLink className="w-3.5 h-3.5 text-[#25D366]" />
                          <span>Live Project URL</span>
                        </label>
                        <input
                          type="text"
                          value={proj.liveUrl || ''}
                          onChange={(e) => updateProjectField(pIdx, 'liveUrl', e.target.value)}
                          placeholder="e.g. https://heytube.demo.site (Leave empty to hide button)"
                          className="w-full bg-black border border-white/20 rounded-sm px-3 py-2 text-xs text-white font-mono focus:border-white focus:outline-none"
                        />
                        <p className="text-[10px] text-neutral-500 font-mono mt-1">
                          When populated, renders the &quot;View Live Site ↗&quot; button on frontend.
                        </p>
                      </div>

                      <div>
                        <label className="text-xs font-mono text-white block mb-1 uppercase flex items-center gap-2">
                          <Play className="w-3.5 h-3.5 text-red-500" />
                          <span>YouTube Video URL</span>
                        </label>
                        <input
                          type="text"
                          value={proj.youtubeUrl || ''}
                          onChange={(e) => updateProjectField(pIdx, 'youtubeUrl', e.target.value)}
                          placeholder="e.g. https://www.youtube.com/watch?v=..."
                          className="w-full bg-black border border-white/20 rounded-sm px-3 py-2 text-xs text-white font-mono focus:border-white focus:outline-none"
                        />
                        <p className="text-[10px] text-neutral-500 font-mono mt-1">
                          When provided, embeds a responsive video player in place of static image.
                        </p>
                      </div>
                    </div>

                    {/* Basic Meta */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="text-xs font-mono text-neutral-400 block mb-1 uppercase">Title</label>
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => updateProjectField(pIdx, 'title', e.target.value)}
                          className="w-full bg-black border border-white/20 rounded-sm px-3 py-1.5 text-sm text-white focus:border-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-mono text-neutral-400 block mb-1 uppercase">Subtitle</label>
                        <input
                          type="text"
                          value={proj.subtitle}
                          onChange={(e) => updateProjectField(pIdx, 'subtitle', e.target.value)}
                          className="w-full bg-black border border-white/20 rounded-sm px-3 py-1.5 text-sm text-white focus:border-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-mono text-neutral-400 block mb-1 uppercase">Tag / Category</label>
                        <input
                          type="text"
                          value={proj.tag}
                          onChange={(e) => updateProjectField(pIdx, 'tag', e.target.value)}
                          className="w-full bg-black border border-white/20 rounded-sm px-3 py-1.5 text-sm text-white focus:border-white focus:outline-none font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-mono text-neutral-400 block mb-1 uppercase">Description</label>
                      <textarea
                        rows={2}
                        value={proj.description}
                        onChange={(e) => updateProjectField(pIdx, 'description', e.target.value)}
                        className="w-full bg-black border border-white/20 rounded-sm p-3 text-sm text-white focus:border-white focus:outline-none leading-relaxed"
                      />
                    </div>

                    {/* 3-Part Framework Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-black/60 border border-white/10 rounded-sm">
                      <div>
                        <label className="text-[11px] font-mono text-[#d4af37] block mb-1 uppercase">01. Problem</label>
                        <textarea
                          rows={3}
                          value={proj.problem}
                          onChange={(e) => updateProjectField(pIdx, 'problem', e.target.value)}
                          className="w-full bg-neutral-950 border border-white/15 rounded-sm p-2 text-xs text-neutral-300 focus:border-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-mono text-neutral-300 block mb-1 uppercase">02. Solution</label>
                        <textarea
                          rows={3}
                          value={proj.solution}
                          onChange={(e) => updateProjectField(pIdx, 'solution', e.target.value)}
                          className="w-full bg-neutral-950 border border-white/15 rounded-sm p-2 text-xs text-neutral-300 focus:border-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-mono text-white block mb-1 uppercase">03. Benefit</label>
                        <textarea
                          rows={3}
                          value={proj.benefit}
                          onChange={(e) => updateProjectField(pIdx, 'benefit', e.target.value)}
                          className="w-full bg-neutral-950 border border-white/15 rounded-sm p-2 text-xs text-neutral-300 focus:border-white focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Tech Stack */}
                    <div>
                      <label className="text-xs font-mono text-neutral-400 block mb-1 uppercase">
                        Tech Stack (Comma Separated)
                      </label>
                      <input
                        type="text"
                        value={proj.stack?.join(', ') || ''}
                        onChange={(e) =>
                          updateProjectField(
                            pIdx,
                            'stack',
                            e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                          )
                        }
                        className="w-full bg-black border border-white/20 rounded-sm px-3 py-1.5 text-xs text-white font-mono focus:border-white focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: EXPERIENCE */}
          {activeTab === 'experience' && (
            <div className="space-y-8">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-xl font-serif text-white">Experience Timeline</h3>
                <p className="text-xs font-mono text-neutral-400 mt-1">
                  Chronological progression of engineering milestones and leadership.
                </p>
              </div>

              <div className="space-y-6">
                {currentContent.experience.map((exp, eIdx) => (
                  <div key={eIdx} className="p-6 bg-neutral-950 border border-white/10 rounded-sm space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="text-xs font-mono text-neutral-400 block mb-1 uppercase">Year / Tag</label>
                        <input
                          type="text"
                          value={exp.year}
                          onChange={(e) => {
                            const newExp = [...currentContent.experience];
                            newExp[eIdx] = { ...newExp[eIdx], year: e.target.value };
                            setDataStore((prev) => ({
                              ...prev,
                              [activeLocale]: {
                                ...prev[activeLocale],
                                experience: newExp,
                              },
                            }));
                          }}
                          className="w-full bg-black border border-white/20 rounded-sm px-3 py-1.5 text-sm text-[#d4af37] font-mono focus:border-white focus:outline-none"
                        />
                      </div>

                      <div className="md:col-span-3">
                        <label className="text-xs font-mono text-neutral-400 block mb-1 uppercase">Title / Role</label>
                        <input
                          type="text"
                          value={exp.title}
                          onChange={(e) => {
                            const newExp = [...currentContent.experience];
                            newExp[eIdx] = { ...newExp[eIdx], title: e.target.value };
                            setDataStore((prev) => ({
                              ...prev,
                              [activeLocale]: {
                                ...prev[activeLocale],
                                experience: newExp,
                              },
                            }));
                          }}
                          className="w-full bg-black border border-white/20 rounded-sm px-3 py-1.5 text-sm text-white focus:border-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-mono text-neutral-400 block mb-1 uppercase">Description</label>
                      <textarea
                        rows={2}
                        value={exp.description}
                        onChange={(e) => {
                          const newExp = [...currentContent.experience];
                          newExp[eIdx] = { ...newExp[eIdx], description: e.target.value };
                          setDataStore((prev) => ({
                            ...prev,
                            [activeLocale]: {
                              ...prev[activeLocale],
                              experience: newExp,
                            },
                          }));
                        }}
                        className="w-full bg-black border border-white/20 rounded-sm p-3 text-sm text-neutral-300 focus:border-white focus:outline-none leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SOCIAL & WHATSAPP (+8801934885834) */}
          {activeTab === 'social' && (
            <div className="space-y-8">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-xl font-serif text-white">Social Media & Direct Contact Channels</h3>
                <p className="text-xs font-mono text-neutral-400 mt-1">
                  Global direct contact links applied across both English and Bengali pages.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-2 uppercase flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#25D366]"></span>
                    <span>WhatsApp Direct Link (+8801934885834)</span>
                  </label>
                  <input
                    type="text"
                    value={dataStore.en.socialLinks.whatsapp}
                    onChange={(e) => updateSocialLink('whatsapp', e.target.value)}
                    className="w-full bg-neutral-950 border border-white/15 rounded-sm px-4 py-2 text-sm text-white font-mono focus:border-white focus:outline-none"
                  />
                  <p className="text-[10px] text-neutral-500 font-mono mt-1">Direct: https://wa.me/8801934885834</p>
                </div>

                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-2 uppercase">Email Address / mailto:</label>
                  <input
                    type="text"
                    value={dataStore.en.socialLinks.email}
                    onChange={(e) => updateSocialLink('email', e.target.value)}
                    className="w-full bg-neutral-950 border border-white/15 rounded-sm px-4 py-2 text-sm text-white font-mono focus:border-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-2 uppercase">LinkedIn Profile URL</label>
                  <input
                    type="text"
                    value={dataStore.en.socialLinks.linkedin}
                    onChange={(e) => updateSocialLink('linkedin', e.target.value)}
                    className="w-full bg-neutral-950 border border-white/15 rounded-sm px-4 py-2 text-sm text-white font-mono focus:border-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-2 uppercase">GitHub Profile URL</label>
                  <input
                    type="text"
                    value={dataStore.en.socialLinks.github}
                    onChange={(e) => updateSocialLink('github', e.target.value)}
                    className="w-full bg-neutral-950 border border-white/15 rounded-sm px-4 py-2 text-sm text-white font-mono focus:border-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-2 uppercase">Instagram Profile URL</label>
                  <input
                    type="text"
                    value={dataStore.en.socialLinks.instagram}
                    onChange={(e) => updateSocialLink('instagram', e.target.value)}
                    className="w-full bg-neutral-950 border border-white/15 rounded-sm px-4 py-2 text-sm text-white font-mono focus:border-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-2 uppercase">Facebook Profile URL</label>
                  <input
                    type="text"
                    value={dataStore.en.socialLinks.facebook}
                    onChange={(e) => updateSocialLink('facebook', e.target.value)}
                    className="w-full bg-neutral-950 border border-white/15 rounded-sm px-4 py-2 text-sm text-white font-mono focus:border-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-2 uppercase">TikTok Profile URL</label>
                  <input
                    type="text"
                    value={dataStore.en.socialLinks.tiktok}
                    onChange={(e) => updateSocialLink('tiktok', e.target.value)}
                    className="w-full bg-neutral-950 border border-white/15 rounded-sm px-4 py-2 text-sm text-white font-mono focus:border-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono text-xs">
          Loading Control Terminal...
        </div>
      }
    >
      <AdminContent />
    </Suspense>
  );
}
