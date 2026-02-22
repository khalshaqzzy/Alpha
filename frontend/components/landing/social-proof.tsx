"use client"

import { motion } from "framer-motion"
import { SlideUpOnScroll } from "@/components/ui/animated-layout"
import {
  Bitcoin,
  TrendingUp,
  Shield,
  BarChart3,
  Zap,
  Brain,
  Globe,
} from "lucide-react"

const CRYPTO_LOGOS = [
  { icon: Bitcoin, label: "Bitcoin" },
  { icon: TrendingUp, label: "Ethereum" },
  { icon: Zap, label: "Solana" },
  { icon: Globe, label: "Avalanche" },
  { icon: BarChart3, label: "Chainlink" },
  { icon: Brain, label: "Polygon" },
  { icon: Shield, label: "Cosmos" },
]

const TESTIMONIALS = [
  {
    text: "Alpha completely changed how I approach crypto research. What used to take hours now takes minutes.",
    author: "Alex K.",
    role: "Crypto Trader",
    avatar: "AK",
  },
  {
    text: "The AI strategy cards are insane. It catches levels I'd have missed and lays out the whole trade.",
    author: "Maria S.",
    role: "Portfolio Manager",
    avatar: "MS",
  },
  {
    text: "The monitoring agent is like having a hawk watching my positions 24/7. Game changer.",
    author: "James L.",
    role: "Full-time Trader",
    avatar: "JL",
  },
]

export function SocialProof() {
  return (
    <section
      className="overflow-hidden py-20"
      style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border-default)", borderBottom: "1px solid var(--border-default)" }}
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Supported assets */}
        <SlideUpOnScroll>
          <p
            className="mb-6 text-center text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--text-tertiary)" }}
          >
            Research any asset
          </p>
        </SlideUpOnScroll>

        {/* Marquee ticker */}
        <div className="marquee-container mb-16">
          <div className="marquee-track">
            {[...CRYPTO_LOGOS, ...CRYPTO_LOGOS].map(({ icon: Icon, label }, i) => (
              <div
                key={`${label}-${i}`}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ background: "var(--bg-surface-raised)", border: "1px solid var(--border-default)" }}
                >
                  <Icon className="h-4 w-4" style={{ color: "var(--text-secondary)" }} />
                </div>
                <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <SlideUpOnScroll key={t.author} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl p-6"
                style={{
                  background: "var(--bg-surface-raised)",
                  border: "1px solid var(--border-default)",
                }}
              >
                {/* Stars */}
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <span key={s} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>
                <p
                  className="mb-4 text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold"
                    style={{
                      background: "var(--brand-subtle)",
                      color: "var(--brand-primary)",
                    }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      {t.author}
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                      {t.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </SlideUpOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
