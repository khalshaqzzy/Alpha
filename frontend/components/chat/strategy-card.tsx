"use client"

import { useState } from "react"
import { ArrowUpRight, AlertTriangle, X, Check } from "lucide-react"

export function StrategyCard() {
  const [showModal, setShowModal] = useState(false)
  const [positionSize, setPositionSize] = useState("$1,000")
  const [leverage, setLeverage] = useState("5x")
  const [takeProfit, setTakeProfit] = useState("$72,000.00")
  const [stopLoss, setStopLoss] = useState("$65,200.00")

  return (
    <>
      <div
        className="max-w-[420px] rounded-xl border p-5"
        style={{
          background: "var(--bg-surface)",
          borderColor: "var(--border-default)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        {/* Strategy header */}
        <div className="mb-4 flex items-center gap-3">
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
            style={{
              background: "var(--semantic-success-subtle)",
              color: "var(--semantic-success)",
            }}
          >
            <ArrowUpRight className="h-3 w-3" />
            Long
          </span>
          <span
            className="text-base font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            BTC/USD Strategy
          </span>
        </div>

        {/* Strategy grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label
              className="text-xs font-medium"
              style={{ color: "var(--text-tertiary)" }}
            >
              Entry Price
            </label>
            <span
              className="font-mono text-sm"
              style={{ color: "var(--text-primary)" }}
            >
              $67,450.00
            </span>
          </div>
          <EditableField
            label="Position Size"
            value={positionSize}
            onChange={setPositionSize}
          />
          <EditableField
            label="Leverage"
            value={leverage}
            onChange={setLeverage}
          />
          <EditableField
            label="Take Profit"
            value={takeProfit}
            onChange={setTakeProfit}
          />
          <EditableField
            label="Stop Loss"
            value={stopLoss}
            onChange={setStopLoss}
          />
        </div>

        {/* Invalidation conditions */}
        <div
          className="mt-4 border-t pt-4"
          style={{ borderColor: "var(--border-default)" }}
        >
          <span
            className="text-xs font-medium"
            style={{ color: "var(--text-tertiary)" }}
          >
            Invalidation Conditions
          </span>
          <ul
            className="mt-2 flex flex-col gap-1.5 pl-4 text-[13px] leading-relaxed"
            style={{ color: "var(--text-secondary)", listStyleType: "disc" }}
          >
            <li>{"4h candle closes below $65,200"}</li>
            <li>{"4h MACD histogram turns negative for 3 consecutive candles"}</li>
          </ul>
        </div>

        {/* Add Trade button */}
        <button
          onClick={() => setShowModal(true)}
          className="mt-4 w-full rounded-lg py-2.5 text-sm font-medium transition-all duration-150"
          style={{
            background: "var(--btn-primary-bg)",
            color: "var(--text-inverse)",
          }}
        >
          Add Trade to Portfolio
        </button>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            className="w-[90%] max-w-[480px] rounded-2xl p-8"
            style={{
              background: "var(--bg-surface)",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{
                    background: "var(--semantic-success-subtle)",
                  }}
                >
                  <Check
                    className="h-4 w-4"
                    style={{ color: "var(--semantic-success)" }}
                  />
                </div>
                <h3
                  className="text-lg font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Trade Added to Portfolio
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="flex h-7 w-7 items-center justify-center rounded-md"
                style={{ color: "var(--text-tertiary)" }}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p
              className="mb-4 text-sm leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              Your BTC/USD Long strategy has been saved to your portfolio. A
              monitoring agent has been activated to watch for invalidation
              conditions.
            </p>

            {/* Warning box */}
            <div
              className="mb-6 rounded-lg p-3"
              style={{
                background: "var(--semantic-warning-subtle)",
                borderLeft: "3px solid var(--semantic-warning)",
              }}
            >
              <div className="flex items-start gap-2">
                <AlertTriangle
                  className="mt-0.5 h-4 w-4 shrink-0"
                  style={{ color: "var(--semantic-warning)" }}
                />
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-primary)" }}
                >
                  This trade has <strong>NOT</strong> been executed. You must
                  manually place the trade on your exchange.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full rounded-lg py-2.5 text-sm font-medium transition-all duration-150"
              style={{
                background: "var(--btn-primary-bg)",
                color: "var(--text-inverse)",
              }}
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function EditableField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-1">
      <label
        className="text-xs font-medium"
        style={{ color: "var(--text-tertiary)" }}
      >
        {label}
      </label>
      <input
        className="h-8 rounded-lg border px-2 font-mono text-sm outline-none transition-all duration-150 focus:ring-[3px]"
        style={{
          borderColor: "var(--border-default)",
          background: "var(--bg-surface)",
          color: "var(--text-primary)",
          "--tw-ring-color": "var(--brand-subtle)",
        } as React.CSSProperties}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
