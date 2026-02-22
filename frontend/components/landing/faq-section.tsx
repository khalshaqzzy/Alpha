"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, HelpCircle } from "lucide-react"
import { SlideUpOnScroll } from "@/components/ui/animated-layout"

const FAQ_ITEMS = [
    {
        q: "What is Alpha and how is it different from other tools?",
        a: "Alpha is an AI-native crypto trading research platform. Unlike traditional charting tools, Alpha lets you research, build strategies, and monitor trades through natural conversation with an AI agent — like having a senior analyst available 24/7.",
    },
    {
        q: "Do I need coding or trading experience to use Alpha?",
        a: "Not at all. Alpha is designed for traders of all experience levels. Just type your questions in plain English — the AI handles the technical analysis, charting, and strategy formulation for you.",
    },
    {
        q: "How does the AI monitoring agent work?",
        a: "When you add a trade to your portfolio, Alpha's background agent continuously monitors the market. It checks your entry, take-profit, stop-loss, and invalidation conditions, then alerts you in real time when anything needs attention.",
    },
    {
        q: "Is my data secure?",
        a: "Yes. Alpha uses end-to-end encryption, is SOC 2 compliant, and never shares your data with third parties. Your trading strategies and portfolio data remain fully private and encrypted at rest.",
    },
    {
        q: "Can I connect my exchange account?",
        a: "Alpha currently focuses on research and strategy generation. Exchange integration for one-click execution is on our roadmap and coming soon. You'll be able to connect Binance, Bybit, and more.",
    },
    {
        q: "What cryptocurrencies does Alpha support?",
        a: "Alpha supports research on 500+ cryptocurrencies across major exchanges. You can analyze any asset with the @ mention feature — from BTC and ETH to smaller altcoins and newly listed tokens.",
    },
    {
        q: "Can I cancel my subscription anytime?",
        a: "Yes, absolutely. You can cancel your subscription at any time from the settings page with no cancellation fees. Your data will remain accessible until the end of your billing period.",
    },
    {
        q: "Do you offer a team plan?",
        a: "Yes! Our Team plan is designed for trading groups and funds. It includes shared workspaces, team analytics, custom AI tuning, and a dedicated account manager. Contact sales for details.",
    },
]

function FAQItem({ item, isOpen, onToggle }: { item: typeof FAQ_ITEMS[0]; isOpen: boolean; onToggle: () => void }) {
    return (
        <div
            className="rounded-2xl border transition-all duration-150"
            style={{
                borderColor: isOpen ? "var(--brand-primary)" : "var(--border-default)",
                background: isOpen ? "var(--bg-surface)" : "transparent",
                boxShadow: isOpen ? "var(--shadow-sm)" : "none",
            }}
        >
            <button
                onClick={onToggle}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
                <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    {item.q}
                </span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0"
                >
                    <ChevronDown className="h-4 w-4" style={{ color: "var(--text-tertiary)" }} />
                </motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 pb-5">
                            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                                {item.a}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number>(0)

    return (
        <section id="faq" className="py-24 md:py-32" style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border-default)" }}>
            <div className="mx-auto max-w-3xl px-6">
                <SlideUpOnScroll>
                    <div className="mb-12 text-center">
                        <div
                            className="mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                            style={{ background: "var(--brand-subtle)", color: "var(--brand-primary)" }}
                        >
                            <HelpCircle className="h-3 w-3" />
                            FAQ
                        </div>
                        <h2
                            className="text-4xl font-bold tracking-tight md:text-5xl"
                            style={{ color: "var(--text-primary)" }}
                        >
                            Frequently asked
                            <br />
                            <span className="gradient-text">questions</span>
                        </h2>
                    </div>
                </SlideUpOnScroll>

                <div className="flex flex-col gap-3">
                    {FAQ_ITEMS.map((item, i) => (
                        <SlideUpOnScroll key={i} delay={i * 0.03}>
                            <FAQItem
                                item={item}
                                isOpen={openIndex === i}
                                onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
                            />
                        </SlideUpOnScroll>
                    ))}
                </div>
            </div>
        </section>
    )
}
