"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  Diamond,
  Plus,
  ChevronRight,
  TrendingUp,
  MoreHorizontal,
  Search,
} from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: TrendingUp, label: "Trade", href: "/trade" },
  { icon: Settings, label: "Settings", href: "/settings" },
]

const CHAT_HISTORY = {
  Today: [
    { id: "1", title: "BTC breakout analysis" },
    { id: "2", title: "ETH/USD long setup 4H" },
  ],
  Yesterday: [
    { id: "3", title: "SOL momentum play" },
    { id: "4", title: "Altcoin season thesis" },
  ],
  "Previous 7 Days": [
    { id: "5", title: "AVAX support level check" },
    { id: "6", title: "Macro week outlook" },
    { id: "7", title: "DOT short-term RSI" },
  ],
}

function ChatItem({ id, title, isActive }: { id: string; title: string; isActive: boolean }) {
  const [hovering, setHovering] = useState(false)

  return (
    <Link
      href={`/chat?id=${id}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className={cn(
        "group flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-all duration-100",
        isActive && "font-medium"
      )}
      style={{
        background: isActive ? "var(--bg-active)" : hovering ? "var(--bg-hover)" : "transparent",
        color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
      }}
    >
      <span className="min-w-0 truncate">{title}</span>
      <AnimatePresence>
        {hovering && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.12 }}
            className="shrink-0 flex h-5 w-5 items-center justify-center rounded"
            style={{ color: "var(--text-tertiary)" }}
            onClick={(e) => e.preventDefault()}
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
          </motion.button>
        )}
      </AnimatePresence>
    </Link>
  )
}

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="flex h-full w-[260px] shrink-0 flex-col"
      style={{
        background: "var(--bg-surface)",
        borderRight: "1px solid var(--border-default)",
      }}
    >
      {/* Logo */}
      <div
        className="flex h-14 items-center gap-2 px-4"
        style={{ borderBottom: "1px solid var(--border-default)" }}
      >
        <Diamond className="h-5 w-5" style={{ color: "var(--brand-primary)" }} />
        <span className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
          Alpha
        </span>
      </div>

      {/* New Chat + Search */}
      <div className="flex flex-col gap-2 p-3">
        <Link
          href="/chat"
          className="flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150"
          style={{
            background: "var(--btn-primary-bg)",
            color: "var(--text-inverse)",
          }}
        >
          <span className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Chat
          </span>
          <kbd
            className="rounded px-1.5 py-0.5 text-[10px] font-mono opacity-60"
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "var(--text-inverse)",
            }}
          >
            ⌘K
          </kbd>
        </Link>

        <button
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors duration-100"
          style={{
            color: "var(--text-secondary)",
            background: "var(--bg-surface-raised)",
          }}
        >
          <Search className="h-4 w-4" />
          <span>Search chats</span>
        </button>
      </div>

      {/* Primary nav */}
      <nav className="flex flex-col gap-0.5 px-3">
        {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/")
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-100"
              style={{
                background: isActive ? "var(--bg-active)" : "transparent",
                color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
              }}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
              {isActive && <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-40" />}
            </Link>
          )
        })}
      </nav>

      {/* Divider */}
      <div className="mx-3 my-3 h-px" style={{ background: "var(--border-default)" }} />

      {/* Chat history */}
      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3">
        {Object.entries(CHAT_HISTORY).map(([group, items]) => (
          <div key={group} className="mb-3">
            <p
              className="mb-1 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider"
              style={{ color: "var(--text-tertiary)" }}
            >
              {group}
            </p>
            {items.map((item) => (
              <ChatItem
                key={item.id}
                id={item.id}
                title={item.title}
                isActive={pathname === `/chat?id=${item.id}`}
              />
            ))}
          </div>
        ))}
      </div>

      {/* User footer */}
      <div
        className="flex items-center gap-3 border-t px-4 py-3"
        style={{ borderColor: "var(--border-default)" }}
      >
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
          style={{
            background: "var(--brand-subtle)",
            color: "var(--brand-primary)",
          }}
        >
          AT
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            Alex Thompson
          </p>
          <p className="truncate text-xs" style={{ color: "var(--text-tertiary)" }}>
            Free tier
          </p>
        </div>
      </div>
    </aside>
  )
}
