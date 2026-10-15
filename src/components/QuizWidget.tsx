'use client';

import React, { useState } from 'react';
import { QuizQuestion } from '@/types';
import { CheckCircle2, XCircle, HelpCircle, RefreshCw } from 'lucide-react';

interface QuizProps {
  questions: QuizQuestion[];
}

export function QuizWidget({ questions }: QuizProps) {
  const [current, setCurrent]     = useState(0);
  const [selected, setSelected]   = useState<number | null>(null);
  const [revealed, setRevealed]   = useState(false);
  const [score, setScore]         = useState(0);
  const [finished, setFinished]   = useState(false);

  const q = questions[current];

  function handleSelect(idx: number) {
    if (revealed) return;
    setSelected(idx);
    setRevealed(true);
    if (idx === q.correctIndex) setScore((s) => s + 1);
  }

  function handleNext() {
    if (current + 1 >= questions.length) {
      setFinished(true);
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
    setRevealed(false);
  }

  function reset() {
    setCurrent(0);
    setSelected(null);
    setRevealed(false);
    setScore(0);
    setFinished(false);
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    const pass = pct >= 70;
    return (
      <div className="p-6 rounded-2xl border border-slate-800 bg-[#090e1a] text-center space-y-4">
        <div className={`text-5xl font-black ${pass ? 'text-emerald-400' : 'text-rose-400'}`}>
          {pct}%
        </div>
        <p className="text-sm text-slate-300 font-semibold">
          {score}/{questions.length} correct — {pass ? '🎉 Great work!' : '📖 Review the material and try again'}
        </p>
        <button
          onClick={reset}
          className="flex items-center gap-2 mx-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Retry Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
        <span>Question {current + 1} of {questions.length}</span>
        <span className="text-emerald-400">{score} correct</span>
      </div>
      <div className="h-1 rounded-full bg-slate-800">
        <div
          className="h-1 rounded-full bg-cyan-500 transition-all"
          style={{ width: `${((current) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="p-5 rounded-2xl bg-[#080d18] border border-slate-800 space-y-4">
        <div className="flex items-start gap-2">
          <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <p className="text-sm font-semibold text-white leading-relaxed">{q.question}</p>
        </div>

        {/* Options */}
        <div className="space-y-2">
          {q.options.map((opt, idx) => {
            let style = 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-600 hover:text-white';
            if (revealed) {
              if (idx === q.correctIndex) {
                style = 'border-emerald-500/60 bg-emerald-950/30 text-emerald-300';
              } else if (idx === selected && idx !== q.correctIndex) {
                style = 'border-rose-500/60 bg-rose-950/30 text-rose-300';
              } else {
                style = 'border-slate-800 bg-slate-900/40 text-slate-500';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={revealed}
                className={`w-full text-left px-4 py-3 rounded-xl border text-xs font-medium transition-all flex items-center gap-3 cursor-pointer disabled:cursor-default ${style}`}
              >
                <span className="shrink-0 w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-bold">
                  {String.fromCharCode(65 + idx)}
                </span>
                {opt}
                {revealed && idx === q.correctIndex && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-auto shrink-0" />
                )}
                {revealed && idx === selected && idx !== q.correctIndex && (
                  <XCircle className="w-4 h-4 text-rose-400 ml-auto shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {revealed && (
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-slate-300 leading-relaxed">
            <span className="font-bold text-cyan-400">Explanation: </span>
            {q.explanation}
          </div>
        )}
      </div>

      {revealed && (
        <button
          onClick={handleNext}
          className="w-full py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all cursor-pointer"
        >
          {current + 1 >= questions.length ? 'See Results →' : 'Next Question →'}
        </button>
      )}
    </div>
  );
}
