"use client"

import { motion } from "framer-motion"
import { SlideUpOnScroll } from "@/components/ui/animated-layout"
import {
    MessageSquare, BarChart3, Target, Zap,
    ArrowRight, CheckCircle2,
} from "lucide-react"

const STEPS = [
    {
        number: "01",
        icon: MessageSquare,
        title: "Ask Alpha anything",
        description: "Type a question in natural language — or tag an asset with @ to research specific cryptocurrencies. Alpha understands market context.",
        color: "var(--brand-primary)",
        features: ["Natural language queries", "@ asset tagging", "Multi-asset analysis"],
    },
    {
        number: "02",
        icon: BarChart3,
        title: "Get AI-powered analysis",
        description: "Alpha analyzes technicals, fundamentals, on-chain data, and market sentiment — then presents clear, actionable insights with live charts.",
        color: "#7C3AED",
        features: ["Technical indicator overlays", "Chart pattern recognition", "Sentiment analysis"],
    },
    {
        number: "03",
        icon: Target,
        title: "Generate a strategy",
        description: "Alpha builds a complete trade setup with defined entry, take-profit, stop-loss, position sizing, and invalidation conditions.",
        color: "var(--semantic-success)",
        features: ["Auto risk/reward calculation", "Position size recommendations", "Invalidation rules"],
    },
    {
        number: "04",
        icon: Zap,
        title: "Monitor & manage",
        description: "Add the trade to your portfolio and let Alpha's AI agent monitor it 24/7. Get alerts when conditions change or targets are hit.",
        color: "var(--semantic-warning)",
        features: ["24/7 background monitoring", "Real-time alert system", "Auto-exit suggestions"],
    },
]

export function HowItWorksSection() {
    return (
        <section
            id="how-it-works"
            className="py-24 md:py-32"
            style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border-default)", borderBottom: "1px solid var(--border-default)" }}
        >
            <div className="mx-auto max-w-7xl px-6">
                <SlideUpOnScroll>
                    <div className="mb-16 text-center">
                        <div
                            className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold"
                            style={{ background: "rgba(124,58,237,0.08)", color: "#7C3AED" }}
                        >
                            How it works
                        </div>
                        <h2
                            className="text-4xl font-bold tracking-tight md:text-5xl"
                            style={{ color: "var(--text-primary)" }}
                        >
                            From question to trade
                            <br />
                            <span className="gradient-text">in four steps</span>
                        </h2>
                        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                            Alpha combines research, strategy, and execution into a single conversational workflow.
                        </p>
                    </div>
                </SlideUpOnScroll>

                {/* Steps */}
                <div className="relative">
                    {/* Connecting line (desktop) */}
                    <div
                        className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 md:block"
                        style={{ background: "linear-gradient(to bottom, var(--border-default), transparent)" }}
                    />

                    <div className="space-y-12 md:space-y-24">
                        {STEPS.map((step, i) => {
                            const isEven = i % 2 === 0
                            return (
                                <SlideUpOnScroll key={step.number} delay={i * 0.08}>
                                    <div className={`flex flex-col gap-8 md:flex-row md:items-center ${isEven ? "" : "md:flex-row-reverse"}`}>
                                        {/* Content */}
                                        <div className={`flex-1 ${isEven ? "md:text-right md:pr-16" : "md:text-left md:pl-16"}`}>
                                            <div
                                                className={`mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${isEven ? "" : ""}`}
                                                style={{ background: `color-mix(in srgb,${step.color} 10%,transparent)`, color: step.color }}
                                            >
                                                Step {step.number}
                                            </div>
                                            <h3 className="text-2xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
                                                {step.title}
                                            </h3>
                                            <p className="text-sm leading-relaxed max-w-md" style={{ color: "var(--text-secondary)" }}>
                                                {step.description}
                                            </p>
                                            <div className={`mt-4 flex flex-wrap gap-2 ${isEven ? "md:justify-end" : ""}`}>
                                                {step.features.map((f) => (
                                                    <span
                                                        key={f}
                                                        className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
                                                        style={{ background: "var(--bg-surface-raised)", color: "var(--text-secondary)", border: "1px solid var(--border-default)" }}
                                                    >
                                                        <CheckCircle2 className="h-3 w-3" style={{ color: step.color }} />
                                                        {f}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Center icon (connector) */}
                                        <div className="hidden md:flex relative z-10">
                                            <motion.div
                                                whileHover={{ scale: 1.1 }}
                                                className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg"
                                                style={{
                                                    background: step.color,
                                                    boxShadow: `0 8px 24px color-mix(in srgb,${step.color} 30%,transparent)`,
                                                }}
                                            >
                                                <step.icon className="h-6 w-6 text-white" />
                                            </motion.div>
                                        </div>

                                        {/* Visual card */}
                                        <div className="flex-1">
                                            <div
                                                className="rounded-2xl p-5 overflow-hidden"
                                                style={{
                                                    background: "var(--bg-canvas)",
                                                    border: "1px solid var(--border-default)",
                                                    boxShadow: "var(--shadow-sm)",
                                                }}
                                            >
                                                {/* Mini preview per step */}
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg"
                                                        style={{ background: `color-mix(in srgb,${step.color} 10%,transparent)` }}
                                                    >
                                                        <step.icon className="h-4 w-4" style={{ color: step.color }} />
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{step.title}</div>
                                                        <div className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Alpha AI</div>
                                                    </div>
                                                </div>
                                                {/* Content bars (skeleton-like preview) */}
                                                <div className="space-y-2">
                                                    <div className="h-2.5 w-full rounded-full" style={{ background: "var(--bg-surface-raised)" }} />
                                                    <div className="h-2.5 w-4/5 rounded-full" style={{ background: "var(--bg-surface-raised)" }} />
                                                    <div className="h-2.5 w-3/5 rounded-full" style={{ background: "var(--bg-surface-raised)" }} />
                                                </div>
                                                {/* Accent bar */}
                                                <div className="mt-4 h-1 w-full rounded-full overflow-hidden" style={{ background: "var(--bg-active)" }}>
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: `${25 * (i + 1)}%` }}
                                                        viewport={{ once: true }}
                                                        transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                                                        className="h-full rounded-full"
                                                        style={{ background: step.color }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SlideUpOnScroll>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}
