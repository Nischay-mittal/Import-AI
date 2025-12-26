import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowLeft, Share2, Code, FlaskConical, Rocket, Wrench, ExternalLink, Github } from "lucide-react";
import { getApiUrl } from "@/lib/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Project {
  _id: string;
  title: string;
  slug: string;
  tagline?: string;
  projectType?: string;
  status?: string;
  primaryCategory?: string;
  dataTags?: string[];
  problemSummary?: string;
  whoFacesProblem?: string[];
  whyExistingSolutionsFail?: string;
  solutionSummary?: string;
  workflowSteps?: Array<{ title: string; description: string }>;
  showBeforeAfter?: boolean;
  beforeState?: string;
  afterState?: string;
  architectureDescription?: string;
  architectureDiagram?: {
    url: string;
    alt: string;
  };
  toolsUsed?: string[];
  metrics?: Array<{
    type: string;
    value: string;
    context: string;
  }>;
  demoType?: string;
  demoUrl?: string;
  videoUrl?: string;
  screenshots?: Array<{
    url: string;
    alt: string;
    caption?: string;
  }>;
  githubRepo?: {
    url: string;
    isPublic: boolean;
  };
  publishedAt?: string;
  author?: {
    name: string;
    bio?: string;
    profileImage?: string;
  };
}

const projectTypeIcons: Record<string, any> = {
  'Internal Project': Wrench,
  'R&D Experiment': FlaskConical,
  'Open-source': Code,
  'Demo / Prototype': Rocket,
};

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (slug) {
      loadProject();
    }
  }, [slug]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/projects/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setProject(data);
      }
    } catch (error) {
      console.error("Error loading project:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="pt-24 pb-16 text-center">
        <div className="text-muted-foreground">Loading project...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="pt-24 pb-16 text-center">
        <div className="text-muted-foreground mb-4">Project not found.</div>
        <Button asChild>
          <Link to="/projects">Back to Projects</Link>
        </Button>
      </div>
    );
  }

  const IconComponent = project.projectType ? projectTypeIcons[project.projectType] || Code : Code;

  return (
    <div className="pt-24 pb-16 relative min-h-screen">
      {/* Galaxy Stars Animation */}
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
              boxShadow: `0 0 ${star.size * 4}px rgba(255, 255, 255, ${star.opacity * 0.8}), 0 0 ${star.size * 8}px rgba(139, 92, 246, ${star.opacity * 0.3})`,
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

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-8">
          <Link to="/projects">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Link>
        </Button>

        {/* Project Header */}
        <article>
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {project.featured && (
              <Badge variant="default" className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                Featured
              </Badge>
            )}
            {project.projectType && (
              <Badge variant="outline" className="flex items-center gap-1">
                <IconComponent className="w-3 h-3" />
                {project.projectType}
              </Badge>
            )}
            {project.primaryCategory && (
              <Badge variant="outline">
                {project.primaryCategory}
              </Badge>
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>
          
          {project.tagline && (
            <p className="text-xl text-muted-foreground mb-6">{project.tagline}</p>
          )}
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
            {project.author?.name && (
              <div>
                <span className="font-medium text-foreground">By {project.author.name}</span>
              </div>
            )}
            {project.publishedAt && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(project.publishedAt)}
              </div>
            )}
          </div>

          {/* Architecture Diagram */}
          {project.architectureDiagram?.url && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img
                src={project.architectureDiagram.url}
                alt={project.architectureDiagram.alt || project.title}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* The Problem Section */}
          {(project.problemSummary || project.whoFacesProblem?.length || project.whyExistingSolutionsFail) && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6">The Problem</h2>
              {project.problemSummary && (
                <p className="text-lg mb-4 leading-relaxed">{project.problemSummary}</p>
              )}
              {project.whoFacesProblem && project.whoFacesProblem.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Who Faces This Problem?</h3>
                  <ul className="list-disc ml-6 space-y-1">
                    {project.whoFacesProblem.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {project.whyExistingSolutionsFail && (
                <div>
                  <h3 className="font-semibold mb-2">Why Existing Solutions Fail?</h3>
                  <p className="text-muted-foreground">{project.whyExistingSolutionsFail}</p>
                </div>
              )}
            </div>
          )}

          {/* Solution Overview */}
          {project.solutionSummary && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Solution Overview</h2>
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {project.solutionSummary}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {/* Workflow Steps */}
          {project.workflowSteps && project.workflowSteps.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Key Workflow Steps</h2>
              <div className="space-y-4">
                {project.workflowSteps.map((step, idx) => (
                  <div key={idx} className="border-l-4 border-primary pl-4">
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Before vs After */}
          {project.showBeforeAfter && project.beforeState && project.afterState && (
            <div className="mb-12 grid md:grid-cols-2 gap-6">
              <div className="p-6 border rounded-lg">
                <h3 className="font-semibold mb-3 text-red-400">Before</h3>
                <p className="text-muted-foreground">{project.beforeState}</p>
              </div>
              <div className="p-6 border rounded-lg border-primary/50 bg-primary/5">
                <h3 className="font-semibold mb-3 text-green-400">After</h3>
                <p className="text-muted-foreground">{project.afterState}</p>
              </div>
            </div>
          )}

          {/* System Architecture */}
          {project.architectureDescription && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6">System Architecture</h2>
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {project.architectureDescription}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {/* Tools Used */}
          {project.toolsUsed && project.toolsUsed.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Tools Used</h2>
              <div className="flex flex-wrap gap-2">
                {project.toolsUsed.map((tool, idx) => (
                  <Badge key={idx} variant="outline">{tool}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Results & Benchmarks */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Results & Benchmarks</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.metrics.map((metric, idx) => (
                  <div key={idx} className="p-6 border rounded-lg">
                    <div className="text-3xl font-bold mb-2 text-primary">{metric.value}</div>
                    <div className="font-semibold mb-1">{metric.type}</div>
                    {metric.context && (
                      <div className="text-sm text-muted-foreground">{metric.context}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Demo & Proof */}
          {(project.demoUrl || project.videoUrl || project.screenshots?.length || project.githubRepo) && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Demo & Proof</h2>
              <div className="space-y-4">
                {project.demoUrl && (
                  <Button asChild variant="outline">
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Live Demo
                    </a>
                  </Button>
                )}
                {project.videoUrl && (
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <iframe
                      src={project.videoUrl}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
                {project.screenshots && project.screenshots.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.screenshots.map((screenshot, idx) => (
                      <div key={idx} className="rounded-lg overflow-hidden">
                        <img
                          src={screenshot.url}
                          alt={screenshot.alt || `Screenshot ${idx + 1}`}
                          className="w-full h-auto"
                        />
                        {screenshot.caption && (
                          <p className="text-sm text-muted-foreground mt-2 text-center">
                            {screenshot.caption}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {project.githubRepo && (
                  <Button asChild variant="outline">
                    <a href={project.githubRepo.url} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      {project.githubRepo.isPublic ? 'View on GitHub' : 'GitHub (Private)'}
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          {project.dataTags && project.dataTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-12 pt-8 border-t border-border">
              <span className="text-sm font-medium mr-2">Tags:</span>
              {project.dataTags.map((tag, idx) => (
                <Badge key={idx} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Share Section */}
          <div className="flex items-center gap-4 pt-8 border-t border-border">
            <span className="text-sm font-medium">Share:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: project.title,
                    text: project.tagline,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied to clipboard!");
                }
              }}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </article>
      </div>
    </div>
  );
}

