"use client"

import { Diamond, Github, Twitter } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Changelog", href: "#" },
    { label: "API Docs", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Resources: [
    { label: "Help Center", href: "#" },
    { label: "Community", href: "#" },
    { label: "Status", href: "#" },
    { label: "FAQ", href: "#faq" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Security", href: "#" },
  ],
}

const SOCIAL = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Github, href: "#", label: "GitHub" },
]

export function LandingFooter() {
  const [email, setEmail] = useState("")

  return (
    <footer style={{ background: "var(--bg-surface-raised)", borderTop: "1px solid var(--border-default)" }}>
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-6">
          {/* Brand + newsletter */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <Diamond className="h-5 w-5" style={{ color: "var(--brand-primary)" }} />
              <span className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Alpha</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              AI-native crypto trading platform that empowers traders to research, strategize, and execute with confidence.
            </p>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-tertiary)" }}>
                Stay updated
              </p>
              <form onSubmit={(e) => { e.preventDefault(); setEmail(""); }} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:border-[var(--brand-primary)]"
                  style={{
                    background: "var(--bg-surface)",
                    borderColor: "var(--border-default)",
                    color: "var(--text-primary)",
                  }}
                />
                <button
                  type="submit"
                  className="rounded-lg px-4 py-2 text-sm font-semibold transition-all"
                  style={{ background: "var(--btn-primary-bg)", color: "var(--text-inverse)" }}
                >
                  Subscribe
                </button>
              </form>
            </div>

            {/* Social */}
            <div className="mt-5 flex gap-3">
              {SOCIAL.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border transition-colors hover:bg-[var(--bg-hover)]"
                  style={{ borderColor: "var(--border-default)", color: "var(--text-tertiary)" }}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4
                className="mb-3 text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-tertiary)" }}
              >
                {category}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm transition-colors duration-150 hover:text-[var(--text-primary)]"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="mt-14 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row"
          style={{ borderColor: "var(--border-default)" }}
        >
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            &copy; 2026 Alpha. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs" style={{ color: "var(--text-tertiary)" }}>
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: "var(--semantic-success)" }} />
                <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: "var(--semantic-success)" }} />
              </span>
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
