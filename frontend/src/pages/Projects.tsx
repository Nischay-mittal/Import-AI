import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, Search, Code, FlaskConical, Rocket, Wrench, ArrowRight } from "lucide-react";
import { getApiUrl } from "@/lib/api";

interface Project {
  _id: string;
  title: string;
  slug: string;
  tagline?: string;
  projectType?: string;
  status?: string;
  primaryCategory?: string;
  dataTags?: string[];
  publishedAt?: string;
  featured?: boolean;
  architectureDiagram?: {
    url: string;
    alt: string;
  };
}

const projectTypeIcons: Record<string, any> = {
  'Internal Project': Wrench,
  'R&D Experiment': FlaskConical,
  'Open-source': Code,
  'Demo / Prototype': Rocket,
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

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
    loadProjects();
  }, [selectedType, selectedCategory, searchQuery]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const apiUrl = getApiUrl();
      const params = new URLSearchParams();
      if (selectedType) params.append("projectType", selectedType);
      if (selectedCategory) params.append("category", selectedCategory);
      if (searchQuery) params.append("search", searchQuery);
      
      const res = await fetch(`${apiUrl}/api/projects?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error("Error loading projects:", error);
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

  const projectTypes = ['Internal Project', 'R&D Experiment', 'Open-source', 'Demo / Prototype'];
  const categories = Array.from(new Set(projects.map(p => p.primaryCategory).filter(Boolean)));

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

      {/* Hero Section */}
      <section className="py-16 bg-gradient-hero min-h-[280px] flex items-center">
        <div className="container mx-auto px-6 text-center w-full">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Our </span><span className="text-gradient">Projects</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our portfolio of AI automation projects, R&D experiments, and open-source contributions.
          </p>
        </div>
      </section>

      {/* Projects Content */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 bg-background border border-border rounded-md text-foreground"
            >
              <option value="">All Types</option>
              {projectTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-background border border-border rounded-md text-foreground"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="text-muted-foreground">Loading projects...</div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-muted-foreground">No projects found.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {projects.map((project) => {
              const IconComponent = project.projectType ? projectTypeIcons[project.projectType] || Code : Code;
              return (
                <Link
                  key={project._id}
                  to={`/projects/${project.slug}`}
                  className="group"
                >
                  <div className="glass-card p-6 h-full flex flex-col hover:border-primary/40 transition-all duration-300 hover:scale-105">
                    {project.architectureDiagram?.url && (
                      <div className="mb-4 rounded-lg overflow-hidden">
                        <img
                          src={project.architectureDiagram.url}
                          alt={project.architectureDiagram.alt || project.title}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
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
                        <Badge variant="outline" className="w-fit">
                          {project.primaryCategory}
                        </Badge>
                      )}
                    </div>
                    <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {project.title}
                    </h2>
                    {project.tagline && (
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-grow">
                        {project.tagline}
                      </p>
                    )}
                    {project.dataTags && project.dataTags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.dataTags.slice(0, 3).map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {project.dataTags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{project.dataTags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-4 border-t border-border">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {project.publishedAt ? formatDate(project.publishedAt) : 'Draft'}
                      </div>
                      <div className="flex items-center gap-1 group-hover:gap-2 transition-all">
                        <span>View Project</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
        </div>
      </section>
    </div>
  );
}

