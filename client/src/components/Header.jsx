import React from "react";
import { Link } from "react-router-dom";
import { Brain, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-white border-b border-teal/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 bg-teal/10 rounded-lg">
              <Brain className="h-6 w-6 text-teal" />
            </div>
            <span className="text-xl font-bold text-midnight-blue">
              TaskAI Manager
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-midnight-blue/70 hover:text-teal transition-colors"
            >
              Home
            </Link>
            <a
              href="#features"
              className="text-midnight-blue/70 hover:text-teal transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-midnight-blue/70 hover:text-teal transition-colors"
            >
              How It Works
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            <Link to="/login">
              <Button
                variant="ghost"
                className="text-midnight-blue hover:bg-teal/10"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-teal hover:bg-teal/90 text-white">
                <UserPlus className="h-4 w-4 mr-2" />
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile menu button - you can enhance this later with a mobile menu */}
          <div className="md:hidden">
            <Link to="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-midnight-blue hover:bg-teal/10"
              >
                <LogIn className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
