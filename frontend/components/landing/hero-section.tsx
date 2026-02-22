"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { ArrowRight, Sparkles, TrendingUp, Shield, Zap } from "lucide-react"

const STATS = [
  { value: "10K+", label: "Active traders" },
  { value: "$2.4B", label: "Volume analyzed" },
  { value: "98%", label: "Uptime SLA" },
]

/* Animated gradient mesh background */
function GradientMesh() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Blob 1 — blue */}
      <motion.div
        className="absolute gradient-blob"
        style={{
          width: 700,
          height: 700,
          background: "radial-gradient(circle, rgba(37,99,235,0.22) 0%, transparent 70%)",
          top: "-15%",
          left: "-10%",
        }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Blob 2 — violet */}
      <motion.div
        className="absolute gradient-blob"
        style={{
          width: 500,
          height: 500,
          background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)",
          top: "5%",
          right: "-5%",
        }}
        animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      {/* Blob 3 — emerald */}
      <motion.div
        className="absolute gradient-blob"
        style={{
          width: 400,
          height: 400,
          background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)",
          bottom: "0%",
          left: "30%",
        }}
        animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />
      {/* Grid overlay */}
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

/* Animated hero mockup card */
function HeroMockup() {
  return (
    <motion.div
      className="relative mx-auto w-full max-w-[520px]"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Glow behind card */}
      <div
        className="absolute inset-0 rounded-2xl blur-2xl opacity-30"
        style={{ background: "radial-gradient(circle, rgba(37,99,235,0.4), transparent 70%)", transform: "scale(0.9) translateY(8px)" }}
      />
      {/* Card */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-default)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {/* Window chrome */}
        <div
          className="flex items-center gap-2 px-4 py-3"
          style={{ borderBottom: "1px solid var(--border-default)", background: "var(--bg-surface-raised)" }}
        >
          <div className="h-3 w-3 rounded-full bg-red-400/80" />
          <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
          <div className="h-3 w-3 rounded-full bg-green-400/80" />
          <div className="ml-auto flex items-center gap-1.5">
            <div className="h-2 w-16 rounded-full alpha-skeleton" />
          </div>
        </div>
        {/* Chat messages */}
        <div className="p-4 space-y-3">
          {[
            { role: "user", content: "Analyze @BTC technicals on the 4H chart" },
            { role: "ai", content: "BTC/USD showing bullish structure. RSI at 58 with room to run. Key resistance at $69,800." },
          ].map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.3, duration: 0.4 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className="max-w-[80%] rounded-xl px-3 py-2 text-sm"
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
          {/* Strategy card mini */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.4 }}
            className="rounded-xl p-3"
            style={{ background: "var(--semantic-success-subtle)", border: "1px solid rgba(22,163,74,0.2)" }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <TrendingUp className="h-3.5 w-3.5" style={{ color: "var(--semantic-success)" }} />
              <span className="text-xs font-semibold" style={{ color: "var(--semantic-success)" }}>Long BTC/USD</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              {[["Entry", "$67,450"], ["TP", "$72,000"], ["SL", "$65,200"]].map(([label, val]) => (
                <div key={label}>
                  <div style={{ color: "var(--text-tertiary)" }}>{label}</div>
                  <div className="font-mono font-semibold" style={{ color: "var(--text-primary)" }}>{val}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-24 md:py-36">
      <GradientMesh />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 flex justify-center"
        >
          <div
            className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium"
            style={{
              background: "var(--brand-subtle)",
              borderColor: "rgba(37,99,235,0.2)",
              color: "var(--brand-primary)",
            }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI-Native Trading Research Platform
            <ArrowRight className="h-3 w-3" />
          </div>
        </motion.div>

        {/* Main heading + subtext */}
        <div className="text-center mb-14">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl"
            style={{ color: "var(--text-primary)", lineHeight: 1.08 }}
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
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold transition-all duration-200"
                style={{
                  background: "var(--btn-primary-bg)",
                  color: "var(--text-inverse)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                }}
              >
                Get started — it&apos;s free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
            <Link
              href="#features"
              className="inline-flex items-center gap-2 rounded-xl border px-6 py-3.5 text-sm font-medium transition-all duration-150"
              style={{
                borderColor: "var(--border-default)",
                color: "var(--text-primary)",
                background: "var(--bg-surface)",
              }}
            >
              See how it works
            </Link>
          </motion.div>

          {/* Social proof stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-8"
          >
            {STATS.map(({ value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="text-center"
              >
                <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                  {value}
                </p>
                <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* App mockup */}
        <HeroMockup />

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-6"
        >
          {[
            { icon: Shield, label: "SOC 2 Compliant" },
            { icon: Zap, label: "99.9% Uptime" },
            { icon: Sparkles, label: "GPT-4 Powered" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 text-xs"
              style={{ color: "var(--text-tertiary)" }}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
