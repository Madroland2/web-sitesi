"use client";

import { useRef, useEffect, useState, useCallback } from "react";

// ─── Sabitler ────────────────────────────────────────────────────────────────
const SIZE = 420;
const CELL = SIZE / 3;
const TAU = Math.PI * 2;
const FOG_MS = 520;   // buğu açılma süresi (ms)
const LINE_MS = 600;  // kazanan çizgisi çizim süresi (ms)

// ─── Oyun mantığı ────────────────────────────────────────────────────────────
const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
] as const;

type Cell   = null | "X" | "O";
type Player = "X" | "O";
type Result = { player: Player | "draw"; line: [number, number, number] | null };

function checkWinner(board: Cell[]): Result | null {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { player: board[a] as Player, line: [a, b, c] };
    }
  }
  if (board.every((c) => c !== null)) return { player: "draw", line: null };
  return null;
}

function cellPos(i: number) {
  const col = i % 3, row = Math.floor(i / 3);
  return { x: col * CELL, y: row * CELL, cx: col * CELL + CELL / 2, cy: row * CELL + CELL / 2 };
}

function easeOut(t: number) { return 1 - (1 - t) ** 3; }

// ─── Ses ─────────────────────────────────────────────────────────────────────
function tone(freq: number, dur: number, type: OscillatorType = "sine") {
  try {
    const ac = new AudioContext();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain); gain.connect(ac.destination);
    osc.type = type; osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.12, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur);
    osc.start(); osc.stop(ac.currentTime + dur);
  } catch { /* sessiz kal */ }
}
const sfxMove = () => tone(440, 0.07);
const sfxWin  = () => [523, 659, 784].forEach((f, i) => setTimeout(() => tone(f, 0.22), i * 130));
const sfxDraw = () => tone(280, 0.5, "triangle");

