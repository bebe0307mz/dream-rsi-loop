"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STAGES = [
  {
    id: "agent",
    label: "Agent",
    sub: "gen n",
    caption: "The current-generation agent, carrying all skills learned so far.",
    icon: "A",
  },
  {
    id: "dream",
    label: "Dream Worlds",
    sub: "generate",
    caption:
      "The agent dreams up new training environments -- harder puzzles, novel scenarios it hasn't mastered yet.",
    icon: "W",
  },
  {
    id: "train",
    label: "Train",
    sub: "in worlds",
    caption:
      "Training runs inside those generated worlds. The agent practices in its own imagination.",
    icon: "T",
  },
  {
    id: "eval",
    label: "Evaluate",
    sub: "benchmark",
    caption:
      "Performance is benchmarked against prior generations. Did it actually get better?",
    icon: "E",
  },
  {
    id: "next",
    label: "Agent",
    sub: "gen n+1",
    caption:
      "A stronger agent emerges. It becomes the new baseline and the loop restarts.",
    icon: "A+",
  },
];

const STEP_DURATION = 1800;

function getNodePosition(index: number, total: number, radius: number) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  };
}

function ArrowPath({
  from,
  to,
  active,
  completed,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  active: boolean;
  completed: boolean;
}) {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  const nx = -dy / len;
  const ny = dx / len;
  const bulge = len * 0.15;
  const cx = midX + nx * bulge;
  const cy = midY + ny * bulge;

  const nodeRadius = 36;
  const startDx = (to.x - from.x) / len;
  const startDy = (to.y - from.y) / len;
  const sx = from.x + startDx * nodeRadius;
  const sy = from.y + startDy * nodeRadius;
  const endDx = (from.x - to.x) / len;
  const endDy = (from.y - to.y) / len;
  const ex = to.x + endDx * (nodeRadius + 6);
  const ey = to.y + endDy * (nodeRadius + 6);

  const d = `M ${sx} ${sy} Q ${cx} ${cy} ${ex} ${ey}`;

  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke={
          active
            ? "#00ff41"
            : completed
            ? "rgba(0,255,65,0.25)"
            : "rgba(255,255,255,0.06)"
        }
        strokeWidth={active ? 2.5 : 1.5}
        strokeDasharray={active ? "6 4" : "none"}
        className={active ? "animate-dash-flow" : ""}
        markerEnd={
          active
            ? "url(#arrowActive)"
            : completed
            ? "url(#arrowDim)"
            : "url(#arrowIdle)"
        }
      />
      {active && (
        <path
          d={d}
          fill="none"
          stroke="#00ff41"
          strokeWidth={6}
          opacity={0.15}
          strokeLinecap="round"
        />
      )}
    </g>
  );
}

