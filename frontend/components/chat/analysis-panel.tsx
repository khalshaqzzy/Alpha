"use client"

import { useState } from "react"
import {
  CandlestickChart,
  LineChart,
  AreaChart,
  BarChart3,
  Maximize2,
  Layers,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

const chartTypes = [
  { icon: CandlestickChart, label: "Candlestick", id: "candle" },
  { icon: LineChart, label: "Line", id: "line" },
  { icon: AreaChart, label: "Area", id: "area" },
  { icon: BarChart3, label: "Bar", id: "bar" },
]

const timeframes = ["1m", "5m", "15m", "1h", "4h", "1D", "1W"]

// Mock candlestick data for visual representation
const mockCandles = Array.from({ length: 60 }, (_, i) => {
  const base = 67000 + Math.sin(i * 0.3) * 2000 + Math.random() * 500
  const open = base + (Math.random() - 0.5) * 300
  const close = base + (Math.random() - 0.5) * 300
  const high = Math.max(open, close) + Math.random() * 200
  const low = Math.min(open, close) - Math.random() * 200
  return { open, close, high, low, bullish: close > open }
})

// Mock RSI data
const mockRsi = Array.from({ length: 60 }, (_, i) => 30 + Math.sin(i * 0.2) * 25 + Math.random() * 10)

export function AnalysisPanel() {
  const [activeChart, setActiveChart] = useState("candle")
  const [activeTimeframe, setActiveTimeframe] = useState("4h")
  const [showRsi, setShowRsi] = useState(true)

  return (
    <div
      className="flex flex-1 flex-col"
      style={{
        borderRight: "1px solid var(--border-default)",
        background: "var(--bg-canvas)",
      }}
    >
      {/* Chart Toolbar */}
      <div
        className="flex items-center justify-between px-4"
        style={{
          height: "var(--chart-toolbar-height, 48px)",
          borderBottom: "1px solid var(--border-default)",
          background: "var(--bg-surface)",
        }}
      >
        {/* Chart type selector */}
        <div className="flex items-center gap-1">
          {chartTypes.map(({ icon: Icon, label, id }) => (
            <button
              key={id}
              onClick={() => setActiveChart(id)}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-150"
              )}
              style={{
                background:
                  activeChart === id
                    ? "var(--bg-active)"
                    : "transparent",
                color:
                  activeChart === id
                    ? "var(--text-primary)"
                    : "var(--text-tertiary)",
              }}
              title={label}
              aria-label={label}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>

        {/* Timeframe pills */}
        <div className="flex items-center gap-0.5">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setActiveTimeframe(tf)}
              className="rounded-md px-2.5 py-1 text-xs font-medium transition-colors duration-150"
              style={{
                background:
                  activeTimeframe === tf
                    ? "var(--bg-active)"
                    : "transparent",
                color:
                  activeTimeframe === tf
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
                fontWeight: activeTimeframe === tf ? 600 : 500,
              }}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          <button
            className="flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-150"
            style={{ color: "var(--text-tertiary)" }}
            title="Indicators"
            aria-label="Toggle indicators"
          >
            <Layers className="h-4 w-4" />
          </button>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-150"
            style={{ color: "var(--text-tertiary)" }}
            title="Fullscreen"
            aria-label="Fullscreen"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative flex-1 p-4">
        {/* Asset label */}
        <div className="mb-2 flex items-center gap-3">
          <span
            className="text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            BTC/USD
          </span>
          <span
            className="font-mono text-sm font-medium"
            style={{ color: "var(--semantic-success)" }}
          >
            $69,247.50
          </span>
          <span
            className="font-mono text-xs"
            style={{ color: "var(--semantic-success)" }}
          >
            +2.67%
          </span>
        </div>

        {/* Mock Candlestick Chart SVG */}
        <div
          className="w-full overflow-hidden rounded-lg"
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border-default)",
          }}
        >
          <svg
            viewBox="0 0 900 350"
            className="w-full"
            style={{ display: "block" }}
            aria-label="BTC/USD price chart"
          >
            {/* Grid lines */}
            {[70, 140, 210, 280].map((y) => (
              <line
                key={y}
                x1="40"
                y1={y}
                x2="880"
                y2={y}
                stroke="var(--border-default)"
                strokeWidth="0.5"
                opacity="0.5"
              />
            ))}

            {/* EMA overlay line */}
            <polyline
              points={mockCandles
                .map((_, i) => {
                  const x = 50 + i * 14
                  const avg =
                    mockCandles
                      .slice(Math.max(0, i - 10), i + 1)
                      .reduce((s, c) => s + c.close, 0) /
                    Math.min(i + 1, 11)
                  const y = 320 - ((avg - 65000) / 5000) * 280
                  return `${x},${y}`
                })
                .join(" ")}
              fill="none"
              stroke="var(--brand-primary)"
              strokeWidth="1.5"
              opacity="0.7"
            />

            {/* Candlesticks */}
            {mockCandles.map((c, i) => {
              const x = 50 + i * 14
              const yOpen = 320 - ((c.open - 65000) / 5000) * 280
              const yClose = 320 - ((c.close - 65000) / 5000) * 280
              const yHigh = 320 - ((c.high - 65000) / 5000) * 280
              const yLow = 320 - ((c.low - 65000) / 5000) * 280
              const color = c.bullish
                ? "var(--semantic-success)"
                : "var(--semantic-danger)"
              return (
                <g key={i}>
                  <line
                    x1={x}
                    y1={yHigh}
                    x2={x}
                    y2={yLow}
                    stroke={color}
                    strokeWidth="1"
                  />
                  <rect
                    x={x - 4}
                    y={Math.min(yOpen, yClose)}
                    width="8"
                    height={Math.max(Math.abs(yClose - yOpen), 1)}
                    fill={color}
                    rx="1"
                  />
                </g>
              )
            })}

            {/* Support line annotation */}
            <line
              x1="40"
              y1="250"
              x2="880"
              y2="250"
              stroke="var(--semantic-danger)"
              strokeWidth="1"
              strokeDasharray="6 3"
              opacity="0.6"
            />
            <text
              x="850"
              y="246"
              fill="var(--semantic-danger)"
              fontSize="9"
              fontFamily="var(--font-mono)"
              textAnchor="end"
              opacity="0.8"
            >
              S: $66,200
            </text>

            {/* Resistance line */}
            <line
              x1="40"
              y1="80"
              x2="880"
              y2="80"
              stroke="var(--brand-primary)"
              strokeWidth="1"
              strokeDasharray="6 3"
              opacity="0.6"
            />
            <text
              x="850"
              y="76"
              fill="var(--brand-primary)"
              fontSize="9"
              fontFamily="var(--font-mono)"
              textAnchor="end"
              opacity="0.8"
            >
              R: $69,800
            </text>

            {/* Y-axis labels */}
            {[
              { price: "$69,500", y: 90 },
              { price: "$68,500", y: 150 },
              { price: "$67,500", y: 210 },
              { price: "$66,500", y: 270 },
            ].map(({ price, y }) => (
              <text
                key={price}
                x="35"
                y={y}
                fill="var(--text-tertiary)"
                fontSize="8"
                fontFamily="var(--font-mono)"
                textAnchor="end"
              >
                {price}
              </text>
            ))}
          </svg>
        </div>

        {/* RSI Sub-Pane */}
        {showRsi && (
          <div className="mt-2">
            <div
              className="flex items-center justify-between rounded-t-lg px-3 py-1.5"
              style={{
                background: "var(--bg-surface)",
                borderTop: "1px solid var(--border-default)",
                borderLeft: "1px solid var(--border-default)",
                borderRight: "1px solid var(--border-default)",
              }}
            >
              <span
                className="text-xs font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                RSI (14)
              </span>
              <button
                onClick={() => setShowRsi(false)}
                className="flex h-5 w-5 items-center justify-center rounded"
                style={{ color: "var(--text-tertiary)" }}
                aria-label="Close RSI pane"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            <div
              className="overflow-hidden rounded-b-lg"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-default)",
                borderTop: "none",
              }}
            >
              <svg
                viewBox="0 0 900 80"
                className="w-full"
                style={{ display: "block" }}
                aria-label="RSI indicator"
              >
                {/* Overbought / oversold zones */}
                <rect
                  x="0"
                  y="0"
                  width="900"
                  height="16"
                  fill="var(--semantic-danger)"
                  opacity="0.05"
                />
                <rect
                  x="0"
                  y="56"
                  width="900"
                  height="24"
                  fill="var(--semantic-success)"
                  opacity="0.05"
                />
                <line
                  x1="0"
                  y1="16"
                  x2="900"
                  y2="16"
                  stroke="var(--semantic-danger)"
                  strokeWidth="0.5"
                  strokeDasharray="4 2"
                  opacity="0.3"
                />
                <line
                  x1="0"
                  y1="56"
                  x2="900"
                  y2="56"
                  stroke="var(--semantic-success)"
                  strokeWidth="0.5"
                  strokeDasharray="4 2"
                  opacity="0.3"
                />
                {/* RSI Line */}
                <polyline
                  points={mockRsi
                    .map((val, i) => {
                      const x = 50 + i * 14
                      const y = 80 - (val / 100) * 80
                      return `${x},${y}`
                    })
                    .join(" ")}
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
