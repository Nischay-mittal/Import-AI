import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, ArrowRight, Search } from "lucide-react";
import { getApiUrl } from "@/lib/api";

interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  metaDescription?: string;
  featuredImage?: {
    url: string;
    alt: string;
  };
  category?: string;
  tags?: string[];
  publishedAt?: string;
  readingTime?: number;
  views?: number;
  author?: {
    name: string;
  };
}

export default function Articles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

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
    loadArticles();
    loadCategories();
  }, [selectedCategory, searchQuery]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const apiUrl = getApiUrl();
      const params = new URLSearchParams();
      if (selectedCategory) params.append("category", selectedCategory);
      if (searchQuery) params.append("search", searchQuery);
      
      const res = await fetch(`${apiUrl}/api/articles?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setArticles(data.articles || []);
      }
    } catch (error) {
      console.error("Error loading articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/articles/categories/list`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data || []);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
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
      <section className="py-16 bg-gradient-hero relative z-10">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Our </span>
            <span className="text-gradient">Articles</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Insights, guides, and updates on AI automation and business transformation.
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 relative z-10">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              {categories.length > 0 && (
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 rounded-md border border-border bg-background text-foreground"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-8 relative z-10">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="text-center py-20">
              <div className="text-muted-foreground">Loading articles...</div>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-muted-foreground">No articles found.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {articles.map((article) => (
                <Link
                  key={article._id}
                  to={`/articles/${article.slug}`}
                  className="group"
                >
                  <div className="glass-card p-6 h-full flex flex-col hover:border-primary/40 transition-all duration-300 hover:scale-105">
                    {article.featuredImage?.url && (
                      <div className="mb-4 rounded-lg overflow-hidden">
                        <img
                          src={article.featuredImage.url}
                          alt={article.featuredImage.alt || article.title}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}
                    {article.category && (
                      <Badge variant="outline" className="mb-3 w-fit">
                        {article.category}
                      </Badge>
                    )}
                    <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h2>
                    {(article.excerpt || article.metaDescription) && (
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-grow">
                        {article.excerpt || article.metaDescription}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-4 border-t border-border">
                      <div className="flex items-center gap-4">
                        {article.publishedAt && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(article.publishedAt)}
                          </div>
                        )}
                        {article.readingTime && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {article.readingTime} min read
                          </div>
                        )}
                      </div>
                      {article.views && (
                        <div>{article.views} views</div>
                      )}
                    </div>
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {article.tags.slice(0, 3).map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

