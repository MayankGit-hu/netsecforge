'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Terminal, Map, BookOpen, Award, Layers, Search, Menu, X, Cpu } from 'lucide-react';
import { useProgress } from '@/context/ProgressContext';
import { SearchModal } from './SearchModal';

export function Navbar() {
  const pathname = usePathname();
  const { getOverallProgress } = useProgress();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { completedCount, totalCount, percent } = getOverallProgress();

  // Listen for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { href: '/roadmap', label: 'Roadmap', icon: Map },
    { href: '/knowledge', label: 'Knowledge Base', icon: BookOpen },
    { href: '/products', label: 'Enterprise Tools', icon: Layers },
    { href: '/certs', label: 'Cert Engine', icon: Award },
    { href: '/labs', label: 'Interactive Labs', icon: Terminal },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#080c14]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Status */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative p-2 rounded-lg bg-slate-900 border border-slate-800 group-hover:border-cyan-500/50 group-hover:shadow-[0_0_15px_-3px_rgba(6,182,212,0.4)] transition-all">
              <Shield className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                  NetSec<span className="text-cyan-400">Forge</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/50 text-cyan-300">
                  v2.6
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono hidden sm:block">Zero-to-Expert Cyber Lab</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    active
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_-3px_rgba(6,182,212,0.3)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Search & Progress Pill */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-xs transition-colors group cursor-pointer"
              title="Search topics, CVEs, vendor commands (Cmd+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 rounded border border-slate-700">
                ⌘K
              </kbd>
            </button>

            {/* User Curriculum Progress Badge */}
            <Link
              href="/certs"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#0e1524] border border-slate-800 hover:border-emerald-500/40 transition-colors group"
              title="View Certification Readiness & Progress"
            >
              <div className="relative w-4 h-4 flex items-center justify-center">
                <Cpu className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-45 transition-transform" />
              </div>
              <div className="text-right hidden sm:block">
                <span className="block text-[11px] font-semibold text-slate-200 leading-none">
                  {percent}%
                </span>
                <span className="text-[9px] text-slate-400 font-mono leading-none">
                  {completedCount}/{totalCount}
                </span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded-lg md:hidden text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-[#080c14] px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
                    active
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Global Search Dialog */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
