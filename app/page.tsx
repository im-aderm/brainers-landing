import { CustomCursor } from "@/components/chrome/CustomCursor";
import { Footer } from "@/components/chrome/Footer";
import { Navbar } from "@/components/chrome/Navbar";
import { Preloader } from "@/components/chrome/Preloader";
import { ScrollProgress } from "@/components/chrome/ScrollProgress";
import { SmoothScroll } from "@/components/chrome/SmoothScroll";
import { Comparison } from "@/components/sections/Comparison";
import { Dashboard } from "@/components/sections/Dashboard";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Integrations } from "@/components/sections/Integrations";
import { KnowledgeGraphSection } from "@/components/sections/KnowledgeGraphSection";
import { Problem } from "@/components/sections/Problem";
import { SearchExperience } from "@/components/sections/SearchExperience";
import { Security } from "@/components/sections/Security";
import { Testimonials } from "@/components/sections/Testimonials";

export default function Home() {
  return (
    <SmoothScroll>
      <Preloader />
      <ScrollProgress />
      <CustomCursor />
      <Navbar />
      <main className="relative noise">
        <Hero />
        <Problem />
        <HowItWorks />
        <KnowledgeGraphSection />
        <SearchExperience />
        <Dashboard />
        <Security />
        <Integrations />
        <Comparison />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
