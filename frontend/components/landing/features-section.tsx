"use client"

import { motion } from "framer-motion"
import {
  MessageSquare, BarChart3, Brain, Eye, TrendingUp, Shield,
  Bot, Zap, Target, ArrowUpRight, ArrowDownRight, Activity,
  Cpu, LineChart, Bell,
} from "lucide-react"
import { SlideUpOnScroll } from "@/components/ui/animated-layout"

const FEATURES = [
  {
    icon: MessageSquare,
    title: "Conversational Research",
    description: "Chat naturally to research any cryptocurrency. Tag assets with @ and get instant technical analysis, charts, and market insights.",
    accent: "var(--brand-primary)",
    accentBg: "var(--brand-subtle)",
    large: true,
    preview: "chat",
  },
  {
    icon: Brain,
    title: "AI Strategy Generation",
    description: "Describe your thesis and Alpha generates a complete strategy with entry, target, stop-loss, and invalidation logic.",
    accent: "#7C3AED",
    accentBg: "rgba(124,58,237,0.08)",
    large: true,
    preview: "strategy",
  },
  {
    icon: BarChart3,
    title: "Interactive Charts",
    description: "Real-time charts with RSI, EMA, MACD overlays — embedded right in the conversation flow.",
    accent: "var(--semantic-success)",
    accentBg: "var(--semantic-success-subtle)",
    preview: "chart",
  },
  {
    icon: Eye,
    title: "AI Monitoring Agent",
    description: "Background AI watches your trades 24/7 and alerts on invalidation, TP hit, or risk changes.",
    accent: "var(--semantic-warning)",
    accentBg: "var(--semantic-warning-subtle)",
    preview: "monitor",
  },
  {
    icon: Activity,
    title: "Portfolio Dashboard",
    description: "See all positions, P/L, win rate, and performance charts at a glance.",
    accent: "#3b82f6",
    accentBg: "rgba(59,130,246,0.08)",
    preview: "portfolio",
  },
  {
    icon: Shield,
    title: "Risk Management",
    description: "Auto-calculated R:R ratios, position sizing, and SL/TP recommendations for every trade.",
    accent: "var(--semantic-danger)",
    accentBg: "var(--semantic-danger-subtle)",
    preview: "risk",
  },
]

/* ── Inline visual previews for each feature card ────────────────────────── */
function ChatPreview() {
  return (
    <div className="mt-4 space-y-2">
      {[
        { side: "right", text: "Analyze @SOL for a swing trade" },
        { side: "left", text: "SOL forming a bull flag on 4H. RSI divergence positive at 52..." },
      ].map((m, i) => (
        <div key={i} className={`flex ${m.side === "right" ? "justify-end" : "justify-start"}`}>
          <div
            className="max-w-[85%] rounded-lg px-3 py-1.5 text-xs"
            style={
              m.side === "right"
                ? { background: "var(--btn-primary-bg)", color: "var(--text-inverse)" }
                : { background: "var(--bg-surface-raised)", color: "var(--text-secondary)", border: "1px solid var(--border-default)" }
            }
          >
            {m.text}
          </div>
        </div>
      ))}
    </div>
  )
}

