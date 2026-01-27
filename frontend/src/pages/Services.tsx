import { TrendingUp, Users, Settings, Bot, ArrowRight, CheckCircle2, Sparkles, Zap, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";

export default function Services() {
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
      description: "We engineer AI-powered growth engines that automate demand generation, content production, and multi-channel distribution. These systems scale your reach without adding headcount, using performance data to continuously optimize what works.",
      whatWeBuild: [
        {
          title: "Lead generation & acquisition automation",
          description: "Autonomous agents that identify, qualify, and capture leads across channels"
        },
        {
          title: "SEO intelligence & content generation",
          description: "Systems that analyze search intent, generate optimized content, and track competitive positioning"
        },
        {
          title: "AI video & audio cloning for content at scale",
          description: "Production pipelines that create personalized video and audio content without manual recording"
        },
        {
          title: "Multi-channel distribution & performance tracking",
          description: "Orchestrated workflows that publish, promote, and measure content performance across platforms"
        }
      ],
      deployed: [
        "Autonomous SEO agent that extracts key topics from websites and generates 100+ high-value keywords with intent analysis and competitive difficulty scoring",
        "AI-powered listing and launch strategies that increased organic traffic by 35% and search visibility by 28%",
        "GenAI creative pipeline using Veo3 and Nano Banana that tripled video and image production speed",
        "Guided video automation with CTA tracking that improved user education and increased meeting bookings"
      ]
    },
    {
      icon: Users,
      title: "Sales Systems",
      description: "We design AI-driven sales infrastructure that automates outreach, qualification, and follow-ups across every channel—cutting sales cycles and increasing conversion rates without expanding your team.",
      whatWeBuild: [
        {
          title: "AI-powered lead scoring & qualification",
          description: "Intelligence layers that prioritize high-intent prospects and route them to the right actions"
        },
        {
          title: "Email, LinkedIn & CRM orchestration",
          description: "Multi-agent systems that personalize outreach, manage sequences, and sync activity across tools"
        },
        {
          title: "AI calling agents for outbound & inbound sales",
          description: "Voice agents that handle prospecting calls, qualify leads, and book meetings autonomously"
        },
        {
          title: "Conversation intelligence & meeting automation",
          description: "Systems that analyze interactions, surface insights, and automatically schedule next steps"
        }
      ],
      deployed: [
        "4-agent outbound automation system that cut outreach effort by 80% and tripled qualified leads",
        "Outbound orchestration sending personalized LinkedIn invites to email openers, significantly boosting activation rates",
        "Visitor capture agent that identifies website visitors and sends personalized invitations, increasing warm conversions",
        "AI appointment scheduler integrating with Gmail and Google Calendar to instantly book appointments and automate confirmations"
      ]
    },
    {
      icon: Settings,
      title: "Operations Systems",
      description: "We develop intelligent operations infrastructure that replaces manual workflows with reliable AI automation—streamlining internal processes, support, and knowledge access across your organization.",
      whatWeBuild: [
        {
          title: "Internal workflow & task automation",
          description: "Agents that handle repetitive operational tasks, approvals, and cross-team coordination"
        },
        {
          title: "RAG-based chatbots over company data",
          description: "Knowledge systems that give teams instant access to documentation, policies, and institutional knowledge"
        },
        {
          title: "Reporting, dashboards & data pipelines",
          description: "Automated analytics infrastructure that surfaces insights without manual data wrangling"
        },
        {
          title: "Tool-to-tool integrations & monitoring",
          description: "Orchestration layers that connect your systems and alert you when intervention is needed"
        }
      ],
      deployed: [
        "5-agent system using LangGraph achieving 95% query accuracy with context-aware WhatsApp integration supporting 250+ concurrent users",
        "Stateful persistence system that reduced manual operational workload by 90% with self-corrective reasoning",
        "3-agent system scraping URLs and extracting structured metadata for downstream content generation",
        "Automated Sheets → LLM → WordPress workflows enabling batch publishing with zero manual effort, reducing content work by 90%"
      ]
    },
    {
      icon: Bot,
      title: "Custom AI Agents",
      description: "We architect production-grade AI agents tailored to your domain, data, and business logic—built to reason autonomously, take action, and integrate deeply with your existing systems.",
      whatWeBuild: [
        {
          title: "Domain-specific RAG agents & copilots",
          description: "Intelligent assistants trained on your proprietary data, capable of answering questions and performing specialized tasks"
        },
        {
          title: "Multi-agent reasoning & orchestration",
          description: "Swarms of specialized agents that collaborate, self-correct, and handle complex workflows end-to-end"
        },
        {
          title: "AI calling, chat, and action-taking agents",
          description: "Conversational agents that interact with users and execute tasks across voice, text, and API integrations"
        },
        {
          title: "Secure deployment, monitoring & optimization",
          description: "Production infrastructure with state management, error recovery, performance tracking, and continuous improvement"
        }
      ],
      deployed: [
        "Multi-agent swarm with inter-agent communication enabling collaborative problem-solving across specialized domains",
        "Creator discovery agents matching 1000+ creators to brand requests with improved relevance and fit",
        "SERP-scanning agent analyzing competitors and content formats across top search results to inform strategy",
        "Strategy engine recommending specific actions to improve Google ranking and strengthen organic visibility"
      ]
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

      {/* Hero Section */}
      <section className="py-16 bg-gradient-hero min-h-[280px] flex items-center">
        <div className="container mx-auto px-6 text-center w-full">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Our </span><span className="text-gradient">Services</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We build AI systems that run your growth, sales, and operations<br />on autopilot—so you can focus on strategy while automation handles execution.
          </p>
        </div>
      </section>

      {/* Services Sections */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-6xl space-y-8 relative z-10">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <section key={index} className="scroll-mt-20">
              {/* Service Header */}
              <div className="mb-10">
                <div className="flex items-start gap-5 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center flex-shrink-0 shadow-md shadow-primary/20">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-bold mb-3">{service.title}</h2>
                    <p className="text-base text-muted-foreground max-w-4xl leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* What We Build */}
              <div className="mb-10">
                <div className="flex items-center gap-2.5 mb-5">
                  <Target className="w-4 h-4 text-primary" />
                  <h3 className="text-xl font-bold">What we build</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {service.whatWeBuild.map((item, idx) => (
                    <div
                      key={idx}
                      className="group relative bg-muted/30 rounded-lg p-4 border border-border/50 hover:border-primary/40 transition-all duration-300 hover:shadow-md hover:shadow-primary/10"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold mb-1.5 text-foreground">{item.title}</h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Systems We've Deployed */}
              <div className="relative">
                <div className="flex items-center gap-2.5 mb-5">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  <h3 className="text-xl font-bold">Systems we've deployed</h3>
                </div>
                <div className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 rounded-xl p-6 border border-primary/20">
                  <div className="space-y-3.5">
                    {service.deployed.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3.5 p-3.5 rounded-lg bg-background/50 backdrop-blur-sm border border-border/30 hover:border-primary/40 transition-all"
                      >
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Zap className="w-2.5 h-2.5 text-primary" />
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {index < services.length - 1 && (
                <div className="mt-16 pt-16 border-t border-border/30"></div>
              )}
            </section>
          );
        })}
      </div>

      {/* Final CTA Section */}
      <div className="container mx-auto px-6 max-w-4xl mt-20 relative z-10">
        <div className="relative bg-gradient-to-br from-primary/20 via-accent/10 to-primary/20 rounded-2xl p-10 border border-primary/30 text-center overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-48 h-48 bg-primary rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-accent rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to automate your next bottleneck?
            </h3>
            <p className="text-base text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Let's talk about what AI can do for your specific workflow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleBookConsultation}
                variant="gradient"
                size="default"
                className="px-6 py-3 shadow-md shadow-primary/30"
              >
                Book Free AI Consultation
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
