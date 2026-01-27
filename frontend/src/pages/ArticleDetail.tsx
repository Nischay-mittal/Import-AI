import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react";
import { getApiUrl } from "@/lib/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
          <div className="prose prose-invert max-w-none mb-12">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({node, ...props}: any) => <h1 className="text-4xl font-bold mt-12 mb-8" {...props} />,
                h2: ({node, ...props}: any) => <h2 className="text-3xl font-bold mt-10 mb-6" {...props} />,
                h3: ({node, ...props}: any) => <h3 className="text-2xl font-bold mt-8 mb-4" {...props} />,
                h4: ({node, ...props}: any) => <h4 className="text-xl font-bold mt-6 mb-3" {...props} />,
                p: ({node, ...props}: any) => <p className="mb-4 leading-relaxed" {...props} />,
                a: ({node, ...props}: any) => <a className="text-primary hover:underline" {...props} />,
                code: ({node, inline, ...props}: any) => 
                  inline ? (
                    <code className="bg-muted px-1.5 py-0.5 rounded text-sm" {...props} />
                  ) : (
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-4"><code {...props} /></pre>
                  ),
                ul: ({node, ...props}: any) => <ul className="list-disc ml-6 mb-4" {...props} />,
                ol: ({node, ...props}: any) => <ol className="list-decimal ml-6 mb-4" {...props} />,
                li: ({node, ...props}: any) => <li className="mb-2" {...props} />,
                blockquote: ({node, ...props}: any) => (
                  <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground" {...props} />
                ),
                table: ({node, ...props}: any) => (
                  <div className="overflow-x-auto my-6">
                    <table className="min-w-full border-collapse border border-border" {...props} />
                  </div>
                ),
                thead: ({node, ...props}: any) => <thead className="bg-muted" {...props} />,
                tbody: ({node, ...props}: any) => <tbody {...props} />,
                th: ({node, ...props}: any) => (
                  <th className="border border-border px-4 py-2 text-left font-semibold" {...props} />
                ),
                td: ({node, ...props}: any) => (
                  <td className="border border-border px-4 py-2" {...props} />
                ),
                tr: ({node, ...props}: any) => <tr {...props} />,
                hr: ({node, ...props}: any) => <hr className="my-8 border-border" {...props} />,
              }}
            >
              {article.content}
            </ReactMarkdown>
          </div>

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

