import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { PricingSection } from "@/components/landing/PricingSection";
import ParticlesBackground from "@/components/ui/ParticlesBackground";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-neutral-200 selection:bg-indigo-500/30">
      <ParticlesBackground />
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
      </main>
      
      <footer className="py-8 border-t border-neutral-900 text-center text-neutral-500 text-sm relative z-10">
        <p>© {new Date().getFullYear()} NexusGuard AI (Project Version 1.0). Developer name Nothacker-Fahim.</p>
      </footer>
    </div>
  );
}
