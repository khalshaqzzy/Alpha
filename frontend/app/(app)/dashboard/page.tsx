"use client"

import Link from "next/link"
import { useState, useMemo } from "react"
import {
  Sparkles, TrendingUp, TrendingDown, AlertTriangle,
  DollarSign, ArrowUpRight, Plus, RefreshCw, Bell,
  BarChart2, Activity, Clock,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { TradeCard } from "@/components/dashboard/trade-card"

/* ── Mock data ───────────────────────────────────────────────────────────── */
const MOCK_TRADES = [
  {
    id: "1", asset: "BTC/USD", symbol: "BTC", direction: "Long" as const,
    entryPrice: 67450, currentPrice: 69250, takeProfit: 72000, stopLoss: 65200,
    pnl: 1800, pnlPercent: 2.67, status: "Active" as const,
    leverage: 5, positionSize: 1000,
  },
  {
    id: "2", asset: "ETH/USD", symbol: "ETH", direction: "Short" as const,
    entryPrice: 3820, currentPrice: 3910, takeProfit: 3400, stopLoss: 4050,
    pnl: -450, pnlPercent: -2.36, status: "Needs Attention" as const,
    leverage: 3, positionSize: 800,
  },
  {
    id: "3", asset: "SOL/USD", symbol: "SOL", direction: "Long" as const,
    entryPrice: 148.5, currentPrice: 155.2, takeProfit: 170, stopLoss: 140,
    pnl: 670, pnlPercent: 4.51, status: "Active" as const,
    leverage: 2, positionSize: 500,
  },
  {
    id: "4", asset: "AVAX/USD", symbol: "AVAX", direction: "Long" as const,
    entryPrice: 38.2, currentPrice: 41.5, takeProfit: 46, stopLoss: 35.5,
    pnl: 330, pnlPercent: 8.64, status: "Active" as const,
    leverage: 1, positionSize: 600,
  },
  {
    id: "5", asset: "DOT/USD", symbol: "DOT", direction: "Short" as const,
    entryPrice: 7.85, currentPrice: 7.42, takeProfit: 6.8, stopLoss: 8.5,
    pnl: 215, pnlPercent: 5.48, status: "Closed" as const,
    leverage: 1, positionSize: 400,
  },
]

/* ── Portfolio sparkline data ────────────────────────────────────────────── */
const CHART_DATA = [0, 420, 380, 890, 720, 1050, 980, 1240, 1600, 1820, 2100, 2565]
const CHART_LABELS = ["Feb 12", "Feb 14", "Feb 16", "Feb 18", "Feb 20", "Feb 22", "Feb 23"]

/* ── Filter tabs ─────────────────────────────────────────────────────────── */
type Filter = "All" | "Active" | "Needs Attention" | "Closed"
const FILTERS: Filter[] = ["All", "Active", "Needs Attention", "Closed"]

/* ── SVG sparkline chart ─────────────────────────────────────────────────── */
function PortfolioChart() {
  const W = 800, H = 160
  const pad = { t: 16, b: 24, l: 0, r: 0 }
  const min = Math.min(...CHART_DATA)
  const max = Math.max(...CHART_DATA)
  const xStep = (W - pad.l - pad.r) / (CHART_DATA.length - 1)
  const yScale = (v: number) =>
    pad.t + ((max - v) / (max - min || 1)) * (H - pad.t - pad.b)
  const points = CHART_DATA.map((v, i) => [pad.l + i * xStep, yScale(v)] as [number, number])
  const pathD = points.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ")
  const areaD = `${pathD} L ${points[points.length - 1][0]} ${H - pad.b} L ${points[0][0]} ${H - pad.b} Z`

  return (
    <div className="relative w-full overflow-hidden" style={{ height: H }}>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--brand-primary)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--brand-primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={0} y1={pad.t + f * (H - pad.t - pad.b)}
            x2={W} y2={pad.t + f * (H - pad.t - pad.b)}
            stroke="var(--border-default)" strokeWidth="1" strokeDasharray="4 4"
          />
        ))}
        {/* Area fill */}
        <path d={areaD} fill="url(#chart-fill)" />
        {/* Line */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="var(--brand-primary)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* End dot */}
        <circle
          cx={points[points.length - 1][0]}
          cy={points[points.length - 1][1]}
          r="5"
          fill="var(--brand-primary)"
          stroke="var(--bg-surface)"
          strokeWidth="2"
        />
      </svg>
    </div>
  )
}

