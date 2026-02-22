"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Diamond } from "lucide-react"

const NAV_ITEMS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
]

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <motion.header
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "nav-scrolled" : ""}`}
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div whileHover={{ rotate: 15 }} transition={{ duration: 0.2 }}>
            <Diamond
              className="h-5 w-5 transition-colors duration-200"
              style={{ color: "var(--brand-primary)" }}
            />
          </motion.div>
          <span
            className="text-lg font-bold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Alpha
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium transition-colors duration-150 hover:text-[var(--text-primary)]"
              style={{ color: "var(--text-secondary)" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden sm:block text-sm font-medium transition-colors duration-150"
            style={{ color: "var(--text-secondary)" }}
          >
            Sign in
          </Link>
          <motion.div whileTap={{ scale: 0.97 }}>
            <Link
              href="/signup"
              className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-150"
              style={{
                background: "var(--btn-primary-bg)",
                color: "var(--text-inverse)",
              }}
            >
              Get started
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.header>
  )
}
