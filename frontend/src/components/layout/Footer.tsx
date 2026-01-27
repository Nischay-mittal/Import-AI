import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background-alt border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
              <img 
                src="/lovable-uploads/60f635ed-3fbe-4d07-b2aa-b6af5d734839.png" 
                alt="Import AI Logo" 
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
              />
              <div className="text-xl sm:text-2xl font-bold text-gradient">Import AI</div>
            </Link>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 max-w-md">
              We build AI systems that run your growth, sales, and operations on autopilot—so you can focus on strategy while automation handles execution.
            </p>
            <div className="flex space-x-4">
              <Button 
                variant="ghost" 
                size="icon"
                asChild
              >
                <a 
                  href="https://www.linkedin.com/company/import-ai-in/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                asChild
              >
                <a 
                  href="https://x.com/LetsImportAI" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="X (formerly Twitter)"
                >
                  <svg 
                    className="w-4 h-4" 
                    fill="currentColor" 
                    viewBox="0 0 24 24" 
                    aria-hidden="true"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                asChild
              >
                <a 
                  href="mailto:team@importai.in"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Services</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link to="/services" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Growth Systems
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Sales Systems
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Operations Systems
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Custom AI Agents
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Company</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link to="/about" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/case-studies" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center space-y-3 sm:space-y-4 md:space-y-0">
          <p className="text-muted-foreground text-xs sm:text-sm text-center md:text-left">
            Copyright © 2025, All Right Reserved
          </p>
          <div className="flex space-x-4 sm:space-x-6 text-xs sm:text-sm">
            <Link to="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}