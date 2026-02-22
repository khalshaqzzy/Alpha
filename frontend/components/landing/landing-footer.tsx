"use client"

import { Diamond } from "lucide-react"
import Link from "next/link"

const footerLinks = {
  Product: ["Features", "Pricing", "Changelog", "Docs"],
  Company: ["About", "Blog", "Careers", "Contact"],
  Resources: ["Help Center", "API Reference", "Community", "Status"],
  Legal: ["Privacy", "Terms", "Security"],
}

export function LandingFooter() {
  return (
    <footer style={{ background: "var(--bg-surface-raised)" }}>
      <div
        className="mx-auto px-6 py-12"
        style={{ maxWidth: "var(--max-content-width, 1280px)" }}
      >
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <Diamond
                className="h-5 w-5"
                style={{ color: "var(--brand-primary)" }}
              />
              <span
                className="text-lg font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Alpha
              </span>
            </Link>
            <p
              className="mt-3 max-w-xs text-sm leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              AI-native crypto trading platform that empowers traders to make
              more informed decisions.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4
                className="mb-3 text-xs font-medium uppercase tracking-wider"
                style={{ color: "var(--text-tertiary)" }}
              >
                {category}
              </h4>
              <ul className="flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-sm transition-colors duration-150"
                      style={{ color: "var(--text-secondary)" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--text-primary)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--text-secondary)")
                      }
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="mt-12 border-t pt-6"
          style={{ borderColor: "var(--border-default)" }}
        >
          <p
            className="text-center text-xs"
            style={{ color: "var(--text-tertiary)" }}
          >
            {'2026 Alpha. All rights reserved.'}
          </p>
        </div>
      </div>
    </footer>
  )
}
