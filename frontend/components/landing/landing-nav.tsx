"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Diamond, Menu, X } from "lucide-react"

const NAV_ITEMS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
]

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <>
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
              <Diamond className="h-5 w-5" style={{ color: "var(--brand-primary)" }} />
            </motion.div>
            <span className="text-lg font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
              Alpha
            </span>
          </Link>

          {/* Desktop nav */}
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

          {/* Right */}
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
                className="hidden sm:flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-150"
                style={{ background: "var(--btn-primary-bg)", color: "var(--text-inverse)" }}
              >
                Get started
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-[var(--bg-hover)]"
              style={{ color: "var(--text-secondary)" }}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 border-b p-4 md:hidden"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border-default)",
              backdropFilter: "blur(16px)",
            }}
          >
            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-[var(--bg-hover)]"
                  style={{ color: "var(--text-primary)" }}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-3 flex flex-col gap-2">
                <Link
                  href="/login"
                  className="rounded-lg text-center border px-4 py-3 text-sm font-medium"
                  style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }}
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg text-center px-4 py-3 text-sm font-semibold"
                  style={{ background: "var(--btn-primary-bg)", color: "var(--text-inverse)" }}
                >
                  Get started free
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
