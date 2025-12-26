import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowRight, Shield, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Google OAuth Client ID - should be in environment variable
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.token, data.user.name, data.user.role || 'user');
        toast({
          title: "Login successful!",
          description: `Welcome back, ${data.user.name}!`,
        });
        navigate('/');
      } else {
        const error = await response.json();
        toast({
          title: "Login failed",
          description: error.message || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.token, data.user.name, data.user.role || 'user');
        toast({
          title: "Account created!",
          description: `Welcome to Import AI, ${data.user.name}!`,
        });
        navigate('/');
      } else {
        const error = await response.json();
        toast({
          title: "Registration failed",
          description: error.message || "Failed to create account",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load Google Identity Services and set up global callback
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      console.warn("Google Client ID not configured. Set VITE_GOOGLE_CLIENT_ID in frontend/.env.local");
      return; // Don't load Google script if Client ID is not set
    }

    // Set up global callback function for Google Sign-In
    (window as any).handleGoogleSignIn = async (response: any) => {
      setIsLoading(true);
      
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiUrl}/api/auth/google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ credential: response.credential }),
        });

        if (res.ok) {
          const data = await res.json();
          login(data.token, data.user.name, data.user.role || 'user');
          toast({
            title: "Login successful!",
            description: `Welcome, ${data.user.name}!`,
          });
          navigate('/');
        } else {
          const error = await res.json();
          toast({
            title: "Login failed",
            description: error.message || "Failed to sign in with Google",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Login failed",
          description: "Network error. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if ((window as any).google && GOOGLE_CLIENT_ID) {
        (window as any).google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (window as any).handleGoogleSignIn,
        });
        
        // Render the buttons after initialization
        const renderButtons = () => {
          try {
            const loginButton = document.getElementById('g_id_signin_login');
            const signupButton = document.getElementById('g_id_signin_signup');
            
            if (loginButton && !loginButton.hasChildNodes()) {
              (window as any).google.accounts.id.renderButton(loginButton, {
                type: 'standard',
                theme: 'outline',
                size: 'large',
                text: 'sign_in_with',
                shape: 'rectangular',
                logo_alignment: 'left',
                width: '100%'
              });
            }
            
            if (signupButton && !signupButton.hasChildNodes()) {
              (window as any).google.accounts.id.renderButton(signupButton, {
                type: 'standard',
                theme: 'outline',
                size: 'large',
                text: 'sign_up_with',
                shape: 'rectangular',
                logo_alignment: 'left',
                width: '100%'
              });
            }
          } catch (error) {
            console.error('Error rendering Google Sign-In buttons:', error);
          }
        };
        
        // Try rendering after DOM is ready
        if (document.readyState === 'complete') {
          renderButtons();
        } else {
          window.addEventListener('load', renderButtons);
        }
        // Retry rendering multiple times to ensure buttons appear
        setTimeout(renderButtons, 300);
        setTimeout(renderButtons, 800);
        setTimeout(renderButtons, 1500);
      }
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (existingScript) {
        existingScript.remove();
      }
      delete (window as any).handleGoogleSignIn;
    };
  }, []);

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 mb-8">
              <div className="text-2xl font-bold text-gradient">Import AI</div>
            </Link>
            <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
            <p className="text-muted-foreground">
              Access your automation dashboard and manage your AI agents.
            </p>
          </div>

                      <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

            <TabsContent value="login" className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  variant="hero" 
                  size="lg" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>Logging in...</>
                  ) : (
                    <>
                      Login
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <div className="w-full">
                {GOOGLE_CLIENT_ID ? (
                  <>
                    <div 
                      id="g_id_onload"
                      data-client_id={GOOGLE_CLIENT_ID}
                      data-callback="handleGoogleSignIn"
                      style={{ display: 'none' }}
                    ></div>
                    <div 
                      id="g_id_signin_login"
                      className="w-full flex justify-center min-h-[40px]"
                      style={{ minHeight: '40px' }}
                    ></div>
                  </>
                ) : (
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full" 
                    disabled
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google (Not Configured)
                  </Button>
                )}
              </div>
            </TabsContent>

            <TabsContent value="signup" className="space-y-6">
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="John Doe" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="signupEmail">Email address</Label>
                  <Input
                    id="signupEmail"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="signupPassword">Password</Label>
                  <Input
                    id="signupPassword"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  variant="hero" 
                  size="lg" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>Creating account...</>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              <div className="w-full">
                {GOOGLE_CLIENT_ID ? (
                  <div 
                    id="g_id_signin_signup"
                    className="w-full flex justify-center min-h-[40px]"
                    style={{ minHeight: '40px' }}
                  ></div>
                ) : (
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full" 
                    disabled
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign up with Google (Not Configured)
                  </Button>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <p className="text-center text-sm text-muted-foreground mt-8">
            By continuing, you agree to our{" "}
            <Link to="/terms-of-service" className="underline hover:text-foreground">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy-policy" className="underline hover:text-foreground">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-hero items-center justify-center p-8">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]"></div>
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-accent/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative z-10 max-w-lg text-center">
          <div className="glass-card p-8 mb-8">
            <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Secure Access</h3>
            <p className="text-muted-foreground">
              Magic link authentication ensures your account stays secure while making login effortless.
            </p>
          </div>
          
          <div className="glass-card p-8">
            <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Lightning Fast</h3>
            <p className="text-muted-foreground">
              One click access to your automation dashboard, project status, and performance metrics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}