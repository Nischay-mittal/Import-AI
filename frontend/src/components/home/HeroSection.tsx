import { Button } from "@/components/ui/button";
import { Calendar, Play, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export function HeroSection() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
        <div className="container mx-auto px-6 pt-32 md:pt-40 pb-12 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
          {/* Main Headline */}
          <div className="animate-fade-in-up">
            <p className="text-xs md:text-sm text-muted-foreground mb-3 font-medium tracking-wide">
              AI Automation Agency for Growth and Operations
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6">
              Time is money.
              <br />
              <span className="text-gradient">We save you both.</span>
            </h1>
            
            <p className="text-base md:text-lg text-foreground mb-24 max-w-2xl mx-auto leading-relaxed font-medium">
              Production-ready AI agents that automate growth and operations,
              <br />
              built by{" "}
              <span className="relative inline-block">
                <span className="relative z-10 drop-shadow-sm">IIT Engineers</span>
                <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent rounded-full animate-highlight origin-left opacity-100" style={{ transform: 'rotate(-1deg)', boxShadow: '0 0 8px rgba(139, 92, 246, 0.5)' }}></span>
              </span>
              .
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex flex-col items-center">
              <Button 
                variant="hero" 
                size="lg" 
                className="group shadow-glow"
                onClick={handleBookDemo}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book a Free AI Consultation
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <p className="text-xs text-muted-foreground mt-2 text-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                No sales pitch. Actionable recommendations tailored to your workflows.
              </p>
            </div>
            
            <Button
              variant="glass"
              size="lg"
              className="group"
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