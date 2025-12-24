import { NotificationSettings } from "@/components/NotificationSettings";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/lib/translations";
import { ArrowLeft } from "lucide-react";

export function Settings() {
  const { language } = useLanguage();
  const t = useTranslation(language);
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <a className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span>{t.close}</span>
              </a>
            </Link>
            <h1 className="text-xl font-serif font-medium">{t.settings}</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-serif font-medium mb-2">{t.notificationSettings}</h2>
            <p className="text-muted-foreground mb-6">
              {t.dailyReminder}
            </p>
            <NotificationSettings />
          </div>
        </div>
      </main>
    </div>
  );
}
