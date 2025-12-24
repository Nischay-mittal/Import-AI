import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X, Calendar, Play, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const navigation = [
  { name: "Demos", href: "/demos" },
  { name: "Case Studies", href: "/case-studies" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    // Optionally redirect to home page
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
    <header className="glass-card fixed top-4 left-4 right-4 z-50 px-6 py-3">
      <nav className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <img 
            src="/Import AI Logo PNG.png" 
            alt="Import AI Logo" 
            className="w-10 h-10 object-contain"
          />
          <div className="text-2xl font-bold text-gradient">Import AI</div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
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
        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
              <Button variant="hero" size="sm" className="animate-glow" onClick={handleBookDemo}>
                <Calendar className="w-4 h-4 mr-2" />
                Book Demo
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-border">
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
                  <Button variant="ghost" size="sm" className="w-full" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                  <Button variant="hero" size="sm" className="w-full" onClick={handleBookDemo}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Demo
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