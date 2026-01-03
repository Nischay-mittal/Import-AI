import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Clock, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { getApiUrl } from "@/lib/api";

const MAX_DISPLAY = 4;

export function CaseStudiesSection() {
  const [caseStudies, setCaseStudies] = useState<any[]>([]);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
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

  useEffect(() => {
    loadCaseStudies();
  }, []);

  const loadCaseStudies = async () => {
    try {
      const apiUrl = getApiUrl();
      console.log("Fetching case studies from:", `${apiUrl}/api/case-studies`);
      const response = await fetch(`${apiUrl}/api/case-studies`);
      
      console.log("Response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Case studies data:", data);
        let studies = data.caseStudies || [];
        
        // Sort: featured first, then by sortPriority (higher first), then by createdAt (newest first)
        const sorted = studies.sort((a: any, b: any) => {
          // Featured items first
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          // Then by sortPriority (higher numbers first)
          const aPriority = a.sortPriority ?? 0;
          const bPriority = b.sortPriority ?? 0;
          if (aPriority !== bPriority) return bPriority - aPriority;
          // Finally by createdAt (newest first)
          const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bDate - aDate;
        });
        
        console.log("Sorted case studies:", sorted);
        setCaseStudies(sorted.slice(0, MAX_DISPLAY));
      } else {
        const errorText = await response.text();
        console.error("Error loading case studies:", response.status, errorText);
        setCaseStudies([]);
      }
    } catch (error) {
      console.error("Error loading case studies:", error);
      setCaseStudies([]);
    }
  };

  // Convert detail format to listing format
  const formatForListing = (study: any) => {
    return {
      id: study.id,
      title: study.title,
      company: study.company || study.client,
      industry: study.industry || "",
      challenge: study.challenge || study.problem?.content?.substring(0, 100) + "...",
      solution: study.solutionShort || study.solution?.content?.substring(0, 100) + "...",
      results: study.resultsShort || [],
      timeline: study.timelineShort || study.timeline,
      roi: study.roi || "",
      description: study.description || study.solution?.content?.substring(0, 200) + "...",
      image: study.image || "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop",
      tags: study.tags || [],
      featured: study.featured || false
    };
  };

  const displayStudies = caseStudies.map(formatForListing);

  // Auto-play functionality - loops continuously
  useEffect(() => {
    if (displayStudies.length === 0) return;

    // Clear any existing interval
    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current);
    }

    // If paused, don't start the interval
    if (isPaused) return;

    // Auto-advance cards every 2.5 seconds, looping continuously
    autoPlayIntervalRef.current = setInterval(() => {
      setVisibleIndex((prev) => {
        // Loop back to first card after last card
        return (prev + 1) % displayStudies.length;
      });
    }, 2500);

    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
    };
  }, [displayStudies.length, isPaused]);

  // Pause auto-play when user hovers over section
  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  // Manual navigation functions
  const goToPrevious = () => {
    setVisibleIndex((prev) => (prev > 0 ? prev - 1 : displayStudies.length - 1));
    setIsPaused(true);
    // Resume after 5 seconds
    setTimeout(() => setIsPaused(false), 5000);
  };

  const goToNext = () => {
    setVisibleIndex((prev) => (prev < displayStudies.length - 1 ? prev + 1 : 0));
    setIsPaused(true);
    // Resume after 5 seconds
    setTimeout(() => setIsPaused(false), 5000);
  };

  // Always show the section, even if no case studies (will show loading state)
  if (displayStudies.length === 0 && caseStudies.length === 0) {
    return (
      <section className="py-32 bg-background relative overflow-hidden min-h-screen flex items-center">
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Real <span className="text-gradient">Results</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how businesses are saving time, reducing costs, and accelerating growth with AI automation.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={sectionRef} 
      className="bg-background relative overflow-hidden py-12 md:py-16"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
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
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10 w-full">
        {/* Section Header */}
        <div className="mb-8 sm:mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">
            Real <span className="text-gradient">Results</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto px-4">
            See how businesses are saving time, reducing costs, and accelerating growth with AI automation.
          </p>
        </div>

        {/* Case Study Cards Container - Fixed height for all cards */}
        <div className="relative mb-8" style={{ height: '380px' }}>
          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-20 bg-background/80 hover:bg-background border border-border rounded-full p-1.5 sm:p-2 transition-all duration-300 hover:scale-110 hover:shadow-lg"
            aria-label="Previous case study"
          >
            <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-foreground" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-20 bg-background/80 hover:bg-background border border-border rounded-full p-1.5 sm:p-2 transition-all duration-300 hover:scale-110 hover:shadow-lg"
            aria-label="Next case study"
          >
            <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-foreground" />
          </button>

          {displayStudies.map((study, index) => {
            const isVisible = index === visibleIndex;
            
            return (
              <div
                key={study.id}
                ref={(el) => (cardRefs.current[index] = el)}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  isVisible
                    ? "opacity-100 translate-y-0 scale-100 z-10"
                    : "opacity-0 translate-y-8 scale-95 z-0 pointer-events-none"
                }`}
              >
                <div className="relative bg-gradient-to-br from-muted/30 via-muted/20 to-muted/10 rounded-2xl p-4 sm:p-6 border border-border/50 backdrop-blur-md group hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 overflow-hidden h-full flex flex-col">
                  {/* Animated gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  
                  {/* Glow effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"></div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-center relative z-10 h-full">
                    {/* Content */}
                    <div className="flex flex-col h-full justify-between min-w-0">
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          {study.featured && (
                            <Badge variant="default" className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-xs font-semibold shadow-lg">
                              ⭐ Featured
                            </Badge>
                          )}
                          {study.tags.slice(0, 2).map((tag: string, tagIndex: number) => (
                            <Badge key={tagIndex} variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <h3 className="text-base sm:text-lg font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent group-hover:text-gradient transition-all duration-300 line-clamp-2">
                          {study.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-3 leading-relaxed line-clamp-2">
                          {study.description}
                        </p>

                        {/* Results - Enhanced */}
                        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3">
                          {study.results.slice(0, 3).map((result: any, resultIndex: number) => (
                            <div key={resultIndex} className="text-center p-2 rounded-lg bg-background/40 border border-border/30 hover:border-primary/40 hover:bg-background/60 transition-all duration-300">
                              <div className="text-sm sm:text-base font-bold bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent mb-0.5">
                                {result.metric}
                              </div>
                              <div className="text-[9px] sm:text-[10px] text-muted-foreground font-medium leading-tight line-clamp-2">
                                {result.description}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Meta Info - Enhanced */}
                        <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
                          <div className="flex items-center space-x-1.5 px-2 py-1 rounded-full bg-background/60 border border-border/30">
                            <Clock className="w-3 h-3 text-primary flex-shrink-0" />
                            <span className="text-muted-foreground font-medium truncate">{study.timeline}</span>
                          </div>
                          <div className="flex items-center space-x-1.5 px-2 py-1 rounded-full bg-background/60 border border-border/30">
                            <TrendingUp className="w-3 h-3 text-green-500 flex-shrink-0" />
                            <span className="text-muted-foreground font-medium truncate">{study.roi} ROI</span>
                          </div>
                          <div className="flex items-center space-x-1.5 px-2 py-1 rounded-full bg-background/60 border border-border/30">
                            <Users className="w-3 h-3 text-accent flex-shrink-0" />
                            <span className="text-muted-foreground font-medium truncate">{study.industry}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-auto pt-2">
                        <Button variant="gradient" size="default" className="group font-semibold shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto" asChild>
                          <Link to={`/case-studies/${study.id}`}>
                            Read Full Case Study
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </Button>
                      </div>
                    </div>

                    {/* Image - Enhanced */}
                    <div className="h-full flex items-center">
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden group/image shadow-xl">
                        <img 
                          src={study.image} 
                          alt={study.company}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {displayStudies.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === visibleIndex
                  ? "w-6 bg-primary"
                  : index < visibleIndex
                  ? "w-1.5 bg-primary/50"
                  : "w-1.5 bg-muted"
              }`}
            />
          ))}
        </div>

        {/* CTA - Always visible */}
        <div className="text-center px-4">
          <h3 className="text-base sm:text-lg font-bold mb-2 sm:mb-3">Explore More Case Studies</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 max-w-2xl mx-auto">
            Discover more success stories and see how AI automation can transform your business.
          </p>
          <Button variant="gradient" size="default" className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base" asChild>
            <Link to="/case-studies">
              View All Case Studies
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

