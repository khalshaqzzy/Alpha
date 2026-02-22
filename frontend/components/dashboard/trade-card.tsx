"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight, ArrowDownRight, AlertTriangle, ExternalLink } from "lucide-react"

interface TradeCardProps {
  id: string
  asset: string
  symbol: string
  direction: "Long" | "Short"
  entryPrice: number
  currentPrice: number
  takeProfit: number
  stopLoss: number
  pnl: number
  pnlPercent: number
  status: "Active" | "Needs Attention" | "Closed"
  leverage?: number
  positionSize?: number
}

const STATUS_CONFIG = {
  Active: {
    bg: "var(--semantic-success-subtle)",
    color: "var(--semantic-success)",
    border: "var(--semantic-success)",
    label: "Active",
  },
  "Needs Attention": {
    bg: "var(--semantic-warning-subtle)",
    color: "var(--semantic-warning)",
    border: "var(--semantic-warning)",
    label: "Attention",
  },
  Closed: {
    bg: "var(--bg-surface-raised)",
    color: "var(--text-tertiary)",
    border: "var(--border-default)",
    label: "Closed",
  },
} as const

/** Returns 0–100 representing how far current price has moved from entry toward TP/SL */
function calcProgress(
  direction: "Long" | "Short",
  entry: number,
  current: number,
  tp: number,
  sl: number
): { pct: number; toward: "tp" | "sl" | "entry" } {
  const range = Math.abs(tp - entry)
  if (range === 0) return { pct: 0, toward: "entry" }
  const move = direction === "Long" ? current - entry : entry - current
  const pct = Math.min(Math.max((move / range) * 100, -100), 100)
  return { pct, toward: pct >= 0 ? "tp" : "sl" }
}

export function TradeCard({
  id, asset, symbol, direction,
  entryPrice, currentPrice, takeProfit, stopLoss,
  pnl, pnlPercent, status, leverage = 1, positionSize = 1000,
}: TradeCardProps) {
  const isPositive = pnl >= 0
  const isLong = direction === "Long"
  const s = STATUS_CONFIG[status]
  const { pct, toward } = calcProgress(direction, entryPrice, currentPrice, takeProfit, stopLoss)
  const progressColor = toward === "tp" ? "var(--semantic-success)" : "var(--semantic-danger)"

  /* risk/reward distance in % */
  const tpDist = (((takeProfit - entryPrice) / entryPrice) * 100 * (isLong ? 1 : -1)).toFixed(2)
  const slDist = (((stopLoss - entryPrice) / entryPrice) * 100 * (isLong ? -1 : 1)).toFixed(2)

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
      <Link
        href={`/trade/${id}`}
        className="group block overflow-hidden rounded-2xl transition-shadow duration-200"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-default)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        {/* Color accent top bar */}
        <div
          className="h-1 w-full"
          style={{
            background:
              status === "Closed"
                ? "var(--border-default)"
                : isLong
                  ? "var(--semantic-success)"
                  : "var(--semantic-danger)",
          }}
        />

        <div className="p-5">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              {/* Asset badge */}
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold"
                style={{
                  background: isLong ? "var(--semantic-success-subtle)" : "var(--semantic-danger-subtle)",
                  color: isLong ? "var(--semantic-success)" : "var(--semantic-danger)",
                }}
              >
                {symbol.slice(0, 3)}
              </div>
              <div>
                <p className="text-base font-bold leading-tight" style={{ color: "var(--text-primary)" }}>
                  {asset}
                </p>
                <div className="mt-0.5 flex items-center gap-2">
                  <span
                    className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[11px] font-bold"
                    style={{
                      background: isLong ? "var(--semantic-success-subtle)" : "var(--semantic-danger-subtle)",
                      color: isLong ? "var(--semantic-success)" : "var(--semantic-danger)",
                    }}
                  >
                    {isLong ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {direction}
                  </span>
                  {leverage > 1 && (
                    <span
                      className="rounded px-1.5 py-0.5 text-[11px] font-medium"
                      style={{ background: "var(--bg-surface-raised)", color: "var(--text-tertiary)" }}
                    >
                      {leverage}×
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Status badge */}
            <div className="flex flex-col items-end gap-1.5">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                style={{ background: s.bg, color: s.color }}
              >
                {status === "Needs Attention" && <AlertTriangle className="h-3 w-3" />}
                {s.label}
              </span>
            </div>
          </div>

          {/* P/L Block — the hero metric */}
          <div
            className="mt-4 rounded-xl p-3"
            style={{
              background: isPositive
                ? "var(--semantic-success-subtle)"
                : "var(--semantic-danger-subtle)",
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>
                Unrealized P/L
              </span>
              <span
                className="font-mono text-lg font-bold"
                style={{ color: isPositive ? "var(--semantic-success)" : "var(--semantic-danger)" }}
              >
                {isPositive ? "+" : ""}${Math.abs(pnl).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                <span className="ml-1 text-sm opacity-80">
                  ({isPositive ? "+" : ""}{pnlPercent.toFixed(2)}%)
                </span>
              </span>
            </div>
          </div>

          {/* Progress bar: SL ←——●——→ TP */}
          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-[10px] font-medium" style={{ color: "var(--text-tertiary)" }}>
              <span>SL ${stopLoss.toLocaleString()}</span>
              <span>Entry</span>
              <span>TP ${takeProfit.toLocaleString()}</span>
            </div>
            <div
              className="relative h-2 w-full overflow-hidden rounded-full"
              style={{ background: "var(--bg-active)" }}
            >
              {/* Track fill */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.abs(pct) / 2}%` }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-0 h-full rounded-full"
                style={{
                  background: progressColor,
                  left: pct >= 0 ? "50%" : `calc(50% - ${Math.abs(pct) / 2}%)`,
                }}
              />
              {/* Entry marker */}
              <div
                className="absolute top-0 h-full w-0.5 -translate-x-1/2"
                style={{ left: "50%", background: "var(--border-strong)" }}
              />
            </div>
          </div>

          {/* Price metrics */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { label: "Entry", value: `$${entryPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}` },
              { label: "Current", value: `$${currentPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, highlight: true },
              { label: "Size", value: `$${positionSize.toLocaleString()}` },
            ].map(({ label, value, highlight }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span className="text-[10px] font-medium uppercase tracking-wide" style={{ color: "var(--text-tertiary)" }}>
                  {label}
                </span>
                <span
                  className="font-mono text-sm font-semibold"
                  style={{ color: highlight ? "var(--text-primary)" : "var(--text-secondary)" }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderTop: "1px solid var(--border-default)", background: "var(--bg-surface-raised)" }}
        >
          <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-tertiary)" }}>
            <span>TP <span className="font-semibold text-[var(--semantic-success)]">+{tpDist}%</span></span>
            <span>SL <span className="font-semibold text-[var(--semantic-danger)]">-{Math.abs(Number(slDist)).toFixed(2)}%</span></span>
          </div>
          <span
            className="flex items-center gap-1 text-xs font-semibold transition-all duration-150 group-hover:text-[var(--brand-primary)]"
            style={{ color: "var(--text-tertiary)" }}
          >
            Details <ExternalLink className="h-3 w-3" />
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
