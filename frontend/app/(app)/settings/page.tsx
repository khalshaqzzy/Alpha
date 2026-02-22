"use client"

import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import {
  User, Lock, Palette, Bell, Shield, Sun, Moon, Monitor,
  AlertTriangle, X, Eye, EyeOff, Copy, Plus, Trash2,
  CheckCircle2, Circle, Key, Smartphone, Globe, Mail,
  MessageSquare, Zap, ChevronRight, LogOut, Check,
} from "lucide-react"
import { Toaster, toast } from "sonner"
import { cn } from "@/lib/utils"

/* ── Types ────────────────────────────────────────────────────────────────── */
type NavSection = "profile" | "security" | "appearance" | "notifications" | "api-keys" | "sessions" | "danger"

/* ── Sidebar nav items ────────────────────────────────────────────────────── */
const NAV_ITEMS: { id: NavSection; label: string; icon: React.ElementType; group: string }[] = [
  { id: "profile", label: "Profile", icon: User, group: "Account" },
  { id: "security", label: "Security", icon: Lock, group: "Account" },
  { id: "sessions", label: "Sessions", icon: Globe, group: "Account" },
  { id: "appearance", label: "Appearance", icon: Palette, group: "Preferences" },
  { id: "notifications", label: "Notifications", icon: Bell, group: "Preferences" },
  { id: "api-keys", label: "API Keys", icon: Key, group: "Developer" },
  { id: "danger", label: "Danger Zone", icon: Shield, group: "Account" },
]

/* ── Mock sessions ────────────────────────────────────────────────────────── */
const MOCK_SESSIONS = [
  { id: "1", device: "Chrome on macOS", location: "Bangkok, TH", lastActive: "Now", current: true },
  { id: "2", device: "Firefox on Windows", location: "Singapore, SG", lastActive: "2h ago", current: false },
  { id: "3", device: "Safari on iPhone", location: "Bangkok, TH", lastActive: "1d ago", current: false },
]

