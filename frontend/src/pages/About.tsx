import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight, MapPin, Zap, Target, Users, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function About() {
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
  const geoFocus = [
    { region: "India", flag: "🇮🇳" },
    { region: "US", flag: "🇺🇸" },
    { region: "GB", flag: "🇬🇧" },
    { region: "CA", flag: "🇨🇦" },
    { region: "AU", flag: "🇦🇺" },
    { region: "DE", flag: "🇩🇪" },
    { region: "NL", flag: "🇳🇱" },
    { region: "SG", flag: "🇸🇬" },
    { region: "AE", flag: "🇦🇪" }
  ];

  const process = [
    {
      step: "01",
      title: "Intake",
      description: "We analyze your current workflows, pain points, and automation opportunities through detailed discovery sessions."
    },
    {
      step: "02", 
      title: "Build",
      description: "Our team develops custom AI agents using proven frameworks, integrating seamlessly with your existing tools."
    },
    {
      step: "03",
      title: "Test",
      description: "Rigorous testing in sandbox environments ensures reliability before any production deployment."
    },
    {
      step: "04",
      title: "Deploy",
      description: "Careful rollout with monitoring, training, and support to ensure smooth adoption across your team."
    },
    {
      step: "05",
      title: "Iterate",
      description: "Continuous optimization based on performance data and evolving business needs."
    }
  ];

  return (
    <div className="pt-24 pb-16 relative">
      {/* Galaxy Stars Animation - More Prominent */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
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
      {/* Header */}
      <section className="py-16 bg-gradient-hero">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            We build AI that <span className="text-gradient">actually works</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            No fluff, no hype. Just practical AI automation that saves time, reduces costs, and drives real business results.
          </p>
        </div>
      </section>

      {/* Mission & Team */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Every business is drowning in repetitive tasks. While everyone talks about AI's potential, 
                  most companies struggle to turn that potential into actual productivity gains.
                </p>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  We bridge that gap. Import AI builds practical automation that integrates with your 
                  existing processes, requires minimal training, and delivers measurable ROI from day one.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-primary" />
                    <span className="font-medium">Results-focused</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-primary" />
                    <span className="font-medium">Fast deployment</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-primary" />
                    <span className="font-medium">Human-friendly</span>
                  </div>
                </div>
              </div>
              <div className="glass-card p-8">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-gradient mb-2">2025</div>
                  <div className="text-muted-foreground">Founded with a simple belief:</div>
                </div>
                <blockquote className="text-lg font-medium text-center italic">
                  "AI should make work more human, not replace humans entirely."
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-background-alt">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Built by IIT Engineers</h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Our team brings deep technical expertise from India's premier engineering institute. 
              We combine rigorous problem-solving skills with practical business understanding to 
              deliver AI solutions that actually work in production.
            </p>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              With backgrounds in computer science, AI/ML, and systems engineering from IIT, 
              we understand both the technical complexity and the real-world constraints of 
              deploying automation at scale. Every solution we build is engineered for reliability, 
              scalability, and measurable impact.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Badge variant="outline" className="px-4 py-2 text-sm">
                IIT Alumni
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-sm">
                Production-Ready Engineering
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-sm">
                Systems Thinking
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-16 bg-background-alt">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">How we work</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our proven 5-step process ensures every automation delivers real value from the start.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {process.map((item, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors duration-300">
                    <span className="text-2xl font-bold text-primary">{item.step}</span>
                  </div>
                  {index < process.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-border transform -translate-y-0.5"></div>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Geographic Focus */}
      <section className="py-16 bg-background-alt">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">Where we work</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Supporting English-speaking businesses across major markets worldwide.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {geoFocus.map((geo, index) => (
              <div key={index} className="glass-card p-6 text-center group hover:scale-105 transition-all duration-300">
                <div className="text-3xl mb-2">{geo.flag}</div>
                <div className="font-semibold">{geo.region}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl mt-20 relative z-10">
          <div className="relative bg-gradient-to-br from-primary/20 via-accent/10 to-primary/20 rounded-2xl p-10 border border-primary/30 text-center overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-48 h-48 bg-primary rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-accent rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to automate your workflow?
              </h3>
              <p className="text-base text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Let's discuss your specific challenges and show you exactly how AI can transform your operations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleBookConsultation}
                  variant="gradient"
                  size="default"
                  className="px-6 py-3 shadow-md shadow-primary/30"
                >
                  <Calendar className="w-5 h-5 mr-3" />
                  Book Strategy Call
                </Button>
                <Button variant="outline" size="default" className="px-6 py-3" asChild>
                  <Link to="/case-studies">
                    View Case Studies
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}