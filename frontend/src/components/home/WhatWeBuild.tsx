import { TrendingUp, Users, Settings, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMemo } from "react";

export function WhatWeBuild() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Generate stars once - more prominent
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

  const handleBookConsultation = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      const api = import.meta.env.VITE_API_URL || "http://localhost:5000";
      window.location.href = `${api}/go/contact`;
    }
  };

  const services = [
    {
      icon: TrendingUp,
      title: "Growth Systems",
      description: "AI-driven systems that continuously identify demand, attract the right users, and scale acquisition without increasing headcount.",
      examples: [
        "SEO & market intelligence agents",
        "Website visitor capture & follow-ups",
        "Content and growth automation"
      ]
    },
    {
      icon: Users,
      title: "Sales Systems",
      description: "End-to-end sales systems that qualify leads, personalize outreach, and move deals forward automatically.",
      examples: [
        "Outbound AI pipelines",
        "Email, LinkedIn & CRM orchestration",
        "Lead qualification & meeting booking"
      ]
    },
    {
      icon: Settings,
      title: "Operations Systems",
      description: "Reliable internal systems that eliminate repetitive work and keep teams focused on execution, not coordination.",
      examples: [
        "Scheduling & internal workflows",
        "Reporting, dashboards & data pipelines",
        "Tool-to-tool automation"
      ]
    },
    {
      icon: Bot,
      title: "Custom AI Agents",
      description: "Production-grade AI agents built for your business logic — not generic tools or demos.",
      examples: [
        "Multi-agent reasoning systems",
        "WhatsApp & product-integrated agents",
        "Bespoke internal copilots"
      ]
    }
  ];

  return (
    <section className="pt-12 sm:pt-16 md:pt-20 pb-6 sm:pb-8 md:pb-10 bg-background relative overflow-hidden">
      {/* Galaxy Stars Animation - More Prominent */}
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
              background: `radial-gradient(circle, rgba(255, 255, 255, ${star.opacity}) 0%, rgba(139, 92, 246, ${star.opacity * 0.3}) 40%, rgba(255, 255, 255, 0) 70%)`,
              animation: `star-twinkle ${star.duration}s ease-in-out infinite`,
              animationDelay: `${star.delay}s`,
              boxShadow: `0 0 ${star.size * 4}px rgba(255, 255, 255, ${star.opacity * 0.8}), 0 0 ${star.size * 8}px rgba(139, 92, 246, ${star.opacity * 0.3})`
            }}
          />
        ))}
        {/* Additional larger stars for depth */}
        {Array.from({ length: 15 }, (_, i) => {
          const size = 3 + Math.random() * 2;
          const left = Math.random() * 100;
          const top = Math.random() * 100;
          const delay = Math.random() * 3;
          return (
            <div
              key={`large-${i}`}
              className="absolute rounded-full"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                top: `${top}%`,
                background: `radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(139, 92, 246, 0.4) 50%, transparent 80%)`,
                animation: `star-pulse ${2 + Math.random() * 2}s ease-in-out infinite`,
                animationDelay: `${delay}s`,
                boxShadow: `0 0 ${size * 5}px rgba(255, 255, 255, 0.6), 0 0 ${size * 10}px rgba(139, 92, 246, 0.4)`
              }}
            />
          );
        })}
      </div>
      <style>{`
        @keyframes star-twinkle {
          0%, 100% { 
            opacity: 0.4; 
            transform: scale(1) translate(0, 0);
          }
          25% { 
            opacity: 0.8; 
            transform: scale(1.15) translate(3px, -3px);
          }
          50% { 
            opacity: 1; 
            transform: scale(1.3) translate(-2px, 2px);
          }
          75% { 
            opacity: 0.7; 
            transform: scale(1.1) translate(2px, -2px);
          }
        }
        @keyframes star-pulse {
          0%, 100% { 
            opacity: 0.6; 
            transform: scale(1);
          }
          50% { 
            opacity: 1; 
            transform: scale(1.2);
          }
        }
      `}</style>

      {/* Minimal Animated Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '80px 80px',
            }}
          ></div>
        </div>
        
        {/* Subtle Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-primary/10 to-accent/8 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-tl from-accent/10 to-primary/8 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
        {/* Section Header */}
        <div className="mb-6 sm:mb-8 md:mb-10 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">
            What We <span className="text-gradient">Build</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto px-4">
            We design and deploy AI systems that automate growth, sales, and operations — built to run reliably in production and improve over time.
          </p>
        </div>

        {/* Service Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mb-6 sm:mb-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isCustomAI = service.title === "Custom AI Agents";
            return (
              <div
                key={index}
                className={`group relative bg-muted/20 rounded-xl p-4 sm:p-5 backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:shadow-primary/10 ${
                  isCustomAI 
                    ? "border-2 border-yellow-500/60 hover:border-yellow-500/80 shadow-lg shadow-yellow-500/20" 
                    : "border border-border/50 hover:border-primary/40"
                }`}
              >
                <div className="mb-3 sm:mb-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-105 transition-transform duration-300">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2">{service.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-snug mb-2 sm:mb-3">
                    {service.description}
                  </p>
                </div>
                
                {/* Examples */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Examples
                  </p>
                  <ul className="space-y-1.5 mb-2">
                    {service.examples.slice(0, 2).map((example, idx) => (
                      <li key={idx} className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <span className="text-primary flex-shrink-0">•</span>
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted-foreground/70 italic">
                    Deployed in real business workflows
                  </p>
                </div>

                {/* CTA for Custom AI Agents */}
                {isCustomAI && (
                  <div className="mt-4 pt-4 border-t border-border/30">
                    <Button
                      onClick={handleBookConsultation}
                      variant="outline"
                      size="sm"
                      className="w-full border-yellow-500/40 bg-yellow-500/5 hover:bg-yellow-500/10 hover:border-yellow-500/60 text-yellow-500 font-semibold"
                    >
                      Book Free AI Consultation
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-8 mb-4">
          <Button 
            asChild
            variant="gradient"
            size="default"
            className="px-6 py-3"
          >
            <Link to="/services">
              Explore Services
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

