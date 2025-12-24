import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Loader2, Download } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { exportPrayersToPDF } from "@/lib/pdfExport";

export default function SavedPrayers() {
  const { user, isAuthenticated } = useAuth();

  // Fetch saved prayers
  const { data: savedPrayers, isLoading } = trpc.prayers.saved.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const handleExport = () => {
    if (savedPrayers && savedPrayers.length > 0) {
      const prayers = savedPrayers
        .filter(sp => sp.prayer)
        .map(sp => ({
          id: sp.prayer!.id,
          title: sp.prayer!.title,
          content: sp.prayer!.content,
          reflection: sp.prayer!.reflection || "",
          affirmation: sp.prayer!.affirmation || "",
          date: sp.prayer!.date,
          language: sp.prayer!.language,
        }));
      
      if (prayers.length > 0) {
        exportPrayersToPDF(prayers, user?.name);
        toast.success("Prayers exported to PDF");
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Please sign in to view your saved prayers</p>
        <a href={getLoginUrl()}>
          <Button>Sign In</Button>
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-border px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="font-serif font-medium text-xl text-foreground">Saved Prayers</h1>
          {savedPrayers && savedPrayers.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-muted"
              onClick={handleExport}
              title="Export to PDF"
            >
              <Download className="w-5 h-5" />
            </Button>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 pt-24 pb-12">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : savedPrayers && savedPrayers.length > 0 ? (
          <div className="space-y-8">
            {savedPrayers.map((saved) => {
              const prayer = saved.prayer;
              if (!prayer) return null;

              return (
                <article
                  key={saved.id}
                  className="bg-card border border-border rounded-lg p-8 space-y-6"
                >
                  {/* Date */}
                  <time className="text-sm text-muted-foreground uppercase tracking-wider">
                    {new Date(prayer.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>

                  {/* Title */}
                  <h2 className="font-serif text-2xl md:text-3xl font-medium text-foreground">
                    {prayer.title}
                  </h2>

                  {/* Reflection */}
                  {prayer.reflection && (
                    <p className="text-muted-foreground italic text-lg">
                      {prayer.reflection}
                    </p>
                  )}

                  {/* Content */}
                  <div className="prose prose-lg max-w-none">
                    <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
                      {prayer.content}
                    </p>
                  </div>

                  {/* Affirmation */}
                  {prayer.affirmation && (
                    <div className="bg-muted/50 rounded-lg p-6 border-l-4 border-primary">
                      <h3 className="font-serif text-sm font-medium text-muted-foreground mb-2">
                        Daily Affirmation
                      </h3>
                      <p className="text-foreground italic">"{prayer.affirmation}"</p>
                    </div>
                  )}

                  {/* Saved date */}
                  <div className="text-xs text-muted-foreground pt-4 border-t border-border">
                    Saved on {new Date(saved.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 space-y-4">
            <p className="text-muted-foreground">No saved prayers yet</p>
            <Link href="/">
              <Button>Browse Prayers</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
