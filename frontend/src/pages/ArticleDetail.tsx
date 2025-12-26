import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react";
import { getApiUrl } from "@/lib/api";

interface Article {
  _id: string;
  title: string;
  slug: string;
  content: string;
  metaDescription?: string;
  featuredImage?: {
    url: string;
    alt: string;
    caption?: string;
  };
  category?: string;
  tags?: string[];
  publishedAt?: string;
  readingTime?: number;
  views?: number;
  author?: {
    name: string;
    bio?: string;
    profileImage?: string;
  };
  primaryKeyword?: string;
  secondaryKeywords?: string[];
}

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
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
      loadArticle();
    }
  }, [slug]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/articles/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setArticle(data);
      }
    } catch (error) {
      console.error("Error loading article:", error);
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

  // Simple markdown to HTML converter (basic)
  const renderContent = (content: string) => {
    // Convert markdown headers
    let html = content
      .replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold mt-8 mb-4">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold mt-10 mb-6">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold mt-12 mb-8">$1</h1>')
      // Convert bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Convert italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Convert links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>')
      // Convert code blocks
      .replace(/```([^`]+)```/g, '<pre class="bg-muted p-4 rounded-lg overflow-x-auto my-4"><code>$1</code></pre>')
      // Convert inline code
      .replace(/`([^`]+)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm">$1</code>')
      // Convert lists
      .replace(/^\* (.*$)/gim, '<li class="ml-6">$1</li>')
      .replace(/^- (.*$)/gim, '<li class="ml-6">$1</li>')
      // Convert paragraphs
      .split('\n\n')
      .map(para => {
        if (para.trim() && !para.match(/^<[h|u|o|l|p]/)) {
          return `<p class="mb-4 leading-relaxed">${para.trim()}</p>`;
        }
        return para;
      })
      .join('\n');

    return { __html: html };
  };

  if (loading) {
    return (
      <div className="pt-24 pb-16 text-center">
        <div className="text-muted-foreground">Loading article...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="pt-24 pb-16 text-center">
        <div className="text-muted-foreground mb-4">Article not found.</div>
        <Button asChild>
          <Link to="/articles">Back to Articles</Link>
        </Button>
      </div>
    );
  }

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
          <Link to="/articles">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Articles
          </Link>
        </Button>

        {/* Article Header */}
        <article>
          {article.category && (
            <Badge variant="outline" className="mb-4">
              {article.category}
            </Badge>
          )}
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{article.title}</h1>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
            {article.author?.name && (
              <div>
                <span className="font-medium text-foreground">By {article.author.name}</span>
              </div>
            )}
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
            {article.views && (
              <div>{article.views} views</div>
            )}
          </div>

          {article.featuredImage?.url && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img
                src={article.featuredImage.url}
                alt={article.featuredImage.alt || article.title}
                className="w-full h-auto"
              />
              {article.featuredImage.caption && (
                <p className="text-sm text-muted-foreground mt-2 text-center italic">
                  {article.featuredImage.caption}
                </p>
              )}
            </div>
          )}

          {/* Article Content */}
          <div 
            className="prose prose-invert max-w-none mb-12"
            dangerouslySetInnerHTML={renderContent(article.content)}
          />

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-12 pt-8 border-t border-border">
              <span className="text-sm font-medium mr-2">Tags:</span>
              {article.tags.map((tag, idx) => (
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
                    title: article.title,
                    text: article.metaDescription,
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

