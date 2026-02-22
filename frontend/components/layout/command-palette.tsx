"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import {
    MessageSquare,
    LayoutDashboard,
    Settings,
    Sun,
    Moon,
    Monitor,
    Plus,
    Search,
    ArrowRight,
    Bitcoin,
    TrendingUp,
} from "lucide-react"

interface CommandItem {
    id: string
    label: string
    description?: string
    icon: React.ComponentType<{ className?: string }>
    action: () => void
    shortcut?: string
    group: string
}

export function CommandPalette() {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState("")
    const [selectedIndex, setSelectedIndex] = useState(0)
    const router = useRouter()
    const { setTheme } = useTheme()

    const commands: CommandItem[] = [
        {
            id: "new-chat",
            label: "New Chat",
            description: "Start a new AI conversation",
            icon: Plus,
            action: () => { router.push("/chat"); setOpen(false) },
            shortcut: "N",
            group: "Actions",
        },
        {
            id: "dashboard",
            label: "Go to Dashboard",
            icon: LayoutDashboard,
            action: () => { router.push("/dashboard"); setOpen(false) },
            shortcut: "D",
            group: "Navigation",
        },
        {
            id: "chat",
            label: "Go to Chat",
            icon: MessageSquare,
            action: () => { router.push("/chat"); setOpen(false) },
            group: "Navigation",
        },
        {
            id: "settings",
            label: "Go to Settings",
            icon: Settings,
            action: () => { router.push("/settings"); setOpen(false) },
            group: "Navigation",
        },
        {
            id: "theme-dark",
            label: "Switch to Dark Mode",
            icon: Moon,
            action: () => { setTheme("dark"); setOpen(false) },
            group: "Appearance",
        },
        {
            id: "theme-light",
            label: "Switch to Light Mode",
            icon: Sun,
            action: () => { setTheme("light"); setOpen(false) },
            group: "Appearance",
        },
        {
            id: "theme-system",
            label: "Use System Theme",
            icon: Monitor,
            action: () => { setTheme("system"); setOpen(false) },
            group: "Appearance",
        },
        {
            id: "research-btc",
            label: "Research Bitcoin (BTC)",
            icon: Bitcoin,
            action: () => { router.push("/chat"); setOpen(false) },
            group: "Quick Research",
        },
        {
            id: "research-eth",
            label: "Research Ethereum (ETH)",
            icon: TrendingUp,
            action: () => { router.push("/chat"); setOpen(false) },
            group: "Quick Research",
        },
    ]

    const filtered = query.trim()
        ? commands.filter(
            (c) =>
                c.label.toLowerCase().includes(query.toLowerCase()) ||
                c.description?.toLowerCase().includes(query.toLowerCase()) ||
                c.group.toLowerCase().includes(query.toLowerCase())
        )
        : commands

    // Group filtered results
    const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, cmd) => {
        if (!acc[cmd.group]) acc[cmd.group] = []
        acc[cmd.group].push(cmd)
        return acc
    }, {})

    const flatFiltered = filtered

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            // Open/close
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault()
                setOpen((prev) => !prev)
                setQuery("")
                setSelectedIndex(0)
                return
            }
            if (!open) return

            if (e.key === "Escape") {
                setOpen(false)
                return
            }
            if (e.key === "ArrowDown") {
                e.preventDefault()
                setSelectedIndex((i) => Math.min(i + 1, flatFiltered.length - 1))
            }
            if (e.key === "ArrowUp") {
                e.preventDefault()
                setSelectedIndex((i) => Math.max(i - 1, 0))
            }
            if (e.key === "Enter") {
                e.preventDefault()
                flatFiltered[selectedIndex]?.action()
            }
        },
        [open, flatFiltered, selectedIndex]
    )

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [handleKeyDown])

    useEffect(() => {
        setSelectedIndex(0)
    }, [query])

    let globalIndex = -1

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}
                    onClick={() => setOpen(false)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -8 }}
                        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full max-w-lg overflow-hidden rounded-2xl"
                        style={{
                            background: "var(--bg-surface)",
                            border: "1px solid var(--border-default)",
                            boxShadow: "var(--shadow-lg)",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Search input */}
                        <div
                            className="flex items-center gap-3 px-4 py-3.5"
                            style={{ borderBottom: "1px solid var(--border-default)" }}
                        >
                            <Search className="h-4 w-4 shrink-0" style={{ color: "var(--text-tertiary)" }} />
                            <input
                                autoFocus
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search commands or navigate..."
                                className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--text-tertiary)]"
                                style={{ color: "var(--text-primary)" }}
                            />
                            <kbd
                                className="rounded px-1.5 py-0.5 text-[11px] font-mono"
                                style={{
                                    background: "var(--bg-surface-raised)",
                                    color: "var(--text-tertiary)",
                                    border: "1px solid var(--border-default)",
                                }}
                            >
                                ESC
                            </kbd>
                        </div>

                        {/* Results */}
                        <div className="max-h-[360px] overflow-y-auto py-2">
                            {flatFiltered.length === 0 ? (
                                <p
                                    className="px-4 py-6 text-center text-sm"
                                    style={{ color: "var(--text-tertiary)" }}
                                >
                                    No results for &ldquo;{query}&rdquo;
                                </p>
                            ) : (
                                Object.entries(grouped).map(([group, items]) => (
                                    <div key={group}>
                                        <p
                                            className="px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider"
                                            style={{ color: "var(--text-tertiary)" }}
                                        >
                                            {group}
                                        </p>
                                        {items.map((cmd) => {
                                            globalIndex++
                                            const idx = globalIndex
                                            const isSelected = selectedIndex === idx
                                            const Icon = cmd.icon
                                            return (
                                                <button
                                                    key={cmd.id}
                                                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors duration-100"
                                                    style={{
                                                        background: isSelected ? "var(--bg-hover)" : "transparent",
                                                        color: "var(--text-primary)",
                                                    }}
                                                    onMouseEnter={() => setSelectedIndex(idx)}
                                                    onClick={cmd.action}
                                                >
                                                    <div
                                                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                                                        style={{ background: "var(--bg-surface-raised)" }}
                                                    >
                                                        <Icon className="h-3.5 w-3.5" style={{ color: "var(--text-secondary)" }} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <span className="text-sm font-medium">{cmd.label}</span>
                                                        {cmd.description && (
                                                            <span className="ml-2 text-xs" style={{ color: "var(--text-tertiary)" }}>
                                                                {cmd.description}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {cmd.shortcut && (
                                                        <kbd
                                                            className="rounded px-1.5 py-0.5 text-[11px] font-mono"
                                                            style={{
                                                                background: "var(--bg-surface-raised)",
                                                                color: "var(--text-tertiary)",
                                                                border: "1px solid var(--border-default)",
                                                            }}
                                                        >
                                                            {cmd.shortcut}
                                                        </kbd>
                                                    )}
                                                    {isSelected && (
                                                        <ArrowRight className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--text-tertiary)" }} />
                                                    )}
                                                </button>
                                            )
                                        })}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div
                            className="flex items-center justify-between px-4 py-2.5"
                            style={{
                                borderTop: "1px solid var(--border-default)",
                                background: "var(--bg-surface-raised)",
                            }}
                        >
                            <div className="flex items-center gap-3 text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                                <span>↑↓ navigate</span>
                                <span>↵ select</span>
                                <span>ESC close</span>
                            </div>
                            <div
                                className="flex items-center gap-1 text-[11px] font-medium"
                                style={{ color: "var(--text-tertiary)" }}
                            >
                                <kbd
                                    className="rounded px-1 py-0.5 font-mono"
                                    style={{
                                        background: "var(--bg-surface)",
                                        border: "1px solid var(--border-default)",
                                    }}
                                >
                                    ⌘K
                                </kbd>
                                to open
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
