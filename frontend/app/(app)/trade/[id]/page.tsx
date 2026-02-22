import Link from "next/link"
import {
  ArrowLeft,
  ArrowUpRight,
  AlertTriangle,
  ExternalLink,
  MessageSquare,
} from "lucide-react"

const agentLogs = [
  {
    timestamp: "Feb 22, 14:30",
    message: "Monitoring agent started. Watching BTC/USD for invalidation conditions.",
    type: "info",
  },
  {
    timestamp: "Feb 22, 15:00",
    message: "Price check: $67,890 — all conditions nominal.",
    type: "info",
  },
  {
    timestamp: "Feb 22, 18:45",
    message: "Price check: $68,450 — approaching resistance at $69,800.",
    type: "info",
  },
  {
    timestamp: "Feb 23, 02:15",
    message: "4h MACD histogram: +0.032 — still positive.",
    type: "info",
  },
  {
    timestamp: "Feb 23, 09:00",
    message: "Alert: Price spiked to $69,750, testing resistance zone.",
    type: "warning",
  },
  {
    timestamp: "Feb 23, 13:30",
    message: "Price holding at $69,250. Take profit target at $72,000 not yet reached.",
    type: "info",
  },
]

const chatHistory = [
  {
    role: "user" as const,
    content: "Analyze @BTC on the 4h timeframe.",
  },
  {
    role: "assistant" as const,
    content:
      "The 4h chart shows BTC/USD at $67,450 with RSI at 58.3 and MACD crossing bullish. The 20-EMA is acting as dynamic support.",
  },
  {
    role: "user" as const,
    content: "Generate a trading strategy based on this analysis.",
  },
  {
    role: "assistant" as const,
    content:
      "I've generated a Long strategy for BTC/USD with entry at $67,450, take profit at $72,000, and stop loss at $65,200. Leverage is set to 5x with $1,000 position size.",
  },
]