/* ── Stat card ──────────────────────────────────────────────────────────── */
function StatCard({
  icon: Icon,
  label,
  value,
  valueColor,
  delta,
  deltaLabel,
  delay,
  accent,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  label: string
  value: string
  valueColor?: string
  delta?: number
  deltaLabel?: string
  delay: number
  accent?: string
}) {
  const isUp = delta !== undefined ? delta >= 0 : undefined
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
      className="relative overflow-hidden rounded-2xl border p-5"
      style={{
        background: "var(--bg-surface)",
        borderColor: "var(--border-default)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Subtle accent glow */}
      {accent && (
        <div
          className="pointer-events-none absolute right-0 top-0 h-24 w-24 opacity-[0.06] blur-2xl"
          style={{ background: accent }}
        />
      )}
      <div className="flex items-start justify-between gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ background: accent ? `color-mix(in srgb,${accent} 10%,transparent)` : "var(--bg-surface-raised)" }}
        >
          <Icon className="h-5 w-5" style={{ color: accent || "var(--text-secondary)" }} />
        </div>
        {delta !== undefined && (
          <div
            className="flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold"
            style={{
              background: isUp ? "var(--semantic-success-subtle)" : "var(--semantic-danger-subtle)",
              color: isUp ? "var(--semantic-success)" : "var(--semantic-danger)",
            }}
          >
            {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(delta)}%
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className="text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>{label}</p>
        <p
          className="mt-1 font-mono text-2xl font-bold tracking-tight"
          style={{ color: valueColor || "var(--text-primary)" }}
        >
          {value}
        </p>
        {deltaLabel && (
          <p className="mt-0.5 text-[11px]" style={{ color: "var(--text-tertiary)" }}>
            {deltaLabel}
          </p>
        )}
      </div>
    </motion.div>
  )
}

/* ── Main page ─────────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const [filter, setFilter] = useState<Filter>("All")
  const [view, setView] = useState<"grid" | "list">("grid")

  const totalPnl = MOCK_TRADES.filter(t => t.status !== "Closed").reduce((s, t) => s + t.pnl, 0)
  const activeTrades = MOCK_TRADES.filter((t) => t.status === "Active").length
  const alerts = MOCK_TRADES.filter((t) => t.status === "Needs Attention").length
  const winRate = Math.round(
    (MOCK_TRADES.filter((t) => t.pnl > 0).length / MOCK_TRADES.length) * 100
  )

  const filtered = useMemo(
    () => MOCK_TRADES.filter((t) => filter === "All" || t.status === filter),
    [filter]
  )

  const now = new Date().toLocaleString("en-US", {
    hour: "2-digit", minute: "2-digit", month: "short", day: "numeric",
  })

  return (
    <div className="min-h-full" style={{ background: "var(--bg-canvas)" }}>
      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-4 border-b px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
        style={{ borderColor: "var(--border-default)", background: "var(--bg-surface)" }}
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
            Portfolio
          </h1>
          <div className="mt-1 flex items-center gap-2">
            <div className="status-dot-active" />
            <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              Live · Updated {now}
            </p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2">
          <button
            className="flex h-9 w-9 items-center justify-center rounded-xl border transition-colors hover:bg-[var(--bg-hover)]"
            style={{ borderColor: "var(--border-default)", color: "var(--text-secondary)" }}
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border transition-colors hover:bg-[var(--bg-hover)]"
            style={{ borderColor: "var(--border-default)", color: "var(--text-secondary)" }}
            title="Alerts"
          >
            <Bell className="h-4 w-4" />
            {alerts > 0 && (
              <span
                className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white"
                style={{ background: "var(--semantic-warning)" }}
              >
                {alerts}
              </span>
            )}
          </button>
          <motion.div whileTap={{ scale: 0.97 }}>
            <Link
              href="/chat"
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all"
              style={{ background: "var(--btn-primary-bg)", color: "var(--text-inverse)" }}
            >
              <Sparkles className="h-4 w-4" />
              New Research
            </Link>
          </motion.div>
        </div>
      </motion.div>

      <div className="px-6 py-6 lg:px-8">
        {/* ── Stat cards ─────────────────────────────────────────────────── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={DollarSign}
            label="Total Unrealized P/L"
            value={`${totalPnl >= 0 ? "+" : ""}$${Math.abs(totalPnl).toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
            valueColor={totalPnl >= 0 ? "var(--semantic-success)" : "var(--semantic-danger)"}
            delta={5.2}
            deltaLabel="vs. yesterday"
            delay={0.05}
            accent={totalPnl >= 0 ? "#22c55e" : "#ef4444"}
          />
          <StatCard
            icon={Activity}
            label="Active Positions"
            value={activeTrades.toString()}
            delta={0}
            deltaLabel="Same as yesterday"
            delay={0.1}
            accent="#3b82f6"
          />
          <StatCard
            icon={BarChart2}
            label="Win Rate"
            value={`${winRate}%`}
            delta={2}
            deltaLabel="Across all trades"
            delay={0.15}
            accent="#8b5cf6"
          />
          <StatCard
            icon={AlertTriangle}
            label="Alerts"
            value={alerts.toString()}
            valueColor={alerts > 0 ? "var(--semantic-warning)" : "var(--text-primary)"}
            deltaLabel={alerts > 0 ? "Require attention" : "All positions nominal"}
            delay={0.2}
            accent={alerts > 0 ? "#f59e0b" : undefined}
          />
        </div>

        {/* ── Portfolio chart ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="mt-6 overflow-hidden rounded-2xl border"
          style={{
            background: "var(--bg-surface)",
            borderColor: "var(--border-default)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div
            className="flex items-center justify-between px-5 pt-4 pb-3"
            style={{ borderBottom: "1px solid var(--border-default)" }}
          >
            <div>
              <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                P/L History
              </h2>
              <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>Last 12 days</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Timeframe chips */}
              {["1D", "1W", "1M", "All"].map((tf, i) => (
                <button
                  key={tf}
                  className="rounded-lg px-2.5 py-1 text-xs font-semibold transition-all"
                  style={i === 1
                    ? { background: "var(--bg-active)", color: "var(--text-primary)" }
                    : { color: "var(--text-tertiary)" }
                  }
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
          <div className="px-4 pb-3 pt-1">
            <div className="flex items-baseline gap-2 px-1 py-2">
              <span className="font-mono text-2xl font-bold" style={{ color: "var(--semantic-success)" }}>
                +$2,565.00
              </span>
              <span className="text-sm font-semibold" style={{ color: "var(--semantic-success)" }}>
                +12.4% this week
              </span>
            </div>
            <PortfolioChart />
            {/* X-axis labels */}
            <div className="flex justify-between px-1 pt-1">
              {CHART_LABELS.map((l) => (
                <span key={l} className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>{l}</span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Positions ─────────────────────────────────────────────────── */}
        <div className="mt-6">
          {/* Section header + filters */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
                Positions
              </h2>
              <span
                className="rounded-full px-2 py-0.5 text-xs font-bold"
                style={{ background: "var(--bg-active)", color: "var(--text-secondary)" }}
              >
                {filtered.length}
              </span>
            </div>

            {/* Filter tabs */}
            <div
              className="flex gap-0.5 overflow-x-auto rounded-xl border p-1"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-default)",
              }}
            >
              {FILTERS.map((f) => {
                const count = f === "All"
                  ? MOCK_TRADES.length
                  : MOCK_TRADES.filter((t) => t.status === f).length
                return (
                  <motion.button
                    key={f}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setFilter(f)}
                    className="flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-150"
                    style={{
                      background: filter === f ? "var(--bg-active)" : "transparent",
                      color: filter === f ? "var(--text-primary)" : "var(--text-secondary)",
                    }}
                  >
                    {f}
                    {count > 0 && (
                      <span
                        className="rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                        style={{
                          background: f === "Needs Attention" && filter === f
                            ? "var(--semantic-warning)"
                            : "var(--bg-surface-raised)",
                          color: f === "Needs Attention" && filter === f
                            ? "white"
                            : "var(--text-tertiary)",
                        }}
                      >
                        {count}
                      </span>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Needs-attention banner */}
          <AnimatePresence>
            {(filter === "All" || filter === "Needs Attention") && alerts > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mb-4 flex items-center gap-3 overflow-hidden rounded-xl px-4 py-3"
                style={{
                  background: "var(--semantic-warning-subtle)",
                  border: "1px solid rgba(245,158,11,0.2)",
                }}
              >
                <AlertTriangle className="h-4 w-4 shrink-0" style={{ color: "var(--semantic-warning)" }} />
                <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                  <strong>{alerts} position{alerts > 1 ? "s" : ""}</strong> need your attention. Review and adjust your stop-loss or exit strategy.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cards grid */}
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center rounded-2xl border py-20 text-center"
                style={{
                  borderColor: "var(--border-default)",
                  background: "var(--bg-surface)",
                }}
              >
                <TrendingUp className="mb-3 h-10 w-10" style={{ color: "var(--text-tertiary)" }} />
                <h3 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                  No {filter !== "All" ? filter.toLowerCase() : ""} positions
                </h3>
                <p className="mt-2 max-w-xs text-sm" style={{ color: "var(--text-secondary)" }}>
                  {filter === "All"
                    ? "Start a conversation with Alpha AI to build your first strategy."
                    : `No trades with "${filter}" status right now.`}
                </p>
                {filter === "All" && (
                  <Link
                    href="/chat"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
                    style={{ background: "var(--btn-primary-bg)", color: "var(--text-inverse)" }}
                  >
                    <Plus className="h-4 w-4" />
                    New AI Chat
                  </Link>
                )}
              </motion.div>
            ) : (
              <motion.div
                key={filter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="grid gap-4"
                style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}
              >
                {filtered.map((trade, i) => (
                  <motion.div
                    key={trade.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <TradeCard {...trade} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Quick insights footer bar ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="mt-6 grid gap-4 sm:grid-cols-3"
        >
          {[
            {
              icon: TrendingUp,
              title: "Best performer",
              value: "AVAX/USD",
              subtext: "+8.64% · Long",
              color: "var(--semantic-success)",
            },
            {
              icon: Clock,
              title: "Longest open",
              value: "BTC/USD",
              subtext: "3 days active",
              color: "var(--brand-primary)",
            },
            {
              icon: AlertTriangle,
              title: "Largest risk",
              value: "ETH/USD",
              subtext: "Approaching SL",
              color: "var(--semantic-warning)",
            },
          ].map(({ icon: Icon, title, value, subtext, color }) => (
            <div
              key={title}
              className="flex items-center gap-4 rounded-2xl border p-4"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-default)",
              }}
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                style={{ background: `color-mix(in srgb,${color} 10%,transparent)` }}
              >
                <Icon className="h-4.5 w-4.5" style={{ color }} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wide" style={{ color: "var(--text-tertiary)" }}>
                  {title}
                </p>
                <p className="truncate text-sm font-bold" style={{ color: "var(--text-primary)" }}>{value}</p>
                <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>{subtext}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
