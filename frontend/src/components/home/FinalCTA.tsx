import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Calendar, ArrowRight, Sparkles, Send } from "lucide-react";
import { getApiUrl } from "@/lib/api";

export function FinalCTA() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    useCase: "",
    details: "",
  });
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get API URL using helper function
      const apiUrl = getApiUrl();

      const response = await fetch(`${apiUrl}/api/contact/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Server error" }));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Show success message
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
          details: "",
        });
        
        // Reset form fields safely
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
      [id.replace("cta-", "")]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      useCase: value,
    }));
  };

  return (
    <section className="py-8 md:py-10 bg-gradient-hero relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]"></div>
      <div className="absolute top-10 left-1/3 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-10 right-1/3 w-80 h-80 bg-accent/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Headline */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full mb-3 text-xs">
            <Sparkles className="w-3 h-3" />
            <span className="font-medium">Ready to automate?</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Time is money.{" "}
            <span className="text-gradient">We save you both.</span>
          </h2>
          
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
            See exactly how AI can transform your workflows in a free consultation tailored to your business.
          </p>
        </div>

        {/* Two Column Layout: Form Left, Calendly Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Contact Form - Left */}
          <div className="glass-card p-5 md:p-6">
            <h3 className="text-xl font-bold mb-4">Send us a message</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Fill out the form and we'll get back to you within 24 hours.
            </p>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="cta-name" className="text-xs">Name *</Label>
                  <Input 
                    id="cta-name" 
                    required 
                    placeholder="Your full name" 
                    className="h-9 text-sm"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="cta-email" className="text-xs">Email *</Label>
                  <Input 
                    id="cta-email" 
                    type="email" 
                    required 
                    placeholder="you@company.com" 
                    className="h-9 text-sm"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="cta-company" className="text-xs">Company *</Label>
                  <Input 
                    id="cta-company" 
                    required 
                    placeholder="Company name" 
                    className="h-9 text-sm"
                    value={formData.company}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="cta-role" className="text-xs">Role *</Label>
                  <Input 
                    id="cta-role" 
                    required 
                    placeholder="Your job title" 
                    className="h-9 text-sm"
                    value={formData.role}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="cta-use-case" className="text-xs">Use Case *</Label>
                <Select required value={formData.useCase} onValueChange={handleSelectChange}>
                  <SelectTrigger className="h-9 text-sm">
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
                <Label htmlFor="cta-details" className="text-xs">Project Details *</Label>
                <Textarea 
                  id="cta-details" 
                  required 
                  placeholder="Tell us about your current workflow and pain points..."
                  className="min-h-[100px] text-sm"
                  value={formData.details}
                  onChange={handleInputChange}
                />
              </div>

              <Button 
                type="submit" 
                variant="gradient" 
                size="default" 
                className="w-full text-sm" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>Sending...</>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Calendly Widget - Right */}
          <div className="glass-card p-5 md:p-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-2">Or book a call</h3>
              <p className="text-sm text-muted-foreground">
                Schedule a 30-minute consultation to discuss your automation needs.
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

        {/* Footer Note */}
        <p className="text-xs text-muted-foreground mt-6 text-center">
          No sales pitch. Just a genuine conversation about your automation needs.
        </p>
      </div>
    </section>
  );
}