"use client"

import { motion, AnimatePresence } from "framer-motion"
import type { ReactNode } from "react"

/* ── Page-level transition wrapper ────────────────────────────────────────── */
export function PageTransition({ children }: { children: ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    )
}

/* ── Card mount animation ─────────────────────────────────────────────────── */
export function AnimatedCard({
    children,
    delay = 0,
    className,
}: {
    children: ReactNode
    delay?: number
    className?: string
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, delay, ease: [0.22, 1, 0.36, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

/* ── Staggered list (wraps each child with a fade+slide-up) ──────────────── */
export function AnimatedList({
    children,
    className,
    staggerDelay = 0.06,
}: {
    children: ReactNode[]
    className?: string
    staggerDelay?: number
}) {
    return (
        <div className={className}>
            {children.map((child, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i * staggerDelay, ease: [0.22, 1, 0.36, 1] }}
                >
                    {child}
                </motion.div>
            ))}
        </div>
    )
}

/* ── Modal overlay with scale-in ──────────────────────────────────────────── */
export function AnimatedModal({
    show,
    children,
    onClose,
}: {
    show: boolean
    children: ReactNode
    onClose?: () => void
}) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)" }}
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.94, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.94, y: 8 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

/* ── Count-up number on mount ─────────────────────────────────────────────── */
export function AnimatedNumber({
    value,
    prefix = "",
    suffix = "",
    className,
}: {
    value: string | number
    prefix?: string
    suffix?: string
    className?: string
}) {
    return (
        <motion.span
            className={className}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
            {prefix}{value}{suffix}
        </motion.span>
    )
}

/* ── Fade-in wrapper (simple) ─────────────────────────────────────────────── */
export function FadeIn({
    children,
    delay = 0,
    className,
}: {
    children: ReactNode
    delay?: number
    className?: string
}) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

/* ── Slide-up on scroll (uses IntersectionObserver via whileInView) ────────── */
export function SlideUpOnScroll({
    children,
    delay = 0,
    className,
}: {
    children: ReactNode
    delay?: number
    className?: string
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

/* ── Hover lift for interactive cards ─────────────────────────────────────── */
export function HoverLift({
    children,
    className,
}: {
    children: ReactNode
    className?: string
}) {
    return (
        <motion.div
            whileHover={{ y: -3, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className={className}
        >
            {children}
        </motion.div>
    )
}
