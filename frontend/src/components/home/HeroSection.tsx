import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Play, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export function HeroSection() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showFirstLine, setShowFirstLine] = useState(false);
  const [showSecondLine, setShowSecondLine] = useState(false);

  useEffect(() => {
    // Show first line with a slight delay for smooth entrance
    const firstTimer = setTimeout(() => {
      setShowFirstLine(true);
    }, 200);
    
    // Show second line after first line appears
    const secondTimer = setTimeout(() => {
      setShowSecondLine(true);
    }, 800);

    return () => {
      clearTimeout(firstTimer);
      clearTimeout(secondTimer);
    };
  }, []);

  const handleBookDemo = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      // Redirect to contact page via backend
      const api = import.meta.env.VITE_API_URL || "http://localhost:5000";
      window.location.href = `${api}/go/contact`;
    }
  };

    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-32 md:pt-40 pb-8 sm:pb-12 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
          {/* Main Headline */}
          <div className="animate-fade-in-up">
            {/* Trust Badge */}
            <div className="mb-4 sm:mb-6 flex justify-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-transparent border border-yellow-500/60 text-yellow-500 animate-fade-in">
                <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                Trusted by YC & Shark Tank–backed startups
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 font-medium tracking-wide px-2">
              AI Automation Agency for Growth, Sales and Operations
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight mb-4 sm:mb-6 px-2">
              {showFirstLine && (
                <span className="inline-block animate-fade-in-down">
                  Time is money.
                </span>
              )}
              {showSecondLine && (
                <>
                  <br />
                  <span className="text-gradient inline-block animate-fade-in-down" style={{ animationDelay: '0.1s' }}>
                    We save you both.
                  </span>
                </>
              )}
            </h1>
            
            <p className="text-sm sm:text-base md:text-lg text-foreground mb-12 sm:mb-16 md:mb-24 max-w-2xl mx-auto leading-relaxed font-medium px-4">
              Production-ready AI agents that automate growth and operations,
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>built by{" "}
              <span className="relative inline-block">
                <span className="relative z-10 drop-shadow-sm">IIT Engineers</span>
                <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent rounded-full animate-highlight origin-left opacity-100" style={{ transform: 'rotate(-1deg)', boxShadow: '0 0 8px rgba(139, 92, 246, 0.5)' }}></span>
              </span>
              .
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6 sm:mb-8 animate-fade-in-up px-4" style={{ animationDelay: '0.2s' }}>
            <div className="flex flex-col items-center w-full sm:w-auto">
              <Button 
                variant="hero" 
                size="lg" 
                className="group shadow-glow w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6"
                onClick={handleBookDemo}
              >
                <Calendar className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Book a Free AI Consultation</span>
                <span className="sm:hidden">Book Free Consultation</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <p className="text-xs text-muted-foreground mt-2 text-center animate-fade-in-up max-w-xs" style={{ animationDelay: '0.3s' }}>
                No sales pitch. Actionable recommendations tailored to your workflows.
              </p>
            </div>
            
            <Button
              variant="glass"
              size="lg"
              className="group w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6"
              onClick={() => {
                navigate('/case-studies');
              }}
            >
              <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              View Case Studies
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
}