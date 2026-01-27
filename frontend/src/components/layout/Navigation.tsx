import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const navigation = [
  { name: "Services", href: "/services" },
  { name: "Case Studies", href: "/case-studies" },
  { name: "Projects", href: "/projects" },
  { name: "Articles", href: "/articles" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, userName, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleBookDemo = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      // Redirect to contact page via backend
      const api = import.meta.env.VITE_API_URL || "http://localhost:5000";
      window.location.href = `${api}/go/contact`;
    }
  };

  return (
    <header className="glass-card fixed top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 z-50 px-3 sm:px-6 py-2 sm:py-3">
      <nav className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
          <img 
            src="/Import AI Logo PNG.png" 
            alt="Import AI Logo" 
            className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
          />
          <div className="text-lg sm:text-2xl font-bold text-gradient">Import AI</div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "text-xs xl:text-sm font-medium transition-colors hover:text-primary",
                location.pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
          {isAuthenticated ? (
            <>
              <span className="text-xs xl:text-sm text-muted-foreground hidden xl:inline">
                Hello {userName || "User"}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-primary/50 bg-primary/5 hover:bg-primary/10 hover:border-primary text-primary font-semibold px-3 xl:px-6 text-xs xl:text-sm whitespace-nowrap" 
                onClick={handleBookDemo}
              >
                <span className="hidden xl:inline">Book a Free AI Consultation</span>
                <span className="xl:hidden">Book Demo</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-4 pt-4 border-t border-border">
          <div className="space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "block text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 space-y-3">
              {isAuthenticated ? (
                <>
                  <div className="text-sm text-muted-foreground text-center pb-2">
                    Hello {userName || "User"}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-primary/50 bg-primary/5 hover:bg-primary/10 hover:border-primary text-primary font-semibold" 
                    onClick={handleBookDemo}
                  >
                    Book a Free AI Consultation
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full text-muted-foreground hover:text-foreground" 
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link to="/login">Login</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}