"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Diamond, Eye, EyeOff } from "lucide-react"

interface AuthFormProps {
  mode: "login" | "signup"
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Navigate to dashboard on form submit (mock auth)
    router.push("/dashboard")
  }

  const handleGoogleAuth = () => {
    // Navigate to dashboard on Google auth (mock auth)
    router.push("/dashboard")
  }

  const isLogin = mode === "login"
  const title = isLogin ? "Sign in to Alpha" : "Create your account"
  const toggleText = isLogin
    ? "Don't have an account?"
    : "Already have an account?"
  const toggleLink = isLogin ? "/signup" : "/login"
  const toggleLabel = isLogin ? "Sign Up" : "Sign In"
  const submitLabel = isLogin ? "Sign In" : "Create Account"

  return (
    <div className="flex min-h-screen">
      {/* Brand Panel (left) */}
      <div
        className="relative hidden w-1/2 flex-col justify-between p-12 lg:flex"
        style={{
          background: "linear-gradient(135deg, #1E3A5F, #0F172A)",
        }}
      >
        {/* Subtle grid overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative">
          <Link href="/" className="flex items-center gap-2">
            <Diamond className="h-6 w-6 text-white" />
            <span className="text-xl font-bold text-white">Alpha</span>
          </Link>
        </div>
        <div className="relative">
          <h2 className="max-w-md text-4xl font-bold leading-tight text-white text-balance">
            AI-Powered Insight for Smarter Crypto Trading
          </h2>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-white/60">
            Research, strategize, and monitor your portfolio — all through
            natural conversation with AI.
          </p>
        </div>
        <div className="relative text-sm text-white/40">
          {'2026 Alpha. All rights reserved.'}
        </div>
      </div>

      {/* Form Panel (right) */}
      <div
        className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2"
        style={{ background: "var(--bg-surface)" }}
      >
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <Diamond
              className="h-6 w-6"
              style={{ color: "var(--brand-primary)" }}
            />
            <span
              className="text-xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Alpha
            </span>
          </div>

          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            {title}
          </h1>
          <p
            className="mt-2 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            {isLogin
              ? "Welcome back. Enter your credentials to continue."
              : "Start your journey with AI-assisted trading."}
          </p>

          {/* Google OAuth button */}
          <button
            onClick={handleGoogleAuth}
            type="button"
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium transition-colors duration-150 hover:bg-[var(--bg-hover)]"
            style={{
              borderColor: "var(--border-default)",
              color: "var(--text-primary)",
              background: "var(--bg-surface)",
            }}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign {isLogin ? "in" : "up"} with Google
          </button>

          {/* Separator */}
          <div className="my-6 flex items-center gap-4">
            <div
              className="h-px flex-1"
              style={{ background: "var(--border-default)" }}
            />
            <span
              className="text-xs font-medium"
              style={{ color: "var(--text-tertiary)" }}
            >
              OR
            </span>
            <div
              className="h-px flex-1"
              style={{ background: "var(--border-default)" }}
            />
          </div>

          {/* Form */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="name"
                  className="text-xs font-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="h-10 rounded-lg border px-3 text-sm outline-none transition-all duration-150 placeholder:text-[var(--text-tertiary)] focus:ring-[3px]"
                  style={{
                    borderColor: "var(--border-default)",
                    background: "var(--bg-surface)",
                    color: "var(--text-primary)",
                    "--tw-ring-color": "var(--brand-subtle)",
                  } as React.CSSProperties}
                />
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label
                htmlFor="email"
                className="text-xs font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="h-10 rounded-lg border px-3 text-sm outline-none transition-all duration-150 placeholder:text-[var(--text-tertiary)] focus:ring-[3px]"
                style={{
                  borderColor: "var(--border-default)",
                  background: "var(--bg-surface)",
                  color: "var(--text-primary)",
                  "--tw-ring-color": "var(--brand-subtle)",
                } as React.CSSProperties}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="password"
                className="text-xs font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="h-10 w-full rounded-lg border px-3 pr-10 text-sm outline-none transition-all duration-150 placeholder:text-[var(--text-tertiary)] focus:ring-[3px]"
                  style={{
                    borderColor: "var(--border-default)",
                    background: "var(--bg-surface)",
                    color: "var(--text-primary)",
                    "--tw-ring-color": "var(--brand-subtle)",
                  } as React.CSSProperties}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--text-tertiary)" }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 h-11 w-full rounded-lg text-sm font-medium transition-all duration-150 hover:bg-[var(--btn-primary-hover)]"
              style={{
                background: "var(--btn-primary-bg)",
                color: "var(--text-inverse)",
              }}
            >
              {submitLabel}
            </button>
          </form>

          <p
            className="mt-6 text-center text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            {toggleText}{" "}
            <Link
              href={toggleLink}
              className="font-semibold"
              style={{ color: "var(--brand-primary)" }}
            >
              {toggleLabel}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
