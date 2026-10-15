'use client';

import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  Shield,
  Zap,
  Info,
  CheckCircle2,
  AlertTriangle,
  Send,
  Download,
  Gauge,
  HelpCircle,
} from 'lucide-react';

interface SegmentItem {
  id: number;
  byteStart: number;
  byteEnd: number;
  label: string;
  status: 'acked' | 'in-flight' | 'usable' | 'blocked';
  isDropped?: boolean;
  isSacked?: boolean;
}

export function TcpSlidingWindowSimulator() {
  const TOTAL_SEGMENTS = 10;
  const SEGMENT_SIZE = 1000;

  // Window State
  const [windowSize, setWindowSize] = useState<number>(3); // in segments (3 = 3000 bytes)
  const [sendBase, setSendBase] = useState<number>(0); // segment index of oldest unacked
  const [nextSeq, setNextSeq] = useState<number>(0); // segment index of next to send
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isZeroWindow, setIsZeroWindow] = useState<boolean>(false);
  const [isSackDemo, setIsSackDemo] = useState<boolean>(false);
  const [activeTheoryTab, setActiveTheoryTab] = useState<'basics' | 'flow-vs-congestion' | 'window-scale' | 'silly-window'>('basics');
  const [statusMessage, setStatusMessage] = useState<string>(
    'Ready. Click "Send Segment" or "Auto Play" to watch the sliding window in action.'
  );

  // Generate segments dynamically
  const segments: SegmentItem[] = Array.from({ length: TOTAL_SEGMENTS }, (_, i) => {
    const byteStart = i * SEGMENT_SIZE + 1;
    const byteEnd = (i + 1) * SEGMENT_SIZE;
    const effectiveWindow = isZeroWindow ? 0 : windowSize;

    let status: SegmentItem['status'] = 'blocked';
    if (i < sendBase) {
      status = 'acked';
    } else if (i < nextSeq) {
      status = 'in-flight';
    } else if (i < sendBase + effectiveWindow) {
      status = 'usable';
    } else {
      status = 'blocked';
    }

    const isDropped = isSackDemo && i === 2 && status === 'in-flight';
    const isSacked = isSackDemo && (i === 3 || i === 4) && status === 'in-flight';

    return {
      id: i,
      byteStart,
      byteEnd,
      label: `Seg ${i + 1} (${byteStart}-${byteEnd}B)`,
      status,
      isDropped,
      isSacked,
    };
  });

  // Auto-play loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setTimeout(() => {
        const effectiveWindow = isZeroWindow ? 0 : windowSize;
        // Can we send more?
        if (nextSeq < sendBase + effectiveWindow && nextSeq < TOTAL_SEGMENTS) {
          setNextSeq((prev) => prev + 1);
          setStatusMessage(`Transmitted Segment ${nextSeq + 1} (${(nextSeq * SEGMENT_SIZE) + 1}-${(nextSeq + 1) * SEGMENT_SIZE}B). In-flight awaiting ACK.`);
        } else if (sendBase < nextSeq) {
          // Window full or finished, receive ACK to slide window!
          setSendBase((prev) => prev + 1);
          setStatusMessage(`Received ACK for Segment ${sendBase + 1}. Window slides right by 1000 bytes!`);
        } else if (sendBase >= TOTAL_SEGMENTS) {
          setIsPlaying(false);
          setStatusMessage('All 10,000 bytes successfully transmitted and acknowledged!');
        }
      }, 1400);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, nextSeq, sendBase, windowSize, isZeroWindow]);

  const handleSend = () => {
    const effectiveWindow = isZeroWindow ? 0 : windowSize;
    if (isZeroWindow) {
      setStatusMessage('⚠️ FLOW CONTROL BLOCKED: Receiver advertised Window Size = 0 (Zero Window). Sender pauses all data transmission!');
      return;
    }
    if (nextSeq < sendBase + effectiveWindow && nextSeq < TOTAL_SEGMENTS) {
      setNextSeq((prev) => prev + 1);
      setStatusMessage(
        `Transmitted Segment ${nextSeq + 1} (Bytes ${nextSeq * SEGMENT_SIZE + 1} to ${(nextSeq + 1) * SEGMENT_SIZE}). It is now in-flight on the network.`
      );
    } else {
      setStatusMessage('Window Full! You have reached the advertised receiver window limit. You cannot send more until an ACK arrives.');
    }
  };

  const handleAck = () => {
    if (sendBase < nextSeq) {
      const ackedSeg = sendBase + 1;
      setSendBase((prev) => prev + 1);
      setStatusMessage(
        `Received cumulative ACK for Segment ${ackedSeg}. The left edge of the window slides right, freeing buffer space!`
      );
    } else {
      setStatusMessage('No in-flight segments to acknowledge. Send a segment first.');
    }
  };

  const handleReset = () => {
    setSendBase(0);
    setNextSeq(0);
    setIsPlaying(false);
    setIsZeroWindow(false);
    setIsSackDemo(false);
    setStatusMessage('Simulation reset. Buffer empty and window aligned at Byte 1.');
  };

  const toggleZeroWindow = () => {
    const newZero = !isZeroWindow;
    setIsZeroWindow(newZero);
    if (newZero) {
      setIsPlaying(false);
      setStatusMessage('🛑 ZERO WINDOW SIMULATED: Receiver application buffer is 100% full! Receiver sent "Window Size: 0". Sender pauses and starts Zero Window Probe timer.');
    } else {
      setStatusMessage('✅ WINDOW UPDATE: Receiver application read data from buffer! Advertised Window Size reopened. Sender resumes transmission.');
    }
  };

  const toggleSackDemo = () => {
    setIsSackDemo(!isSackDemo);
    if (!isSackDemo) {
      setSendBase(2);
      setNextSeq(5);
      setStatusMessage('⚡ SACK SIMULATION: Segment 3 was lost! But Segments 4 and 5 arrived safely. Receiver sends SACK blocks [3001-5000]. Sender retransmits ONLY Segment 3 instead of everything!');
    } else {
      handleReset();
    }
  };

  return (
    <div className="rounded-3xl bg-[#070b14] border border-slate-800 shadow-2xl overflow-hidden space-y-6">
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="p-6 bg-[#0a0f1e] border-b border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950/90 border border-emerald-800 text-emerald-300">
              <Gauge className="w-3 h-3 text-emerald-400" />
              TCP FLOW CONTROL ENGINE
            </span>
            <span className="text-xs font-mono text-slate-400">
              Sliding Window & Pipelining Simulator
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            TCP Sliding Window & Flow Control Simulator
          </h2>
          <p className="text-xs text-slate-400">
            Understand how TCP transmits multiple packets without waiting, slides the window on ACKs, and prevents receiver buffer overflow.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950" />}
            {isPlaying ? 'Pause' : 'Auto Play'}
          </button>

          <button
            onClick={handleSend}
            disabled={isPlaying || nextSeq >= sendBase + (isZeroWindow ? 0 : windowSize) || nextSeq >= TOTAL_SEGMENTS}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 disabled:opacity-30 disabled:pointer-events-none text-xs font-bold font-mono transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            Send Segment
          </button>

          <button
            onClick={handleAck}
            disabled={isPlaying || sendBase >= nextSeq}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 disabled:opacity-30 disabled:pointer-events-none text-xs font-bold font-mono transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Receive ACK (Slide)
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── LIVE WINDOW CONTROLLER BAR ────────────────────────────────────── */}
      <div className="px-6">
        <div className="p-4 rounded-2xl bg-[#090d1a] border border-slate-800 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          {/* Window Size Slider */}
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Advertised Window Size (rwnd):</span>
            <div className="flex items-center gap-1.5">
              {[2, 3, 4, 5].map((w) => (
                <button
                  key={w}
                  onClick={() => {
                    setWindowSize(w);
                    setIsZeroWindow(false);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    windowSize === w && !isZeroWindow
                      ? 'bg-cyan-500 text-slate-950 font-black'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {w * 1000}B ({w} Segs)
                </button>
              ))}
            </div>
          </div>

          {/* Special Condition Toggles */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleZeroWindow}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                isZeroWindow
                  ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {isZeroWindow ? '⚠️ Zero Window (Active)' : 'Simulate Zero Window'}
            </button>

            <button
              onClick={toggleSackDemo}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                isSackDemo
                  ? 'bg-purple-500/20 border-purple-500 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {isSackDemo ? '⚡ SACK Demo (Active)' : 'Simulate SACK & Loss'}
            </button>
          </div>
        </div>
      </div>

      {/* ── THE INTERACTIVE BYTE STREAM & SLIDING WINDOW VISUALIZER ─────────── */}
      <div className="px-6">
        <div className="p-6 rounded-2xl bg-[#090e1c] border border-slate-800 space-y-6">
          {/* Status Alert Banner */}
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-slate-300 font-mono leading-relaxed">{statusMessage}</span>
          </div>

          {/* Color Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-emerald-500/80 border border-emerald-400" />
              <span className="text-slate-300">Sent & ACKed (Buffer Freed)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-amber-500/80 border border-amber-400" />
              <span className="text-slate-300">Sent In-Flight (Awaiting ACK)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-cyan-500/80 border border-cyan-400" />
              <span className="text-slate-300">Usable Window (Can Send Now)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-slate-800 border border-slate-700" />
              <span className="text-slate-400">Outside Window (Blocked)</span>
            </div>
          </div>

          {/* Window Bracket Overlay Indicator */}
          <div className="relative pt-6 pb-2">
            {/* The Actual Segments Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
              {segments.map((seg) => {
                let bgStyle = 'bg-slate-900/60 border-slate-800 text-slate-400';
                let tag = 'BLOCKED';

                if (seg.isDropped) {
                  bgStyle = 'bg-rose-950/70 border-rose-500 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.4)] animate-pulse';
                  tag = 'DROPPED ❌';
                } else if (seg.isSacked) {
                  bgStyle = 'bg-purple-950/70 border-purple-400 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.3)]';
                  tag = 'SACKED (Got)';
                } else if (seg.status === 'acked') {
                  bgStyle = 'bg-emerald-950/60 border-emerald-500/80 text-emerald-300';
                  tag = 'ACKED ✓';
                } else if (seg.status === 'in-flight') {
                  bgStyle = 'bg-amber-950/60 border-amber-500/80 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]';
                  tag = 'IN-FLIGHT ✈️';
                } else if (seg.status === 'usable') {
                  bgStyle = 'bg-cyan-950/60 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.3)]';
                  tag = 'CAN SEND ➔';
                }

                return (
                  <div
                    key={seg.id}
                    className={`p-3 rounded-xl border flex flex-col justify-between transition-all duration-500 h-28 relative ${bgStyle}`}
                  >
                    <div className="text-[10px] font-mono font-bold">{seg.label.split(' ')[0]} {seg.label.split(' ')[1]}</div>
                    <div className="text-[9px] font-mono opacity-80">{seg.byteStart}-{seg.byteEnd}</div>
                    <div className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/40 text-center truncate">
                      {tag}
                    </div>

                    {/* Window Pointer Flags */}
                    {seg.id === sendBase && (
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 px-1.5 py-0.5 rounded bg-cyan-500 text-slate-950 font-black text-[8px] font-mono whitespace-nowrap shadow-md">
                        Base
                      </div>
                    )}
                    {seg.id === nextSeq && (
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[8px] font-mono whitespace-nowrap shadow-md">
                        Next
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mathematical Window Equation Display */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs pt-4 border-t border-slate-800">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Oldest Unacked Byte (sendBase):</span>
              <span className="text-white font-bold text-sm">Byte {(sendBase * SEGMENT_SIZE) + 1}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Next Sequence to Send (nextSeq):</span>
              <span className="text-amber-400 font-bold text-sm">Byte {(nextSeq * SEGMENT_SIZE) + 1}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Right Edge of Usable Window:</span>
              <span className="text-cyan-400 font-bold text-sm">
                Byte {Math.min(TOTAL_SEGMENTS * SEGMENT_SIZE, ((sendBase + (isZeroWindow ? 0 : windowSize)) * SEGMENT_SIZE))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── COMPREHENSIVE THEORY & REAL-WORLD CONCEPTS ──────────────────────── */}
      <div className="px-6 pb-6">
        <div className="p-6 rounded-2xl bg-[#090e1c] border border-slate-800 space-y-5">
          {/* Theory Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3 overflow-x-auto">
            {[
              { id: 'basics', label: '1. How Window Slides' },
              { id: 'flow-vs-congestion', label: '2. Flow (rwnd) vs Congestion (cwnd)' },
              { id: 'window-scale', label: '3. Window Scale (RFC 7323)' },
              { id: 'silly-window', label: '4. Silly Window & Nagle\'s Rule' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTheoryTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTheoryTab === tab.id
                    ? 'bg-cyan-500 text-slate-950'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: How the Window Slides */}
          {activeTheoryTab === 'basics' && (
            <div className="space-y-3 text-xs leading-relaxed text-slate-300">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Info className="w-4 h-4 text-cyan-400" />
                Why Stop-and-Wait is Slow and Pipelining is Fast
              </h3>
              <p>
                In primitive networking (Stop-and-Wait), a sender transmits 1 packet and stops dead in its tracks until an ACK returns. If Round Trip Time (RTT) across the Atlantic is 100 milliseconds, you can only transmit 10 packets per second (~15 KB/s) even on a 10-Gigabit fiber line!
              </p>
              <p>
                <strong>The Solution: The TCP Sliding Window.</strong> TCP allows the sender to transmit multiple packets (the entire Window Size) into the wire simultaneously without waiting for an individual ACK for each. As ACKs trickle back, the left edge of the window slides to the right, unlocking new bytes on the right edge.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-800/40">
                  <div className="font-bold text-cyan-300 mb-1">Cumulative Acknowledgment</div>
                  <p className="text-slate-400 text-[11px]">
                    An ACK for Byte 3001 does NOT just mean "I got segment 3" — it strictly means "I have received every single byte up to 3000 in perfect sequential order; please send byte 3001 next!"
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-800/40">
                  <div className="font-bold text-purple-300 mb-1">Selective ACK (SACK - RFC 2018)</div>
                  <p className="text-slate-400 text-[11px]">
                    If Segment 3 is lost but Segments 4 and 5 arrive, SACK allows the receiver to report: "I have 4 and 5; only retransmit 3!" This prevents wasting bandwidth re-sending data the receiver already buffered.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Flow Control vs Congestion Control */}
          {activeTheoryTab === 'flow-vs-congestion' && (
            <div className="space-y-3 text-xs leading-relaxed text-slate-300">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                Receiver Flow Control (rwnd) vs. Network Congestion Control (cwnd)
              </h3>
              <p>
                A sender must NEVER overwhelm two distinct entities:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-1">
                  <div className="font-bold text-amber-300">1. Receiver Window (rwnd) — Flow Control</div>
                  <p className="text-slate-400 text-[11px]">
                    Protects the <strong>receiving host</strong> (e.g. an overloaded iPhone with slow CPU). Advertised directly in the 16-bit TCP header "Window Size" field. Prevents the receiver\'s socket buffer from overflowing and dropping packets.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/40 space-y-1">
                  <div className="font-bold text-purple-300">2. Congestion Window (cwnd) — Congestion Control</div>
                  <p className="text-slate-400 text-[11px]">
                    Protects the <strong>intermediate network routers and switches</strong>. Calculated entirely in software by algorithms like TCP BBR, Cubic, and Reno. Ramps up sending rate until packet loss or queue delay is detected.
                  </p>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-center text-cyan-300 font-bold">
                Golden Rule: Effective Transmission Window = min(rwnd, cwnd)
              </div>
            </div>
          )}

          {/* Tab 3: Window Scale Option */}
          {activeTheoryTab === 'window-scale' && (
            <div className="space-y-3 text-xs leading-relaxed text-slate-300">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                Why Gigabit Internet Broke the Original TCP Header (Window Scale RFC 7323)
              </h3>
              <p>
                The original 1981 TCP specification (RFC 793) allocated exactly <strong>16 bits</strong> for the Window Size field. The largest number you can write with 16 bits is <strong>65,535 bytes (~64 KB)</strong>.
              </p>
              <p>
                On a modern 10 Gbps transatlantic link with 80ms RTT, the <strong>Bandwidth-Delay Product (BDP)</strong> is:
                <br />
                <code className="text-cyan-300 font-mono">BDP = 10 Gbps × 0.080s = 800 Megabits = 100 Megabytes!</code>
              </p>
              <p>
                A 64 KB window would force a 10-Gigabit line to sit idle 99.9% of the time, artificially capping speed at ~6.5 Mbps!
              </p>
              <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-800/50 space-y-1">
                <div className="font-bold text-cyan-300">The Solution: TCP Window Scale (RFC 7323 / RFC 1323)</div>
                <p className="text-slate-300 text-[11px]">
                  During the initial SYN packet, endpoints negotiate a 1-byte "Window Scale" shift multiplier (0 to 14).
                  A scale of 7 means: multiply the advertised 16-bit window by $2^7 = 128$.
                  This expands maximum TCP window capacity from <strong>64 Kilobytes up to 1 Gigabyte (1,073,725,440 bytes)</strong>!
                </p>
              </div>
            </div>
          )}

          {/* Tab 4: Silly Window Syndrome */}
          {activeTheoryTab === 'silly-window' && (
            <div className="space-y-3 text-xs leading-relaxed text-slate-300">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Silly Window Syndrome & Nagle\'s Algorithm (RFC 896)
              </h3>
              <p>
                Imagine an application (like a slow interactive terminal) that consumes data 1 byte at a time. The receiver advertises "Window Size = 1". The sender obliges by wrapping that single byte in a 20-byte IP header + 20-byte TCP header.
              </p>
              <p className="text-amber-400 font-bold">
                Result: 41 bytes sent over the wire to transmit 1 byte of user data — a catastrophic 97.5% overhead waste!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="font-bold text-white">Nagle\'s Algorithm (Sender-Side Fix)</div>
                  <p className="text-slate-400 text-[11px]">
                    If there is unacknowledged data in flight, the sender holds off on sending small packets until it has accumulated a full MSS (1460 bytes) or until the previous ACK returns.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="font-bold text-white">Clark\'s Solution (Receiver-Side Fix)</div>
                  <p className="text-slate-400 text-[11px]">
                    The receiver refuses to advertise small window increases. It keeps advertising Window = 0 until it can accept at least a full MSS or half of its total buffer.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
