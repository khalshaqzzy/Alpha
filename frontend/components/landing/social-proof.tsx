"use client"

import { motion } from "framer-motion"
import { SlideUpOnScroll } from "@/components/ui/animated-layout"
import {
  Bitcoin, TrendingUp, Zap, Globe, BarChart3, Brain, Shield,
  Star, Quote,
} from "lucide-react"

const CRYPTO_LOGOS = [
  { icon: Bitcoin, label: "Bitcoin", price: "$69,240", change: "+2.1%" },
  { icon: TrendingUp, label: "Ethereum", price: "$3,820", change: "+1.4%" },
  { icon: Zap, label: "Solana", price: "$155.20", change: "+4.5%" },
  { icon: Globe, label: "Avalanche", price: "$41.50", change: "+3.2%" },
  { icon: BarChart3, label: "Chainlink", price: "$18.40", change: "-0.8%" },
  { icon: Brain, label: "Polygon", price: "$0.92", change: "+1.1%" },
  { icon: Shield, label: "Cosmos", price: "$12.30", change: "+0.6%" },
]

const TESTIMONIALS = [
  {
    text: "Alpha completely changed how I approach crypto research. What used to take hours now takes minutes. The strategy cards are incredibly accurate.",
    author: "Alex K.",
    role: "Crypto Trader · 3 years",
    avatar: "AK",
    rating: 5,
    highlight: "What used to take hours now takes minutes.",
  },
  {
    text: "The AI strategy cards are insane. It catches levels I'd have missed and lays out the whole trade with clear entry, TP, and SL. My win rate went from 52% to 71%.",
    author: "Maria S.",
    role: "Portfolio Manager · DeFi Fund",
    avatar: "MS",
    rating: 5,
    highlight: "My win rate went from 52% to 71%.",
  },
  {
    text: "The monitoring agent is like having a hawk watching my positions 24/7. I got an alert about ETH approaching my SL at 3am — saved me $1,200.",
    author: "James L.",
    role: "Full-time Trader",
    avatar: "JL",
    rating: 5,
    highlight: "saved me $1,200.",
  },
  {
    text: "I manage a small fund and Alpha's team features are perfect. We share research, compare strategies, and the analytics dashboard keeps everyone aligned.",
    author: "Sarah W.",
    role: "Fund Manager · Apex Capital",
    avatar: "SW",
    rating: 5,
    highlight: "keeps everyone aligned.",
  },
  {
    text: "As a beginner, I was lost with charts and indicators. Alpha explains everything in plain English and walks me through each trade. Best learning tool I've found.",
    author: "Daniel R.",
    role: "Retail Investor",
    avatar: "DR",
    rating: 5,
    highlight: "Best learning tool I've found.",
  },
  {
    text: "The backtesting feature alone is worth the Pro subscription. I tested my thesis on SOL before committing capital and it showed me exactly where my idea was wrong.",
    author: "Nina T.",
    role: "Swing Trader",
    avatar: "NT",
    rating: 5,
    highlight: "worth the Pro subscription.",
  },
]

const COUNTER_STATS = [
  { value: "10,000+", label: "Active traders" },
  { value: "$2.4B+", label: "Volume analyzed" },
  { value: "1.2M+", label: "AI conversations" },
  { value: "500+", label: "Supported assets" },
]

export function SocialProof() {
  return (
    <section
      className="overflow-hidden py-20 md:py-28"
      style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border-default)", borderBottom: "1px solid var(--border-default)" }}
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Label */}
        <SlideUpOnScroll>
          <p
            className="mb-6 text-center text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--text-tertiary)" }}
          >
            Research any asset · Real-time data
          </p>
        </SlideUpOnScroll>

        {/* Marquee ticker — now with prices */}
        <div className="marquee-container mb-16">
          <div className="marquee-track">
            {[...CRYPTO_LOGOS, ...CRYPTO_LOGOS].map(({ icon: Icon, label, price, change }, i) => (
              <div key={`${label}-${i}`} className="flex items-center gap-2.5 whitespace-nowrap">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ background: "var(--bg-surface-raised)", border: "1px solid var(--border-default)" }}
                >
                  <Icon className="h-4 w-4" style={{ color: "var(--text-secondary)" }} />
                </div>
                <div>
                  <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{label}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono" style={{ color: "var(--text-secondary)" }}>{price}</span>
                    <span
                      className="text-[10px] font-bold"
                      style={{ color: change.startsWith("+") ? "var(--semantic-success)" : "var(--semantic-danger)" }}
                    >
                      {change}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Counter stats row */}
        <SlideUpOnScroll>
          <div className="mx-auto mb-16 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
            {COUNTER_STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>{value}</p>
                <p className="mt-1 text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>{label}</p>
              </div>
            ))}
          </div>
        </SlideUpOnScroll>

        {/* Section heading */}
        <SlideUpOnScroll>
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl" style={{ color: "var(--text-primary)" }}>
              Loved by traders <span className="gradient-text">worldwide</span>
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Hear from real users who transformed their trading workflow with Alpha.
            </p>
          </div>
        </SlideUpOnScroll>

        {/* Testimonial grid — 2 rows × 3 cols */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <SlideUpOnScroll key={t.author} delay={i * 0.06}>
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="flex h-full flex-col rounded-2xl p-6"
                style={{
                  background: "var(--bg-surface-raised)",
                  border: "1px solid var(--border-default)",
                }}
              >
                {/* Stars */}
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, s) => (
                    <Star key={s} className="h-3.5 w-3.5 fill-yellow-400" style={{ color: "#facc15" }} />
                  ))}
                </div>

                {/* Quote */}
                <p className="mb-4 flex-1 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  &ldquo;{t.text}&rdquo;
                </p>

                {/* Highlight callout */}
                <div
                  className="mb-4 rounded-lg px-3 py-2 text-xs font-semibold italic"
                  style={{ background: "var(--brand-subtle)", color: "var(--brand-primary)" }}
                >
                  &ldquo;{t.highlight}&rdquo;
                </div>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold"
                    style={{ background: "var(--brand-subtle)", color: "var(--brand-primary)" }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{t.author}</p>
                    <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>{t.role}</p>
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
