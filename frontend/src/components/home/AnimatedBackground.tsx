export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-gradient-hero">
      {/* Neural Network Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            animation: 'fade-in 1s ease-out'
          }}
        ></div>
      </div>
      
      {/* AI Agent Nodes - Neural Network */}
      {/* Top Left Network Cluster */}
      <div className="absolute top-32 left-20">
        <div className="relative">
          {/* Agent Nodes */}
          <div className="absolute w-4 h-4 bg-primary rounded-full animate-agent-pulse shadow-lg shadow-primary/50"></div>
          <div className="absolute top-8 left-8 w-4 h-4 bg-accent rounded-full animate-agent-pulse" style={{ animationDelay: '0.3s' }}></div>
          <div className="absolute top-4 left-12 w-3 h-3 bg-primary/80 rounded-full animate-agent-pulse" style={{ animationDelay: '0.6s' }}></div>
          {/* Connection Lines */}
          <svg className="absolute top-0 left-0 w-16 h-16 opacity-20">
            <line x1="8" y1="8" x2="16" y2="16" stroke="currentColor" strokeWidth="1" className="text-primary animate-network-pulse" />
            <line x1="8" y1="8" x2="20" y2="12" stroke="currentColor" strokeWidth="1" className="text-accent animate-network-pulse" style={{ animationDelay: '0.5s' }} />
          </svg>
        </div>
      </div>
      
      {/* Top Right Network Cluster */}
      <div className="absolute top-40 right-24">
        <div className="relative">
          <div className="absolute w-5 h-5 bg-accent rounded-full animate-agent-pulse shadow-lg shadow-accent/50"></div>
          <div className="absolute top-10 right-8 w-4 h-4 bg-primary rounded-full animate-agent-pulse" style={{ animationDelay: '0.4s' }}></div>
          <div className="absolute top-6 right-14 w-3 h-3 bg-accent/80 rounded-full animate-agent-pulse" style={{ animationDelay: '0.7s' }}></div>
          <svg className="absolute top-0 right-0 w-20 h-20 opacity-20">
            <line x1="10" y1="10" x2="16" y2="20" stroke="currentColor" strokeWidth="1" className="text-accent animate-network-pulse" />
          </svg>
        </div>
      </div>
      
      {/* Bottom Left Network Cluster */}
      <div className="absolute bottom-32 left-32">
        <div className="relative">
          <div className="absolute w-4 h-4 bg-primary rounded-full animate-agent-pulse shadow-lg shadow-primary/50"></div>
          <div className="absolute bottom-8 left-10 w-4 h-4 bg-accent rounded-full animate-agent-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-4 left-16 w-3 h-3 bg-primary/80 rounded-full animate-agent-pulse" style={{ animationDelay: '0.8s' }}></div>
          <svg className="absolute bottom-0 left-0 w-20 h-20 opacity-20">
            <line x1="8" y1="8" x2="20" y2="16" stroke="currentColor" strokeWidth="1" className="text-primary animate-network-pulse" />
          </svg>
        </div>
      </div>
      
      {/* Bottom Right Network Cluster */}
      <div className="absolute bottom-40 right-20">
        <div className="relative">
          <div className="absolute w-5 h-5 bg-accent rounded-full animate-agent-pulse shadow-lg shadow-accent/50"></div>
          <div className="absolute bottom-10 right-8 w-4 h-4 bg-primary rounded-full animate-agent-pulse" style={{ animationDelay: '0.3s' }}></div>
          <div className="absolute bottom-6 right-14 w-3 h-3 bg-accent/80 rounded-full animate-agent-pulse" style={{ animationDelay: '0.6s' }}></div>
        </div>
      </div>
      
      {/* Data Flow Paths - Animated Lines Showing Data Movement */}
      <div className="absolute top-1/4 left-0 w-1/3 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent">
        <div className="h-full w-20 bg-primary/60 rounded-full animate-data-flow shadow-lg shadow-primary/50"></div>
      </div>
      <div className="absolute bottom-1/4 right-0 w-1/3 h-px bg-gradient-to-l from-transparent via-accent/40 to-transparent">
        <div className="h-full w-20 bg-accent/60 rounded-full animate-data-flow" style={{ animationDelay: '1s' }}></div>
      </div>
      <div className="absolute top-1/2 left-1/4 w-px h-32 bg-gradient-to-b from-transparent via-primary/30 to-transparent">
        <div className="w-full h-16 bg-primary/50 rounded-full animate-data-flow" style={{ animationDelay: '0.5s', transform: 'rotate(90deg)' }}></div>
      </div>
      
      {/* Central AI Agent Hub */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10">
        <div className="relative w-32 h-32">
          {/* Main Agent Node */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full animate-agent-pulse shadow-2xl shadow-primary/50 border-2 border-white/20"></div>
          {/* Orbiting Agent Nodes */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-6 bg-primary/60 rounded-full animate-float" style={{ animationDelay: '0s' }}></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-6 bg-accent/60 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-6 h-6 bg-primary/60 rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-6 h-6 bg-accent/60 rounded-full animate-float" style={{ animationDelay: '1.5s' }}></div>
          {/* Connection Lines to Orbiting Nodes */}
          <svg className="absolute top-0 left-0 w-full h-full opacity-30" viewBox="0 0 128 128">
            <circle cx="64" cy="64" r="60" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary/20 animate-spin-slow" />
            <line x1="64" y1="64" x2="64" y2="0" stroke="currentColor" strokeWidth="1" className="text-primary/30 animate-network-pulse" />
            <line x1="64" y1="64" x2="64" y2="128" stroke="currentColor" strokeWidth="1" className="text-accent/30 animate-network-pulse" style={{ animationDelay: '0.5s' }} />
            <line x1="64" y1="64" x2="0" y2="64" stroke="currentColor" strokeWidth="1" className="text-primary/30 animate-network-pulse" style={{ animationDelay: '0.25s' }} />
            <line x1="64" y1="64" x2="128" y2="64" stroke="currentColor" strokeWidth="1" className="text-accent/30 animate-network-pulse" style={{ animationDelay: '0.75s' }} />
          </svg>
        </div>
      </div>
      
      {/* Growth Indicators - Upward Arrows */}
      <div className="absolute top-24 left-1/3">
        <div className="relative w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[16px] border-b-primary/30 animate-float" style={{ animationDelay: '0.2s' }}></div>
        <div className="absolute top-4 left-0 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[12px] border-b-accent/25 animate-float" style={{ animationDelay: '0.6s' }}></div>
      </div>
      <div className="absolute bottom-24 right-1/3">
        <div className="relative w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[16px] border-b-accent/30 animate-float" style={{ animationDelay: '1.2s' }}></div>
        <div className="absolute top-4 left-0 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[12px] border-b-primary/25 animate-float" style={{ animationDelay: '1.6s' }}></div>
      </div>
      
      {/* Automation Flow Indicators - Circular Paths */}
      <div className="absolute top-1/4 right-1/4 w-24 h-24 border border-primary/20 rounded-full animate-spin-slow opacity-40"></div>
      <div className="absolute bottom-1/4 left-1/4 w-20 h-20 border border-accent/20 rounded-full animate-spin-slow opacity-40" style={{ animationDirection: 'reverse' }}></div>
      
      {/* Background Glow Effects - Distributed throughout */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/20 to-accent/15 rounded-full blur-3xl animate-float"></div>
      <div className="absolute top-[30%] right-1/3 w-80 h-80 bg-gradient-to-tl from-accent/15 to-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-primary/1 via-accent/1.5 to-primary/1 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute top-[60%] left-1/5 w-72 h-72 bg-gradient-to-br from-primary/12 to-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-[70%] right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-accent/18 to-primary/12 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
      <div className="absolute top-[85%] left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-r from-primary/8 to-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '0.5s' }}></div>
      
      {/* Additional scattered agent nodes for full page coverage - distributed throughout */}
      {/* Top section nodes */}
      <div className="absolute top-[10%] left-[10%] w-3 h-3 bg-primary/40 rounded-full animate-agent-pulse" style={{ animationDelay: '0.2s' }}></div>
      <div className="absolute top-[15%] right-[15%] w-3 h-3 bg-accent/40 rounded-full animate-agent-pulse" style={{ animationDelay: '0.4s' }}></div>
      <div className="absolute top-[20%] left-[20%] w-3 h-3 bg-primary/40 rounded-full animate-agent-pulse" style={{ animationDelay: '0.6s' }}></div>
      
      {/* Middle-top section nodes */}
      <div className="absolute top-[35%] left-[8%] w-4 h-4 bg-primary/35 rounded-full animate-agent-pulse" style={{ animationDelay: '0.8s' }}></div>
      <div className="absolute top-[40%] right-[12%] w-3 h-3 bg-accent/40 rounded-full animate-agent-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-[45%] left-[18%] w-3 h-3 bg-primary/40 rounded-full animate-agent-pulse" style={{ animationDelay: '1.2s' }}></div>
      
      {/* Center section nodes */}
      <div className="absolute top-[55%] right-[8%] w-4 h-4 bg-accent/35 rounded-full animate-agent-pulse" style={{ animationDelay: '0.3s' }}></div>
      <div className="absolute top-[60%] left-[12%] w-3 h-3 bg-primary/40 rounded-full animate-agent-pulse" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute top-[65%] right-[18%] w-3 h-3 bg-accent/40 rounded-full animate-agent-pulse" style={{ animationDelay: '0.7s' }}></div>
      
      {/* Middle-bottom section nodes */}
      <div className="absolute top-[75%] left-[10%] w-4 h-4 bg-primary/35 rounded-full animate-agent-pulse" style={{ animationDelay: '0.9s' }}></div>
      <div className="absolute top-[80%] right-[15%] w-3 h-3 bg-accent/40 rounded-full animate-agent-pulse" style={{ animationDelay: '1.1s' }}></div>
      <div className="absolute top-[85%] left-[22%] w-3 h-3 bg-primary/40 rounded-full animate-agent-pulse" style={{ animationDelay: '1.3s' }}></div>
      
      {/* Bottom section nodes */}
      <div className="absolute top-[95%] right-[10%] w-4 h-4 bg-accent/35 rounded-full animate-agent-pulse" style={{ animationDelay: '0.4s' }}></div>
      <div className="absolute top-[98%] left-[15%] w-3 h-3 bg-primary/40 rounded-full animate-agent-pulse" style={{ animationDelay: '0.6s' }}></div>
      
      {/* Additional network clusters at different vertical positions */}
      {/* Mid-page left cluster */}
      <div className="absolute top-[50%] left-[5%]">
        <div className="relative">
          <div className="absolute w-4 h-4 bg-primary/30 rounded-full animate-agent-pulse"></div>
          <div className="absolute top-6 left-6 w-3 h-3 bg-accent/30 rounded-full animate-agent-pulse" style={{ animationDelay: '0.3s' }}></div>
          <svg className="absolute top-0 left-0 w-12 h-12 opacity-15">
            <line x1="8" y1="8" x2="14" y2="14" stroke="currentColor" strokeWidth="1" className="text-primary animate-network-pulse" />
          </svg>
        </div>
      </div>
      
      {/* Mid-page right cluster */}
      <div className="absolute top-[50%] right-[5%]">
        <div className="relative">
          <div className="absolute w-4 h-4 bg-accent/30 rounded-full animate-agent-pulse"></div>
          <div className="absolute top-6 right-6 w-3 h-3 bg-primary/30 rounded-full animate-agent-pulse" style={{ animationDelay: '0.4s' }}></div>
          <svg className="absolute top-0 right-0 w-12 h-12 opacity-15">
            <line x1="8" y1="8" x2="14" y2="14" stroke="currentColor" strokeWidth="1" className="text-accent animate-network-pulse" />
          </svg>
        </div>
      </div>
      
      {/* Lower page cluster */}
      <div className="absolute top-[80%] left-[12%]">
        <div className="relative">
          <div className="absolute w-3 h-3 bg-primary/30 rounded-full animate-agent-pulse"></div>
          <div className="absolute bottom-5 left-5 w-3 h-3 bg-accent/30 rounded-full animate-agent-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>
      </div>
      
      {/* Additional data flow paths at different positions */}
      <div className="absolute top-[30%] left-0 w-1/4 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent">
        <div className="h-full w-16 bg-primary/50 rounded-full animate-data-flow" style={{ animationDelay: '0.2s' }}></div>
      </div>
      <div className="absolute top-[70%] right-0 w-1/4 h-px bg-gradient-to-l from-transparent via-accent/30 to-transparent">
        <div className="h-full w-16 bg-accent/50 rounded-full animate-data-flow" style={{ animationDelay: '1.5s' }}></div>
      </div>
    </div>
  );
}

