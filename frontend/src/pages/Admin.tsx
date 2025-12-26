import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  X,
  FileText,
  ArrowLeft,
  Star,
  MessageSquare,
  BookOpen,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getApiUrl } from "@/lib/api";

interface CaseStudy {
  id: string;
  title: string;
  client: string;
  timeline: string;
  problem: {
    title: string;
    content: string;
  };
  solution: {
    title: string;
    content: string;
    howItWorks: {
      title: string;
      steps: string[];
    };
  };
  results: {
    title: string;
    before: string[];
    after: string[];
    bottomLine: string[];
  };
  whyItWorked: {
    title: string;
    content: string;
  };
  tech: string[];
  tags: string[];
  // For listing page
  company: string;
  industry: string;
  challenge: string;
  solutionShort: string;
  resultsShort: Array<{ metric: string; description: string }>;
  description: string;
  image: string;
  timelineShort: string;
  roi: string;
  featured?: boolean;
  createdAt?: string;
}

const STORAGE_KEY = "case_studies";
const REVIEWS_STORAGE_KEY = "reviews";

interface Review {
  id?: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  rating: number;
  featured?: boolean;
  order?: number;
}

export default function Admin() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, userRole, token } = useAuth();
  const { toast } = useToast();
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("list");
  
  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [reviewFormData, setReviewFormData] = useState<Review>({
    quote: "",
    author: "",
    role: "",
    company: "",
    rating: 5,
    featured: false,
    order: 0
  });

  // Articles state
  const [articles, setArticles] = useState<any[]>([]);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [articleFormData, setArticleFormData] = useState<any>({
    title: "",
    slug: "",
    metaTitle: "",
    metaDescription: "",
    content: "",
    excerpt: "",
    primaryKeyword: "",
    secondaryKeywords: [],
    searchIntent: "Informational",
    featuredImage: { url: "", alt: "", caption: "" },
    category: "",
    tags: [],
    status: "Draft",
    publishedAt: "",
    scheduledAt: "",
    author: { name: "", bio: "", profileImage: "" },
    schemaType: "Article",
    faqs: [],
  });
  const [formData, setFormData] = useState<Partial<CaseStudy>>({
    problem: { title: "The Problem", content: "" },
    solution: { 
      title: "What We Built", 
      content: "",
      howItWorks: { title: "How it works:", steps: [""] }
    },
    results: {
      title: "What Changed",
      before: [""],
      after: [""],
      bottomLine: [""]
    },
    whyItWorked: { title: "Why It Worked", content: "" },
    tech: [""],
    tags: [""],
    resultsShort: [{ metric: "", description: "" }]
  });

  useEffect(() => {
    // Check authentication and admin role
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isAdmin) {
      // Debug: Log the current role
      console.log('Current user role:', userRole);
      console.log('Is admin?', isAdmin);
      console.log('Is authenticated?', isAuthenticated);
      
      toast({
        title: "Access Denied",
        description: `You don't have permission to access the admin panel. Current role: ${userRole || 'none'}. Please log out and log back in with an admin account.`,
        variant: "destructive",
      });
      navigate('/');
      return;
    }
    loadCaseStudies();
    loadReviews();
    loadArticles();
  }, [isAuthenticated, isAdmin, navigate, toast]);

  const loadCaseStudies = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const studies = JSON.parse(stored);
        setCaseStudies(studies);
      } catch (e) {
        console.error("Error loading case studies:", e);
        // If parsing fails, try to load defaults
        loadDefaultCaseStudies();
      }
    } else {
      // Load default case studies if none exist
      loadDefaultCaseStudies();
    }
  };

  const loadDefaultCaseStudies = () => {
    // These are the default case studies shown on the website
    const defaults: CaseStudy[] = [
      {
        id: "jupiter-outbound",
        title: "Jupiter: Building a Multi-Channel Outbound Engine from Scratch",
        client: "Jupiter (YC S19)",
        timeline: "Aug 2025 - Present",
        company: "Jupiter",
        industry: "YC S19",
        challenge: "Manual outbound was limiting growth to 30-40 brands per week. CEO spending 10+ hours weekly on cold emails.",
        solutionShort: "Always-on outbound SDR coordinating email and LinkedIn without human handoffs",
        description: "How Jupiter scaled brand outreach from 40/week to 2,100/week with coordinated email + LinkedIn automation.",
        image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop",
        timelineShort: "Aug 2025 - Present",
        roi: "Ongoing",
        featured: false,
        createdAt: new Date("2025-08-01").toISOString(),
        problem: {
          title: "The Problem",
          content: `Jupiter had 1000+ food creators on their platform. CPG brands needed them. But the growth team was stuck in Gmail hell.

This was brand-side outbound—selling Jupiter's creator network to CPG CMOs and Directors of Marketing. Manual one-off emails. No follow-up system. No sequencing. If someone didn't reply to the first email, they'd maybe send one manual follow-up a week later—if they remembered.

They were reaching maybe 30-40 brands per week. At that pace, it would take 6+ months just to reach their target account list. Meanwhile, competitors were closing deals.

The CEO was spending 10+ hours weekly writing cold emails instead of running the company.`
        },
        solution: {
          title: "What We Built",
          content: `An always-on outbound SDR that coordinates email and LinkedIn without human handoffs.

Based on how a prospect engages, the system automatically chooses the next best action across email and LinkedIn.`,
          howItWorks: {
            title: "How it works:",
            steps: [
              "Email goes out via Instantly.ai → System watches engagement → Routes to the right next action:",
              "If they open/reply: LinkedIn connection request with personalized note referencing Jupiter's platform",
              "If they connect: 4-message sequence (immediate meeting ask → 2-day follow-up → final touch with Calendly)",
              "If they don't connect: Engagement agent likes and comments on their recent posts to build familiarity, then retries connection after 5-7 days",
              "If no email engagement: Stays in email sequence, tries different angles",
              "One system. No manual coordination. No \"remember to follow up.\""
            ]
          }
        },
        results: {
          title: "What Changed",
          before: [
            "30-40 brands reached per week (manual Gmail limit)",
            "No LinkedIn outreach at all",
            "No systematic follow-up",
            "CEO spending 10+ hours/week on outreach"
          ],
          after: [
            "300+ brands reached per day (2,100+ per week)—equivalent to 3-4 full-time SDRs working nonstop",
            "Coordinated email + LinkedIn sequences running 24/7",
            "24 meetings booked with CMOs and Directors of Marketing from 2,500 cold emails (0.96% meeting rate—above the 0.5% industry benchmark for cold executive outreach)",
            "5.7% LinkedIn connection acceptance rate with senior executives",
            "CEO spending ~2 hours per week reviewing conversations"
          ],
          bottomLine: [
            "CEO time recovered: 8 hours/week",
            "Brand outreach scaled: 40/week → 2,100/week",
            "Meetings booked without manual follow-up"
          ]
        },
        whyItWorked: {
          title: "Why It Worked",
          content: `Context-aware routing.

The system doesn't just blast LinkedIn messages. It watches who's engaging with emails, personalizes the connection request based on that engagement, and adjusts the follow-up strategy based on whether they accept.

For non-connectors, the engagement agent builds social proof first—so when the connection request comes later, it's not completely cold.

That's why they're booking meetings at ~1% conversion despite being an unknown platform reaching senior executives.

The system thinks about each prospect's journey, not just "send message → hope for reply."`
        },
        tech: ["n8n", "Instantly.ai", "Rules-based LinkedIn outreach with safety throttles", "PhantomBuster", "Apollo"],
        tags: ["Revenue", "Outbound", "Multi-Channel"],
        resultsShort: [
          { metric: "2,100+", description: "brands/week reached" },
          { metric: "24", description: "meetings booked" },
          { metric: "8 hrs", description: "CEO time saved/week" }
        ]
      }
    ];
    setCaseStudies(defaults);
    // Optionally save defaults to localStorage
    // localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
  };

  const saveCaseStudies = (studies: CaseStudy[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(studies));
    setCaseStudies(studies);
  };

  const handleNew = () => {
    setEditingId(null);
    setActiveTab("form");
    setFormData({
      id: "",
      title: "",
      client: "",
      timeline: "",
      company: "",
      industry: "",
      challenge: "",
      solutionShort: "",
      description: "",
      image: "",
      timelineShort: "",
      roi: "",
      problem: { title: "The Problem", content: "" },
      solution: { 
        title: "What We Built", 
        content: "",
        howItWorks: { title: "How it works:", steps: [""] }
      },
      results: {
        title: "What Changed",
        before: [""],
        after: [""],
        bottomLine: [""]
      },
      whyItWorked: { title: "Why It Worked", content: "" },
      tech: [""],
      tags: [""],
      resultsShort: [{ metric: "", description: "" }],
      featured: false
    });
  };

  const handleEdit = (study: CaseStudy) => {
    setEditingId(study.id);
    setFormData(study);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this case study?")) {
      const updated = caseStudies.filter(s => s.id !== id);
      saveCaseStudies(updated);
      toast({
        title: "Case study deleted",
        description: "The case study has been removed.",
      });
    }
  };

  const handleSave = () => {
    if (!formData.id || !formData.title) {
      toast({
        title: "Error",
        description: "Please fill in at least ID and Title",
        variant: "destructive"
      });
      return;
    }

    const existingStudy = editingId ? caseStudies.find(s => s.id === editingId) : null;
    const study: CaseStudy = {
      id: formData.id,
      title: formData.title || "",
      client: formData.client || "",
      timeline: formData.timeline || "",
      company: formData.company || formData.client || "",
      industry: formData.industry || "",
      challenge: formData.challenge || "",
      solutionShort: formData.solutionShort || "",
      description: formData.description || "",
      image: formData.image || "",
      timelineShort: formData.timelineShort || formData.timeline || "",
      roi: formData.roi || "",
      problem: formData.problem || { title: "The Problem", content: "" },
      solution: formData.solution || { 
        title: "What We Built", 
        content: "",
        howItWorks: { title: "How it works:", steps: [] }
      },
      results: formData.results || {
        title: "What Changed",
        before: [],
        after: [],
        bottomLine: []
      },
      whyItWorked: formData.whyItWorked || { title: "Why It Worked", content: "" },
      tech: formData.tech?.filter(t => t.trim()) || [],
      tags: formData.tags?.filter(t => t.trim()) || [],
      resultsShort: formData.resultsShort?.filter(r => r.metric || r.description) || [],
      featured: formData.featured || false,
      createdAt: existingStudy?.createdAt || new Date().toISOString()
    };

    let updated: CaseStudy[];
    if (editingId) {
      updated = caseStudies.map(s => s.id === editingId ? study : s);
    } else {
      updated = [...caseStudies, study];
    }

    // Sort: featured first, then by createdAt (newest first)
    updated.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bDate - aDate; // Newest first
    });

    saveCaseStudies(updated);
    setEditingId(null);
    setActiveTab("list");
    toast({
      title: "Case study saved",
      description: `Case study "${study.title}" has been ${editingId ? "updated" : "created"}.`,
    });
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (path: string[], value: any) => {
    setFormData(prev => {
      const newData = { ...prev };
      let current: any = newData;
      for (let i = 0; i < path.length - 1; i++) {
        current[path[i]] = { ...current[path[i]] };
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newData;
    });
  };

  const addArrayItem = (field: string) => {
    setFormData(prev => {
      const current = (prev as any)[field] || [];
      return { ...prev, [field]: [...current, ""] };
    });
  };

  const updateArrayItem = (field: string, index: number, value: string) => {
    setFormData(prev => {
      const current = [...((prev as any)[field] || [])];
      current[index] = value;
      return { ...prev, [field]: current };
    });
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => {
      const current = [...((prev as any)[field] || [])];
      current.splice(index, 1);
      return { ...prev, [field]: current };
    });
  };

  // Reviews functions
  const loadReviews = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/reviews`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
        localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(data));
      } else {
        const stored = localStorage.getItem(REVIEWS_STORAGE_KEY);
        if (stored) {
          try {
            const reviewsData = JSON.parse(stored);
            setReviews(reviewsData);
          } catch (e) {
            loadDefaultReviews();
          }
        } else {
          loadDefaultReviews();
        }
      }
    } catch (error) {
      const stored = localStorage.getItem(REVIEWS_STORAGE_KEY);
      if (stored) {
        try {
          const reviewsData = JSON.parse(stored);
          setReviews(reviewsData);
        } catch (e) {
          loadDefaultReviews();
        }
      } else {
        loadDefaultReviews();
      }
    }
  };

  const loadDefaultReviews = () => {
    const defaults: Review[] = [
      {
        id: "review-1",
        quote: "Import AI saved us 15 hours per week on lead qualification. Our conversion rate jumped 28% in the first month.",
        author: "Sarah Chen",
        role: "VP of Sales",
        company: "TechFlow Solutions",
        rating: 5,
        featured: true,
        order: 0
      },
      {
        id: "review-2",
        quote: "The invoice processing automation is incredible. What used to take days now happens in minutes with 99% accuracy.",
        author: "Marcus Rodriguez",
        role: "Finance Director",
        company: "GrowthCorp",
        rating: 5,
        featured: true,
        order: 1
      },
      {
        id: "review-3",
        quote: "Their AI support assistant handles 60% of our tickets automatically. Our team can finally focus on complex issues.",
        author: "Emily Watson",
        role: "Customer Success Manager",
        company: "ServicePro",
        rating: 5,
        featured: true,
        order: 2
      }
    ];
    setReviews(defaults);
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(defaults));
  };

  const handleNewReview = () => {
    setEditingReviewId(null);
    setReviewFormData({
      quote: "",
      author: "",
      role: "",
      company: "",
      rating: 5,
      featured: false,
      order: reviews.length
    });
    setActiveTab("review-form");
  };

  const handleEditReview = (review: Review) => {
    setEditingReviewId(review.id || null);
    setReviewFormData(review);
    setActiveTab("review-form");
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/reviews/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const updated = reviews.filter(r => r.id !== id);
        setReviews(updated);
        localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
        toast({
          title: "Review deleted",
          description: "The review has been deleted successfully.",
        });
      } else {
        const updated = reviews.filter(r => r.id !== id);
        setReviews(updated);
        localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
        toast({
          title: "Review deleted",
          description: "The review has been deleted from local storage.",
        });
      }
    } catch (error) {
      const updated = reviews.filter(r => r.id !== id);
      setReviews(updated);
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
      toast({
        title: "Review deleted",
        description: "The review has been deleted from local storage.",
      });
    }
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reviewFormData.quote || !reviewFormData.author || !reviewFormData.role || !reviewFormData.company) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const url = editingReviewId 
        ? `${apiUrl}/api/reviews/${editingReviewId}`
        : `${apiUrl}/api/reviews`;
      
      const method = editingReviewId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reviewFormData)
      });

      if (response.ok) {
        const savedReview = await response.json();
        let updated: Review[];
        
        if (editingReviewId) {
          updated = reviews.map(r => r.id === editingReviewId ? { ...savedReview, id: savedReview._id || savedReview.id } : r);
        } else {
          updated = [...reviews, { ...savedReview, id: savedReview._id || savedReview.id }];
        }
        
        setReviews(updated);
        localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
        
        setEditingReviewId(null);
        setReviewFormData({
          quote: "",
          author: "",
          role: "",
          company: "",
          rating: 5,
          featured: false,
          order: 0
        });
        setActiveTab("reviews-list");
        
        toast({
          title: "Review saved",
          description: `Review has been ${editingReviewId ? "updated" : "created"} successfully.`,
        });
      } else {
        const newId = editingReviewId || `review-${Date.now()}`;
        const reviewToSave: Review = { ...reviewFormData, id: newId };
        
        let updated: Review[];
        if (editingReviewId) {
          updated = reviews.map(r => r.id === editingReviewId ? reviewToSave : r);
        } else {
          updated = [...reviews, reviewToSave];
        }
        
        setReviews(updated);
        localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
        
        setEditingReviewId(null);
        setReviewFormData({
          quote: "",
          author: "",
          role: "",
          company: "",
          rating: 5,
          featured: false,
          order: 0
        });
        setActiveTab("reviews-list");
        
        toast({
          title: "Review saved",
          description: `Review has been ${editingReviewId ? "updated" : "created"} in local storage.`,
        });
      }
    } catch (error) {
      const newId = editingReviewId || `review-${Date.now()}`;
      const reviewToSave: Review = { ...reviewFormData, id: newId };
      
      let updated: Review[];
      if (editingReviewId) {
        updated = reviews.map(r => r.id === editingReviewId ? reviewToSave : r);
      } else {
        updated = [...reviews, reviewToSave];
      }
      
      setReviews(updated);
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
      
      setEditingReviewId(null);
      setReviewFormData({
        quote: "",
        author: "",
        role: "",
        company: "",
        rating: 5,
        featured: false,
        order: 0
      });
      setActiveTab("reviews-list");
      
      toast({
        title: "Review saved",
        description: `Review has been ${editingReviewId ? "updated" : "created"} in local storage.`,
      });
    }
  };

  // Article management functions
  const loadArticles = async () => {
    try {
      const apiUrl = getApiUrl();
      // For admin panel, request all articles with a higher limit
      const res = await fetch(`${apiUrl}/api/articles?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setArticles(data.articles || []);
      } else {
        const error = await res.json().catch(() => ({ message: "Failed to load articles" }));
        console.error("Error loading articles:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load articles",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error loading articles:", error);
      toast({
        title: "Error",
        description: "Failed to load articles",
        variant: "destructive",
      });
    }
  };

  const handleNewArticle = () => {
    setEditingArticleId(null);
    setActiveTab("article-form");
    setArticleFormData({
      title: "",
      slug: "",
      metaTitle: "",
      metaDescription: "",
      content: "",
      excerpt: "",
      primaryKeyword: "",
      secondaryKeywords: [],
      searchIntent: "Informational",
      featuredImage: { url: "", alt: "", caption: "" },
      category: "",
      tags: [],
      status: "Draft",
      publishedAt: "",
      scheduledAt: "",
      author: { name: "", bio: "", profileImage: "" },
      schemaType: "Article",
      faqs: [],
    });
  };

  const handleEditArticle = (article: any) => {
    try {
      setEditingArticleId(article._id);
      setActiveTab("article-form");
      
      // Ensure all fields are properly set with defaults, especially nested objects
      setArticleFormData({
        title: article.title || "",
        slug: article.slug || "",
        metaTitle: article.metaTitle || "",
        metaDescription: article.metaDescription || "",
        content: article.content || "",
        excerpt: article.excerpt || "",
        primaryKeyword: article.primaryKeyword || "",
        secondaryKeywords: Array.isArray(article.secondaryKeywords) ? article.secondaryKeywords : [],
        searchIntent: article.searchIntent || "Informational",
        featuredImage: {
          url: article.featuredImage?.url || "",
          alt: article.featuredImage?.alt || "",
          caption: article.featuredImage?.caption || "",
        },
        category: article.category || "",
        tags: Array.isArray(article.tags) ? article.tags : [],
        status: article.status || "Draft",
        publishedAt: article.publishedAt ? new Date(article.publishedAt).toISOString().split('T')[0] : "",
        scheduledAt: article.scheduledAt ? new Date(article.scheduledAt).toISOString().split('T')[0] : "",
        author: {
          name: article.author?.name || "",
          bio: article.author?.bio || "",
          profileImage: article.author?.profileImage || "",
        },
        schemaType: article.schemaType || "Article",
        faqs: Array.isArray(article.faqs) ? article.faqs : [],
      });
    } catch (error) {
      console.error("Error setting article form data:", error);
      toast({
        title: "Error",
        description: "Failed to load article data for editing",
        variant: "destructive",
      });
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleArticleTitleChange = (title: string) => {
    setArticleFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
      metaTitle: prev.metaTitle || title.substring(0, 60),
    }));
  };

  const calculateSEO = () => {
    const checks: any = {
      hasMetaTitle: articleFormData.metaTitle && articleFormData.metaTitle.length >= 50 && articleFormData.metaTitle.length <= 60,
      hasMetaDescription: articleFormData.metaDescription && articleFormData.metaDescription.length >= 140 && articleFormData.metaDescription.length <= 160,
      hasPrimaryKeyword: !!articleFormData.primaryKeyword,
      hasH1: articleFormData.content.includes('# ') || articleFormData.content.includes('<h1>'),
      hasH2: articleFormData.content.includes('## ') || articleFormData.content.includes('<h2>'),
      hasFeaturedImage: !!articleFormData.featuredImage?.url,
      hasAltText: !!articleFormData.featuredImage?.alt,
    };
    return Object.values(checks).filter(Boolean).length * 10;
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!articleFormData.title || !articleFormData.title.trim()) {
        toast({
          title: "Validation Error",
          description: "Article title is required",
          variant: "destructive",
        });
        return;
      }

      if (!articleFormData.content || !articleFormData.content.trim()) {
        toast({
          title: "Validation Error",
          description: "Article content is required",
          variant: "destructive",
        });
        return;
      }

      if (!articleFormData.slug || !articleFormData.slug.trim()) {
        toast({
          title: "Validation Error",
          description: "Article slug is required",
          variant: "destructive",
        });
        return;
      }

      const apiUrl = getApiUrl();
      const url = editingArticleId 
        ? `${apiUrl}/api/articles/${editingArticleId}`
        : `${apiUrl}/api/articles`;
      
      const method = editingArticleId ? 'PUT' : 'POST';
      
      // Clean up the data before sending
      const articleData: any = {
        title: articleFormData.title.trim(),
        slug: articleFormData.slug.trim(),
        content: articleFormData.content.trim(),
      };

      // Add optional fields only if they have values
      if (articleFormData.metaTitle?.trim()) {
        articleData.metaTitle = articleFormData.metaTitle.trim();
      }
      if (articleFormData.metaDescription?.trim()) {
        articleData.metaDescription = articleFormData.metaDescription.trim();
      }
      if (articleFormData.excerpt?.trim()) {
        articleData.excerpt = articleFormData.excerpt.trim();
      }
      if (articleFormData.primaryKeyword?.trim()) {
        articleData.primaryKeyword = articleFormData.primaryKeyword.trim();
      }
      if (articleFormData.secondaryKeywords && articleFormData.secondaryKeywords.length > 0) {
        articleData.secondaryKeywords = articleFormData.secondaryKeywords.filter((k: string) => k.trim());
      }
      if (articleFormData.searchIntent) {
        articleData.searchIntent = articleFormData.searchIntent;
      }
      if (articleFormData.category?.trim()) {
        articleData.category = articleFormData.category.trim();
      }
      if (articleFormData.tags && articleFormData.tags.length > 0) {
        articleData.tags = articleFormData.tags.filter((t: string) => t.trim());
      }
      if (articleFormData.status) {
        articleData.status = articleFormData.status;
      }
      if (articleFormData.schemaType) {
        articleData.schemaType = articleFormData.schemaType;
      }
      if (articleFormData.publishedAt) {
        articleData.publishedAt = new Date(articleFormData.publishedAt).toISOString();
      }
      if (articleFormData.scheduledAt) {
        articleData.scheduledAt = new Date(articleFormData.scheduledAt).toISOString();
      }
      if (articleFormData.author?.name?.trim()) {
        articleData.author = {
          name: articleFormData.author.name.trim(),
          bio: articleFormData.author.bio?.trim() || '',
          profileImage: articleFormData.author.profileImage?.trim() || '',
        };
      }
      if (articleFormData.featuredImage?.url?.trim()) {
        articleData.featuredImage = {
          url: articleFormData.featuredImage.url.trim(),
          alt: articleFormData.featuredImage.alt?.trim() || '',
          caption: articleFormData.featuredImage.caption?.trim() || '',
        };
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(articleData)
      });

      if (response.ok) {
        const savedArticle = await response.json();
        await loadArticles();
        setEditingArticleId(null);
        setActiveTab("articles-list");
        toast({
          title: "Article saved",
          description: `Article has been ${editingArticleId ? "updated" : "created"} successfully.`,
        });
      } else {
        let errorMessage = "Failed to save article";
        try {
          const error = await response.json();
          if (error.errors && Array.isArray(error.errors)) {
            errorMessage = error.errors.join(', ');
          } else if (error.message) {
            errorMessage = error.message;
          } else if (error.error) {
            errorMessage = error.error;
          } else if (error.details) {
            errorMessage = error.details;
          }
          console.error("Article save error:", error);
        } catch (parseError) {
          // If response is not JSON, use status text
          errorMessage = response.statusText || "Failed to save article";
          console.error("Error parsing response:", parseError);
        }
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save article",
        variant: "destructive",
      });
      console.error("Article save error:", error);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    
    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/articles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await loadArticles();
        toast({
          title: "Article deleted",
          description: "Article has been deleted successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete article",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete article",
        variant: "destructive",
      });
    }
  };

  const wordCount = articleFormData.content
    ? articleFormData.content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().split(' ').filter(w => w.length > 0).length
    : 0;
  const readingTime = Math.ceil(wordCount / 200);
  const seoScore = calculateSEO();

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate("/portal")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Portal
          </Button>
          <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">Manage case studies and reviews</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="list">All Case Studies</TabsTrigger>
            <TabsTrigger value="form">
              {editingId ? "Edit" : "New"} Case Study
            </TabsTrigger>
            <TabsTrigger value="reviews-list">
              <MessageSquare className="w-4 h-4 mr-2" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="review-form">
              {editingReviewId ? "Edit" : "New"} Review
            </TabsTrigger>
            <TabsTrigger value="articles-list">
              <BookOpen className="w-4 h-4 mr-2" />
              Articles
            </TabsTrigger>
            <TabsTrigger value="article-form">
              {editingArticleId ? "Edit" : "New"} Article
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Case Studies</CardTitle>
                    <CardDescription>
                      {caseStudies.length} case {caseStudies.length !== 1 ? "studies" : "study"} total
                    </CardDescription>
                  </div>
                  <Button onClick={handleNew}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Case Study
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {caseStudies.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No case studies yet. Create your first one!</p>
                    </div>
                  ) : (
                    caseStudies.map((study) => (
                      <div
                        key={study.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{study.title}</h3>
                            {study.featured && (
                              <Badge variant="default" className="bg-yellow-500 text-black">
                                <Star className="w-3 h-3 mr-1 fill-current" />
                                Featured
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {study.client} • {study.timeline}
                          </p>
                          <div className="flex gap-2 mt-2">
                            {study.tags.map((tag, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              handleEdit(study);
                              setActiveTab("form");
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(study.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="form">
            <Card>
              <CardHeader>
                <CardTitle>{editingId ? "Edit" : "Create"} Case Study</CardTitle>
                <CardDescription>
                  Fill in all the details for the case study
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="id">ID (URL slug)</Label>
                      <Input
                        id="id"
                        value={formData.id || ""}
                        onChange={(e) => updateField("id", e.target.value)}
                        placeholder="jupiter-outbound"
                      />
                    </div>
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={formData.title || ""}
                        onChange={(e) => updateField("title", e.target.value)}
                        placeholder="Jupiter: Building a Multi-Channel Outbound Engine"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="client">Client</Label>
                      <Input
                        id="client"
                        value={formData.client || ""}
                        onChange={(e) => updateField("client", e.target.value)}
                        placeholder="Jupiter (YC S19)"
                      />
                    </div>
                    <div>
                      <Label htmlFor="timeline">Timeline</Label>
                      <Input
                        id="timeline"
                        value={formData.timeline || ""}
                        onChange={(e) => updateField("timeline", e.target.value)}
                        placeholder="Aug 2025 - Present"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company">Company (for listing)</Label>
                      <Input
                        id="company"
                        value={formData.company || ""}
                        onChange={(e) => updateField("company", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="industry">Industry</Label>
                      <Input
                        id="industry"
                        value={formData.industry || ""}
                        onChange={(e) => updateField("industry", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Short Description (for listing)</Label>
                    <Textarea
                      id="description"
                      value={formData.description || ""}
                      onChange={(e) => updateField("description", e.target.value)}
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      value={formData.image || ""}
                      onChange={(e) => updateField("image", e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                    />
                    <p className="text-xs text-muted-foreground">
                      Or upload an image file (will be converted to data URL)
                    </p>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            updateField("image", reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="cursor-pointer"
                    />
                    {formData.image && formData.image.startsWith("data:image") && (
                      <div className="mt-2">
                        <img 
                          src={formData.image} 
                          alt="Preview" 
                          className="w-32 h-32 object-cover rounded-lg border border-border"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>Tags</Label>
                    <div className="space-y-2">
                      {(formData.tags || []).map((tag, i) => (
                        <div key={i} className="flex gap-2">
                          <Input
                            value={tag}
                            onChange={(e) => updateArrayItem("tags", i, e.target.value)}
                            placeholder="Revenue"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeArrayItem("tags", i)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addArrayItem("tags")}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Tag
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Star className={`w-5 h-5 ${formData.featured ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} />
                      <div>
                        <Label htmlFor="featured" className="cursor-pointer">Feature this case study</Label>
                        <p className="text-xs text-muted-foreground">Featured case studies appear first</p>
                      </div>
                    </div>
                    <Switch
                      id="featured"
                      checked={formData.featured || false}
                      onCheckedChange={(checked) => updateField("featured", checked)}
                    />
                  </div>
                </div>

                {/* Problem Section */}
                <div className="space-y-4 border-t pt-6">
                  <h3 className="text-lg font-semibold">The Problem</h3>
                  <div>
                    <Label htmlFor="problem-content">Problem Content</Label>
                    <Textarea
                      id="problem-content"
                      value={formData.problem?.content || ""}
                      onChange={(e) => updateNestedField(["problem", "content"], e.target.value)}
                      rows={6}
                      placeholder="Describe the problem the client was facing..."
                    />
                  </div>
                </div>

                {/* Solution Section */}
                <div className="space-y-4 border-t pt-6">
                  <h3 className="text-lg font-semibold">What We Built</h3>
                  <div>
                    <Label htmlFor="solution-content">Solution Description</Label>
                    <Textarea
                      id="solution-content"
                      value={formData.solution?.content || ""}
                      onChange={(e) => updateNestedField(["solution", "content"], e.target.value)}
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <Label>How It Works (Steps)</Label>
                    <div className="space-y-2">
                      {(formData.solution?.howItWorks?.steps || []).map((step, i) => (
                        <div key={i} className="flex gap-2">
                          <Textarea
                            value={step}
                            onChange={(e) => {
                              const steps = [...(formData.solution?.howItWorks?.steps || [])];
                              steps[i] = e.target.value;
                              updateNestedField(["solution", "howItWorks", "steps"], steps);
                            }}
                            rows={2}
                            placeholder="Step description..."
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              const steps = [...(formData.solution?.howItWorks?.steps || [])];
                              steps.splice(i, 1);
                              updateNestedField(["solution", "howItWorks", "steps"], steps);
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const steps = [...(formData.solution?.howItWorks?.steps || []), ""];
                          updateNestedField(["solution", "howItWorks", "steps"], steps);
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Step
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Results Section */}
                <div className="space-y-4 border-t pt-6">
                  <h3 className="text-lg font-semibold">What Changed</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Before (one per line)</Label>
                      <div className="space-y-2">
                        {(formData.results?.before || []).map((item, i) => (
                          <div key={i} className="flex gap-2">
                            <Input
                              value={item}
                              onChange={(e) => {
                                const before = [...(formData.results?.before || [])];
                                before[i] = e.target.value;
                                updateNestedField(["results", "before"], before);
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                const before = [...(formData.results?.before || [])];
                                before.splice(i, 1);
                                updateNestedField(["results", "before"], before);
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const before = [...(formData.results?.before || []), ""];
                            updateNestedField(["results", "before"], before);
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Before Item
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label>After (one per line)</Label>
                      <div className="space-y-2">
                        {(formData.results?.after || []).map((item, i) => (
                          <div key={i} className="flex gap-2">
                            <Input
                              value={item}
                              onChange={(e) => {
                                const after = [...(formData.results?.after || [])];
                                after[i] = e.target.value;
                                updateNestedField(["results", "after"], after);
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                const after = [...(formData.results?.after || [])];
                                after.splice(i, 1);
                                updateNestedField(["results", "after"], after);
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const after = [...(formData.results?.after || []), ""];
                            updateNestedField(["results", "after"], after);
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add After Item
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Bottom Line (one per line)</Label>
                    <div className="space-y-2">
                      {(formData.results?.bottomLine || []).map((item, i) => (
                        <div key={i} className="flex gap-2">
                          <Input
                            value={item}
                            onChange={(e) => {
                              const bottomLine = [...(formData.results?.bottomLine || [])];
                              bottomLine[i] = e.target.value;
                              updateNestedField(["results", "bottomLine"], bottomLine);
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              const bottomLine = [...(formData.results?.bottomLine || [])];
                              bottomLine.splice(i, 1);
                              updateNestedField(["results", "bottomLine"], bottomLine);
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const bottomLine = [...(formData.results?.bottomLine || []), ""];
                          updateNestedField(["results", "bottomLine"], bottomLine);
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Bottom Line Item
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Why It Worked */}
                <div className="space-y-4 border-t pt-6">
                  <h3 className="text-lg font-semibold">Why It Worked</h3>
                  <div>
                    <Label htmlFor="why-content">Content</Label>
                    <Textarea
                      id="why-content"
                      value={formData.whyItWorked?.content || ""}
                      onChange={(e) => updateNestedField(["whyItWorked", "content"], e.target.value)}
                      rows={6}
                    />
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="space-y-4 border-t pt-6">
                  <h3 className="text-lg font-semibold">Tech Stack</h3>
                  <div className="space-y-2">
                    {(formData.tech || []).map((tech, i) => (
                      <div key={i} className="flex gap-2">
                        <Input
                          value={tech}
                          onChange={(e) => updateArrayItem("tech", i, e.target.value)}
                          placeholder="n8n"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeArrayItem("tech", i)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addArrayItem("tech")}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Tech
                    </Button>
                  </div>
                </div>

                {/* Short Results for Listing */}
                <div className="space-y-4 border-t pt-6">
                  <h3 className="text-lg font-semibold">Short Results (for listing page)</h3>
                  <div className="space-y-2">
                    {(formData.resultsShort || []).map((result, i) => (
                      <div key={i} className="grid grid-cols-2 gap-2">
                        <Input
                          value={result.metric || ""}
                          onChange={(e) => {
                            const results = [...(formData.resultsShort || [])];
                            results[i] = { ...results[i], metric: e.target.value };
                            updateField("resultsShort", results);
                          }}
                          placeholder="Metric (e.g., +285%)"
                        />
                        <div className="flex gap-2">
                          <Input
                            value={result.description || ""}
                            onChange={(e) => {
                              const results = [...(formData.resultsShort || [])];
                              results[i] = { ...results[i], description: e.target.value };
                              updateField("resultsShort", results);
                            }}
                            placeholder="Description"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              const results = [...(formData.resultsShort || [])];
                              results.splice(i, 1);
                              updateField("resultsShort", results);
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const results = [...(formData.resultsShort || []), { metric: "", description: "" }];
                        updateField("resultsShort", results);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Result
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-6 border-t">
                  <Button onClick={handleSave} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    {editingId ? "Update" : "Create"} Case Study
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingId(null);
                      handleNew();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews List Tab */}
          <TabsContent value="reviews-list">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Reviews</CardTitle>
                    <CardDescription>
                      {reviews.length} review{reviews.length !== 1 ? "s" : ""} total
                    </CardDescription>
                  </div>
                  <Button onClick={handleNewReview}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Review
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No reviews yet. Create your first review!</p>
                    </div>
                  ) : (
                    reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="font-semibold text-sm italic line-clamp-2">
                                "{review.quote}"
                              </p>
                              {review.featured && (
                                <Badge variant="default" className="ml-2">
                                  <Star className="w-3 h-3 mr-1" />
                                  Featured
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="font-medium">{review.author}</span>
                              <span>{review.role} at {review.company}</span>
                              <div className="flex items-center gap-1">
                                {[...Array(review.rating)].map((_, i) => (
                                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditReview(review)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => review.id && handleDeleteReview(review.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Review Form Tab */}
          <TabsContent value="review-form">
            <Card>
              <CardHeader>
                <CardTitle>{editingReviewId ? "Edit Review" : "New Review"}</CardTitle>
                <CardDescription>
                  {editingReviewId ? "Update review details" : "Add a new customer review"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveReview} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="quote">Quote *</Label>
                    <Textarea
                      id="quote"
                      value={reviewFormData.quote}
                      onChange={(e) => setReviewFormData({ ...reviewFormData, quote: e.target.value })}
                      placeholder="Customer review quote..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="author">Author Name *</Label>
                      <Input
                        id="author"
                        value={reviewFormData.author}
                        onChange={(e) => setReviewFormData({ ...reviewFormData, author: e.target.value })}
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Role/Title *</Label>
                      <Input
                        id="role"
                        value={reviewFormData.role}
                        onChange={(e) => setReviewFormData({ ...reviewFormData, role: e.target.value })}
                        placeholder="VP of Sales"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company *</Label>
                      <Input
                        id="company"
                        value={reviewFormData.company}
                        onChange={(e) => setReviewFormData({ ...reviewFormData, company: e.target.value })}
                        placeholder="TechFlow Solutions"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rating">Rating *</Label>
                      <Input
                        id="rating"
                        type="number"
                        min="1"
                        max="5"
                        value={reviewFormData.rating}
                        onChange={(e) => setReviewFormData({ ...reviewFormData, rating: parseInt(e.target.value) || 5 })}
                        required
                      />
                      <div className="flex items-center gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < reviewFormData.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={reviewFormData.featured}
                      onCheckedChange={(checked) => setReviewFormData({ ...reviewFormData, featured: checked })}
                    />
                    <Label htmlFor="featured">Featured Review</Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="order">Display Order</Label>
                    <Input
                      id="order"
                      type="number"
                      value={reviewFormData.order}
                      onChange={(e) => setReviewFormData({ ...reviewFormData, order: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                    />
                    <p className="text-xs text-muted-foreground">
                      Lower numbers appear first. Featured reviews are prioritized.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit">
                      <Save className="w-4 h-4 mr-2" />
                      {editingReviewId ? "Update" : "Create"} Review
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingReviewId(null);
                        setReviewFormData({
                          quote: "",
                          author: "",
                          role: "",
                          company: "",
                          rating: 5,
                          featured: false,
                          order: 0
                        });
                        setActiveTab("reviews-list");
                      }}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Articles List Tab */}
          <TabsContent value="articles-list">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Articles</CardTitle>
                    <CardDescription>
                      {articles.length} article{articles.length !== 1 ? "s" : ""} total
                    </CardDescription>
                  </div>
                  <Button onClick={handleNewArticle}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Article
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {articles.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No articles yet. Create your first one!</p>
                    </div>
                  ) : (
                    articles.map((article) => (
                      <div
                        key={article._id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{article.title}</h3>
                            <Badge variant={article.status === 'Published' ? 'default' : 'outline'}>
                              {article.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Slug: /articles/{article.slug} • {article.views || 0} views
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditArticle(article)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteArticle(article._id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Article Form Tab */}
          <TabsContent value="article-form">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{editingArticleId ? "Edit Article" : "New Article"}</CardTitle>
                    <CardDescription>
                      {editingArticleId ? "Update article details" : "Create a new article"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSaveArticle} className="space-y-6">
                      {/* Core Content Fields */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Core Content</h3>
                        
                        <div className="space-y-2">
                          <Label htmlFor="title">
                            Article Title (H1) *
                            <span className="text-xs text-muted-foreground ml-2">
                              {articleFormData.title.length}/60
                            </span>
                          </Label>
                          <Input
                            id="title"
                            value={articleFormData.title}
                            onChange={(e) => handleArticleTitleChange(e.target.value)}
                            placeholder="Enter article title..."
                            maxLength={60}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="slug">Slug / URL *</Label>
                          <Input
                            id="slug"
                            value={articleFormData.slug}
                            onChange={(e) => setArticleFormData({ ...articleFormData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                            placeholder="article-slug"
                            required
                          />
                          <p className="text-xs text-muted-foreground">
                            URL: /articles/{articleFormData.slug || 'article-slug'}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="excerpt">Excerpt</Label>
                          <Textarea
                            id="excerpt"
                            value={articleFormData.excerpt}
                            onChange={(e) => setArticleFormData({ ...articleFormData, excerpt: e.target.value })}
                            placeholder="Short excerpt for listing pages..."
                            rows={3}
                            maxLength={300}
                          />
                        </div>
                      </div>

                      {/* SEO Meta Fields */}
                      <div className="space-y-4 border-t pt-4">
                        <h3 className="text-lg font-semibold">SEO Meta</h3>
                        
                        <div className="space-y-2">
                          <Label htmlFor="metaTitle">
                            Meta Title
                            <span className="text-xs text-muted-foreground ml-2">
                              {articleFormData.metaTitle?.length || 0}/60
                            </span>
                          </Label>
                          <Input
                            id="metaTitle"
                            value={articleFormData.metaTitle}
                            onChange={(e) => setArticleFormData({ ...articleFormData, metaTitle: e.target.value })}
                            placeholder="SEO title (50-60 characters)"
                            maxLength={60}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="metaDescription">
                            Meta Description
                            <span className="text-xs text-muted-foreground ml-2">
                              {articleFormData.metaDescription?.length || 0}/160
                            </span>
                          </Label>
                          <Textarea
                            id="metaDescription"
                            value={articleFormData.metaDescription}
                            onChange={(e) => setArticleFormData({ ...articleFormData, metaDescription: e.target.value })}
                            placeholder="SEO description (140-160 characters)"
                            rows={3}
                            maxLength={160}
                          />
                        </div>
                      </div>

                      {/* Keyword Management */}
                      <div className="space-y-4 border-t pt-4">
                        <h3 className="text-lg font-semibold">Keywords</h3>
                        
                        <div className="space-y-2">
                          <Label htmlFor="primaryKeyword">Primary Keyword</Label>
                          <Input
                            id="primaryKeyword"
                            value={articleFormData.primaryKeyword}
                            onChange={(e) => setArticleFormData({ ...articleFormData, primaryKeyword: e.target.value })}
                            placeholder="Main keyword for this article"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="secondaryKeywords">Secondary Keywords (comma-separated)</Label>
                          <Input
                            id="secondaryKeywords"
                            value={articleFormData.secondaryKeywords?.join(', ') || ''}
                            onChange={(e) => setArticleFormData({ 
                              ...articleFormData, 
                              secondaryKeywords: e.target.value.split(',').map(k => k.trim()).filter(k => k) 
                            })}
                            placeholder="keyword1, keyword2, keyword3"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="searchIntent">Search Intent</Label>
                          <Select
                            value={articleFormData.searchIntent}
                            onValueChange={(value) => setArticleFormData({ ...articleFormData, searchIntent: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Informational">Informational</SelectItem>
                              <SelectItem value="Commercial">Commercial</SelectItem>
                              <SelectItem value="Transactional">Transactional</SelectItem>
                              <SelectItem value="Navigational">Navigational</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Content Editor */}
                      <div className="space-y-4 border-t pt-4">
                        <h3 className="text-lg font-semibold">Content</h3>
                        <div className="space-y-2">
                          <Label htmlFor="content">Main Content (Markdown supported) *</Label>
                          <Textarea
                            id="content"
                            value={articleFormData.content}
                            onChange={(e) => setArticleFormData({ ...articleFormData, content: e.target.value })}
                            placeholder="Write your article content here. Supports Markdown: # H1, ## H2, **bold**, *italic*, [links](url), etc."
                            rows={20}
                            required
                            className="font-mono text-sm"
                          />
                          <p className="text-xs text-muted-foreground">
                            Word count: {wordCount} • Reading time: ~{readingTime} min
                          </p>
                        </div>
                      </div>

                      {/* Featured Image */}
                      <div className="space-y-4 border-t pt-4">
                        <h3 className="text-lg font-semibold">Featured Image</h3>
                        
                        <div className="space-y-2">
                          <Label htmlFor="featuredImageUrl">Image URL</Label>
                          <Input
                            id="featuredImageUrl"
                            value={articleFormData.featuredImage?.url || ''}
                            onChange={(e) => setArticleFormData({ 
                              ...articleFormData, 
                              featuredImage: { 
                                url: e.target.value,
                                alt: articleFormData.featuredImage?.alt || "",
                                caption: articleFormData.featuredImage?.caption || ""
                              } 
                            })}
                            placeholder="https://example.com/image.jpg"
                          />
                          <p className="text-xs text-muted-foreground">
                            Or upload an image file (will be converted to data URL)
                          </p>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setArticleFormData({ 
                                    ...articleFormData, 
                                    featuredImage: { 
                                      url: reader.result as string,
                                      alt: articleFormData.featuredImage?.alt || "",
                                      caption: articleFormData.featuredImage?.caption || ""
                                    } 
                                  });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="cursor-pointer"
                          />
                          {articleFormData.featuredImage?.url && (
                            <div className="mt-2">
                              <img 
                                src={articleFormData.featuredImage.url} 
                                alt="Preview" 
                                className="w-32 h-32 object-cover rounded-lg border border-border"
                                onError={(e) => {
                                  // Hide image if it fails to load
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="featuredImageAlt">Alt Text *</Label>
                          <Input
                            id="featuredImageAlt"
                            value={articleFormData.featuredImage?.alt || ''}
                            onChange={(e) => setArticleFormData({ 
                              ...articleFormData, 
                              featuredImage: { 
                                url: articleFormData.featuredImage?.url || "",
                                alt: e.target.value,
                                caption: articleFormData.featuredImage?.caption || ""
                              } 
                            })}
                            placeholder="Descriptive alt text for accessibility"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="featuredImageCaption">Caption</Label>
                          <Input
                            id="featuredImageCaption"
                            value={articleFormData.featuredImage?.caption || ''}
                            onChange={(e) => setArticleFormData({ 
                              ...articleFormData, 
                              featuredImage: { 
                                url: articleFormData.featuredImage?.url || "",
                                alt: articleFormData.featuredImage?.alt || "",
                                caption: e.target.value
                              } 
                            })}
                            placeholder="Optional image caption"
                          />
                        </div>
                      </div>

                      {/* Category & Tags */}
                      <div className="space-y-4 border-t pt-4">
                        <h3 className="text-lg font-semibold">Organization</h3>
                        
                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Input
                            id="category"
                            value={articleFormData.category}
                            onChange={(e) => setArticleFormData({ ...articleFormData, category: e.target.value })}
                            placeholder="e.g., AI Automation, Business"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="tags">Tags (comma-separated)</Label>
                          <Input
                            id="tags"
                            value={articleFormData.tags?.join(', ') || ''}
                            onChange={(e) => setArticleFormData({ 
                              ...articleFormData, 
                              tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) 
                            })}
                            placeholder="tag1, tag2, tag3"
                          />
                        </div>
                      </div>

                      {/* Author */}
                      <div className="space-y-4 border-t pt-4">
                        <h3 className="text-lg font-semibold">Author</h3>
                        
                        <div className="space-y-2">
                          <Label htmlFor="authorName">Author Name</Label>
                          <Input
                            id="authorName"
                            value={articleFormData.author?.name || ''}
                            onChange={(e) => setArticleFormData({ 
                              ...articleFormData, 
                              author: { 
                                name: e.target.value,
                                bio: articleFormData.author?.bio || "",
                                profileImage: articleFormData.author?.profileImage || ""
                              } 
                            })}
                            placeholder="Author name"
                          />
                        </div>
                      </div>

                      {/* Publishing */}
                      <div className="space-y-4 border-t pt-4">
                        <h3 className="text-lg font-semibold">Publishing</h3>
                        
                        <div className="space-y-2">
                          <Label htmlFor="status">Status</Label>
                          <Select
                            value={articleFormData.status}
                            onValueChange={(value) => setArticleFormData({ ...articleFormData, status: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Draft">Draft</SelectItem>
                              <SelectItem value="Review">Review</SelectItem>
                              <SelectItem value="Scheduled">Scheduled</SelectItem>
                              <SelectItem value="Published">Published</SelectItem>
                              <SelectItem value="Archived">Archived</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="publishedAt">Publish Date</Label>
                          <Input
                            id="publishedAt"
                            type="date"
                            value={articleFormData.publishedAt}
                            onChange={(e) => setArticleFormData({ ...articleFormData, publishedAt: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="schemaType">Schema Type</Label>
                          <Select
                            value={articleFormData.schemaType}
                            onValueChange={(value) => setArticleFormData({ ...articleFormData, schemaType: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Article">Article</SelectItem>
                              <SelectItem value="BlogPosting">BlogPosting</SelectItem>
                              <SelectItem value="FAQ">FAQ</SelectItem>
                              <SelectItem value="HowTo">HowTo</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 pt-4 border-t">
                        <Button type="submit">
                          <Save className="w-4 h-4 mr-2" />
                          Save Article
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setEditingArticleId(null);
                            setActiveTab("articles-list");
                          }}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* SEO Score Panel */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>SEO Score</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-2">{seoScore}/100</div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${seoScore}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        {articleFormData.metaTitle && articleFormData.metaTitle.length >= 50 && articleFormData.metaTitle.length <= 60 ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-yellow-500" />
                        )}
                        <span>Meta Title (50-60 chars)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {articleFormData.metaDescription && articleFormData.metaDescription.length >= 140 && articleFormData.metaDescription.length <= 160 ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-yellow-500" />
                        )}
                        <span>Meta Description (140-160 chars)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {articleFormData.primaryKeyword ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-yellow-500" />
                        )}
                        <span>Primary Keyword</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {(articleFormData.content.includes('## ') || articleFormData.content.includes('<h2>')) ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-yellow-500" />
                        )}
                        <span>Has H2 Headings</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {articleFormData.featuredImage?.url ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-yellow-500" />
                        )}
                        <span>Featured Image</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {articleFormData.featuredImage?.alt ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-yellow-500" />
                        )}
                        <span>Image Alt Text</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Word Count:</span>
                        <span className="font-medium">{wordCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Reading Time:</span>
                        <span className="font-medium">~{readingTime} min</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