function LoopDiagram({
  activeStage,
  generation,
  captureRef,
}: {
  activeStage: number;
  generation: number;
  captureRef: React.RefObject<HTMLDivElement>;
}) {
  const radius = 140;
  const svgSize = 400;
  const center = svgSize / 2;

  const positions = STAGES.map((_, i) =>
    getNodePosition(i, STAGES.length, radius)
  );

  return (
    <div
      ref={captureRef}
      className="relative flex items-center justify-center"
      style={{ width: svgSize, height: svgSize }}
    >
      <svg
        width={svgSize}
        height={svgSize}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        className="absolute inset-0"
      >
        <defs>
          <marker
            id="arrowActive"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6" fill="#00ff41" />
          </marker>
          <marker
            id="arrowDim"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6" fill="rgba(0,255,65,0.25)" />
          </marker>
          <marker
            id="arrowIdle"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6" fill="rgba(255,255,255,0.06)" />
          </marker>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connection arrows */}
        {STAGES.map((_, i) => {
          const next = (i + 1) % STAGES.length;
          const from = {
            x: positions[i].x + center,
            y: positions[i].y + center,
          };
          const to = {
            x: positions[next].x + center,
            y: positions[next].y + center,
          };
          const isActive = i === activeStage;
          const isCompleted = i < activeStage;
          return (
            <ArrowPath
              key={`arrow-${i}`}
              from={from}
              to={to}
              active={isActive}
              completed={isCompleted}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {STAGES.map((stage, i) => {
        const pos = positions[i];
        const isActive = i === activeStage;
        const isCompleted = i < activeStage;

        return (
          <motion.div
            key={stage.id}
            className={`absolute flex flex-col items-center justify-center rounded-full border-2 transition-colors duration-300 ${
              isActive
                ? "node-active node-glow"
                : isCompleted
                ? "node-completed"
                : "node-idle"
            }`}
            style={{
              width: 72,
              height: 72,
              left: center + pos.x - 36,
              top: center + pos.y - 36,
            }}
            animate={
              isActive
                ? { scale: [1, 1.08, 1], opacity: 1 }
                : { scale: 1, opacity: isCompleted ? 0.7 : 0.35 }
            }
            transition={
              isActive
                ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0.3 }
            }
          >
            <span
              className={`text-xs font-bold leading-none ${
                isActive
                  ? "text-terminal"
                  : isCompleted
                  ? "text-terminal/50"
                  : "text-fg-muted"
              }`}
            >
              {stage.icon === "A" || stage.icon === "A+"
                ? stage.icon === "A+"
                  ? `A${generation + 1}`
                  : `A${generation}`
                : stage.icon}
            </span>
            <span
              className={`text-[9px] mt-0.5 leading-none ${
                isActive
                  ? "text-fg-primary"
                  : isCompleted
                  ? "text-fg-muted"
                  : "text-fg-muted/50"
              }`}
            >
              {stage.label}
            </span>
          </motion.div>
        );
      })}

      {/* Center generation counter */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          key={generation}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center"
        >
          <span className="text-fg-muted text-[10px] uppercase tracking-widest">
            Gen
          </span>
          <span className="text-amber text-3xl font-bold tabular-nums">
            {generation}
          </span>
        </motion.div>
      </div>
    </div>
  );
}

function CaptionPanel({ activeStage }: { activeStage: number }) {
  const stage = STAGES[activeStage];
  return (
    <div className="w-full max-w-md h-24 flex flex-col items-center justify-center px-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={stage.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <div className="text-terminal text-sm font-bold mb-1">
            {stage.label}{" "}
            <span className="text-fg-muted font-normal">/ {stage.sub}</span>
          </div>
          <p className="text-fg-muted text-xs leading-relaxed">
            {stage.caption}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function StepIndicator({ activeStage }: { activeStage: number }) {
  return (
    <div className="flex gap-2 items-center">
      {STAGES.map((_, i) => (
        <div
          key={i}
          className={`h-1 rounded-full transition-all duration-300 ${
            i === activeStage
              ? "w-6 bg-terminal"
              : i < activeStage
              ? "w-3 bg-terminal/30"
              : "w-3 bg-white/10"
          }`}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const [activeStage, setActiveStage] = useState(0);
  const [generation, setGeneration] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);
  const fullCaptureRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setActiveStage((prev) => {
        const next = (prev + 1) % STAGES.length;
        if (next === 0) {
          setGeneration((g) => g + 1);
        }
        return next;
      });
    }, STEP_DURATION);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const toggleRunning = () => setIsRunning((r) => !r);

  const handleExport = useCallback(async () => {
    if (isExporting) return;
    setIsExporting(true);
    setExportDone(false);

    try {
      const html2canvas = (await import("html2canvas")).default;
      const GIF = (await import("gif.js")).default;

      const target = fullCaptureRef.current;
      if (!target) throw new Error("No capture target");

      const wasRunning = isRunning;
      setIsRunning(false);

      await new Promise((r) => setTimeout(r, 100));

      const gif = new GIF({
        workers: 2,
        quality: 10,
        width: 500,
        height: 600,
        workerScript: "/gif.worker.js",
        background: "#050505",
      });

      const startGen = generation;

      for (let frame = 0; frame < STAGES.length; frame++) {
        setActiveStage(frame);
        if (frame === 0 && frame > 0) {
          setGeneration(startGen + 1);
        }
        await new Promise((r) => setTimeout(r, 200));

        const canvas = await html2canvas(target, {
          backgroundColor: "#050505",
          scale: 1,
          width: 500,
          height: 600,
          useCORS: true,
          logging: false,
        });
        gif.addFrame(canvas, { delay: STEP_DURATION * 0.8 });
      }

      const blob = await new Promise<Blob>((resolve, reject) => {
        gif.on("finished", (b: Blob) => resolve(b));
        gif.on("error", (e: Error) => reject(e));
        gif.render();
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "dream-rsi-loop.gif";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      const tweet = `I animated how Dream-RSI works -- an AI that builds its own training worlds to get smarter, loop by loop.\n\nWatch it recurse:\nhttps://dream-rsi-loop.vercel.app`;
      await navigator.clipboard.writeText(tweet);

      setExportDone(true);
      setTimeout(() => setExportDone(false), 4000);

      if (wasRunning) setIsRunning(true);
    } catch (err) {
      console.error("Export failed:", err);
      alert("Export failed. Check console for details.");
    } finally {
      setIsExporting(false);
    }
  }, [isExporting, isRunning, generation]);

  return (
    <main className="grid-bg min-h-screen flex flex-col items-center justify-center px-4 py-8 sm:py-12 relative overflow-hidden">
      {/* Decorative scan line */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.015]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,1) 2px, rgba(0,255,65,1) 4px)",
          }}
        />
      </div>

      {/* Header */}
      <div className="text-center mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-fg-primary tracking-tight">
          Dream-RSI{" "}
          <span className="text-terminal">Loop</span>
        </h1>
        <p className="text-fg-muted text-xs sm:text-sm mt-2 max-w-sm mx-auto">
          Watch an AI recursively improve itself by building its own training
          worlds.
        </p>
      </div>

      {/* Capture area for GIF */}
      <div
        ref={fullCaptureRef}
        className="flex flex-col items-center"
        style={{ background: "#050505" }}
      >
        {/* Diagram */}
        <LoopDiagram
          activeStage={activeStage}
          generation={generation}
          captureRef={captureRef}
        />

        {/* Step indicator */}
        <div className="mt-4 mb-2">
          <StepIndicator activeStage={activeStage} />
        </div>

        {/* Caption */}
        <CaptionPanel activeStage={activeStage} />

        {/* Loop counter bar */}
        <div className="flex items-center gap-4 mt-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-fg-muted">Loops completed:</span>
            <motion.span
              key={generation}
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-amber font-bold text-sm tabular-nums"
            >
              {generation}
            </motion.span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="text-fg-muted">Stage:</span>
            <span className="text-terminal font-bold">
              {activeStage + 1}/{STAGES.length}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 mt-8">
        <button
          onClick={toggleRunning}
          className="px-4 py-2 text-xs border border-white/10 rounded hover:border-terminal/40 hover:text-terminal transition-colors text-fg-muted"
        >
          {isRunning ? "Pause" : "Play"}
        </button>
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="px-4 py-2 text-xs border border-terminal/40 rounded text-terminal hover:bg-terminal/10 transition-colors disabled:opacity-40 disabled:cursor-wait"
        >
          {isExporting
            ? "Capturing..."
            : exportDone
            ? "GIF saved + tweet copied"
            : "Copy tweet + GIF"}
        </button>
      </div>

      {/* How it works section */}
      <div className="mt-12 sm:mt-16 max-w-lg mx-auto px-4">
        <h2 className="text-sm font-bold text-fg-primary mb-4 text-center">
          What is Dream-RSI?
        </h2>
        <div className="space-y-3">
          {STAGES.map((stage, i) => (
            <div key={stage.id} className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-6 h-6 rounded-full border border-terminal/30 flex items-center justify-center text-terminal text-[10px] font-bold mt-0.5">
                {i + 1}
              </div>
              <div>
                <span className="text-xs font-bold text-fg-primary">
                  {stage.label}
                </span>
                <span className="text-xs text-fg-muted"> / {stage.sub}</span>
                <p className="text-xs text-fg-muted/70 mt-0.5 leading-relaxed">
                  {stage.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-fg-muted/40 text-center mt-6">
          Based on the Dream-RSI paper. Each loop creates a smarter agent that
          then creates harder worlds for itself.
        </p>
      </div>

      {/* Footer */}
      <footer className="mt-12 mb-6 text-center">
        <a
          href="https://github.com/zhengkid/Dream-RSI"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-fg-muted/40 hover:text-terminal/60 transition-colors"
        >
          Dream-RSI paper/repo
        </a>
      </footer>
    </main>
  );
}
