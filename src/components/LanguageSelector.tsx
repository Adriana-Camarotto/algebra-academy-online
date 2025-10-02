import React, { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/lib/auth";

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: "en", flag: "https://flagcdn.com/w20/gb.png", name: "English" },
    { code: "pt", flag: "https://flagcdn.com/w20/br.png", name: "Português" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === language);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="appearance-none bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200 pr-10 min-w-[120px] flex items-center"
        aria-label="Select language"
      >
        <img
          src={currentLanguage?.flag}
          alt={currentLanguage?.name}
          className="w-5 h-4 mr-2"
        />
        <span className="text-white">{language.toUpperCase()}</span>
      </button>

      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        <svg
          className={`h-4 w-4 text-white/70 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full min-w-[140px] bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code as "en" | "pt");
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 text-left flex items-center hover:bg-gray-100 transition-colors duration-150 whitespace-nowrap ${
                language === lang.code
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-900"
              }`}
            >
              <img src={lang.flag} alt={lang.name} className="w-5 h-4 mr-3" />
              <span className="text-sm">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
