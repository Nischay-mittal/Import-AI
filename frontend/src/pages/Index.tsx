import { HeroSection } from "@/components/home/HeroSection";
import { ValueStrip } from "@/components/home/ValueStrip";
import { WhatWeBuild } from "@/components/home/WhatWeBuild";
import { CaseStudiesSection } from "@/components/home/CaseStudiesSection";
import { SocialProof } from "@/components/home/SocialProof";
import { AboutSection } from "@/components/home/AboutSection";
import { FinalCTA } from "@/components/home/FinalCTA";
import { AnimatedBackground } from "@/components/home/AnimatedBackground";

const Index = () => {
  return (
    <div className="relative w-full">
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <AnimatedBackground />
      </div>
      <div className="relative z-10">
        <HeroSection />
        <ValueStrip />
        <WhatWeBuild />
        <CaseStudiesSection />
        <SocialProof />
        <AboutSection />
        <FinalCTA />
      </div>
    </div>
  );
};

export default Index;
