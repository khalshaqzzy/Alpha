import { LandingNav } from "@/components/landing/landing-nav"
import { HeroSection } from "@/components/landing/hero-section"
import { SocialProof } from "@/components/landing/social-proof"
import { FeaturesSection } from "@/components/landing/features-section"
import { CTASection } from "@/components/landing/cta-section"
import { LandingFooter } from "@/components/landing/landing-footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-canvas)" }}>
      <LandingNav />
      <main>
        <HeroSection />
        <SocialProof />
        <FeaturesSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  )
}
