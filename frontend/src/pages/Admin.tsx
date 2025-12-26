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
  MessageSquare
} from "lucide-react";

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
  const { isAuthenticated, isAdmin, token } = useAuth();
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
        </Tabs>
      </div>
    </div>
  );
}

