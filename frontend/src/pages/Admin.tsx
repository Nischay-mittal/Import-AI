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
  AlertCircle,
  Users,
  Mail,
  Shield,
  Code
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
  const { isAuthenticated, isAdmin, userRole, token, isLoading: authLoading } = useAuth();
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
  
  // Users state
  const [users, setUsers] = useState<any[]>([]);
  
  // Contact submissions state
  const [contactSubmissions, setContactSubmissions] = useState<any[]>([]);
  
  // Projects state
  const [projects, setProjects] = useState<any[]>([]);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectFormData, setProjectFormData] = useState<any>({
    title: "",
    slug: "",
    tagline: "",
    projectType: "Internal Project",
    status: "Draft",
    visibility: "Public",
    primaryCategory: "",
    dataTags: [],
    industryRelevance: "",
    problemSummary: "",
    whoFacesProblem: [],
    whyExistingSolutionsFail: "",
    solutionSummary: "",
    workflowSteps: [],
    showBeforeAfter: false,
    beforeState: "",
    afterState: "",
    architectureDescription: "",
    architectureDiagram: { url: "", alt: "" },
    toolsUsed: [],
    metrics: [],
    demoType: "",
    demoUrl: "",
    videoUrl: "",
    screenshots: [],
    githubRepo: { url: "", isPublic: true },
    metaTitle: "",
    metaDescription: "",
    canonicalUrl: "",
    openGraphImage: { url: "", alt: "" },
    schemaType: "Project",
    author: { name: "", bio: "", profileImage: "" },
    publishedAt: "",
    featured: false,
    sortPriority: 0,
  });
  
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
    featured: false,
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
    // Wait for AuthContext to finish loading
    if (authLoading) {
      return;
    }
    
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
    loadUsers();
    loadContactSubmissions();
    loadProjects();
  }, [authLoading, isAuthenticated, isAdmin, navigate, toast, userRole, token]);

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
      featured: false,
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
        featured: article.featured || false,
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
      articleData.featured = articleFormData.featured || false;
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

  const loadUsers = async () => {
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/auth/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      } else {
        const error = await res.json().catch(() => ({ message: "Failed to load users" }));
        console.error("Error loading users:", error);
      }
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const loadContactSubmissions = async () => {
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/contact/submissions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setContactSubmissions(data.submissions || []);
      } else {
        const error = await res.json().catch(() => ({ message: "Failed to load submissions" }));
        console.error("Error loading contact submissions:", error);
      }
    } catch (error) {
      console.error("Error loading contact submissions:", error);
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/auth/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      
      if (res.ok) {
        toast({
          title: "Success",
          description: `User role updated to ${newRole}`,
        });
        loadUsers(); // Reload users list
      } else {
        const error = await res.json().catch(() => ({ message: "Failed to update user role" }));
        toast({
          title: "Error",
          description: error.message || "Failed to update user role",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  const loadProjects = async () => {
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/projects?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      } else {
        const error = await res.json().catch(() => ({ message: "Failed to load projects" }));
        console.error("Error loading projects:", error);
      }
    } catch (error) {
      console.error("Error loading projects:", error);
    }
  };

  const generateProjectSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleProjectTitleChange = (title: string) => {
    setProjectFormData({
      ...projectFormData,
      title,
      slug: projectFormData.slug || generateProjectSlug(title),
    });
  };

  const handleSaveProject = async () => {
    try {
      if (!projectFormData.title?.trim()) {
        toast({
          title: "Error",
          description: "Project title is required",
          variant: "destructive",
        });
        return;
      }

      const apiUrl = getApiUrl();
      const url = editingProjectId 
        ? `${apiUrl}/api/projects/${editingProjectId}`
        : `${apiUrl}/api/projects`;
      
      const method = editingProjectId ? 'PUT' : 'POST';
      
      // Clean up the data before sending
      const projectData: any = {
        title: projectFormData.title.trim(),
        slug: projectFormData.slug.trim() || generateProjectSlug(projectFormData.title),
      };

      // Add optional fields only if they have values
      if (projectFormData.tagline?.trim()) projectData.tagline = projectFormData.tagline.trim();
      if (projectFormData.projectType) projectData.projectType = projectFormData.projectType;
      if (projectFormData.status) projectData.status = projectFormData.status;
      if (projectFormData.visibility) projectData.visibility = projectFormData.visibility;
      if (projectFormData.primaryCategory?.trim()) projectData.primaryCategory = projectFormData.primaryCategory.trim();
      if (projectFormData.dataTags && projectFormData.dataTags.length > 0) {
        projectData.dataTags = projectFormData.dataTags.filter((t: string) => t.trim());
      }
      if (projectFormData.industryRelevance?.trim()) projectData.industryRelevance = projectFormData.industryRelevance.trim();
      if (projectFormData.problemSummary?.trim()) projectData.problemSummary = projectFormData.problemSummary.trim();
      if (projectFormData.whoFacesProblem && projectFormData.whoFacesProblem.length > 0) {
        projectData.whoFacesProblem = projectFormData.whoFacesProblem.filter((w: string) => w.trim());
      }
      if (projectFormData.whyExistingSolutionsFail?.trim()) projectData.whyExistingSolutionsFail = projectFormData.whyExistingSolutionsFail.trim();
      if (projectFormData.solutionSummary?.trim()) projectData.solutionSummary = projectFormData.solutionSummary.trim();
      if (projectFormData.workflowSteps && projectFormData.workflowSteps.length > 0) {
        projectData.workflowSteps = projectFormData.workflowSteps.filter((s: any) => s.title?.trim() && s.description?.trim());
      }
      projectData.showBeforeAfter = projectFormData.showBeforeAfter || false;
      if (projectFormData.beforeState?.trim()) projectData.beforeState = projectFormData.beforeState.trim();
      if (projectFormData.afterState?.trim()) projectData.afterState = projectFormData.afterState.trim();
      if (projectFormData.architectureDescription?.trim()) projectData.architectureDescription = projectFormData.architectureDescription.trim();
      if (projectFormData.architectureDiagram?.url?.trim()) {
        projectData.architectureDiagram = {
          url: projectFormData.architectureDiagram.url.trim(),
          alt: projectFormData.architectureDiagram.alt?.trim() || "",
        };
      }
      if (projectFormData.toolsUsed && projectFormData.toolsUsed.length > 0) {
        projectData.toolsUsed = projectFormData.toolsUsed.filter((t: string) => t.trim());
      }
      if (projectFormData.metrics && projectFormData.metrics.length > 0) {
        projectData.metrics = projectFormData.metrics.filter((m: any) => m.type && m.value?.trim());
      }
      if (projectFormData.demoType) projectData.demoType = projectFormData.demoType;
      if (projectFormData.demoUrl?.trim()) projectData.demoUrl = projectFormData.demoUrl.trim();
      if (projectFormData.videoUrl?.trim()) projectData.videoUrl = projectFormData.videoUrl.trim();
      if (projectFormData.screenshots && projectFormData.screenshots.length > 0) {
        projectData.screenshots = projectFormData.screenshots.filter((s: any) => s.url?.trim());
      }
      if (projectFormData.githubRepo?.url?.trim()) {
        projectData.githubRepo = {
          url: projectFormData.githubRepo.url.trim(),
          isPublic: projectFormData.githubRepo.isPublic || false,
        };
      }
      if (projectFormData.metaTitle?.trim()) projectData.metaTitle = projectFormData.metaTitle.trim();
      if (projectFormData.metaDescription?.trim()) projectData.metaDescription = projectFormData.metaDescription.trim();
      if (projectFormData.canonicalUrl?.trim()) projectData.canonicalUrl = projectFormData.canonicalUrl.trim();
      if (projectFormData.openGraphImage?.url?.trim()) {
        projectData.openGraphImage = {
          url: projectFormData.openGraphImage.url.trim(),
          alt: projectFormData.openGraphImage.alt?.trim() || "",
        };
      }
      if (projectFormData.schemaType) projectData.schemaType = projectFormData.schemaType;
      if (projectFormData.author?.name?.trim()) {
        projectData.author = {
          name: projectFormData.author.name.trim(),
          bio: projectFormData.author.bio?.trim() || '',
          profileImage: projectFormData.author.profileImage?.trim() || '',
        };
      }
      if (projectFormData.publishedAt) {
        projectData.publishedAt = new Date(projectFormData.publishedAt).toISOString();
      }
      projectData.featured = projectFormData.featured || false;
      projectData.sortPriority = projectFormData.sortPriority || 0;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        await loadProjects();
        setEditingProjectId(null);
        setActiveTab("projects-list");
        toast({
          title: "Project saved",
          description: `Project has been ${editingProjectId ? "updated" : "created"} successfully.`,
        });
      } else {
        let errorMessage = "Failed to save project";
        try {
          const error = await response.json();
          if (error.errors && Array.isArray(error.errors)) {
            errorMessage = error.errors.join(', ');
          } else if (error.message) {
            errorMessage = error.message;
          }
        } catch (parseError) {
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
        description: error.message || "Failed to save project",
        variant: "destructive",
      });
      console.error("Project save error:", error);
    }
  };

  const handleEditProject = (project: any) => {
    try {
      setEditingProjectId(project._id);
      setActiveTab("project-form");
      setProjectFormData({
        title: project.title || "",
        slug: project.slug || "",
        tagline: project.tagline || "",
        projectType: project.projectType || "Internal Project",
        status: project.status || "Draft",
        visibility: project.visibility || "Public",
        primaryCategory: project.primaryCategory || "",
        dataTags: Array.isArray(project.dataTags) ? project.dataTags : [],
        industryRelevance: project.industryRelevance || "",
        problemSummary: project.problemSummary || "",
        whoFacesProblem: Array.isArray(project.whoFacesProblem) ? project.whoFacesProblem : [],
        whyExistingSolutionsFail: project.whyExistingSolutionsFail || "",
        solutionSummary: project.solutionSummary || "",
        workflowSteps: Array.isArray(project.workflowSteps) ? project.workflowSteps : [],
        showBeforeAfter: project.showBeforeAfter || false,
        beforeState: project.beforeState || "",
        afterState: project.afterState || "",
        architectureDescription: project.architectureDescription || "",
        architectureDiagram: {
          url: project.architectureDiagram?.url || "",
          alt: project.architectureDiagram?.alt || "",
        },
        toolsUsed: Array.isArray(project.toolsUsed) ? project.toolsUsed : [],
        metrics: Array.isArray(project.metrics) ? project.metrics : [],
        demoType: project.demoType || "",
        demoUrl: project.demoUrl || "",
        videoUrl: project.videoUrl || "",
        screenshots: Array.isArray(project.screenshots) ? project.screenshots : [],
        githubRepo: {
          url: project.githubRepo?.url || "",
          isPublic: project.githubRepo?.isPublic !== undefined ? project.githubRepo.isPublic : true,
        },
        metaTitle: project.metaTitle || "",
        metaDescription: project.metaDescription || "",
        canonicalUrl: project.canonicalUrl || "",
        openGraphImage: {
          url: project.openGraphImage?.url || "",
          alt: project.openGraphImage?.alt || "",
        },
        schemaType: project.schemaType || "Project",
        author: {
          name: project.author?.name || "",
          bio: project.author?.bio || "",
          profileImage: project.author?.profileImage || "",
        },
        publishedAt: project.publishedAt ? new Date(project.publishedAt).toISOString().split('T')[0] : "",
        featured: project.featured || false,
        sortPriority: project.sortPriority || 0,
      });
    } catch (error) {
      console.error("Error setting project form data:", error);
      toast({
        title: "Error",
        description: "Failed to load project data for editing",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await loadProjects();
        toast({
          title: "Project deleted",
          description: "Project has been deleted successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete project",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  const handleNewProject = () => {
    setEditingProjectId(null);
    setActiveTab("project-form");
    setProjectFormData({
      title: "",
      slug: "",
      tagline: "",
      projectType: "Internal Project",
      status: "Draft",
      visibility: "Public",
      primaryCategory: "",
      dataTags: [],
      industryRelevance: "",
      problemSummary: "",
      whoFacesProblem: [],
      whyExistingSolutionsFail: "",
      solutionSummary: "",
      workflowSteps: [],
      showBeforeAfter: false,
      beforeState: "",
      afterState: "",
      architectureDescription: "",
      architectureDiagram: { url: "", alt: "" },
      toolsUsed: [],
      metrics: [],
      demoType: "",
      demoUrl: "",
      videoUrl: "",
      screenshots: [],
      githubRepo: { url: "", isPublic: true },
      metaTitle: "",
      metaDescription: "",
      canonicalUrl: "",
      openGraphImage: { url: "", alt: "" },
      schemaType: "Project",
      author: { name: "", bio: "", profileImage: "" },
      publishedAt: "",
      featured: false,
      sortPriority: 0,
    });
  };

  const wordCount = articleFormData.content
    ? articleFormData.content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().split(' ').filter(w => w.length > 0).length
    : 0;
  const readingTime = Math.ceil(wordCount / 200);
  const seoScore = calculateSEO();

  if (authLoading) {
    return (
      <div className="pt-24 pb-16 min-h-screen">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center py-20">
            <div className="text-muted-foreground">Loading admin panel...</div>
          </div>
        </div>
      </div>
    );
  }

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
            <TabsTrigger value="users">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="contact-submissions">
              <Mail className="w-4 h-4 mr-2" />
              Contact Forms
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
                            {article.featured && (
                              <Badge variant="default" className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                                Featured
                              </Badge>
                            )}
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

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="space-y-0.5">
                            <Label htmlFor="featured">Featured Article</Label>
                            <p className="text-xs text-muted-foreground">
                              Featured articles appear first in the articles list
                            </p>
                          </div>
                          <Switch
                            id="featured"
                            checked={articleFormData.featured || false}
                            onCheckedChange={(checked) => setArticleFormData({ ...articleFormData, featured: checked })}
                          />
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

          {/* Users Management Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>
                      {users.length} user{users.length !== 1 ? "s" : ""} total
                    </CardDescription>
                  </div>
                  <Button onClick={loadUsers} variant="outline">
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No users found.</p>
                    </div>
                  ) : (
                    users.map((user) => (
                      <div
                        key={user._id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{user.name}</h3>
                            <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>
                              {user.role === 'admin' ? (
                                <>
                                  <Shield className="w-3 h-3 mr-1" />
                                  Admin
                                </>
                              ) : (
                                'User'
                              )}
                            </Badge>
                            {user.googleId && (
                              <Badge variant="secondary" className="text-xs">
                                Google
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Joined: {new Date(user.createdAt).toLocaleDateString()}
                            {user.updatedAt && user.updatedAt !== user.createdAt && (
                              <> • Last updated: {new Date(user.updatedAt).toLocaleDateString()}</>
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Select
                            value={user.role}
                            onValueChange={(value: 'user' | 'admin') => {
                              if (user._id === users.find(u => u.role === 'admin')?._id && value === 'user') {
                                toast({
                                  title: "Warning",
                                  description: "You cannot remove your own admin role",
                                  variant: "destructive",
                                });
                                return;
                              }
                              handleUpdateUserRole(user._id, value);
                            }}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Submissions Tab */}
          <TabsContent value="contact-submissions">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Contact Form Submissions</CardTitle>
                    <CardDescription>
                      {contactSubmissions.length} submission{contactSubmissions.length !== 1 ? "s" : ""} total
                    </CardDescription>
                  </div>
                  <Button onClick={loadContactSubmissions} variant="outline">
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contactSubmissions.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No contact form submissions yet.</p>
                    </div>
                  ) : (
                    contactSubmissions.map((submission) => (
                      <div
                        key={submission._id}
                        className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{submission.name}</h3>
                              <Badge variant="outline">{submission.role}</Badge>
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <p><strong>Email:</strong> <a href={`mailto:${submission.email}`} className="text-primary hover:underline">{submission.email}</a></p>
                              <p><strong>Company:</strong> {submission.company}</p>
                              <p><strong>Use Case:</strong> {submission.useCase}</p>
                              {submission.budget && (
                                <p><strong>Budget:</strong> {submission.budget}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground ml-4">
                            {new Date(submission.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm font-medium mb-1">Details:</p>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{submission.details}</p>
                        </div>
                        {submission.ipAddress && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            IP: {submission.ipAddress}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects List Tab */}
          <TabsContent value="projects-list">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Projects</CardTitle>
                    <CardDescription>
                      {projects.length} project{projects.length !== 1 ? "s" : ""} total
                    </CardDescription>
                  </div>
                  <Button onClick={handleNewProject}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Project
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No projects yet. Create your first one!</p>
                    </div>
                  ) : (
                    projects.map((project) => (
                      <div
                        key={project._id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{project.title}</h3>
                            {project.featured && (
                              <Badge variant="default" className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                                Featured
                              </Badge>
                            )}
                            <Badge variant={project.status === 'Published' ? 'default' : 'outline'}>
                              {project.status}
                            </Badge>
                            {project.projectType && (
                              <Badge variant="secondary" className="text-xs">
                                {project.projectType}
                              </Badge>
                            )}
                          </div>
                          {project.tagline && (
                            <p className="text-sm text-muted-foreground mb-1">
                              {project.tagline}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground">
                            Slug: /projects/{project.slug}
                            {project.sortPriority !== 0 && ` • Priority: ${project.sortPriority}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditProject(project)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteProject(project._id)}
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

          {/* Project Form Tab */}
          <TabsContent value="project-form">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{editingProjectId ? "Edit Project" : "New Project"}</CardTitle>
                    <Button variant="outline" onClick={() => setActiveTab("projects-list")}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => { e.preventDefault(); handleSaveProject(); }} className="space-y-6">
                    {/* Core Content Fields */}
                    <div className="space-y-4 border-b pb-6">
                      <h3 className="text-lg font-semibold">Core Information</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="projectTitle">Project Title (H1) *</Label>
                        <Input
                          id="projectTitle"
                          value={projectFormData.title}
                          onChange={(e) => handleProjectTitleChange(e.target.value)}
                          placeholder="Enter project title"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="projectSlug">Slug / URL *</Label>
                        <Input
                          id="projectSlug"
                          value={projectFormData.slug}
                          onChange={(e) => setProjectFormData({ ...projectFormData, slug: e.target.value })}
                          placeholder="project-slug"
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          URL: /projects/{projectFormData.slug || 'project-slug'}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tagline">Short Tagline (1-2 lines)</Label>
                        <Textarea
                          id="tagline"
                          value={projectFormData.tagline}
                          onChange={(e) => setProjectFormData({ ...projectFormData, tagline: e.target.value })}
                          placeholder="Brief description of the project"
                          rows={2}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="projectType">Project Type</Label>
                          <Select
                            value={projectFormData.projectType}
                            onValueChange={(value) => setProjectFormData({ ...projectFormData, projectType: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Internal Project">Internal Project</SelectItem>
                              <SelectItem value="R&D Experiment">R&D Experiment</SelectItem>
                              <SelectItem value="Open-source">Open-source</SelectItem>
                              <SelectItem value="Demo / Prototype">Demo / Prototype</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="projectStatus">Status</Label>
                          <Select
                            value={projectFormData.status}
                            onValueChange={(value) => setProjectFormData({ ...projectFormData, status: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Draft">Draft</SelectItem>
                              <SelectItem value="Published">Published</SelectItem>
                              <SelectItem value="Archived">Archived</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                          <Label htmlFor="projectVisibility">Visibility</Label>
                          <p className="text-xs text-muted-foreground">
                            Public projects are visible to everyone
                          </p>
                        </div>
                        <Select
                          value={projectFormData.visibility}
                          onValueChange={(value) => setProjectFormData({ ...projectFormData, visibility: value })}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Public">Public</SelectItem>
                            <SelectItem value="Private">Private</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Categorization */}
                    <div className="space-y-4 border-b pb-6">
                      <h3 className="text-lg font-semibold">Categorization & Filters</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="primaryCategory">Primary Category</Label>
                        <Input
                          id="primaryCategory"
                          value={projectFormData.primaryCategory}
                          onChange={(e) => setProjectFormData({ ...projectFormData, primaryCategory: e.target.value })}
                          placeholder="e.g., AI Automation, Data Processing"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dataTags">Data / RAG Tags (comma-separated)</Label>
                        <Input
                          id="dataTags"
                          value={projectFormData.dataTags?.join(', ') || ''}
                          onChange={(e) => setProjectFormData({ 
                            ...projectFormData, 
                            dataTags: e.target.value.split(',').map(t => t.trim()).filter(t => t) 
                          })}
                          placeholder="tag1, tag2, tag3"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="industryRelevance">Industry Relevance (Optional)</Label>
                        <Input
                          id="industryRelevance"
                          value={projectFormData.industryRelevance}
                          onChange={(e) => setProjectFormData({ ...projectFormData, industryRelevance: e.target.value })}
                          placeholder="e.g., Healthcare, Finance, E-commerce"
                        />
                      </div>
                    </div>

                    {/* Problem Statement */}
                    <div className="space-y-4 border-b pb-6">
                      <h3 className="text-lg font-semibold">Problem Statement</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="problemSummary">Problem Summary</Label>
                        <Textarea
                          id="problemSummary"
                          value={projectFormData.problemSummary}
                          onChange={(e) => setProjectFormData({ ...projectFormData, problemSummary: e.target.value })}
                          placeholder="Brief summary of the problem"
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="whoFacesProblem">Who Faces This Problem? (one per line)</Label>
                        <Textarea
                          id="whoFacesProblem"
                          value={projectFormData.whoFacesProblem?.join('\n') || ''}
                          onChange={(e) => setProjectFormData({ 
                            ...projectFormData, 
                            whoFacesProblem: e.target.value.split('\n').filter(w => w.trim()) 
                          })}
                          placeholder="Enter each group on a new line"
                          rows={4}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="whyExistingSolutionsFail">Why Existing Solutions Fail?</Label>
                        <Textarea
                          id="whyExistingSolutionsFail"
                          value={projectFormData.whyExistingSolutionsFail}
                          onChange={(e) => setProjectFormData({ ...projectFormData, whyExistingSolutionsFail: e.target.value })}
                          placeholder="Explain why current solutions don't work"
                          rows={4}
                        />
                      </div>
                    </div>

                    {/* Solution Overview */}
                    <div className="space-y-4 border-b pb-6">
                      <h3 className="text-lg font-semibold">Solution Overview</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="solutionSummary">Solution Summary (Markdown supported)</Label>
                        <Textarea
                          id="solutionSummary"
                          value={projectFormData.solutionSummary}
                          onChange={(e) => setProjectFormData({ ...projectFormData, solutionSummary: e.target.value })}
                          placeholder="Describe the solution in detail. Markdown supported."
                          rows={10}
                          className="font-mono text-sm"
                        />
                      </div>

                      <div className="space-y-4">
                        <Label>Key Workflow Steps</Label>
                        {projectFormData.workflowSteps?.map((step: any, idx: number) => (
                          <div key={idx} className="p-4 border rounded-lg space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Step {idx + 1}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const newSteps = projectFormData.workflowSteps.filter((_: any, i: number) => i !== idx);
                                  setProjectFormData({ ...projectFormData, workflowSteps: newSteps });
                                }}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                            <Input
                              placeholder="Step title"
                              value={step.title || ''}
                              onChange={(e) => {
                                const newSteps = [...projectFormData.workflowSteps];
                                newSteps[idx] = { ...step, title: e.target.value };
                                setProjectFormData({ ...projectFormData, workflowSteps: newSteps });
                              }}
                            />
                            <Textarea
                              placeholder="Step description"
                              value={step.description || ''}
                              onChange={(e) => {
                                const newSteps = [...projectFormData.workflowSteps];
                                newSteps[idx] = { ...step, description: e.target.value };
                                setProjectFormData({ ...projectFormData, workflowSteps: newSteps });
                              }}
                              rows={2}
                            />
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setProjectFormData({
                              ...projectFormData,
                              workflowSteps: [...(projectFormData.workflowSteps || []), { title: "", description: "" }]
                            });
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Workflow Step
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                          <Label htmlFor="showBeforeAfter">Show Before vs After</Label>
                          <p className="text-xs text-muted-foreground">
                            Display before/after comparison
                          </p>
                        </div>
                        <Switch
                          id="showBeforeAfter"
                          checked={projectFormData.showBeforeAfter}
                          onCheckedChange={(checked) => setProjectFormData({ ...projectFormData, showBeforeAfter: checked })}
                        />
                      </div>

                      {projectFormData.showBeforeAfter && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="beforeState">Before State</Label>
                            <Textarea
                              id="beforeState"
                              value={projectFormData.beforeState}
                              onChange={(e) => setProjectFormData({ ...projectFormData, beforeState: e.target.value })}
                              placeholder="Describe the state before"
                              rows={4}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="afterState">After State</Label>
                            <Textarea
                              id="afterState"
                              value={projectFormData.afterState}
                              onChange={(e) => setProjectFormData({ ...projectFormData, afterState: e.target.value })}
                              placeholder="Describe the state after"
                              rows={4}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* System Architecture */}
                    <div className="space-y-4 border-b pb-6">
                      <h3 className="text-lg font-semibold">System Architecture</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="architectureDescription">Architecture Description (Markdown)</Label>
                        <Textarea
                          id="architectureDescription"
                          value={projectFormData.architectureDescription}
                          onChange={(e) => setProjectFormData({ ...projectFormData, architectureDescription: e.target.value })}
                          placeholder="Describe the system architecture. Markdown supported."
                          rows={10}
                          className="font-mono text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="architectureDiagramUrl">Architecture Diagram URL</Label>
                        <Input
                          id="architectureDiagramUrl"
                          value={projectFormData.architectureDiagram?.url || ''}
                          onChange={(e) => setProjectFormData({ 
                            ...projectFormData, 
                            architectureDiagram: { 
                              url: e.target.value,
                              alt: projectFormData.architectureDiagram?.alt || ""
                            } 
                          })}
                          placeholder="https://example.com/diagram.png"
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
                                setProjectFormData({ 
                                  ...projectFormData, 
                                  architectureDiagram: { 
                                    url: reader.result as string,
                                    alt: projectFormData.architectureDiagram?.alt || ""
                                  } 
                                });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="cursor-pointer"
                        />
                        {projectFormData.architectureDiagram?.url && (
                          <div className="mt-2">
                            <img 
                              src={projectFormData.architectureDiagram.url} 
                              alt="Preview" 
                              className="w-32 h-32 object-cover rounded-lg border border-border"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="architectureDiagramAlt">Diagram Alt Text</Label>
                        <Input
                          id="architectureDiagramAlt"
                          value={projectFormData.architectureDiagram?.alt || ''}
                          onChange={(e) => setProjectFormData({ 
                            ...projectFormData, 
                            architectureDiagram: { 
                              url: projectFormData.architectureDiagram?.url || "",
                              alt: e.target.value
                            } 
                          })}
                          placeholder="Descriptive alt text for accessibility"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="toolsUsed">Tools Used (comma-separated)</Label>
                        <Input
                          id="toolsUsed"
                          value={projectFormData.toolsUsed?.join(', ') || ''}
                          onChange={(e) => setProjectFormData({ 
                            ...projectFormData, 
                            toolsUsed: e.target.value.split(',').map(t => t.trim()).filter(t => t) 
                          })}
                          placeholder="Python, React, MongoDB, etc."
                        />
                      </div>
                    </div>

                    {/* Results & Benchmarks */}
                    <div className="space-y-4 border-b pb-6">
                      <h3 className="text-lg font-semibold">Results & Benchmarks</h3>
                      
                      {projectFormData.metrics?.map((metric: any, idx: number) => (
                        <div key={idx} className="p-4 border rounded-lg space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Metric {idx + 1}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newMetrics = projectFormData.metrics.filter((_: any, i: number) => i !== idx);
                                setProjectFormData({ ...projectFormData, metrics: newMetrics });
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Select
                              value={metric.type || ''}
                              onValueChange={(value) => {
                                const newMetrics = [...projectFormData.metrics];
                                newMetrics[idx] = { ...metric, type: value };
                                setProjectFormData({ ...projectFormData, metrics: newMetrics });
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Metric Type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Time Saved">Time Saved</SelectItem>
                                <SelectItem value="Cost Reduced">Cost Reduced</SelectItem>
                                <SelectItem value="Speed Improved">Speed Improved</SelectItem>
                                <SelectItem value="Accuracy Improved">Accuracy Improved</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input
                              placeholder="Value (e.g., 50%, 2x, $10k)"
                              value={metric.value || ''}
                              onChange={(e) => {
                                const newMetrics = [...projectFormData.metrics];
                                newMetrics[idx] = { ...metric, value: e.target.value };
                                setProjectFormData({ ...projectFormData, metrics: newMetrics });
                              }}
                            />
                          </div>
                          <Input
                            placeholder="Context (e.g., Internal testing / Demo environment)"
                            value={metric.context || ''}
                            onChange={(e) => {
                              const newMetrics = [...projectFormData.metrics];
                              newMetrics[idx] = { ...metric, context: e.target.value };
                              setProjectFormData({ ...projectFormData, metrics: newMetrics });
                            }}
                          />
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setProjectFormData({
                            ...projectFormData,
                            metrics: [...(projectFormData.metrics || []), { type: "", value: "", context: "" }]
                          });
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Metric
                      </Button>
                    </div>

                    {/* Demo & Proof */}
                    <div className="space-y-4 border-b pb-6">
                      <h3 className="text-lg font-semibold">Demo & Proof</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="demoType">Demo Type</Label>
                        <Select
                          value={projectFormData.demoType}
                          onValueChange={(value) => setProjectFormData({ ...projectFormData, demoType: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select demo type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Live URL">Live URL</SelectItem>
                            <SelectItem value="Video">Video</SelectItem>
                            <SelectItem value="Screenshots">Screenshots</SelectItem>
                            <SelectItem value="GitHub Repo">GitHub Repo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {projectFormData.demoType === 'Live URL' && (
                        <div className="space-y-2">
                          <Label htmlFor="demoUrl">Demo URL</Label>
                          <Input
                            id="demoUrl"
                            value={projectFormData.demoUrl}
                            onChange={(e) => setProjectFormData({ ...projectFormData, demoUrl: e.target.value })}
                            placeholder="https://demo.example.com"
                          />
                        </div>
                      )}

                      {projectFormData.demoType === 'Video' && (
                        <div className="space-y-2">
                          <Label htmlFor="videoUrl">Video URL (Loom / YouTube embed URL)</Label>
                          <Input
                            id="videoUrl"
                            value={projectFormData.videoUrl}
                            onChange={(e) => setProjectFormData({ ...projectFormData, videoUrl: e.target.value })}
                            placeholder="https://www.loom.com/embed/..."
                          />
                        </div>
                      )}

                      {projectFormData.demoType === 'Screenshots' && (
                        <div className="space-y-4">
                          <Label>Screenshots</Label>
                          {projectFormData.screenshots?.map((screenshot: any, idx: number) => (
                            <div key={idx} className="p-4 border rounded-lg space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Screenshot {idx + 1}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const newScreenshots = projectFormData.screenshots.filter((_: any, i: number) => i !== idx);
                                    setProjectFormData({ ...projectFormData, screenshots: newScreenshots });
                                  }}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                              <Input
                                placeholder="Image URL"
                                value={screenshot.url || ''}
                                onChange={(e) => {
                                  const newScreenshots = [...projectFormData.screenshots];
                                  newScreenshots[idx] = { ...screenshot, url: e.target.value };
                                  setProjectFormData({ ...projectFormData, screenshots: newScreenshots });
                                }}
                              />
                              <Input
                                placeholder="Alt text"
                                value={screenshot.alt || ''}
                                onChange={(e) => {
                                  const newScreenshots = [...projectFormData.screenshots];
                                  newScreenshots[idx] = { ...screenshot, alt: e.target.value };
                                  setProjectFormData({ ...projectFormData, screenshots: newScreenshots });
                                }}
                              />
                              <Input
                                placeholder="Caption (optional)"
                                value={screenshot.caption || ''}
                                onChange={(e) => {
                                  const newScreenshots = [...projectFormData.screenshots];
                                  newScreenshots[idx] = { ...screenshot, caption: e.target.value };
                                  setProjectFormData({ ...projectFormData, screenshots: newScreenshots });
                                }}
                              />
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setProjectFormData({
                                ...projectFormData,
                                screenshots: [...(projectFormData.screenshots || []), { url: "", alt: "", caption: "" }]
                              });
                            }}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Screenshot
                          </Button>
                        </div>
                      )}

                      {projectFormData.demoType === 'GitHub Repo' && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="githubRepoUrl">GitHub Repository URL</Label>
                            <Input
                              id="githubRepoUrl"
                              value={projectFormData.githubRepo?.url || ''}
                              onChange={(e) => setProjectFormData({ 
                                ...projectFormData, 
                                githubRepo: { 
                                  url: e.target.value,
                                  isPublic: projectFormData.githubRepo?.isPublic || true
                                } 
                              })}
                              placeholder="https://github.com/username/repo"
                            />
                          </div>
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <Label htmlFor="githubRepoPublic">Public Repository</Label>
                            <Switch
                              id="githubRepoPublic"
                              checked={projectFormData.githubRepo?.isPublic !== false}
                              onCheckedChange={(checked) => setProjectFormData({ 
                                ...projectFormData, 
                                githubRepo: { 
                                  url: projectFormData.githubRepo?.url || "",
                                  isPublic: checked
                                } 
                              })}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* SEO & Metadata */}
                    <div className="space-y-4 border-b pb-6">
                      <h3 className="text-lg font-semibold">SEO & Metadata</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="projectMetaTitle">
                          Meta Title
                          <span className="text-xs text-muted-foreground ml-2">
                            {projectFormData.metaTitle?.length || 0}/60
                          </span>
                        </Label>
                        <Input
                          id="projectMetaTitle"
                          value={projectFormData.metaTitle}
                          onChange={(e) => setProjectFormData({ ...projectFormData, metaTitle: e.target.value })}
                          placeholder="SEO title (50-60 characters)"
                          maxLength={60}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="projectMetaDescription">
                          Meta Description
                          <span className="text-xs text-muted-foreground ml-2">
                            {projectFormData.metaDescription?.length || 0}/160
                          </span>
                        </Label>
                        <Textarea
                          id="projectMetaDescription"
                          value={projectFormData.metaDescription}
                          onChange={(e) => setProjectFormData({ ...projectFormData, metaDescription: e.target.value })}
                          placeholder="SEO description (140-160 characters)"
                          rows={3}
                          maxLength={160}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="canonicalUrl">Canonical URL</Label>
                        <Input
                          id="canonicalUrl"
                          value={projectFormData.canonicalUrl}
                          onChange={(e) => setProjectFormData({ ...projectFormData, canonicalUrl: e.target.value })}
                          placeholder="https://importai.in/projects/project-slug"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="openGraphImageUrl">OpenGraph Image URL</Label>
                        <Input
                          id="openGraphImageUrl"
                          value={projectFormData.openGraphImage?.url || ''}
                          onChange={(e) => setProjectFormData({ 
                            ...projectFormData, 
                            openGraphImage: { 
                              url: e.target.value,
                              alt: projectFormData.openGraphImage?.alt || ""
                            } 
                          })}
                          placeholder="https://example.com/og-image.png"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="projectSchemaType">Schema Type</Label>
                        <Select
                          value={projectFormData.schemaType}
                          onValueChange={(value) => setProjectFormData({ ...projectFormData, schemaType: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SoftwareApplication">SoftwareApplication</SelectItem>
                            <SelectItem value="TechArticle">TechArticle</SelectItem>
                            <SelectItem value="Project">Project</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Author & Publishing */}
                    <div className="space-y-4 border-b pb-6">
                      <h3 className="text-lg font-semibold">Author & Publishing</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="authorName">Author Name</Label>
                          <Input
                            id="authorName"
                            value={projectFormData.author?.name || ''}
                            onChange={(e) => setProjectFormData({ 
                              ...projectFormData, 
                              author: { 
                                name: e.target.value,
                                bio: projectFormData.author?.bio || "",
                                profileImage: projectFormData.author?.profileImage || ""
                              } 
                            })}
                            placeholder="Author name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="projectPublishedAt">Publish Date</Label>
                          <Input
                            id="projectPublishedAt"
                            type="date"
                            value={projectFormData.publishedAt}
                            onChange={(e) => setProjectFormData({ ...projectFormData, publishedAt: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Admin-Only Controls */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Admin Controls</h3>
                      
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                          <Label htmlFor="projectFeatured">Featured Project</Label>
                          <p className="text-xs text-muted-foreground">
                            Featured projects appear first in listings
                          </p>
                        </div>
                        <Switch
                          id="projectFeatured"
                          checked={projectFormData.featured || false}
                          onCheckedChange={(checked) => setProjectFormData({ ...projectFormData, featured: checked })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="sortPriority">Sort Priority</Label>
                        <Input
                          id="sortPriority"
                          type="number"
                          value={projectFormData.sortPriority}
                          onChange={(e) => setProjectFormData({ ...projectFormData, sortPriority: parseInt(e.target.value) || 0 })}
                          placeholder="0"
                        />
                        <p className="text-xs text-muted-foreground">
                          Higher numbers appear first. Default: 0
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-6">
                      <Button type="button" variant="outline" onClick={() => setActiveTab("projects-list")}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        <Save className="w-4 h-4 mr-2" />
                        {editingProjectId ? "Update" : "Create"} Project
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