export default async function TradeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className="flex h-full flex-col lg:flex-row">
      {/* Left Column — Trade Info */}
      <div
        className="flex-1 overflow-y-auto p-6 lg:p-8"
        style={{ borderRight: "1px solid var(--border-default)" }}
      >
        {/* Back button */}
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-150"
          style={{ color: "var(--text-secondary)" }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Trade Summary Card */}
        <div
          className="rounded-xl border p-6"
          style={{
            background: "var(--bg-surface)",
            borderColor: "var(--border-default)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
                style={{
                  background: "var(--bg-surface-raised)",
                  color: "var(--text-primary)",
                }}
              >
                BTC
              </div>
              <div>
                <h2
                  className="text-xl font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  BTC/USD
                </h2>
                <span
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Trade #{id}
                </span>
              </div>
            </div>
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
              style={{
                background: "var(--semantic-success-subtle)",
                color: "var(--semantic-success)",
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: "var(--semantic-success)" }}
              />
              Active
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
            <MetricBlock label="Direction">
              <span
                className="inline-flex items-center gap-1 text-sm font-medium"
                style={{ color: "var(--semantic-success)" }}
              >
                <ArrowUpRight className="h-3.5 w-3.5" />
                Long
              </span>
            </MetricBlock>
            <MetricBlock label="Unrealized P/L">
              <span
                className="font-mono text-lg font-semibold"
                style={{ color: "var(--semantic-success)" }}
              >
                +$1,800.00
              </span>
            </MetricBlock>
            <MetricBlock label="Entry Price">
              <span
                className="font-mono text-sm"
                style={{ color: "var(--text-primary)" }}
              >
                $67,450.00
              </span>
            </MetricBlock>
            <MetricBlock label="Current Price">
              <span
                className="font-mono text-sm"
                style={{ color: "var(--text-primary)" }}
              >
                $69,250.00
              </span>
            </MetricBlock>
          </div>
        </div>

        {/* Strategy Details Card */}
        <div
          className="mt-6 rounded-xl border p-6"
          style={{
            background: "var(--bg-surface)",
            borderColor: "var(--border-default)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <h3
            className="mb-4 text-base font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Strategy Details
          </h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <MetricBlock label="Position Size">
              <span
                className="font-mono text-sm"
                style={{ color: "var(--text-primary)" }}
              >
                $1,000.00
              </span>
            </MetricBlock>
            <MetricBlock label="Leverage">
              <span
                className="font-mono text-sm"
                style={{ color: "var(--text-primary)" }}
              >
                5x
              </span>
            </MetricBlock>
            <MetricBlock label="Take Profit">
              <span
                className="font-mono text-sm"
                style={{ color: "var(--semantic-success)" }}
              >
                $72,000.00
              </span>
            </MetricBlock>
            <MetricBlock label="Stop Loss">
              <span
                className="font-mono text-sm"
                style={{ color: "var(--semantic-danger)" }}
              >
                $65,200.00
              </span>
            </MetricBlock>
          </div>

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
              style={{
                color: "var(--text-secondary)",
                listStyleType: "disc",
              }}
            >
              <li>{"4h candle closes below $65,200"}</li>
              <li>{"4h MACD histogram turns negative for 3 consecutive candles"}</li>
            </ul>
          </div>
        </div>

        {/* Agent Log Card */}
        <div
          className="mt-6 rounded-xl border p-6"
          style={{
            background: "var(--bg-surface)",
            borderColor: "var(--border-default)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <h3
            className="mb-4 text-base font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Agent Log
          </h3>
          <div className="flex flex-col">
            {agentLogs.map((log, i) => (
              <div
                key={i}
                className="flex gap-3 py-2"
                style={{
                  borderBottom:
                    i < agentLogs.length - 1
                      ? "1px solid var(--border-default)"
                      : "none",
                }}
              >
                <span
                  className="shrink-0 font-mono text-xs"
                  style={{ color: "var(--text-tertiary)", width: "120px" }}
                >
                  {log.timestamp}
                </span>
                <span
                  className="flex items-start gap-2 text-[13px]"
                  style={{
                    color:
                      log.type === "warning"
                        ? "var(--semantic-warning)"
                        : "var(--text-secondary)",
                    fontWeight: log.type === "warning" ? 500 : 400,
                  }}
                >
                  {log.type === "warning" && (
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  )}
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column — Chat History (Read-only) */}
      <div
        className="flex w-full flex-col lg:w-[420px] lg:min-w-[380px]"
        style={{ background: "var(--bg-surface)" }}
      >
        <div
          className="flex items-center gap-2 px-4 py-3"
          style={{ borderBottom: "1px solid var(--border-default)" }}
        >
          <MessageSquare
            className="h-4 w-4"
            style={{ color: "var(--text-secondary)" }}
          />
          <span
            className="text-[15px] font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Chat History
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
          {chatHistory.map((msg, i) =>
            msg.role === "user" ? (
              <div key={i} className="flex justify-end">
                <div
                  className="max-w-[80%] rounded-xl rounded-br-sm px-4 py-3 text-sm"
                  style={{
                    background: "var(--btn-primary-bg)",
                    color: "var(--text-inverse)",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ) : (
              <div key={i} className="flex gap-3">
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                  style={{
                    background: "var(--brand-primary)",
                    color: "white",
                  }}
                >
                  A
                </div>
                <div
                  className="rounded-sm rounded-br-xl rounded-tr-xl px-4 py-3 text-sm leading-relaxed"
                  style={{
                    background: "var(--bg-surface-raised)",
                    color: "var(--text-primary)",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            )
          )}
        </div>

        {/* Footer actions */}
        <div
          className="flex gap-3 px-4 py-3"
          style={{ borderTop: "1px solid var(--border-default)" }}
        >
          <Link
            href="/chat"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium transition-colors duration-150"
            style={{
              borderColor: "var(--border-default)",
              color: "var(--text-primary)",
            }}
          >
            Continue in New Chat
          </Link>
          <button
            className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-150"
            style={{ color: "var(--text-secondary)" }}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Export
          </button>
        </div>
      </div>
    </div>
  )
}

function MetricBlock({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1">
      <span
        className="text-xs font-medium"
        style={{ color: "var(--text-tertiary)" }}
      >
        {label}
      </span>
      {children}
    </div>
  )
}
