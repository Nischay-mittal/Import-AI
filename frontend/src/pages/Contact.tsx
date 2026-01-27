import { useState, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Mail, MessageSquare, Send, MapPin, Clock } from "lucide-react";
import { getApiUrl } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Contact() {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    useCase: "",
    budget: "",
    details: "",
  });
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const apiUrl = getApiUrl();

      const response = await fetch(`${apiUrl}/api/contact/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          role: formData.role,
          useCase: formData.useCase,
          budget: formData.budget || "",
          details: formData.details,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Server error" }));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Form submitted successfully!",
          description: data.message || "We'll get back to you within 24 hours.",
        });
        
        // Reset form data
        setFormData({
          name: "",
          email: "",
          company: "",
          role: "",
          useCase: "",
          budget: "",
          details: "",
        });
        
        // Reset form fields
        if (formRef.current) {
          formRef.current.reset();
        }
      } else {
        throw new Error(data.message || "Failed to send message");
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to send message. Please try again later.";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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
      {/* Header */}
      <section className="py-16 bg-gradient-hero">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Let's <span className="text-gradient">talk automation</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to transform your workflows? We're here to help you identify the best automation opportunities for your business.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4">Tell us about your project</h2>
                <p className="text-muted-foreground">
                  The more details you share, the better we can tailor our recommendations to your specific needs.
                </p>
              </div>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input 
                      id="name" 
                      required 
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Work Email *</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      required 
                      placeholder="you@company.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company">Company *</Label>
                    <Input 
                      id="company" 
                      required 
                      placeholder="Your company name"
                      value={formData.company}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role *</Label>
                    <Input 
                      id="role" 
                      required 
                      placeholder="Your job title"
                      value={formData.role}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="use-case">Use Case *</Label>
                  <Select 
                    required 
                    value={formData.useCase}
                    onValueChange={(value) => handleSelectChange("useCase", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="What would you like to automate?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="revenue">Revenue & Sales Automation</SelectItem>
                      <SelectItem value="support">Customer Support</SelectItem>
                      <SelectItem value="finance">Finance & Operations</SelectItem>
                      <SelectItem value="marketing">Marketing Automation</SelectItem>
                      <SelectItem value="hr">HR & Recruiting</SelectItem>
                      <SelectItem value="other">Other / Multiple Areas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="budget">Budget (Optional)</Label>
                  <Select 
                    value={formData.budget}
                    onValueChange={(value) => handleSelectChange("budget", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="What's your budget range?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-10k">Under $10k</SelectItem>
                      <SelectItem value="10k-25k">$10k - $25k</SelectItem>
                      <SelectItem value="25k-50k">$25k - $50k</SelectItem>
                      <SelectItem value="50k-100k">$50k - $100k</SelectItem>
                      <SelectItem value="100k-plus">$100k+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="details">Project Details *</Label>
                  <Textarea 
                    id="details" 
                    required 
                    placeholder="Tell us about your current workflow, pain points, and what you'd like to achieve..."
                    className="min-h-[120px]"
                    value={formData.details}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="consent" required />
                  <Label htmlFor="consent" className="text-sm">
                    I agree to receive communications from Import AI about my inquiry *
                  </Label>
                </div>

                <Button 
                  type="submit" 
                  variant="hero" 
                  size="lg" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>Sending...</>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-3" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Contact Info & Alternative */}
            <div className="space-y-8">
              {/* Contact Details */}
              <div className="glass-card p-8">
                <h3 className="text-xl font-bold mb-6">Get in touch</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <div className="font-medium">Email us directly</div>
                      <div className="text-muted-foreground text-sm">team@importai.in</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <div className="font-medium">Response time</div>
                      <div className="text-muted-foreground text-sm">Within 24 hours</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <div className="font-medium">Coverage</div>
                      <div className="text-muted-foreground text-sm">India, US, GB, CA, AU, DE, NL, SG, AE</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Demo CTA */}
              <div className="glass-card p-8">
                <div className="mb-4">
                  <Calendar className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2 text-center">Prefer a quick call?</h3>
                  <p className="text-muted-foreground mb-4 text-center text-sm">
                    Book a 30-minute demo call where we'll show you exactly how automation can work for your specific use case.
                  </p>
                </div>
                <div className="rounded-xl overflow-hidden shadow-xl bg-white">
                  <iframe
                    src="https://calendly.com/team-importai/30min?embed=true"
                    width="100%"
                    height="500"
                    frameBorder="0"
                    className="w-full"
                    title="Book a Free AI Consultation"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16">
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
              <Button
                onClick={handleBookConsultation}
                variant="gradient"
                size="default"
                className="px-6 py-3 shadow-md shadow-primary/30"
              >
                Book Free AI Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}