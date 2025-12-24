import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Language } from "@/components/LanguageSelector";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const LANGUAGE_STORAGE_KEY = "praywith-language";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    console.log('[LanguageContext] Initializing language state');
    
    // Check URL parameter first
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    if (urlLang && ['en', 'es', 'fr', 'pt'].includes(urlLang)) {
      console.log('[LanguageContext] Language from URL:', urlLang);
      localStorage.setItem(LANGUAGE_STORAGE_KEY, urlLang);
      return urlLang as Language;
    }
    
    // Fall back to localStorage
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    console.log('[LanguageContext] Language from localStorage:', stored);
    return (stored as Language) || "en";
  });

  const setLanguage = (newLanguage: Language) => {
    console.log('[LanguageContext] setLanguage called with:', newLanguage);
    console.log('[LanguageContext] Current language before update:', language);
    
    // Save to localStorage
    localStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
    
    // Reload page with new language parameter to force fresh data fetch
    const url = new URL(window.location.href);
    url.searchParams.set('lang', newLanguage);
    console.log('[LanguageContext] Reloading with URL:', url.toString());
    window.location.href = url.toString();
  };

  useEffect(() => {
    // Sync with localStorage changes from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LANGUAGE_STORAGE_KEY && e.newValue) {
        setLanguageState(e.newValue as Language);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