/* ── Main page ────────────────────────────────────────────────────────────── */
export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [active, setActive] = useState<NavSection>("profile")
  const [dirty, setDirty] = useState(false)

  return (
    <div className="flex h-full" style={{ background: "var(--bg-canvas)" }}>
      <Toaster richColors position="top-right" />

      {/* ── Sidebar nav ─────────────────────────────────────────────────── */}
      <aside
        className="hidden md:flex w-[220px] shrink-0 flex-col py-8 px-4"
        style={{ borderRight: "1px solid var(--border-default)" }}
      >
        <div className="mb-6 px-3">
          <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Settings</h1>
          <p className="mt-1 text-xs" style={{ color: "var(--text-tertiary)" }}>Manage your account</p>
        </div>

        {["Account", "Preferences", "Developer"].map((group) => {
          const items = NAV_ITEMS.filter((i) => i.group === group)
          return (
            <div key={group} className="mb-5">
              <p
                className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-tertiary)" }}
              >
                {group}
              </p>
              {items.map(({ id, label, icon: Icon }) => {
                const isActive = active === id
                const isDanger = id === "danger"
                return (
                  <motion.button
                    key={id}
                    onClick={() => setActive(id)}
                    whileTap={{ scale: 0.97 }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-100"
                    style={{
                      background: isActive ? "var(--bg-active)" : "transparent",
                      color: isDanger
                        ? "var(--semantic-danger)"
                        : isActive
                          ? "var(--text-primary)"
                          : "var(--text-secondary)",
                    }}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                    {isActive && <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-40" />}
                  </motion.button>
                )
              })}
            </div>
          )
        })}
      </aside>

      {/* ── Content pane ────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {/* Mobile tabs */}
        <div
          className="flex gap-1 overflow-x-auto px-4 pt-4 pb-2 md:hidden"
          style={{ borderBottom: "1px solid var(--border-default)" }}
        >
          {NAV_ITEMS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-all"
              style={{
                background: active === id ? "var(--bg-active)" : "transparent",
                color: active === id ? "var(--text-primary)" : "var(--text-secondary)",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mx-auto max-w-2xl px-6 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              {active === "profile" && <ProfileSection onDirty={setDirty} />}
              {active === "security" && <SecuritySection />}
              {active === "sessions" && <SessionsSection />}
              {active === "appearance" && <AppearanceSection theme={theme} setTheme={setTheme} />}
              {active === "notifications" && <NotificationsSection />}
              {active === "api-keys" && <ApiKeysSection />}
              {active === "danger" && <DangerSection />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Unsaved changes banner */}
      <AnimatePresence>
        {dirty && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ duration: 0.22 }}
            className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-2xl px-5 py-3 shadow-xl"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-default)",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <div className="h-2 w-2 rounded-full animate-pulse" style={{ background: "var(--semantic-warning)" }} />
            <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              Unsaved changes
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDirty(false)}
                className="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-[var(--bg-hover)]"
                style={{ color: "var(--text-secondary)" }}
              >
                Discard
              </button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  toast.success("Profile saved")
                  setDirty(false)
                }}
                className="rounded-lg px-4 py-1.5 text-sm font-semibold"
                style={{ background: "var(--btn-primary-bg)", color: "var(--text-inverse)" }}
              >
                Save changes
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════ */
/* PROFILE SECTION                                                            */
/* ══════════════════════════════════════════════════════════════════════════ */
function ProfileSection({ onDirty }: { onDirty: (d: boolean) => void }) {
  return (
    <div>
      <SectionHeader title="Profile" description="Your public identity on Alpha" />

      {/* Avatar */}
      <div className="mb-8 flex items-center gap-5">
        <div className="relative">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold ring-4"
            style={{
              background: "var(--brand-subtle)",
              color: "var(--brand-primary)",
              ringColor: "var(--border-default)",
            }}
          >
            AT
          </div>
          <button
            className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full shadow-md transition-opacity hover:opacity-80"
            style={{ background: "var(--btn-primary-bg)", color: "white" }}
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <div>
          <p className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>Alex Thompson</p>
          <p className="mt-1 text-sm" style={{ color: "var(--text-tertiary)" }}>JPG, PNG or GIF · Max 5MB</p>
          <button className="mt-2 text-xs font-semibold" style={{ color: "var(--brand-primary)" }}>
            Upload new photo
          </button>
        </div>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="First Name" defaultValue="Alex" onChange={() => onDirty(true)} />
          <FormField label="Last Name" defaultValue="Thompson" onChange={() => onDirty(true)} />
        </div>
        <FormField
          label="Email address"
          defaultValue="alex@alpha.dev"
          disabled
          helpText="To change your email, contact support."
        />
        <FormField
          label="Username"
          defaultValue="@alextrader"
          prefix="alpha.dev/"
          onChange={() => onDirty(true)}
        />
        <FormField
          label="Bio"
          defaultValue=""
          placeholder="A short description about yourself…"
          multiline
          onChange={() => onDirty(true)}
        />
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════ */
/* SECURITY SECTION                                                           */
/* ══════════════════════════════════════════════════════════════════════════ */
function SecuritySection() {
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [newPw, setNewPw] = useState("")
  const [confirmPw, setConfirmPw] = useState("")
  const [twoFAEnabled, setTwoFAEnabled] = useState(false)

  const strength = getPasswordStrength(newPw)
  const match = confirmPw.length > 0 && confirmPw === newPw

  function handleUpdatePassword() {
    if (!match) return toast.error("Passwords do not match")
    if (strength.score < 2) return toast.error("Password too weak")
    toast.success("Password updated successfully")
  }

  return (
    <div>
      <SectionHeader title="Security" description="Protect your account with a strong password and 2FA" />

      {/* Password */}
      <Card>
        <CardHeader title="Change Password" />
        <div className="flex flex-col gap-4">
          <PasswordField label="Current Password" show={showCurrent} onToggle={() => setShowCurrent(!showCurrent)} />
          <div>
            <PasswordField
              label="New Password"
              show={showNew}
              onToggle={() => setShowNew(!showNew)}
              value={newPw}
              onChange={setNewPw}
            />
            {/* Strength bar */}
            {newPw.length > 0 && (
              <div className="mt-2">
                <div className="mb-1.5 flex gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-1 flex-1 rounded-full transition-all duration-300"
                      style={{
                        background:
                          i < strength.score
                            ? strength.score <= 1
                              ? "var(--semantic-danger)"
                              : strength.score <= 2
                                ? "var(--semantic-warning)"
                                : "var(--semantic-success)"
                            : "var(--bg-active)",
                      }}
                    />
                  ))}
                </div>
                <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                  {strength.label}
                </p>
              </div>
            )}
          </div>
          <div>
            <FormField
              label="Confirm New Password"
              type="password"
              value={confirmPw}
              onChange={(v) => setConfirmPw(v as string)}
            />
            {confirmPw.length > 0 && (
              <div className="mt-1.5 flex items-center gap-1.5">
                {match ? (
                  <CheckCircle2 className="h-3.5 w-3.5" style={{ color: "var(--semantic-success)" }} />
                ) : (
                  <Circle className="h-3.5 w-3.5" style={{ color: "var(--text-tertiary)" }} />
                )}
                <span className="text-xs" style={{ color: match ? "var(--semantic-success)" : "var(--text-tertiary)" }}>
                  {match ? "Passwords match" : "Passwords do not match"}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleUpdatePassword}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold"
            style={{ background: "var(--btn-primary-bg)", color: "var(--text-inverse)" }}
          >
            Update Password
          </motion.button>
        </div>
      </Card>

      {/* 2FA */}
      <Card className="mt-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardHeader title="Two-Factor Authentication" />
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Add an extra layer of security by requiring a one-time code in addition to your password when you log in.
            </p>
            {twoFAEnabled && (
              <div
                className="mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                style={{ background: "var(--semantic-success-subtle)", color: "var(--semantic-success)" }}
              >
                <CheckCircle2 className="h-3 w-3" />
                Enabled
              </div>
            )}
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
            style={{ background: "var(--bg-surface-raised)" }}>
            <Smartphone className="h-6 w-6" style={{ color: "var(--text-secondary)" }} />
          </div>
        </div>
        <div className="mt-5 flex gap-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setTwoFAEnabled(!twoFAEnabled)
              toast.success(twoFAEnabled ? "2FA disabled" : "2FA setup started")
            }}
            className="rounded-xl border px-5 py-2.5 text-sm font-semibold transition-all"
            style={{
              borderColor: twoFAEnabled ? "var(--semantic-danger)" : "var(--border-default)",
              color: twoFAEnabled ? "var(--semantic-danger)" : "var(--text-primary)",
              background: "transparent",
            }}
          >
            {twoFAEnabled ? "Disable 2FA" : "Enable 2FA"}
          </motion.button>
          {twoFAEnabled && (
            <button
              className="rounded-xl px-5 py-2.5 text-sm font-medium transition-all hover:bg-[var(--bg-hover)]"
              style={{ color: "var(--text-secondary)" }}
            >
              View recovery codes
            </button>
          )}
        </div>
      </Card>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════ */
/* SESSIONS SECTION                                                           */
/* ══════════════════════════════════════════════════════════════════════════ */
function SessionsSection() {
  const [sessions, setSessions] = useState(MOCK_SESSIONS)

  return (
    <div>
      <SectionHeader title="Active Sessions" description="Devices and browsers currently signed in to your account" />
      <Card>
        <div className="flex flex-col divide-y" style={{ "--divider": "var(--border-default)" } as React.CSSProperties}>
          {sessions.map((session, i) => (
            <div
              key={session.id}
              className={cn("flex items-start justify-between gap-4 py-4", i === 0 && "pt-0")}
            >
              <div className="flex items-start gap-3">
                <div
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: "var(--bg-surface-raised)" }}
                >
                  <Globe className="h-4.5 w-4.5" style={{ color: "var(--text-secondary)" }} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      {session.device}
                    </span>
                    {session.current && (
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                        style={{
                          background: "var(--semantic-success-subtle)",
                          color: "var(--semantic-success)",
                        }}
                      >
                        This device
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs" style={{ color: "var(--text-tertiary)" }}>
                    {session.location} · Last active {session.lastActive}
                  </p>
                </div>
              </div>
              {!session.current && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSessions((s) => s.filter((x) => x.id !== session.id))
                    toast.success("Session revoked")
                  }}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all hover:bg-[var(--semantic-danger-subtle)]"
                  style={{ color: "var(--semantic-danger)" }}
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Revoke
                </motion.button>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 border-t pt-4" style={{ borderColor: "var(--border-default)" }}>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setSessions((s) => s.filter((x) => x.current))
              toast.success("All other sessions revoked")
            }}
            className="flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all hover:bg-[var(--semantic-danger-subtle)]"
            style={{ borderColor: "var(--border-default)", color: "var(--semantic-danger)" }}
          >
            <LogOut className="h-4 w-4" />
            Revoke all other sessions
          </motion.button>
        </div>
      </Card>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════ */
/* APPEARANCE SECTION                                                         */
/* ══════════════════════════════════════════════════════════════════════════ */
function AppearanceSection({
  theme,
  setTheme,
}: {
  theme: string | undefined
  setTheme: (t: string) => void
}) {
  const themeOptions = [
    { value: "light", label: "Light", icon: Sun, desc: "Clean & bright" },
    { value: "dark", label: "Dark", icon: Moon, desc: "Easy on the eyes" },
    { value: "system", label: "System", icon: Monitor, desc: "Follows your OS" },
  ] as const

  return (
    <div>
      <SectionHeader title="Appearance" description="Customize how Alpha looks on your device" />

      <Card>
        <CardHeader title="Theme" />
        <div className="grid grid-cols-3 gap-3">
          {themeOptions.map(({ value, label, icon: Icon, desc }) => {
            const isSelected = theme === value
            return (
              <motion.button
                key={value}
                whileTap={{ scale: 0.97 }}
                onClick={() => setTheme(value)}
                className="flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-center transition-all duration-150"
                style={{
                  borderColor: isSelected ? "var(--brand-primary)" : "var(--border-default)",
                  background: isSelected ? "var(--brand-subtle)" : "var(--bg-surface-raised)",
                }}
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    background: isSelected ? "var(--brand-primary)" : "var(--bg-surface)",
                  }}
                >
                  <Icon
                    className="h-5 w-5"
                    style={{ color: isSelected ? "white" : "var(--text-secondary)" }}
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    {label}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>{desc}</p>
                </div>
                {isSelected && (
                  <div
                    className="flex h-5 w-5 items-center justify-center rounded-full"
                    style={{ background: "var(--brand-primary)" }}
                  >
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </motion.button>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════ */
/* NOTIFICATIONS SECTION                                                      */
/* ══════════════════════════════════════════════════════════════════════════ */
type NotifState = {
  emailAlerts: boolean
  tradeAlerts: boolean
  monitoringAlerts: boolean
  pushNotifications: boolean
  weeklyDigest: boolean
  marketSummary: boolean
}

function NotificationsSection() {
  const [state, setState] = useState<NotifState>({
    emailAlerts: true,
    tradeAlerts: true,
    monitoringAlerts: true,
    pushNotifications: false,
    weeklyDigest: true,
    marketSummary: false,
  })

  const toggle = (key: keyof NotifState) =>
    setState((s) => ({ ...s, [key]: !s[key] }))

  const notifGroups = [
    {
      group: "Email",
      icon: Mail,
      items: [
        { key: "emailAlerts" as const, label: "Account activity", desc: "Security alerts and login activity" },
        { key: "weeklyDigest" as const, label: "Weekly portfolio digest", desc: "Summary of your P/L and positions" },
        { key: "marketSummary" as const, label: "Daily market summary", desc: "Top movers and market overview" },
      ],
    },
    {
      group: "Push",
      icon: Smartphone,
      items: [
        { key: "pushNotifications" as const, label: "Browser push notifications", desc: "Real-time alerts in your browser" },
      ],
    },
    {
      group: "In-App",
      icon: MessageSquare,
      items: [
        { key: "tradeAlerts" as const, label: "Trade alerts", desc: "When trades are submitted or filled" },
        { key: "monitoringAlerts" as const, label: "AI agent alerts", desc: "When AI detects invalidation or risk" },
      ],
    },
  ]

  return (
    <div>
      <SectionHeader title="Notifications" description="Choose what you want to be notified about" />
      {notifGroups.map(({ group, icon: Icon, items }) => (
        <Card key={group} className="mt-5 first:mt-0">
          <div className="mb-4 flex items-center gap-2">
            <Icon className="h-4 w-4" style={{ color: "var(--text-secondary)" }} />
            <CardHeader title={group} />
          </div>
          <div className="flex flex-col gap-3">
            {items.map(({ key, label, desc }) => (
              <div
                key={key}
                className="flex items-start justify-between gap-4 rounded-xl p-3 transition-colors hover:bg-[var(--bg-hover)]"
              >
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{label}</p>
                  <p className="mt-0.5 text-xs" style={{ color: "var(--text-tertiary)" }}>{desc}</p>
                </div>
                <Toggle enabled={state[key]} onToggle={() => toggle(key)} label={label} />
              </div>
            ))}
          </div>
        </Card>
      ))}
      <div className="mt-5 flex justify-end">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => toast.success("Notification preferences saved")}
          className="rounded-xl px-5 py-2.5 text-sm font-semibold"
          style={{ background: "var(--btn-primary-bg)", color: "var(--text-inverse)" }}
        >
          Save preferences
        </motion.button>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════ */
/* API KEYS SECTION                                                           */
/* ══════════════════════════════════════════════════════════════════════════ */
type ApiKey = { id: string; name: string; key: string; created: string; lastUsed: string }
const MOCK_KEYS: ApiKey[] = [
  { id: "1", name: "Trading Bot", key: "sk-alpha-••••••••••••••••••••••rX9k", created: "Jan 12, 2026", lastUsed: "2h ago" },
  { id: "2", name: "Webhook Integration", key: "sk-alpha-••••••••••••••••••••••mK3p", created: "Feb 1, 2026", lastUsed: "5d ago" },
]

function ApiKeysSection() {
  const [keys, setKeys] = useState<ApiKey[]>(MOCK_KEYS)
  const [newName, setNewName] = useState("")
  const [creating, setCreating] = useState(false)

  function create() {
    if (!newName.trim()) return
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newName,
      key: `sk-alpha-••••••••••••••••••••••${Math.random().toString(36).slice(2, 6)}`,
      created: "Just now",
      lastUsed: "Never",
    }
    setKeys((k) => [newKey, ...k])
    setNewName("")
    setCreating(false)
    toast.success("API key created")
  }

  return (
    <div>
      <SectionHeader
        title="API Keys"
        description="Use API keys to authenticate programmatic access to Alpha"
      />
      <Card>
        <div className="flex items-center justify-between mb-5">
          <CardHeader title="Your API Keys" />
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setCreating(true)}
            className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold"
            style={{ background: "var(--btn-primary-bg)", color: "var(--text-inverse)" }}
          >
            <Plus className="h-3.5 w-3.5" />
            New key
          </motion.button>
        </div>

        {/* Create form */}
        <AnimatePresence>
          {creating && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div
                className="mb-5 flex items-center gap-3 rounded-xl border p-4"
                style={{ borderColor: "var(--border-default)", background: "var(--bg-surface-raised)" }}
              >
                <input
                  autoFocus
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && create()}
                  placeholder="Key name (e.g. Trading Bot)"
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--text-tertiary)]"
                  style={{ color: "var(--text-primary)" }}
                />
                <button
                  onClick={() => setCreating(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-[var(--bg-hover)]"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  <X className="h-4 w-4" />
                </button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={create}
                  className="rounded-lg px-4 py-1.5 text-sm font-semibold"
                  style={{ background: "var(--btn-primary-bg)", color: "var(--text-inverse)" }}
                >
                  Create
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {keys.length === 0 ? (
          <div className="py-10 text-center">
            <Key className="mx-auto h-8 w-8 mb-3" style={{ color: "var(--text-tertiary)" }} />
            <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>No API keys yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {keys.map((apiKey) => (
              <motion.div
                key={apiKey.id}
                layout
                className="flex items-center gap-3 rounded-xl border p-4"
                style={{ borderColor: "var(--border-default)", background: "var(--bg-surface-raised)" }}
              >
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: "var(--bg-surface)" }}
                >
                  <Key className="h-4 w-4" style={{ color: "var(--text-secondary)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{apiKey.name}</p>
                  <p className="mt-0.5 font-mono text-xs truncate" style={{ color: "var(--text-tertiary)" }}>
                    {apiKey.key}
                  </p>
                  <p className="mt-0.5 text-xs" style={{ color: "var(--text-tertiary)" }}>
                    Created {apiKey.created} · Last used {apiKey.lastUsed}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(apiKey.key)
                      toast.success("Copied to clipboard")
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-[var(--bg-hover)]"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setKeys((k) => k.filter((x) => x.id !== apiKey.id))
                      toast.success("API key revoked")
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-[var(--semantic-danger-subtle)]"
                    style={{ color: "var(--semantic-danger)" }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════ */
/* DANGER SECTION                                                             */
/* ══════════════════════════════════════════════════════════════════════════ */
function DangerSection() {
  const [showModal, setShowModal] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  const CONFIRM_PHRASE = "delete my account"

  return (
    <div>
      <SectionHeader title="Danger Zone" description="Irreversible actions that affect your account" />

      <div
        className="rounded-2xl border-2 p-6"
        style={{ borderColor: "var(--semantic-danger)" }}
      >
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <AlertTriangle className="h-4 w-4" style={{ color: "var(--semantic-danger)" }} />
              <p className="text-sm font-bold" style={{ color: "var(--semantic-danger)" }}>
                Delete Account
              </p>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Permanently deletes your account, all trades, chat history, strategies, and connected integrations.
              <strong style={{ color: "var(--text-primary)" }}> This cannot be undone.</strong>
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowModal(true)}
            className="shrink-0 rounded-xl border-2 px-5 py-2.5 text-sm font-bold transition-all hover:bg-[var(--semantic-danger)] hover:text-white"
            style={{
              borderColor: "var(--semantic-danger)",
              color: "var(--semantic-danger)",
            }}
          >
            Delete Account
          </motion.button>
        </div>
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(10px)" }}
            onClick={() => { setShowModal(false); setConfirmText("") }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 12 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md overflow-hidden rounded-3xl"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-default)",
                boxShadow: "var(--shadow-lg)",
              }}
            >
              {/* Red top stripe */}
              <div className="h-1.5 w-full" style={{ background: "var(--semantic-danger)" }} />

              <div className="p-8">
                <div className="mb-6 flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-2xl"
                      style={{ background: "var(--semantic-danger-subtle)" }}
                    >
                      <AlertTriangle className="h-5 w-5" style={{ color: "var(--semantic-danger)" }} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                        Delete your account?
                      </h3>
                      <p className="mt-1 text-sm" style={{ color: "var(--text-tertiary)" }}>
                        This is permanent and cannot be reversed.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setShowModal(false); setConfirmText("") }}
                    className="flex h-8 w-8 items-center justify-center rounded-xl transition-colors hover:bg-[var(--bg-hover)]"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div
                  className="mb-6 rounded-xl p-4"
                  style={{ background: "var(--semantic-danger-subtle)", border: "1px solid rgba(239,68,68,0.2)" }}
                >
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>
                    The following will be <strong>permanently deleted:</strong>
                  </p>
                  <ul className="mt-2 flex flex-col gap-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                    {["All trade positions and history", "All AI chat conversations", "All API keys and integrations", "Your profile and account data"].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: "var(--semantic-danger)" }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Type-to-confirm */}
                <div className="mb-6">
                  <label className="mb-2 block text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    Type <span className="font-mono font-bold" style={{ color: "var(--semantic-danger)" }}>
                      {CONFIRM_PHRASE}
                    </span> to confirm:
                  </label>
                  <input
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder={CONFIRM_PHRASE}
                    className="w-full rounded-xl border px-4 py-3 text-sm font-mono outline-none transition-all placeholder:text-[var(--text-tertiary)]"
                    style={{
                      borderColor: "var(--border-default)",
                      background: "var(--bg-canvas)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowModal(false); setConfirmText("") }}
                    className="flex-1 rounded-xl border-2 py-3 text-sm font-semibold transition-all hover:bg-[var(--bg-hover)]"
                    style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }}
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    disabled={confirmText !== CONFIRM_PHRASE}
                    className="flex-1 rounded-xl py-3 text-sm font-bold text-white transition-all disabled:cursor-not-allowed disabled:opacity-40"
                    style={{ background: "var(--semantic-danger)" }}
                  >
                    Permanently Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════ */
/* SHARED PRIMITIVES                                                          */
/* ══════════════════════════════════════════════════════════════════════════ */
function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{title}</h2>
      <p className="mt-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>{description}</p>
    </div>
  )
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn("rounded-2xl border p-6", className)}
      style={{
        background: "var(--bg-surface)",
        borderColor: "var(--border-default)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {children}
    </div>
  )
}

function CardHeader({ title }: { title: string }) {
  return (
    <h3 className="mb-0 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{title}</h3>
  )
}

function FormField({
  label,
  type = "text",
  value,
  defaultValue,
  disabled,
  placeholder,
  helpText,
  multiline,
  prefix,
  onChange,
}: {
  label: string
  type?: string
  value?: string
  defaultValue?: string
  disabled?: boolean
  placeholder?: string
  helpText?: string
  multiline?: boolean
  prefix?: string
  onChange?: (v: string | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}) {
  const inputProps = {
    defaultValue,
    value,
    disabled,
    placeholder,
    onChange: onChange ? (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value) : undefined,
    className:
      "w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-all duration-150 placeholder:text-[var(--text-tertiary)] focus:ring-[3px] disabled:cursor-not-allowed disabled:opacity-60",
    style: {
      borderColor: "var(--border-default)",
      background: disabled ? "var(--bg-surface-raised)" : "var(--bg-canvas)",
      color: "var(--text-primary)",
    } as React.CSSProperties,
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{label}</label>
      {prefix ? (
        <div
          className="flex overflow-hidden rounded-xl border"
          style={{ borderColor: "var(--border-default)" }}
        >
          <div
            className="flex items-center px-3.5 text-sm"
            style={{ background: "var(--bg-surface-raised)", color: "var(--text-tertiary)", borderRight: "1px solid var(--border-default)" }}
          >
            {prefix}
          </div>
          <input {...inputProps} className="flex-1 px-3.5 py-2.5 text-sm outline-none" style={{
            background: "var(--bg-canvas)",
            color: "var(--text-primary)",
          }} />
        </div>
      ) : multiline ? (
        <textarea {...inputProps} rows={3} style={{ ...inputProps.style, resize: "vertical", minHeight: "80px" }} />
      ) : (
        <input type={type} {...inputProps} />
      )}
      {helpText && <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>{helpText}</p>}
    </div>
  )
}

function PasswordField({
  label,
  show,
  onToggle,
  value,
  onChange,
}: {
  label: string
  show: boolean
  onToggle: () => void
  value?: string
  onChange?: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{label}</label>
      <div
        className="flex items-center overflow-hidden rounded-xl border"
        style={{ borderColor: "var(--border-default)", background: "var(--bg-canvas)" }}
      >
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          placeholder="••••••••"
          className="flex-1 bg-transparent px-3.5 py-2.5 text-sm outline-none placeholder:text-[var(--text-tertiary)]"
          style={{ color: "var(--text-primary)" }}
        />
        <button
          type="button"
          onClick={onToggle}
          className="px-3.5 transition-opacity hover:opacity-70"
          style={{ color: "var(--text-tertiary)" }}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}

function Toggle({ enabled, onToggle, label }: { enabled: boolean; onToggle: () => void; label: string }) {
  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      onClick={onToggle}
      className="relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors duration-200"
      style={{ background: enabled ? "var(--brand-primary)" : "var(--bg-active)" }}
      role="switch"
      aria-checked={enabled}
      aria-label={label}
    >
      <motion.span
        className="absolute top-0.5 block h-5 w-5 rounded-full"
        style={{ background: "white", boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }}
        animate={{ left: enabled ? "22px" : "2px" }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </motion.button>
  )
}

/* ── Password strength utility ────────────────────────────────────────────── */
function getPasswordStrength(pw: string): { score: number; label: string } {
  if (!pw) return { score: 0, label: "" }
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const labels = ["", "Weak", "Fair", "Good", "Strong"]
  return { score, label: labels[score] || "Strong" }
}
