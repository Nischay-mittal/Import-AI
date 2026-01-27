import { 
  Mail,
  Search,
  Users,
  FileSpreadsheet,
  FileText,
  TrendingUp,
  CheckCircle,
  Database,
  Bot,
  Zap
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function WhatWeAutomate() {
  return (
    <section className="py-32 bg-background relative overflow-hidden">
      {/* Minimal Animated Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '80px 80px',
            }}
          ></div>
        </div>
        
        {/* Subtle Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-primary/10 to-accent/8 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-tl from-accent/10 to-primary/8 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Systems in <span className="text-gradient">production</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Real AI automation systems we've built and deployed
          </p>
        </div>

        {/* System Diagram */}
        <div className="relative bg-muted/20 rounded-3xl p-12 border border-border/50 backdrop-blur-sm min-h-[600px]">
          <div className="grid grid-cols-12 gap-8 items-center relative z-10">
            {/* Left: Inputs */}
            <div className="col-span-4 space-y-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">
                Manual Work
              </h3>
              
              {/* Input 1: Outbound */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-background rounded-xl p-4 border-2 border-border hover:border-primary/40 transition-all cursor-help shadow-md hover:shadow-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Outbound</p>
                        <p className="text-xs text-muted-foreground">Email sequences</p>
                      </div>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Cold email sequences with personalization and A/B testing</p>
                </TooltipContent>
              </Tooltip>

              {/* Input 2: SEO */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-background rounded-xl p-4 border-2 border-border hover:border-primary/40 transition-all cursor-help shadow-md hover:shadow-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <Search className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">SEO</p>
                        <p className="text-xs text-muted-foreground">Content workflows</p>
                      </div>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>SEO content production and optimization workflows</p>
                </TooltipContent>
              </Tooltip>

              {/* Input 3: Sheets */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-background rounded-xl p-4 border-2 border-border hover:border-primary/40 transition-all cursor-help shadow-md hover:shadow-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <FileSpreadsheet className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Sheets</p>
                        <p className="text-xs text-muted-foreground">Data sources</p>
                      </div>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Spreadsheet data with automated extraction and validation</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Center: Processing Hub */}
            <div className="col-span-4 flex flex-col items-center justify-center">
              {/* Central Hub with Logo */}
              <div className="relative z-10">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 border-4 border-primary/50 flex items-center justify-center shadow-2xl shadow-primary/30 relative overflow-hidden">
                  {/* Pulsing rings */}
                  <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping"></div>
                  <div className="absolute inset-2 rounded-full border-2 border-accent/20 animate-ping" style={{ animationDelay: '0.5s' }}></div>
                  
                  {/* Logo */}
                  <div className="relative z-10 w-20 h-20 rounded-full bg-background flex items-center justify-center">
                    <img 
                      src="/Import AI Logo PNG.png" 
                      alt="Import AI" 
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                  
                  {/* Small orbiting icons */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg animate-float">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                </div>
                <p className="text-xs text-center mt-3 text-muted-foreground font-medium">
                  AI Processing
                </p>
              </div>
            </div>

            {/* Right: Outputs */}
            <div className="col-span-4 space-y-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6 text-right">
                Automated Results
              </h3>
              
              {/* Output 1: Lead Capture */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-4 border-2 border-primary/30 hover:border-primary/50 transition-all cursor-help shadow-lg hover:shadow-xl">
                    <div className="flex items-center justify-end gap-3 mb-2">
                      <div className="text-right">
                        <p className="text-sm font-semibold">Lead Capture</p>
                        <p className="text-xs text-muted-foreground">Qualified leads</p>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-1 mt-2">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-muted-foreground">Auto-qualified</span>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Multi-channel lead capture with CRM integration and qualification</p>
                </TooltipContent>
              </Tooltip>

              {/* Output 2: Performance Reports */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-4 border-2 border-primary/30 hover:border-primary/50 transition-all cursor-help shadow-lg hover:shadow-xl">
                    <div className="flex items-center justify-end gap-3 mb-2">
                      <div className="text-right">
                        <p className="text-sm font-semibold">Performance</p>
                        <p className="text-xs text-muted-foreground">Analytics & reports</p>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-1 mt-2">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-muted-foreground">Auto-generated</span>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Automated reporting with analytics, scheduled execution, and distribution</p>
                </TooltipContent>
              </Tooltip>

              {/* Output 3: CMS Content */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-4 border-2 border-primary/30 hover:border-primary/50 transition-all cursor-help shadow-lg hover:shadow-xl">
                    <div className="flex items-center justify-end gap-3 mb-2">
                      <div className="text-right">
                        <p className="text-sm font-semibold">CMS Content</p>
                        <p className="text-xs text-muted-foreground">Published content</p>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-1 mt-2">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-muted-foreground">Auto-published</span>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Automated content publishing to CMS with validation and quality checks</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Bottom: System Details */}
          <div className="mt-12 pt-8 border-t border-border/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-sm font-semibold mb-1">Growth & GTM</p>
                <p className="text-xs text-muted-foreground">Outbound, SEO, Lead capture</p>
              </div>
              <div>
                <p className="text-sm font-semibold mb-1">Operations</p>
                <p className="text-xs text-muted-foreground">Sheets → LLM → CMS pipelines</p>
              </div>
              <div>
                <p className="text-sm font-semibold mb-1">Multi-Agent</p>
                <p className="text-xs text-muted-foreground">LangGraph & LangChain systems</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
