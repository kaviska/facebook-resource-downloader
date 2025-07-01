"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface Language {
  code: string;
  name: string;
}

const languages: Language[] = [
  { code: "en", name: "English" },

  { code: "hi", name: "Hindi" },
  { code: "es", name: "Spanish" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "ja", name: "Japanese" },
  { code: "id", name: "Indonesian (Bahasa)" },
  { code: "de", name: "German" },
  { code: "fr", name: "French" },
  { code: "ar", name: "Arabic" },
  { code: "tr", name: "Turkish" },
  { code: "vi", name: "Vietnamese" },
  { code: "ko", name: "Korean" },
  { code: "bn", name: "Bengali" },
  { code: "ta", name: "Tamil" },
  { code: "te", name: "Telugu" },
  { code: "mr", name: "Marathi" },
  { code: "ur", name: "Urdu" },
  { code: "it", name: "Italian" },
  { code: "th", name: "Thai" },
  { code: "pl", name: "Polish" },
];

export default function TranslateDropdown() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

   const handleLanguageChange = (language: Language) => {
    if (!isMounted) return;
  
    setSelectedLanguage(language);
    setIsDropdownOpen(false);
  
    const currentPath = window.location.pathname;
  
    // Dynamically build regex to match any language code from the `languages` array
    const languageCodes = languages.map((lang) => lang.code).join("|");
    const regex = new RegExp(`^/(${languageCodes})(/|$)`);
  
    // Remove existing language code from the start if present
    const pathWithoutLang = currentPath.replace(regex, "/");
  
    // Ensure no double slashes and correct redirect even on "/"
    const cleanPath = pathWithoutLang === "/" ? "" : pathWithoutLang;
  
    const newPath = `/${language.code}${cleanPath}`;
    router.push(newPath);
  };
  

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left mt-4" ref={dropdownRef}>
      <button
      type="button"
      onClick={toggleDropdown}
      className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
      id="menu-button"
      aria-expanded={isDropdownOpen}
      aria-haspopup="true"
      >
      {selectedLanguage.name}
      <svg
        className="-mr-1 ml-2 h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
        fillRule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        clipRule="evenodd"
        />
      </svg>
      </button>

      {isDropdownOpen && (
      <div className="absolute right-0 z-10 mt-2 w-[400px] origin-top-right rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
        <div
        className="py-1 grid grid-cols-2 sm:grid-cols-3 gap-2"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        >
        {languages.map((language) => (
          <button
          key={language.code}
          onClick={() => handleLanguageChange(language)}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          role="menuitem"
          >
          {language.name}
          </button>
        ))}
        </div>
      </div>
      )}
    </div>
  );
}
