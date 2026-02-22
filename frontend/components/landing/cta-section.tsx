"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles, CheckCircle2, Zap, Users, Shield } from "lucide-react"
import { SlideUpOnScroll } from "@/components/ui/animated-layout"

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-24 md:py-36">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute inset-0 gradient-blob"
          style={{
            background: "radial-gradient(ellipse at center, rgba(37,99,235,0.15) 0%, transparent 60%)",
            filter: "blur(60px)",
          }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <SlideUpOnScroll>
          <div
            className="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold"
            style={{ background: "var(--brand-subtle)", borderColor: "rgba(37,99,235,0.2)", color: "var(--brand-primary)" }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Free to get started
          </div>

          <h2
            className="mt-4 text-4xl font-bold tracking-tight md:text-6xl"
            style={{ color: "var(--text-primary)", lineHeight: 1.1 }}
          >
            Ready to trade
            <br />
            <span className="gradient-text">smarter?</span>
          </h2>

          <p
            className="mx-auto mt-6 max-w-lg text-lg leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            Join thousands of traders using Alpha to research faster, strategize smarter, and monitor effortlessly.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <motion.div whileTap={{ scale: 0.97 }}>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-sm font-semibold transition-all duration-200"
                style={{ background: "var(--btn-primary-bg)", color: "var(--text-inverse)", boxShadow: "0 4px 20px rgba(0,0,0,0.25)" }}
              >
                Create free account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
            <Link
              href="/login"
              className="text-sm font-medium transition-colors hover:text-[var(--text-primary)]"
              style={{ color: "var(--text-secondary)" }}
            >
              Already have an account? Sign in →
            </Link>
          </div>

          {/* Trust row */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs" style={{ color: "var(--text-tertiary)" }}>
            {[
              { icon: CheckCircle2, label: "No credit card required" },
              { icon: Zap, label: "Setup in 30 seconds" },
              { icon: Users, label: "10,000+ traders" },
              { icon: Shield, label: "SOC 2 Compliant" },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5" style={{ color: "var(--semantic-success)" }} />
                {label}
              </span>
            ))}
          </div>
        </SlideUpOnScroll>
      </div>
    </section>
  )
}
