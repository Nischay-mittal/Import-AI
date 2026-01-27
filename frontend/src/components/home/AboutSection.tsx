import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function AboutSection() {
  // Generate stars for background
  const stars = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 4,
      duration: 2 + Math.random() * 2,
      opacity: 0.4 + Math.random() * 0.5,
    }));
  }, []);

  return (
    <section className="py-8 sm:py-12 md:py-16 relative overflow-hidden bg-background">
      {/* Galaxy Stars Animation */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full"
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              left: `${star.left}%`,
              top: `${star.top}%`,
              background: `radial-gradient(circle, rgba(255, 255, 255, ${star.opacity}) 0%, rgba(255, 255, 255, ${star.opacity * 0.5}) 40%, rgba(255, 255, 255, 0) 70%)`,
              animation: `star-twinkle ${star.duration}s ease-in-out infinite`,
              animationDelay: `${star.delay}s`,
              boxShadow: `0 0 ${star.size * 4}px rgba(255, 255, 255, ${star.opacity * 0.8}), 0 0 ${star.size * 8}px rgba(255, 255, 255, ${star.opacity * 0.4})`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes star-twinkle {
          0%, 100% { opacity: 0.4; transform: scale(1) translate(0, 0); }
          25% { opacity: 0.8; transform: scale(1.15) translate(3px, -3px); }
          50% { opacity: 1; transform: scale(1.3) translate(-2px, 2px); }
          75% { opacity: 0.7; transform: scale(1.1) translate(2px, -2px); }
        }
      `}</style>

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4">
            Production-Ready AI Agents by <span className="text-gradient">IIT Engineers</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
            We're building reliable AI automation systems for business growth, sales and operations.
          </p>
        </div>

        <div className="text-center">
          <Button variant="outline" size="default" className="text-sm sm:text-base px-4 sm:px-6" asChild>
            <Link to="/about">
              Learn More About Us
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

