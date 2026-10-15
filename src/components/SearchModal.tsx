'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X, BookOpen, Award, Shield, Terminal, AlertTriangle, ArrowRight } from 'lucide-react';
import { getAllSearchItems } from '@/data/search';
import { SearchItem } from '@/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'topic' | 'command' | 'cve' | 'cert' | 'product'>('all');
  const [results, setResults] = useState<SearchItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const allItems = useRef<SearchItem[]>(getAllSearchItems()).current;

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    let filtered = allItems;
    if (activeFilter !== 'all') {
      filtered = filtered.filter((item) => item.type === activeFilter);
    }
    if (!query.trim()) {
      setResults(filtered.slice(0, 8));
      return;
    }

    const q = query.toLowerCase().trim();
    const scored = filtered.filter((item) => {
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.tags.some((tag) => tag.includes(q))
      );
    });
    setResults(scored.slice(0, 15));
  }, [query, activeFilter, allItems]);

  if (!isOpen) return null;

  const getIcon = (type: SearchItem['type']) => {
    switch (type) {
      case 'topic':
        return <BookOpen className="w-4 h-4 text-cyan-400" />;
      case 'cert':
        return <Award className="w-4 h-4 text-emerald-400" />;
      case 'product':
        return <Shield className="w-4 h-4 text-purple-400" />;
      case 'command':
        return <Terminal className="w-4 h-4 text-amber-400" />;
      case 'cve':
        return <AlertTriangle className="w-4 h-4 text-rose-400" />;
    }
  };

  const getBadgeColor = (type: SearchItem['type']) => {
    switch (type) {
      case 'topic':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'cert':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'product':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'command':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'cve':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-2xl bg-[#0c121e] border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-800 bg-[#080c14]">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search protocols (OSPF, BGP), CVEs, vendor syntax (PAN-OS, Cisco), or certs..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-200 p-1 mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs text-slate-400 bg-slate-800 border border-slate-700 rounded font-mono">
            ESC
          </kbd>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 px-4 py-2 bg-[#0a0f1a] border-b border-slate-800/80 overflow-x-auto text-xs">
          {(
            [
              { id: 'all', label: 'All Results' },
              { id: 'topic', label: 'Lessons' },
              { id: 'command', label: 'CLI Commands' },
              { id: 'cve', label: 'CVEs & Exploits' },
              { id: 'cert', label: 'Certifications' },
              { id: 'product', label: 'Enterprise Tools' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                activeFilter === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 font-medium border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-1 divide-y divide-slate-800/40">
          {results.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No matching security topics, CVEs, or commands found for &quot;{query}&quot;.
            </div>
          ) : (
            results.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={onClose}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-800/60 transition-colors group"
              >
                <div className="mt-0.5 p-2 rounded-md bg-slate-900 border border-slate-800 shrink-0">
                  {getIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">
                      {item.title}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded border uppercase tracking-wider font-mono ${getBadgeColor(
                        item.type
                      )}`}
                    >
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{item.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 shrink-0 mt-2 transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-[#080c14] text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Navigation:</span>
            <kbd className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-[10px]">↑</kbd>
            <kbd className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-[10px]">↓</kbd>
            <span>to cycle</span>
          </div>
          <span>NetSecForge Index: 40+ Topics, 12 Certs, 10 Tools</span>
        </div>
      </div>
    </div>
  );
}
