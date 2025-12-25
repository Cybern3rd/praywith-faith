import { useState } from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Language = "en" | "es" | "fr" | "pt";

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

const languages = [
  { code: "en" as Language, name: "English", nativeName: "English" },
  { code: "es" as Language, name: "Spanish", nativeName: "Español" },
  { code: "fr" as Language, name: "French", nativeName: "Français" },
  { code: "pt" as Language, name: "Portuguese", nativeName: "Português" },
];

export function LanguageSelector({
  currentLanguage,
  onLanguageChange,
}: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const currentLang = languages.find((lang) => lang.code === currentLanguage);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="gap-2"
          aria-label="Select language"
        >
          <Globe className="h-5 w-5" />
          <span className="sr-only">Select language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 z-50">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => {
              onLanguageChange(language.code);
              setOpen(false);
            }}
            className={
              currentLanguage === language.code
                ? "bg-accent text-accent-foreground"
                : ""
            }
          >
            <div className="flex flex-col">
              <span className="font-medium">{language.nativeName}</span>
              <span className="text-xs text-muted-foreground">
                {language.name}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
