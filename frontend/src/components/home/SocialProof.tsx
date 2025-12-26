import { useState, useEffect, useRef, useMemo } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

export function SocialProof() {
  const [visibleIndex, setVisibleIndex] = useState(0);
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isPaused, setIsPaused] = useState(false);

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
  const testimonials = [
    {
      quote: "Import AI saved us 15 hours per week on lead qualification. Our conversion rate jumped 28% in the first month.",
      author: "Sarah Chen",
      role: "VP of Sales",
      company: "TechFlow Solutions",
      rating: 5
    },
    {
      quote: "The invoice processing automation is incredible. What used to take days now happens in minutes with 99% accuracy.",
      author: "Marcus Rodriguez",
      role: "Finance Director",
      company: "GrowthCorp",
      rating: 5
    },
    {
      quote: "Their AI support assistant handles 60% of our tickets automatically. Our team can finally focus on complex issues.",
      author: "Emily Watson",
      role: "Customer Success Manager",
      company: "ServicePro",
      rating: 5
    }
  ];

  const logos = [
    "Microsoft", "Salesforce", "HubSpot", "Stripe", "Zapier", "Slack"
  ];

  // Auto-play functionality - loops continuously
  useEffect(() => {
    if (testimonials.length === 0) return;

    // Clear any existing interval
    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current);
    }

    // If paused, don't start the interval
    if (isPaused) {
      return;
    }

    // Start auto-play
    autoPlayIntervalRef.current = setInterval(() => {
      setVisibleIndex((prev) => (prev + 1) % testimonials.length);
    }, 3000); // Change every 3 seconds

    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
    };
  }, [testimonials.length, isPaused]);

  const goToPrevious = () => {
    setVisibleIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    setIsPaused(true);
    // Resume after 5 seconds
    setTimeout(() => setIsPaused(false), 5000);
  };

  const goToNext = () => {
    setVisibleIndex((prev) => (prev + 1) % testimonials.length);
    setIsPaused(true);
    // Resume after 5 seconds
    setTimeout(() => setIsPaused(false), 5000);
  };

  return (
    <section className="py-12 md:py-16 bg-background relative overflow-hidden">
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
      <div className="container mx-auto px-6 relative z-10">
        {/* Testimonials */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Trusted by <span className="text-gradient">forward-thinking</span> teams
          </h2>
        </div>

        {/* Quote Display - Single testimonial at a time */}
        <div className="relative mb-16" style={{ minHeight: '280px' }}>
          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-background/80 hover:bg-background border border-border rounded-full p-2 transition-all duration-300 hover:scale-110 hover:shadow-lg"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-background/80 hover:bg-background border border-border rounded-full p-2 transition-all duration-300 hover:scale-110 hover:shadow-lg"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>

          {testimonials.map((testimonial, index) => {
            const isVisible = index === visibleIndex;
            
            return (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  isVisible
                    ? "opacity-100 translate-y-0 scale-100 z-10"
                    : "opacity-0 translate-y-8 scale-95 z-0 pointer-events-none"
                }`}
              >
                <div className="max-w-3xl mx-auto text-center px-8">
                  {/* Quote Icon */}
                  <Quote className="w-12 h-12 text-primary/20 mx-auto mb-6" />
                  
                  {/* Quote Text */}
                  <blockquote className="text-lg md:text-xl text-foreground/90 leading-relaxed mb-8 font-medium italic relative">
                    <span className="absolute -left-4 -top-2 text-5xl md:text-6xl text-primary/20 leading-none font-serif">"</span>
                    <span className="relative z-10">{testimonial.quote}</span>
                    <span className="absolute -right-4 -bottom-4 text-5xl md:text-6xl text-primary/20 leading-none font-serif">"</span>
                  </blockquote>

                  {/* Stars */}
                  <div className="flex justify-center space-x-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Author Info */}
                  <div>
                    <div className="text-base font-semibold mb-1">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center space-x-2 mb-16">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setVisibleIndex(index);
                setIsPaused(true);
                setTimeout(() => setIsPaused(false), 5000);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === visibleIndex
                  ? "w-8 bg-primary"
                  : "w-2 bg-border hover:bg-primary/50"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Logo Strip */}
        <div className="text-center">
          <p className="text-muted-foreground mb-8">Integrates with your favorite tools</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {logos.map((logo, index) => (
              <div 
                key={index}
                className="text-lg font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}