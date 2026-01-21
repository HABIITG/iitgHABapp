import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  UserCircleIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";

export default function Layout({ children }) {
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const handleLogin = (type) => {
    const clientId =
      import.meta.env.VITE_CLIENT_ID || "2cdac4f3-1fda-4348-a057-9bb2e3d184a1";
    const redirectUri = encodeURIComponent(
      import.meta.env.VITE_WEB_REDIRECT_URI ||
        "http://localhost:3000/api/auth/login/redirect/web"
    );

    const authUrl = `https://login.microsoftonline.com/850aa78d-94e1-4bc6-9cf3-8c11b530701c/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=user.read&state=${type}&prompt=consent`;

    window.location.href = authUrl;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Desktop dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLoginDropdown(false);
      }
      // Mobile dropdown
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target) && !event.target.closest('button')) {
        setShowLoginDropdown(false);
      }
      // Mobile menu
      if (mobileMenuRef.current && showMobileMenu && !mobileMenuRef.current.contains(event.target) && !event.target.closest('button[aria-label="Toggle menu"]')) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMobileMenu]);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/forms", label: "Forms" },
    { path: "/hostels", label: "Hostels" },
  ];

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header - Nexcent Style */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 xl:px-20">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <img
                src="/hab-logo.png"
                alt="HAB Logo"
                className="h-10 w-10 object-contain"
              />
              <span className="text-2xl font-semibold text-gray-900">
                HABit
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    isActive(item.path)
                      ? "text-[#6149CD]"
                      : "text-gray-600 hover:text-[#6149CD]"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right side - Login & Mobile menu */}
            <div className="flex items-center space-x-4">
              {/* Login Dropdown */}
              <div className="relative hidden md:block" ref={dropdownRef}>
                <Button
                  variant="ghost"
                  onClick={() => setShowLoginDropdown(!showLoginDropdown)}
                  className="text-gray-900"
                >
                  Login
                </Button>

                {showLoginDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-[100] transition-all duration-200 ease-out opacity-100 transform translate-y-0">
                    <div className="px-3 py-2 border-b border-gray-200">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Admin Portals
                      </p>
                    </div>
                    <button
                      onClick={() => handleLogin("hab")}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-3 group"
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-600 group-hover:bg-blue-700"></div>
                      <div>
                        <div className="font-medium">HAB Admin Portal</div>
                        <div className="text-xs text-gray-500">
                          Hostel Affairs Board
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleLogin("hostel")}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-3 group"
                    >
                      <div className="w-2 h-2 rounded-full bg-[#6149CD] group-hover:bg-[#5039B8]"></div>
                      <div>
                        <div className="font-medium">Hostel Admin Portal</div>
                        <div className="text-xs text-gray-500">
                          Hostel Management
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleLogin("smc")}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-3 group"
                    >
                      <div className="w-2 h-2 rounded-full bg-purple-600 group-hover:bg-purple-700"></div>
                      <div>
                        <div className="font-medium">SMC Portal</div>
                        <div className="text-xs text-gray-500">
                          Student Mess Committee
                        </div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                aria-label="Toggle menu"
              >
                {showMobileMenu ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200 bg-white" ref={mobileMenuRef}>
            <nav className="px-4 py-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setShowMobileMenu(false)}
                  className={cn(
                    "block px-4 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive(item.path)
                      ? "bg-purple-50 text-[#6149CD]"
                      : "text-gray-700 hover:bg-purple-50 hover:text-[#6149CD]"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-200">
                <div className="relative" ref={mobileDropdownRef}>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => {
                      setShowLoginDropdown(!showLoginDropdown);
                    }}
                  >
                    Login
                  </Button>
                  
                  {/* Mobile Login Dropdown */}
                  {showLoginDropdown && (
                    <div className="mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-[100] transition-all duration-200 ease-out opacity-100 transform translate-y-0">
                      <div className="px-3 py-2 border-b border-gray-200">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Admin Portals
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          handleLogin("hab");
                          setShowMobileMenu(false);
                          setShowLoginDropdown(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-3 group"
                      >
                        <div className="w-2 h-2 rounded-full bg-blue-600 group-hover:bg-blue-700"></div>
                        <div>
                          <div className="font-medium">HAB Admin Portal</div>
                          <div className="text-xs text-gray-500">
                            Hostel Affairs Board
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          handleLogin("hostel");
                          setShowMobileMenu(false);
                          setShowLoginDropdown(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-3 group"
                      >
                        <div className="w-2 h-2 rounded-full bg-[#6149CD] group-hover:bg-[#5039B8]"></div>
                        <div>
                          <div className="font-medium">Hostel Admin Portal</div>
                          <div className="text-xs text-gray-500">
                            Hostel Management
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          handleLogin("smc");
                          setShowMobileMenu(false);
                          setShowLoginDropdown(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-3 group"
                      >
                        <div className="w-2 h-2 rounded-full bg-purple-600 group-hover:bg-purple-700"></div>
                        <div>
                          <div className="font-medium">SMC Portal</div>
                          <div className="text-xs text-gray-500">
                            Student Mess Committee
                          </div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer - Nexcent Style */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 xl:px-20 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Logo & Copyright */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <img
                  src="/hab-logo.png"
                  alt="HAB Logo"
                  className="h-10 w-10 object-contain"
                />
                <span className="text-2xl font-semibold text-white">HABit</span>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Copyright © {new Date().getFullYear()} HABit IITG. All rights
                reserved.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="YouTube"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                    About us
                  </Link>
                </li>
                <li>
                  <Link to="/hostels" className="text-gray-400 hover:text-white transition-colors">
                    Hostels
                  </Link>
                </li>
                <li>
                  <Link to="/forms" className="text-gray-400 hover:text-white transition-colors">
                    Forms
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                    Contact Support
                  </Link>
                </li>
                <li>
                  <Link to="/bug-report" className="text-gray-400 hover:text-white transition-colors">
                    Report a Bug
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Stay up to date */}
            <div>
              <h3 className="font-semibold text-white mb-4">Stay up to date</h3>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6149CD] focus:border-transparent"
                />
                <button className="px-4 py-2 bg-[#6149CD] text-white rounded-r-lg hover:bg-[#5039B8] transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
