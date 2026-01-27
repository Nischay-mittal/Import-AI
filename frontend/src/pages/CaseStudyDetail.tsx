import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { getApiUrl } from "@/lib/api";

export default function CaseStudyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [study, setStudy] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadCaseStudy();
    }
  }, [id]);

  const loadCaseStudy = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/case-studies/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError("Case study not found");
        } else {
          setError("Failed to load case study");
        }
        setLoading(false);
        return;
      }
      
      const data = await response.json();
      if (data.caseStudy) {
        setStudy(data.caseStudy);
      } else {
        setError("Case study not found");
      }
    } catch (err) {
      console.error("Error loading case study:", err);
      setError("Failed to load case study");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-24 pb-16 text-center">
        <p className="text-muted-foreground">Loading case study...</p>
      </div>
    );
  }

  if (error || !study) {
    return (
      <div className="pt-24 pb-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Case Study Not Found</h1>
        <Button onClick={() => navigate("/case-studies")} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Case Studies
        </Button>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      {/* Header */}
      <div className="container mx-auto px-6 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/case-studies")}
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Case Studies
        </Button>

        {/* Title and Meta */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-2 mb-6">
            {study.tags && study.tags.map((tag: string, index: number) => (
              <Badge key={index} variant="secondary">{tag}</Badge>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {study.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
            {study.client && (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">Client:</span>
                {study.client}
              </div>
            )}
            {study.timeline && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="font-semibold text-foreground">Timeline:</span>
                {study.timeline}
              </div>
            )}
          </div>
        </div>

        {/* Problem Section */}
        {study.problem && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">{study.problem.title || "The Problem"}</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {study.problem.content}
              </p>
            </div>
          </section>
        )}

        {/* Solution Section */}
        {study.solution && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">{study.solution.title || "What We Built"}</h2>
            <div className="prose prose-invert max-w-none mb-6">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {study.solution.content}
              </p>
            </div>
            
            {study.solution.howItWorks && study.solution.howItWorks.steps && (
              <div className="bg-muted/30 rounded-xl p-6 border border-border/50">
                <h3 className="text-lg font-semibold mb-4">{study.solution.howItWorks.title || "How it works:"}</h3>
                <ul className="space-y-3">
                  {study.solution.howItWorks.steps.map((step: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-primary mt-1.5">•</span>
                      <span className="text-foreground leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* Results Section */}
        {study.results && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">{study.results.title || "What Changed"}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Before */}
              {study.results.before && study.results.before.length > 0 && (
                <div className="bg-background rounded-xl p-6 border-2 border-border">
                  <h3 className="text-lg font-semibold mb-4 text-muted-foreground">Before:</h3>
                  <ul className="space-y-3">
                    {study.results.before.map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-destructive mt-1.5">×</span>
                        <span className="text-foreground leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* After */}
              {study.results.after && study.results.after.length > 0 && (
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-6 border-2 border-primary/30">
                  <h3 className="text-lg font-semibold mb-4 text-primary">After:</h3>
                  <ul className="space-y-3">
                    {study.results.after.map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-green-500 mt-1.5">✓</span>
                        <span className="text-foreground leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Bottom Line */}
            {study.results.bottomLine && study.results.bottomLine.length > 0 && (
              <div className="bg-muted/30 rounded-xl p-6 border border-border/50">
                <h3 className="text-lg font-semibold mb-4">Bottom line:</h3>
                <ul className="space-y-2">
                  {study.results.bottomLine.map((item: string, index: number) => (
                    <li key={index} className="flex items-center gap-3">
                      <span className="text-primary font-semibold">→</span>
                      <span className="text-foreground font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* Why It Worked Section */}
        {study.whyItWorked && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">{study.whyItWorked.title || "Why It Worked"}</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {study.whyItWorked.content}
              </p>
            </div>
          </section>
        )}

        {/* Tech Stack */}
        {study.tech && study.tech.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Tech</h2>
            <div className="flex flex-wrap gap-2">
              {study.tech.map((tech: string, index: number) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {tech}
                </Badge>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="border-t border-border pt-8 mt-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to build your own success story?</h3>
            <p className="text-muted-foreground mb-6">
              Let's discuss how we can automate your growth and operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" asChild>
                <Link to="/contact">
                  <Calendar className="w-5 h-5 mr-2" />
                  Book a Strategy Call
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/case-studies">
                  View More Case Studies
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
