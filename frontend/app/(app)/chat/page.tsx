import { AnalysisPanel } from "@/components/chat/analysis-panel"
import { ChatPanel } from "@/components/chat/chat-panel"

export default function ChatPage() {
  return (
    <div className="flex h-full">
      <AnalysisPanel />
      <ChatPanel />
    </div>
  )
}
