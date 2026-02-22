"use client"

import { useState, useRef, useEffect } from "react"
import {
  ArrowUp, AtSign, Check, ChevronRight, MoreHorizontal, Sparkles
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { StrategyCard } from "./strategy-card"
import { cn } from "@/lib/utils"

interface AgentStep {
  label: string
  status: "completed" | "active" | "pending"
  duration?: string
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  hasStrategy?: boolean
  agentSteps?: AgentStep[]
  streaming?: boolean
}

const mockMessages: Message[] = [
  {
    id: "1",
    role: "user",
    content: "Analyze @BTC on the 4H chart and give me a trade setup",
  },
  {
    id: "2",
    role: "assistant",
    content:
      "**BTC/USD Analysis — 4H Chart**\n\nBitcoin is forming a **bullish continuation pattern** after reclaiming the $67,000 support zone.\n\n### Key Levels\n- **Support:** $66,200 (recent swing low)\n- **Resistance:** $69,800 (previous high)\n- **Target:** $72,000 (measured move)\n\n### Technical Indicators\n- RSI (14): 58 — room to run before overbought\n- EMA 21: Sloping up, price above = bullish\n- Volume: Increasing on up candles ✅\n\nOverall structure is **bullish** with a favorable risk/reward setup.",
    agentSteps: [
      { label: "Fetching BTC/USD 4H data", status: "completed", duration: "0.4s" },
      { label: "Running technical analysis", status: "completed", duration: "1.2s" },
      { label: "Generating strategy", status: "completed", duration: "0.8s" },
    ],
    hasStrategy: true,
  },
]

const ASSET_SUGGESTIONS = [
  { symbol: "BTC", name: "Bitcoin" },
  { symbol: "ETH", name: "Ethereum" },
  { symbol: "SOL", name: "Solana" },
  { symbol: "AVAX", name: "Avalanche" },
  { symbol: "DOT", name: "Polkadot" },
  { symbol: "LINK", name: "Chainlink" },
]

function AgentSteps({ steps }: { steps: AgentStep[] }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="mb-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-80"
        style={{ color: "var(--text-tertiary)" }}
      >
        <ChevronRight
          className={cn("h-3 w-3 transition-transform duration-200", expanded && "rotate-90")}
        />
        {steps.filter((s) => s.status === "completed").length}/{steps.length} steps completed
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <ul className="mt-2 flex flex-col gap-1.5 pl-1">
              {steps.map((step, i) => (
                <li key={i} className="flex items-center gap-2 text-xs">
                  <span
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                      step.status === "completed" && "bg-[var(--semantic-success-subtle)]",
                      step.status === "active" && "bg-[var(--brand-subtle)]",
                      step.status === "pending" && "bg-[var(--bg-surface-raised)]"
                    )}
                  >
                    {step.status === "completed" ? (
                      <Check className="h-2.5 w-2.5" style={{ color: "var(--semantic-success)" }} />
                    ) : step.status === "active" ? (
                      <div className="h-2 w-2 rounded-full animate-pulse" style={{ background: "var(--brand-primary)" }} />
                    ) : (
                      <div className="h-2 w-2 rounded-full" style={{ background: "var(--text-tertiary)", opacity: 0.3 }} />
                    )}
                  </span>
                  <span style={{ color: step.status === "pending" ? "var(--text-tertiary)" : "var(--text-secondary)" }}>
                    {step.label}
                  </span>
                  {step.duration && (
                    <span className="ml-auto font-mono text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                      {step.duration}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ThinkingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
        style={{ background: "var(--brand-subtle)" }}
      >
        <Sparkles className="h-3.5 w-3.5" style={{ color: "var(--brand-primary)" }} />
      </div>
      <div
        className="rounded-2xl rounded-tl-none px-4 py-3"
        style={{ background: "var(--bg-surface-raised)", border: "1px solid var(--border-default)" }}
      >
        <div className="dot-pulse">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  )
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user"
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className={cn("flex items-start gap-3", isUser && "flex-row-reverse")}
    >
      {!isUser && (
        <div
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
          style={{ background: "var(--brand-subtle)" }}
        >
          <Sparkles className="h-3.5 w-3.5" style={{ color: "var(--brand-primary)" }} />
        </div>
      )}

      <div className={cn("max-w-[80%]", isUser && "items-end flex flex-col")}>
        {!isUser && message.agentSteps && (
          <AgentSteps steps={message.agentSteps} />
        )}

        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm",
            isUser ? "rounded-tr-none" : "rounded-tl-none"
          )}
          style={
            isUser
              ? { background: "var(--btn-primary-bg)", color: "var(--text-inverse)" }
              : {
                background: "var(--bg-surface-raised)",
                border: "1px solid var(--border-default)",
                color: "var(--text-primary)",
              }
          }
        >
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <div className={cn("alpha-prose text-sm", message.streaming && "streaming-cursor")}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {!isUser && message.hasStrategy && (
          <div className="mt-3">
            <StrategyCard />
          </div>
        )}
      </div>
    </motion.div>
  )
}

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [input, setInput] = useState("")
  const [isThinking, setIsThinking] = useState(false)
  const [showAssets, setShowAssets] = useState(false)
  const [assetQuery, setAssetQuery] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isThinking])

  const filteredAssets = ASSET_SUGGESTIONS.filter(
    (a) =>
      a.symbol.toLowerCase().includes(assetQuery.toLowerCase()) ||
      a.name.toLowerCase().includes(assetQuery.toLowerCase())
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    setInput(val)

    // Detect @ mention
    const atIdx = val.lastIndexOf("@")
    if (atIdx !== -1 && (atIdx === 0 || val[atIdx - 1] === " ")) {
      setAssetQuery(val.slice(atIdx + 1))
      setShowAssets(true)
    } else {
      setShowAssets(false)
    }
  }

  const insertAsset = (symbol: string) => {
    const atIdx = input.lastIndexOf("@")
    setInput(input.slice(0, atIdx) + `@${symbol} `)
    setShowAssets(false)
    inputRef.current?.focus()
  }

  const handleSend = async () => {
    if (!input.trim()) return
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input.trim() }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setShowAssets(false)
    setIsThinking(true)
    // Simulate AI response
    await new Promise((r) => setTimeout(r, 2000))
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "I'm analyzing your request. This is a **mock response** — connect the backend to enable real AI analysis.",
    }
    setIsThinking(false)
    setMessages((prev) => [...prev, aiMsg])
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div
      className="flex flex-col"
      style={{
        width: "var(--chat-panel-width, 420px)",
        background: "var(--bg-surface)",
        borderLeft: "1px solid var(--border-default)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid var(--border-default)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-full"
            style={{ background: "var(--brand-subtle)" }}
          >
            <Sparkles className="h-3.5 w-3.5" style={{ color: "var(--brand-primary)" }} />
          </div>
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Alpha AI
          </span>
          <span className="status-dot-active ml-1" />
        </div>
        <button
          className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-[var(--bg-hover)]"
          style={{ color: "var(--text-tertiary)" }}
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isThinking && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ThinkingIndicator />
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Asset autocomplete */}
      <AnimatePresence>
        {showAssets && filteredAssets.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="mx-4 mb-2 overflow-hidden rounded-xl"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-default)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            {filteredAssets.map((asset) => (
              <button
                key={asset.symbol}
                onClick={() => insertAsset(asset.symbol)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-[var(--bg-hover)]"
              >
                <span
                  className="font-mono text-xs font-bold"
                  style={{ color: "var(--brand-primary)" }}
                >
                  {asset.symbol}
                </span>
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  {asset.name}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input area */}
      <div
        className="px-4 pb-4"
        style={{ borderTop: "1px solid var(--border-default)", paddingTop: "12px" }}
      >
        <div
          className="relative rounded-2xl"
          style={{
            background: "var(--bg-surface-raised)",
            border: "1px solid var(--border-default)",
          }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about crypto... (use @ to tag assets)"
            rows={2}
            className="w-full resize-none bg-transparent px-4 pt-3 pb-12 text-sm outline-none placeholder:text-[var(--text-tertiary)]"
            style={{ color: "var(--text-primary)" }}
          />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <button
              onClick={() => { setShowAssets(!showAssets); setAssetQuery("") }}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-[var(--bg-active)]"
              style={{ color: "var(--text-secondary)" }}
            >
              <AtSign className="h-3.5 w-3.5" />
              Tag Asset
            </button>
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={handleSend}
              disabled={!input.trim() || isThinking}
              className="flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-150 disabled:opacity-40"
              style={{
                background: input.trim() ? "var(--btn-primary-bg)" : "var(--bg-active)",
                color: input.trim() ? "var(--text-inverse)" : "var(--text-tertiary)",
              }}
            >
              <ArrowUp className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
        <p className="mt-2 text-center text-[10px]" style={{ color: "var(--text-tertiary)" }}>
          Alpha may make mistakes. Always do your own research.
        </p>
      </div>
    </div>
  )
}