// ─── Bileşen ─────────────────────────────────────────────────────────────────
export default function XoxCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offRef    = useRef<HTMLCanvasElement | null>(null);

  const [board,  setBoard]  = useState<Cell[]>(Array(9).fill(null));
  const [turn,   setTurn]   = useState<Player>("X");
  const [result, setResult] = useState<Result | null>(null);

  // Canvas çizim döngüsünde kullanılan güncel değerlere erişim
  const boardRef  = useRef<Cell[]>(board);
  boardRef.current = board;
  const resultRef = useRef<Result | null>(result);
  resultRef.current = result;
  const turnRef   = useRef<Player>(turn);
  turnRef.current = turn;

  // Animasyon referansları
  const fogStart  = useRef<number[]>(Array(9).fill(0)); // 0 = buğulu, >0 = açılma başlangıcı
  const lineStart = useRef<number>(0);
  const hoverCell = useRef<number>(-1);

  // Offscreen canvas (destination-out fog için)
  useEffect(() => {
    const off = document.createElement("canvas");
    off.width = SIZE; off.height = SIZE;
    offRef.current = off;
  }, []);

  // ── Çizim döngüsü ──────────────────────────────────────────────────────────
  const draw = useCallback((now: number) => {
    const canvas = canvasRef.current;
    const off    = offRef.current;
    if (!canvas || !off) { requestAnimationFrame(draw); return; }

    const ctx    = canvas.getContext("2d")!;
    const offCtx = off.getContext("2d")!;
    const board  = boardRef.current;
    const result = resultRef.current;

    // — Arkaplan —
    ctx.fillStyle = "#161b22";
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Hafif iç parlaklık (ayna yüzeyi)
    const glow = ctx.createRadialGradient(SIZE / 2, SIZE / 2, 0, SIZE / 2, SIZE / 2, SIZE * 0.7);
    glow.addColorStop(0, "rgba(88,166,255,0.04)");
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, SIZE, SIZE);

    // — Izgara çizgileri —
    ctx.save();
    ctx.strokeStyle = "#30363d";
    ctx.lineWidth = 1.5;
    ctx.shadowColor = "#58a6ff";
    ctx.shadowBlur = 6;
    for (let i = 1; i < 3; i++) {
      ctx.beginPath(); ctx.moveTo(i * CELL, 18); ctx.lineTo(i * CELL, SIZE - 18); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(18, i * CELL); ctx.lineTo(SIZE - 18, i * CELL); ctx.stroke();
    }
    ctx.restore();

    // — X ve O işaretleri —
    board.forEach((mark, i) => {
      if (!mark) return;
      const { cx, cy } = cellPos(i);
      const t0       = fogStart.current[i];
      const progress = t0 ? Math.min((now - t0) / FOG_MS, 1) : 0;
      if (progress <= 0) return;

      ctx.save();
      ctx.globalAlpha = easeOut(progress);
      const r = CELL * 0.285;

      if (mark === "X") {
        ctx.strokeStyle = "#58a6ff"; ctx.lineWidth = 6; ctx.lineCap = "round";
        ctx.shadowColor = "#58a6ff"; ctx.shadowBlur = 22;
        ctx.beginPath(); ctx.moveTo(cx - r, cy - r); ctx.lineTo(cx + r, cy + r); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx + r, cy - r); ctx.lineTo(cx - r, cy + r); ctx.stroke();
      } else {
        ctx.strokeStyle = "#f85149"; ctx.lineWidth = 6;
        ctx.shadowColor = "#f85149"; ctx.shadowBlur = 22;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.stroke();
      }
      ctx.restore();
    });

    // — Kazanan çizgisi —
    if (result?.line) {
      const t0   = lineStart.current;
      const prog = t0 ? easeOut(Math.min((now - t0) / LINE_MS, 1)) : 0;
      const { cx: ax, cy: ay } = cellPos(result.line[0]);
      const { cx: bx, cy: by } = cellPos(result.line[2]);
      const color = result.player === "X" ? "#58a6ff" : "#f85149";

      ctx.save();
      ctx.strokeStyle = color; ctx.lineWidth = 5; ctx.lineCap = "round";
      ctx.shadowColor = color; ctx.shadowBlur = 24; ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(ax + (bx - ax) * prog, ay + (by - ay) * prog);
      ctx.stroke();
      ctx.restore();
    }

    // — Buğu katmanı (offscreen ile) —
    offCtx.clearRect(0, 0, SIZE, SIZE);

    // Temel buğu rengi
    offCtx.fillStyle = "rgba(13, 17, 23, 0.91)";
    offCtx.fillRect(0, 0, SIZE, SIZE);

    // Sol üst aydınlık (cam yansıması)
    const fogHL = offCtx.createLinearGradient(0, 0, SIZE * 0.6, SIZE * 0.6);
    fogHL.addColorStop(0, "rgba(60, 80, 100, 0.22)");
    fogHL.addColorStop(1, "rgba(0, 0, 0, 0)");
    offCtx.fillStyle = fogHL;
    offCtx.fillRect(0, 0, SIZE, SIZE);

    offCtx.globalCompositeOperation = "destination-out";

    // Oynanmış hücrelerde buğuyu aç
    board.forEach((mark, i) => {
      if (!mark) return;
      const t0 = fogStart.current[i];
      if (!t0) return;
      const progress = Math.min((now - t0) / FOG_MS, 1);
      const { cx, cy } = cellPos(i);
      const maxR = CELL * 0.75;
      const r    = maxR * easeOut(progress);
      if (r <= 0) return;

      const grad = offCtx.createRadialGradient(cx, cy, r * 0.15, cx, cy, r);
      grad.addColorStop(0,   "rgba(0,0,0,1)");
      grad.addColorStop(0.65,"rgba(0,0,0,0.9)");
      grad.addColorStop(1,   "rgba(0,0,0,0)");
      offCtx.fillStyle = grad;
      offCtx.beginPath(); offCtx.arc(cx, cy, r, 0, TAU); offCtx.fill();
    });

    // Hayalet hover efekti — boş hücrede parmak izi
    const hi = hoverCell.current;
    if (hi >= 0 && !board[hi] && !result) {
      const { cx, cy } = cellPos(hi);
      const grad = offCtx.createRadialGradient(cx, cy, 0, cx, cy, CELL * 0.32);
      grad.addColorStop(0,   "rgba(0,0,0,0.28)");
      grad.addColorStop(0.6, "rgba(0,0,0,0.1)");
      grad.addColorStop(1,   "rgba(0,0,0,0)");
      offCtx.fillStyle = grad;
      offCtx.beginPath(); offCtx.arc(cx, cy, CELL * 0.32, 0, TAU); offCtx.fill();
    }

    offCtx.globalCompositeOperation = "source-over";
    ctx.drawImage(off, 0, 0);

    requestAnimationFrame(draw);
  }, []);

  const rafRef = useRef<number>(0);
  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  // ── Olay yöneticileri ─────────────────────────────────────────────────────
  function toCanvasCoords(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect  = canvasRef.current!.getBoundingClientRect();
    const scale = SIZE / rect.width;
    return {
      mx: (e.clientX - rect.left) * scale,
      my: (e.clientY - rect.top) * scale,
    };
  }

  function cellFromCoords(mx: number, my: number) {
    const col = Math.floor(mx / CELL);
    const row = Math.floor(my / CELL);
    if (col < 0 || col > 2 || row < 0 || row > 2) return -1;
    return row * 3 + col;
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    const { mx, my } = toCanvasCoords(e);
    hoverCell.current = cellFromCoords(mx, my);
  }

  function handlePointerLeave() { hoverCell.current = -1; }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (resultRef.current) return;
    const { mx, my } = toCanvasCoords(e);
    const i = cellFromCoords(mx, my);
    if (i < 0 || boardRef.current[i]) return;

    fogStart.current[i] = performance.now();
    sfxMove();

    const newBoard = [...boardRef.current];
    newBoard[i] = turnRef.current;
    setBoard(newBoard);

    const outcome = checkWinner(newBoard);
    if (outcome) {
      setResult(outcome);
      if (outcome.player === "draw") { setTimeout(sfxDraw, 100); }
      else { lineStart.current = performance.now() + 250; setTimeout(sfxWin, 250); }
    } else {
      setTurn((t) => (t === "X" ? "O" : "X"));
    }
  }

  function reset() {
    setBoard(Array(9).fill(null));
    setTurn("X");
    setResult(null);
    fogStart.current  = Array(9).fill(0);
    lineStart.current = 0;
  }

  // ── Render ────────────────────────────────────────────────────────────────
  const turnColor  = turn === "X" ? "#58a6ff" : "#f85149";
  const winColor   = result?.player === "X" ? "#58a6ff" : result?.player === "O" ? "#f85149" : "#e6edf3";
  const statusText = result
    ? result.player === "draw" ? "Berabere!" : `${result.player} Kazandı!`
    : null;

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Durum satırı */}
      <div className="h-8 flex items-center">
        {result ? (
          <p className="text-xl font-bold" style={{ color: winColor }}>{statusText}</p>
        ) : (
          <p className="text-sm text-[#8b949e]">
            Sıra:{" "}
            <span className="font-bold text-base" style={{ color: turnColor }}>
              {turn}
            </span>
          </p>
        )}
      </div>

      {/* Canvas */}
      <div className="rounded-2xl overflow-hidden border border-[#30363d] shadow-[0_0_60px_rgba(88,166,255,0.06)]">
        <canvas
          ref={canvasRef}
          width={SIZE}
          height={SIZE}
          className="block touch-none"
          style={{ width: "min(420px, 85vw)", height: "min(420px, 85vw)" }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        />
      </div>

      {/* Tekrar oyna */}
      {result ? (
        <button
          onClick={reset}
          className="rounded-lg border border-[#30363d] px-6 py-2.5 text-sm font-medium text-[#8b949e] hover:border-[#58a6ff] hover:text-[#58a6ff] transition-colors"
        >
          Tekrar Oyna
        </button>
      ) : (
        <div className="flex gap-6 text-sm text-[#8b949e]">
          <span><span className="text-[#58a6ff] font-bold">X</span> — Oyuncu 1</span>
          <span><span className="text-[#f85149] font-bold">O</span> — Oyuncu 2</span>
        </div>
      )}
    </div>
  );
}
