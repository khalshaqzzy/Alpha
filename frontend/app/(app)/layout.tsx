import { AppSidebar } from "@/components/layout/app-sidebar"
import { CommandPalette } from "@/components/layout/command-palette"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen" style={{ background: "var(--bg-canvas)" }}>
      <AppSidebar />
      <CommandPalette />
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}
