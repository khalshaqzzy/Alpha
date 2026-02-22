"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import {
  ArrowRight, Sparkles, TrendingUp, Shield, Zap, BarChart3,
  Activity, Bot, Diamond, ChevronRight, CheckCircle2,
} from "lucide-react"

const STATS = [
  { value: "10K+", label: "Active traders" },
  { value: "$2.4B", label: "Volume analyzed" },
  { value: "98%", label: "Uptime SLA" },
  { value: "4.9", label: "User rating" },
]

/* Animated gradient mesh background */
function GradientMesh() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute gradient-blob"
        style={{
          width: 800, height: 800,
          background: "radial-gradient(circle, rgba(37,99,235,0.2) 0%, transparent 70%)",
          top: "-20%", left: "-15%",
        }}
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute gradient-blob"
        style={{
          width: 600, height: 600,
          background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)",
          top: "0%", right: "-10%",
        }}
        animate={{ x: [0, -50, 0], y: [0, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute gradient-blob"
        style={{
          width: 500, height: 500,
          background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)",
          bottom: "-5%", left: "35%",
        }}
        animate={{ x: [0, 25, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  )
}

/* ── Animated mockup: much richer - shows dashboard + chat switching ──── */
function HeroMockup() {
  return (
    <motion.div
      className="relative mx-auto w-full max-w-3xl"
      initial={{ opacity: 0, y: 40, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Glow */}
      <div
        className="absolute -inset-4 rounded-3xl blur-3xl opacity-25"
        style={{ background: "radial-gradient(circle, rgba(37,99,235,0.5), transparent 70%)" }}
      />

      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-default)",
          boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
        }}
      >
        {/* Window chrome */}
        <div
          className="flex items-center gap-2 px-4 py-3"
          style={{ borderBottom: "1px solid var(--border-default)", background: "var(--bg-surface-raised)" }}
        >
          <div className="h-3 w-3 rounded-full" style={{ background: "#ef4444" }} />
          <div className="h-3 w-3 rounded-full" style={{ background: "#f59e0b" }} />
          <div className="h-3 w-3 rounded-full" style={{ background: "#22c55e" }} />
          <div className="mx-auto flex items-center gap-2">
            <Diamond className="h-3 w-3" style={{ color: "var(--brand-primary)" }} />
            <span className="text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>Alpha — AI Trading Research</span>
          </div>
        </div>

        {/* App content */}
        <div className="flex" style={{ minHeight: 340 }}>
          {/* Mini sidebar */}
          <div
            className="hidden md:flex w-[180px] shrink-0 flex-col p-3 gap-1"
            style={{ borderRight: "1px solid var(--border-default)", background: "var(--bg-surface-raised)" }}
          >
            {[
              { icon: Sparkles, label: "New Chat", active: true },
              { icon: BarChart3, label: "Dashboard", active: false },
              { icon: Activity, label: "Positions", active: false },
            ].map(({ icon: Icon, label, active }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium"
                style={{
                  background: active ? "var(--bg-active)" : "transparent",
                  color: active ? "var(--text-primary)" : "var(--text-tertiary)",
                }}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </div>
            ))}
            <div className="mt-auto">
              <div className="h-px mb-2" style={{ background: "var(--border-default)" }} />
              <div className="flex items-center gap-2 rounded-lg px-3 py-2">
                <div
                  className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold"
                  style={{ background: "var(--brand-subtle)", color: "var(--brand-primary)" }}
                >
                  AT
                </div>
                <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Alex T.</span>
              </div>
            </div>
          </div>

          {/* Main chat area */}
          <div className="flex-1 p-4 space-y-3">
            {[
              { role: "user", content: "Analyze @BTC technicals on the 4H chart", delay: 0.9 },
              { role: "ai", content: "BTC/USD showing bullish structure on 4H. RSI at 58 with room to run. Price holding above 50-EMA. Key levels:", delay: 1.3 },
            ].map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: msg.delay, duration: 0.4 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start gap-2"}`}
              >
                {msg.role === "ai" && (
                  <div
                    className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                    style={{ background: "var(--brand-subtle)" }}
                  >
                    <Bot className="h-3 w-3" style={{ color: "var(--brand-primary)" }} />
                  </div>
                )}
                <div
                  className="max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed"
                  style={
                    msg.role === "user"
                      ? { background: "var(--btn-primary-bg)", color: "var(--text-inverse)" }
                      : { background: "var(--bg-surface-raised)", color: "var(--text-primary)", border: "1px solid var(--border-default)" }
                  }
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}

            {/* Strategy card */}
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1.8, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="ml-8 rounded-xl overflow-hidden"
              style={{ border: "1px solid rgba(22,163,74,0.25)" }}
            >
              <div
                className="h-1"
                style={{ background: "var(--semantic-success)" }}
              />
              <div className="p-3.5" style={{ background: "var(--semantic-success-subtle)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-3.5 w-3.5" style={{ color: "var(--semantic-success)" }} />
                  <span className="text-xs font-bold" style={{ color: "var(--semantic-success)" }}>Long BTC/USD</span>
                  <span
                    className="ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold"
                    style={{ background: "rgba(22,163,74,0.15)", color: "var(--semantic-success)" }}
                  >
                    R:R 3.2
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[11px]">
                  {[["Entry", "$67,450"], ["TP", "$72,000"], ["SL", "$65,200"], ["Size", "5%"]].map(([label, val]) => (
                    <div key={label}>
                      <div style={{ color: "var(--text-tertiary)" }}>{label}</div>
                      <div className="font-mono font-semibold" style={{ color: "var(--text-primary)" }}>{val}</div>
                    </div>
                  ))}
                </div>
                {/* Mini progress bar */}
                <div className="mt-2.5 flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-active)" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "42%" }}
                      transition={{ delay: 2.2, duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: "var(--semantic-success)" }}
                    />
                  </div>
                  <span className="text-[10px] font-mono font-bold" style={{ color: "var(--semantic-success)" }}>+2.67%</span>
                </div>
              </div>
            </motion.div>

            {/* Typing indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.6 }}
              className="flex items-center gap-2 ml-8"
            >
              <div
                className="flex h-6 w-6 items-center justify-center rounded-full"
                style={{ background: "var(--brand-subtle)" }}
              >
                <Bot className="h-3 w-3" style={{ color: "var(--brand-primary)" }} />
              </div>
              <div className="dot-pulse" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-36">
      <GradientMesh />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 flex justify-center"
        >
          <div
            className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium"
            style={{ background: "var(--brand-subtle)", borderColor: "rgba(37,99,235,0.2)", color: "var(--brand-primary)" }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI-Native Trading Research Platform
            <ChevronRight className="h-3 w-3 opacity-60" />
          </div>
        </motion.div>

        {/* Heading */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl font-bold tracking-tight md:text-7xl lg:text-[5.5rem]"
            style={{ color: "var(--text-primary)", lineHeight: 1.05 }}
          >
            Trade smarter
            <br />
            <span className="gradient-text">with AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            Research any crypto, build strategies, and monitor your portfolio —
            all through a natural conversation with a powerful AI agent.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <motion.div whileTap={{ scale: 0.97 }}>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold transition-all duration-200"
                style={{ background: "var(--btn-primary-bg)", color: "var(--text-inverse)", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}
              >
                Get started — it&apos;s free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
            <Link
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-xl border px-6 py-3.5 text-sm font-medium transition-all duration-150"
              style={{ borderColor: "var(--border-default)", color: "var(--text-primary)", background: "var(--bg-surface)" }}
            >
              See how it works
            </Link>
          </motion.div>

          {/* Small trust */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="mt-5 flex items-center justify-center gap-4 text-xs"
            style={{ color: "var(--text-tertiary)" }}
          >
            {["No credit card required", "Free tier available", "SOC 2 Compliant"].map((t) => (
              <span key={t} className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" style={{ color: "var(--semantic-success)" }} />
                {t}
              </span>
            ))}
          </motion.div>
        </div>

        {/* App mockup */}
        <HeroMockup />

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="mx-auto mt-16 grid max-w-2xl grid-cols-2 gap-6 sm:grid-cols-4"
        >
          {STATS.map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 + i * 0.08 }}
              className="text-center"
            >
              <p className="text-3xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
                {value}
              </p>
              <p className="mt-1 text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>{label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
