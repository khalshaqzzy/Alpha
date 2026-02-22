"use client"

import { motion } from "framer-motion"
import {
  MessageSquare,
  BarChart3,
  Brain,
  Eye,
  TrendingUp,
  Shield,
  Zap,
  Target,
} from "lucide-react"
import { SlideUpOnScroll } from "@/components/ui/animated-layout"

const features = [
  {
    icon: MessageSquare,
    title: "Conversational Research",
    description:
      "Chat with AI to research any cryptocurrency. Tag assets with @ and get instant technical analysis, charts, and market insights.",
    large: true,
    accent: "var(--brand-primary)",
    accentBg: "var(--brand-subtle)",
  },
  {
    icon: Brain,
    title: "AI Strategy Generation",
    description:
      "Describe your thesis and Alpha generates a complete trading strategy with entry, target, stop-loss, and logic.",
    large: true,
    accent: "#7C3AED",
    accentBg: "rgba(124,58,237,0.08)",
  },
  {
    icon: BarChart3,
    title: "Interactive Charts",
    description: "Live charts with technical indicators — built into the conversation.",
    accent: "var(--semantic-success)",
    accentBg: "var(--semantic-success-subtle)",
  },
  {
    icon: Eye,
    title: "AI Monitoring Agent",
    description: "Background agent watches your trades and alerts you when conditions are met.",
    accent: "var(--semantic-warning)",
    accentBg: "var(--semantic-warning-subtle)",
  },
  {
    icon: TrendingUp,
    title: "Portfolio Dashboard",
    description: "Track all your positions and P/L at a glance.",
    accent: "var(--semantic-success)",
    accentBg: "var(--semantic-success-subtle)",
  },
  {
    icon: Shield,
    title: "Risk Management",
    description: "Auto-calculated risk/reward ratios and position sizing.",
    accent: "var(--semantic-danger)",
    accentBg: "var(--semantic-danger-subtle)",
  },
]

function FeatureCard({
  feature,
  delay,
  large,
}: {
  feature: (typeof features)[0]
  delay: number
  large?: boolean
}) {
  const Icon = feature.icon
  return (
    <SlideUpOnScroll delay={delay} className={large ? "bento-card-lg" : ""}>
      <motion.div
        whileHover={{ y: -2, boxShadow: "var(--shadow-md)" }}
        transition={{ duration: 0.2 }}
        className="h-full rounded-2xl p-6 cursor-default"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-default)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div
          className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl"
          style={{
            background: feature.accentBg,
          }}
        >
          <Icon className="h-5 w-5" style={{ color: feature.accent }} />
        </div>
        <h3
          className={`font-semibold ${large ? "text-xl" : "text-base"} mb-2`}
          style={{ color: "var(--text-primary)" }}
        >
          {feature.title}
        </h3>
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          {feature.description}
        </p>
        {large && (
          <div
            className="mt-4 h-px"
            style={{
              background: `linear-gradient(to right, ${feature.accentBg}, transparent)`,
            }}
          />
        )}
      </motion.div>
    </SlideUpOnScroll>
  )
}

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 md:py-32" style={{ background: "var(--bg-canvas)" }}>
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <SlideUpOnScroll>
          <div className="mb-16 text-center">
            <div
              className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold"
              style={{
                background: "var(--brand-subtle)",
                color: "var(--brand-primary)",
              }}
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

        {/* Bento grid */}
        <div className="bento-grid">
          {features.map((feature, i) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
              delay={i * 0.06}
              large={feature.large}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