function StrategyPreview() {
  return (
    <div
      className="mt-4 rounded-lg p-3 text-[11px]"
      style={{ background: "var(--semantic-success-subtle)", border: "1px solid rgba(22,163,74,0.15)" }}
    >
      <div className="flex items-center gap-1.5 mb-2">
        <TrendingUp className="h-3 w-3" style={{ color: "var(--semantic-success)" }} />
        <span className="font-bold" style={{ color: "var(--semantic-success)" }}>Long ETH/USD</span>
        <span className="ml-auto font-mono" style={{ color: "var(--semantic-success)" }}>R:R 2.8</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[["Entry", "$3,420"], ["TP", "$3,800"], ["SL", "$3,280"]].map(([l, v]) => (
          <div key={l}>
            <div style={{ color: "var(--text-tertiary)" }}>{l}</div>
            <div className="font-mono font-semibold" style={{ color: "var(--text-primary)" }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ChartPreview() {
  /* SVG mini-chart */
  const pts = [40, 35, 38, 32, 36, 42, 45, 41, 48, 52, 49, 55]
  const W = 200, H = 60
  const path = pts.map((v, i) => `${i === 0 ? "M" : "L"} ${(i / (pts.length - 1)) * W} ${H - (v / 60) * H}`).join(" ")
  return (
    <div className="mt-4 rounded-lg overflow-hidden" style={{ background: "var(--bg-surface-raised)", border: "1px solid var(--border-default)" }}>
      <div className="px-3 pt-2 flex items-center gap-2">
        <span className="text-[10px] font-bold" style={{ color: "var(--text-primary)" }}>SOL/USD</span>
        <span className="text-[10px] font-mono" style={{ color: "var(--semantic-success)" }}>+4.2%</span>
        <div className="ml-auto flex gap-1">
          {["1H", "4H", "1D"].map((tf, i) => (
            <span key={tf} className="text-[9px] px-1.5 py-0.5 rounded" style={{
              background: i === 1 ? "var(--bg-active)" : "transparent",
              color: i === 1 ? "var(--text-primary)" : "var(--text-tertiary)",
            }}>{tf}</span>
          ))}
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 50 }}>
        <path d={path} fill="none" stroke="var(--semantic-success)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  )
}

function MonitorPreview() {
  return (
    <div className="mt-4 space-y-2">
      {[
        { icon: Bell, text: "BTC approaching TP at $72K", color: "var(--semantic-success)" },
        { icon: Bell, text: "ETH SL danger — price at $3,060", color: "var(--semantic-danger)" },
      ].map(({ icon: Icon, text, color }, i) => (
        <div key={i} className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs"
          style={{ background: `color-mix(in srgb,${color} 8%,transparent)`, border: `1px solid color-mix(in srgb,${color} 15%,transparent)` }}
        >
          <Icon className="h-3 w-3 shrink-0" style={{ color }} />
          <span style={{ color: "var(--text-primary)" }}>{text}</span>
        </div>
      ))}
    </div>
  )
}

function PortfolioPreview() {
  return (
    <div className="mt-4 grid grid-cols-2 gap-2">
      {[
        { label: "Total P/L", value: "+$2,565", color: "var(--semantic-success)" },
        { label: "Win Rate", value: "76%", color: "var(--brand-primary)" },
        { label: "Active", value: "4", color: "var(--text-primary)" },
        { label: "Alerts", value: "1", color: "var(--semantic-warning)" },
      ].map(({ label, value, color }) => (
        <div key={label} className="rounded-lg p-2.5" style={{ background: "var(--bg-surface-raised)", border: "1px solid var(--border-default)" }}>
          <div className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>{label}</div>
          <div className="font-mono text-sm font-bold" style={{ color }}>{value}</div>
        </div>
      ))}
    </div>
  )
}

function RiskPreview() {
  return (
    <div className="mt-4 space-y-2">
      {[
        { asset: "BTC", rrText: "R/R 3.2", pct: 78, good: true },
        { asset: "ETH", rrText: "R/R 1.1", pct: 35, good: false },
      ].map(({ asset, rrText, pct, good }) => (
        <div key={asset} className="flex items-center gap-3 text-xs">
          <span className="w-8 font-bold" style={{ color: "var(--text-primary)" }}>{asset}</span>
          <div className="flex-1 h-1.5 rounded-full" style={{ background: "var(--bg-active)" }}>
            <div className="h-full rounded-full" style={{
              width: `${pct}%`,
              background: good ? "var(--semantic-success)" : "var(--semantic-danger)",
            }} />
          </div>
          <span className="font-mono" style={{ color: good ? "var(--semantic-success)" : "var(--semantic-danger)" }}>{rrText}</span>
        </div>
      ))}
    </div>
  )
}

const PREVIEW_MAP: Record<string, React.FC> = {
  chat: ChatPreview,
  strategy: StrategyPreview,
  chart: ChartPreview,
  monitor: MonitorPreview,
  portfolio: PortfolioPreview,
  risk: RiskPreview,
}

function FeatureCard({ feature, delay }: { feature: (typeof FEATURES)[0]; delay: number }) {
  const Icon = feature.icon
  const Preview = feature.preview ? PREVIEW_MAP[feature.preview] : null
  return (
    <SlideUpOnScroll delay={delay} className={feature.large ? "bento-card-lg" : ""}>
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2 }}
        className="group h-full rounded-2xl p-6 cursor-default overflow-hidden"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-default)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div className="flex items-start justify-between">
          <div
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: feature.accentBg }}
          >
            <Icon className="h-5 w-5" style={{ color: feature.accent }} />
          </div>
          <ArrowUpRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-50" style={{ color: "var(--text-tertiary)" }} />
        </div>
        <h3
          className={`font-semibold ${feature.large ? "text-xl" : "text-base"} mt-4 mb-2`}
          style={{ color: "var(--text-primary)" }}
        >
          {feature.title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {feature.description}
        </p>
        {/* Inline preview */}
        {Preview && <Preview />}
      </motion.div>
    </SlideUpOnScroll>
  )
}

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 md:py-32" style={{ background: "var(--bg-canvas)" }}>
      <div className="mx-auto max-w-7xl px-6">
        <SlideUpOnScroll>
          <div className="mb-16 text-center">
            <div
              className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold"
              style={{ background: "var(--brand-subtle)", color: "var(--brand-primary)" }}
            >
              Everything you need
            </div>
            <h2
              className="text-4xl font-bold tracking-tight md:text-5xl"
              style={{ color: "var(--text-primary)" }}
            >
              The complete AI trading
              <br />
              <span className="gradient-text">research toolkit</span>
            </h2>
            <p
              className="mx-auto mt-4 max-w-lg text-base leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              From research to execution, Alpha covers every step of your trading workflow — powered by AI.
            </p>
          </div>
        </SlideUpOnScroll>

        <div className="bento-grid">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} delay={i * 0.06} />
          ))}
        </div>
      </div>
    </section>
  )
}
