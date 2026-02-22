"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { CheckCircle2, Sparkles, ArrowRight, Zap } from "lucide-react"
import { SlideUpOnScroll } from "@/components/ui/animated-layout"

const PLANS = [
    {
        name: "Free",
        price: "$0",
        period: "forever",
        description: "Perfect for getting started with AI-assisted research.",
        cta: "Get started",
        ctaStyle: "secondary" as const,
        features: [
            "5 AI conversations / day",
            "Basic technical analysis",
            "3 active positions",
            "Standard charts",
            "Community access",
        ],
    },
    {
        name: "Pro",
        price: "$29",
        period: "/month",
        description: "For serious traders who want the full AI advantage.",
        cta: "Start free trial",
        ctaStyle: "primary" as const,
        popular: true,
        features: [
            "Unlimited AI conversations",
            "Advanced multi-indicator analysis",
            "Unlimited positions",
            "Real-time AI monitoring agent",
            "Priority chart rendering",
            "Strategy backtesting",
            "API access",
            "Priority support",
        ],
    },
    {
        name: "Team",
        price: "$79",
        period: "/month",
        description: "For trading teams and fund managers who collaborate.",
        cta: "Contact sales",
        ctaStyle: "secondary" as const,
        features: [
            "Everything in Pro",
            "5 team members included",
            "Shared workspaces",
            "Team analytics dashboard",
            "Custom AI model tuning",
            "Dedicated account manager",
            "SLA guarantee",
            "Custom integrations",
        ],
    },
]

export function PricingSection() {
    const [annual, setAnnual] = useState(false)

    return (
        <section id="pricing" className="py-24 md:py-32" style={{ background: "var(--bg-canvas)" }}>
            <div className="mx-auto max-w-7xl px-6">
                <SlideUpOnScroll>
                    <div className="mb-16 text-center">
                        <div
                            className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold"
                            style={{ background: "var(--semantic-success-subtle)", color: "var(--semantic-success)" }}
                        >
                            Pricing
                        </div>
                        <h2
                            className="text-4xl font-bold tracking-tight md:text-5xl"
                            style={{ color: "var(--text-primary)" }}
                        >
                            Simple, transparent
                            <br />
                            <span className="gradient-text">pricing</span>
                        </h2>
                        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                            Start free. Upgrade when you need more power.
                        </p>

                        {/* Billing toggle */}
                        <div className="mt-8 inline-flex items-center gap-3 rounded-full border p-1" style={{ borderColor: "var(--border-default)", background: "var(--bg-surface)" }}>
                            <button
                                onClick={() => setAnnual(false)}
                                className="rounded-full px-4 py-2 text-sm font-medium transition-all"
                                style={{
                                    background: !annual ? "var(--bg-active)" : "transparent",
                                    color: !annual ? "var(--text-primary)" : "var(--text-secondary)",
                                }}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setAnnual(true)}
                                className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all"
                                style={{
                                    background: annual ? "var(--bg-active)" : "transparent",
                                    color: annual ? "var(--text-primary)" : "var(--text-secondary)",
                                }}
                            >
                                Annual
                                <span
                                    className="rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                                    style={{ background: "var(--semantic-success-subtle)", color: "var(--semantic-success)" }}
                                >
                                    -20%
                                </span>
                            </button>
                        </div>
                    </div>
                </SlideUpOnScroll>

                {/* Cards */}
                <div className="grid gap-6 md:grid-cols-3">
                    {PLANS.map((plan, i) => {
                        const displayPrice = annual && plan.price !== "$0"
                            ? `$${Math.round(parseInt(plan.price.slice(1)) * 0.8)}`
                            : plan.price
                        return (
                            <SlideUpOnScroll key={plan.name} delay={i * 0.08}>
                                <motion.div
                                    whileHover={{ y: -4 }}
                                    transition={{ duration: 0.2 }}
                                    className="relative flex h-full flex-col rounded-2xl p-6"
                                    style={{
                                        background: "var(--bg-surface)",
                                        border: plan.popular ? "2px solid var(--brand-primary)" : "1px solid var(--border-default)",
                                        boxShadow: plan.popular ? "0 8px 32px rgba(37,99,235,0.12)" : "var(--shadow-sm)",
                                    }}
                                >
                                    {/* Popular badge */}
                                    {plan.popular && (
                                        <div
                                            className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold text-white"
                                            style={{ background: "var(--brand-primary)" }}
                                        >
                                            <Zap className="h-3 w-3" />
                                            Most popular
                                        </div>
                                    )}

                                    {/* Header */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{plan.name}</h3>
                                        <div className="mt-3 flex items-baseline gap-1">
                                            <span className="text-4xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
                                                {displayPrice}
                                            </span>
                                            <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                                                {plan.period}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                                            {plan.description}
                                        </p>
                                    </div>

                                    {/* CTA */}
                                    <motion.div whileTap={{ scale: 0.97 }}>
                                        <Link
                                            href="/signup"
                                            className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all"
                                            style={
                                                plan.ctaStyle === "primary"
                                                    ? { background: "var(--btn-primary-bg)", color: "var(--text-inverse)" }
                                                    : { background: "var(--bg-surface-raised)", color: "var(--text-primary)", border: "1px solid var(--border-default)" }
                                            }
                                        >
                                            {plan.cta}
                                            <ArrowRight className="h-3.5 w-3.5" />
                                        </Link>
                                    </motion.div>

                                    {/* Features */}
                                    <div className="mt-6 flex flex-col gap-3 flex-1">
                                        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-tertiary)" }}>
                                            Includes
                                        </p>
                                        {plan.features.map((f) => (
                                            <div key={f} className="flex items-start gap-2">
                                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--semantic-success)" }} />
                                                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{f}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            </SlideUpOnScroll>
                        )
                    })}
                </div>

                {/* Bottom note */}
                <SlideUpOnScroll>
                    <p className="mt-10 text-center text-xs" style={{ color: "var(--text-tertiary)" }}>
                        All plans include end-to-end encryption, SOC 2 compliance, and 99.9% uptime SLA. Cancel anytime.
                    </p>
                </SlideUpOnScroll>
            </div>
        </section>
    )
}
