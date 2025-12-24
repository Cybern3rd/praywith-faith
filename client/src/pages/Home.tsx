import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { PrayerDisplay } from "@/components/PrayerDisplay";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { User, BookOpen, MessageCircle, LogOut, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useEffect, useMemo, useState } from "react";

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const [hasTriedGeneration, setHasTriedGeneration] = useState(false);
  
  // Get today's date in YYYY-MM-DD format
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const language = useMemo(() => user?.preferredLanguage || "en", [user?.preferredLanguage]);
  
  // Fetch today's prayer
  const { data: prayer, isLoading, error, refetch } = trpc.prayers.today.useQuery({
    language,
    date: today,
  });

  // Generate prayer mutation
  const generateMutation = trpc.prayers.generate.useMutation({
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      console.error("Failed to generate prayer:", error);
    },
  });

  // Auto-generate if prayer doesn't exist
  useEffect(() => {
    if (!isLoading && !prayer && !hasTriedGeneration && !generateMutation.isPending) {
      setHasTriedGeneration(true);
      generateMutation.mutate({
        language,
        date: today,
      });
    }
  }, [isLoading, prayer, hasTriedGeneration, generateMutation.isPending, language, today]);

  const isGenerating = generateMutation.isPending;
  const showLoading = isLoading || isGenerating;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center backdrop-blur-md border border-white/10">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            </div>
            <span className="font-serif font-medium text-lg tracking-tight text-foreground/80">PrayWith.Faith</span>
          </div>
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link href="/journal">
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 text-foreground/70">
                    <BookOpen className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/chat">
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 text-foreground/70">
                    <MessageCircle className="w-5 h-5" />
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full hover:bg-white/10 text-foreground/70"
                  onClick={() => logout()}
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <a href={getLoginUrl()}>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 text-foreground/70">
                  <User className="w-5 h-5" />
                </Button>
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 pt-20 pb-32">
        {showLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary/50" />
            <p className="text-muted-foreground font-serif">
              {isGenerating ? "Crafting today's prayer..." : "Loading..."}
            </p>
          </div>
        ) : error || generateMutation.isError ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <p className="text-destructive font-serif">Failed to load prayer</p>
            <p className="text-sm text-muted-foreground max-w-md text-center">
              {generateMutation.error?.message || error?.message || "An error occurred"}
            </p>
            <Button 
              onClick={() => {
                setHasTriedGeneration(false);
                refetch();
              }} 
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        ) : prayer ? (
          <PrayerDisplay
            date={new Date(prayer.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            language={prayer.language}
            title={prayer.title}
            subtitle={prayer.subtitle || undefined}
            body={prayer.body}
            affirmation={prayer.affirmation}
            actionStep={prayer.actionStep}
            whisperPrayer={prayer.whisperPrayer || undefined}
            blessing={prayer.blessing}
          />
        ) : null}
      </main>
    </div>
  );
}
