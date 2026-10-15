'use client';

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { TERMINAL_LABS } from '@/data/labs';
import { TerminalLabScenario } from '@/types';
import { useProgress } from '@/context/ProgressContext';
import { Terminal, CheckCircle2, AlertCircle, HelpCircle, RotateCcw, ArrowRight, Sparkles, Send } from 'lucide-react';

interface TerminalLogEntry {
  type: 'prompt' | 'output' | 'error' | 'success' | 'system';
  text: string;
}

export function TerminalSimulator({ initialScenarioId }: { initialScenarioId?: string }) {
  const { markLabCompleted, isLabCompleted } = useProgress();

  const [activeScenario, setActiveScenario] = useState<TerminalLabScenario>(() => {
    return TERMINAL_LABS.find((s) => s.id === initialScenarioId) || TERMINAL_LABS[0];
  });

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [commandInput, setCommandInput] = useState('');
  const [logs, setLogs] = useState<TerminalLogEntry[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [showHint, setShowHint] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize or switch scenario
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsFinished(false);
    setShowHint(false);
    setCommandInput('');
    setLogs([
      {
        type: 'system',
        text: `NetSecForge CLI Sandbox [Version 2.6.4-sec]\nConnected to: ${activeScenario.category} virtual environment.\nType your configuration commands below to achieve scenario objectives.`,
      },
    ]);
  }, [activeScenario]);

  // Scroll to bottom on new logs
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const currentStep = activeScenario.steps[currentStepIndex];

  const handleCommandSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cmd = commandInput.trim();
    if (!cmd) return;

    // Add to history
    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);

    // Prompt log
    const promptPrefix = activeScenario.initialPrompt;
    const newLogs: TerminalLogEntry[] = [
      ...logs,
      { type: 'prompt', text: `${promptPrefix} ${cmd}` },
    ];

    if (!currentStep) return;

    // Validate command
    const pattern = currentStep.expectedPattern;
    const isValid = typeof pattern === 'string' ? cmd === pattern : pattern.test(cmd);

    if (isValid) {
      newLogs.push({
        type: 'output',
        text: currentStep.simulatedOutput,
      });
      newLogs.push({
        type: 'success',
        text: `[✓ STEP ${currentStep.stepNumber} VERIFIED] ${currentStep.explanation}`,
      });

      if (currentStepIndex + 1 < activeScenario.steps.length) {
        setCurrentStepIndex((prev) => prev + 1);
        setShowHint(false);
      } else {
        // Lab Completed!
        setIsFinished(true);
        markLabCompleted(activeScenario.id);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        newLogs.push({
          type: 'success',
          text: `🎉 LAB COMPLETED! You have successfully mastered all objectives for "${activeScenario.title}".`,
        });
      }
    } else {
      newLogs.push({
        type: 'error',
        text: `% Invalid input detected or syntax requirement not met for current objective.\nHint: Click "Need Hint?" below or check command flags.`,
      });
    }

    setLogs(newLogs);
    setCommandInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIdx = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setCommandInput(commandHistory[nextIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx < commandHistory.length) {
        setHistoryIndex(nextIdx);
        setCommandInput(commandHistory[nextIdx]);
      } else {
        setHistoryIndex(-1);
        setCommandInput('');
      }
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsFinished(false);
    setShowHint(false);
    setCommandInput('');
    setLogs([
      {
        type: 'system',
        text: `Terminal reset. Re-initialized scenario: ${activeScenario.title}`,
      },
    ]);
  };

  const handleAutoFillHint = () => {
    if (!currentStep) return;
    setCommandInput(currentStep.hint);
    inputRef.current?.focus();
  };

  return (
    <div className="w-full bg-[#080d18] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Scenario Navigation Tabs */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#060a12] border-b border-slate-800 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-white uppercase font-mono tracking-wider">
            Terminal Sandbox:
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {TERMINAL_LABS.map((lab) => {
            const completed = isLabCompleted(lab.id);
            return (
              <button
                key={lab.id}
                onClick={() => setActiveScenario(lab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeScenario.id === lab.id
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_12px_-2px_rgba(16,185,129,0.3)]'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <span>{lab.vendorBadge}</span>
                {completed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scenario Briefing & Objective Banner */}
      <div className="p-4 bg-[#0a1120] border-b border-slate-800 space-y-3">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-bold text-white">{activeScenario.title}</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-cyan-300 border border-slate-700">
                {activeScenario.difficulty}
              </span>
            </div>
            <p className="text-xs text-slate-400">{activeScenario.scenarioDescription}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Lab
            </button>
          </div>
        </div>

        {/* Current Step Target Box */}
        {currentStep && !isFinished ? (
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700/80 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold uppercase">
                  Step {currentStep.stepNumber} of {activeScenario.steps.length}
                </span>
                <span className="text-xs font-semibold text-slate-200">
                  {currentStep.instruction}
                </span>
              </div>
              {showHint && (
                <div className="text-xs text-amber-300 font-mono bg-amber-950/40 p-2 rounded border border-amber-800/40 flex items-center justify-between gap-2 animate-in fade-in">
                  <span>💡 Hint: {currentStep.hint}</span>
                  <button
                    onClick={handleAutoFillHint}
                    className="text-[11px] underline hover:text-amber-200 shrink-0 cursor-pointer"
                  >
                    Insert command
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-amber-300 shrink-0 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              {showHint ? 'Hide Hint' : 'Need Hint?'}
            </button>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold">All steps completed for this scenario!</span>
            </div>
            <button
              onClick={handleReset}
              className="underline text-emerald-200 hover:text-white"
            >
              Practice Again
            </button>
          </div>
        )}
      </div>

      {/* Terminal Window Header (Mac / Linux Traffic Lights) */}
      <div className="px-4 py-2 bg-[#050810] border-b border-slate-800 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          <span className="ml-2 font-mono text-[11px] text-slate-400">
            netsec@sandbox: ~/{activeScenario.category.toLowerCase().replace(/[\s/]/g, '-')}
          </span>
        </div>
        <span className="font-mono text-[10px] text-slate-600">xterm.js emulation</span>
      </div>

      {/* Terminal Output Console */}
      <div
        onClick={() => inputRef.current?.focus()}
        className="p-4 bg-[#03060c] font-mono text-xs text-slate-200 h-80 overflow-y-auto space-y-1.5 cursor-text scanline"
      >
        {logs.map((log, index) => {
          if (log.type === 'system') {
            return (
              <div key={index} className="text-slate-500 whitespace-pre-wrap leading-relaxed">
                {log.text}
              </div>
            );
          }
          if (log.type === 'prompt') {
            return (
              <div key={index} className="text-cyan-300 font-semibold">
                {log.text}
              </div>
            );
          }
          if (log.type === 'success') {
            return (
              <div key={index} className="text-emerald-400 font-medium">
                {log.text}
              </div>
            );
          }
          if (log.type === 'error') {
            return (
              <div key={index} className="text-rose-400">
                {log.text}
              </div>
            );
          }
          return (
            <div key={index} className="text-slate-300 whitespace-pre-wrap">
              {log.text}
            </div>
          );
        })}
        <div ref={terminalEndRef} />
      </div>

      {/* Interactive Command Input Form */}
      <form
        onSubmit={handleCommandSubmit}
        className="flex items-center px-4 py-3 bg-[#060a12] border-t border-slate-800 gap-3"
      >
        <span className="text-xs font-mono text-cyan-400 font-bold shrink-0">
          {activeScenario.initialPrompt}
        </span>
        <input
          ref={inputRef}
          type="text"
          value={commandInput}
          onChange={(e) => setCommandInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isFinished ? 'Scenario completed. Click Reset to retry.' : 'Type command here... (Press Enter or Send)'}
          disabled={isFinished}
          className="flex-1 bg-transparent text-slate-100 placeholder-slate-600 font-mono text-xs focus:outline-none disabled:opacity-50"
          autoFocus
        />
        <button
          type="submit"
          disabled={isFinished || !commandInput.trim()}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-semibold font-mono transition-colors cursor-pointer"
        >
          <Send className="w-3 h-3" />
          Execute
        </button>
      </form>
    </div>
  );
}
