import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/lib/auth";
import { t } from "@/lib/i18n";
import LanguageSelector from "./LanguageSelector";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";

const Header: React.FC = () => {
  const { user, isAuthenticated, logout, language } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex">
            <Link to="/home" className="flex items-center">
              <img
                src="/src/assets/images/calcul8.png"
                alt="Calcul8 Tutoring Logo"
                className="h-10 w-10 mr-2"
              />
              <span
                className="font-bold gradient-text"
                style={{ fontSize: "2.2rem" }}
              >
                Calcul8
              </span>
            </Link>
          </div>

          {/* Desktop menu */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/home" className="nav-link">
              Home
            </Link>
            <Link to="/about" className="nav-link">
              {t("aboutTitle", language)}
            </Link>
            <Link to="/services" className="nav-link">
              {t("servicesTitle", language)}
            </Link>
            <Link to="/contact" className="nav-link">
              {t("contact", language)}
            </Link>
            <LanguageSelector />

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/booking" className="btn-primary">
                  {t("bookLesson", language)}
                </Link>
                {/* Mostra o botão Dashboard se não estiver na dashboard */}
                {window.location.pathname !== "/dashboard" && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      if (isAuthenticated) {
                        navigate("/dashboard");
                      } else {
                        navigate("/login", {
                          state: { from: { pathname: "/dashboard" } },
                        });
                      }
                    }}
                  >
                    {t("dashboard", language)}
                  </button>
                )}
                <Button
                  variant="outline"
                  onClick={() => {
                    logout();
                    navigate("/home");
                  }}
                >
                  {t("logout", language)}
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="nav-link font-medium">
                  {t("login", language)}
                </Link>
                <Link to="/signup" className="btn-primary">
                  {t("signup", language)}
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <LanguageSelector />
            <button
              className="ml-4 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="pt-2 pb-4 space-y-1 px-4">
            <Link
              to="/home"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("aboutTitle", language)}
            </Link>
            <Link
              to="/services"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("servicesTitle", language)}
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("contact", language)}
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/booking"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-primary text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("bookLesson", language)}
                </Link>
                {/* Mostra o botão Dashboard se não estiver na dashboard */}
                {window.location.pathname !== "/dashboard" && (
                  <button
                    type="button"
                    className="block px-3 py-2 rounded-md text-base font-medium bg-secondary text-white"
                    onClick={async () => {
                      if (isAuthenticated) {
                        // Tenta criar o perfil novamente antes de navegar
                        if (
                          typeof window.createUserProfile === "function" &&
                          user
                        ) {
                          try {
                            await window.createUserProfile(user);
                          } catch (e) {
                            // Silencia erro, navega mesmo assim
                          }
                        }
                        navigate("/dashboard");
                      } else {
                        navigate("/login", {
                          state: { from: { pathname: "/dashboard" } },
                        });
                      }
                      setMobileMenuOpen(false);
                    }}
                  >
                    {t("dashboard", language)}
                  </button>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate("/home");
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-muted"
                >
                  {t("logout", language)}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("login", language)}
                </Link>
                <Link
                  to="/signup"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-primary text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("signup", language)}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
