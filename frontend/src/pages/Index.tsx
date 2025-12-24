import { HeroSection } from "@/components/home/HeroSection";
import { ValueStrip } from "@/components/home/ValueStrip";
import { WhatWeAutomate } from "@/components/home/WhatWeAutomate";
import { DemoGallery } from "@/components/home/DemoGallery";
import { SocialProof } from "@/components/home/SocialProof";
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
        <WhatWeAutomate />
        <DemoGallery />
        <SocialProof />
        <FinalCTA />
      </div>
    </div>
  );
};

export default Index;
