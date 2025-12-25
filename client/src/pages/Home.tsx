import { SignInButton, UserButton, useUser } from '@clerk/clerk-react';
import { PrayerDisplay } from "@/components/PrayerDisplay";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { User, BookOpen, MessageCircle, Loader2, Settings as SettingsIcon, Calendar as CalendarIcon, Heart } from "lucide-react";
import { Link } from "wouter";
import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/lib/translations";
import { PrayerCalendar } from "@/components/PrayerCalendar";
import { format } from "date-fns";

export default function Home() {
  const { user, isSignedIn } = useUser();
  const isAuthenticated = !!isSignedIn;
  const [hasTriedGeneration, setHasTriedGeneration] = useState(false);
  const { language, setLanguage } = useLanguage();
  const t = useTranslation(language);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const queryClient = useQueryClient();
  
  // Get selected date in YYYY-MM-DD format
  // Use formatInTimeZone or ensure we're using local date to avoid timezone issues
  const dateStr = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, [selectedDate]);
  
  // Fetch prayer for selected date
  const { data: prayer, isLoading, error, refetch } = trpc.prayers.today.useQuery(
    {
      language,
      date: dateStr,
    },
    {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      staleTime: 0, // Always consider data stale
      cacheTime: 0, // Don't cache
    }
  );

  // Invalidate and refetch prayer when language changes
  useEffect(() => {
    console.log('[Language Change] Language changed to:', language);
    console.log('[Language Change] Current date:', dateStr);
    console.log('[Language Change] Invalidating all queries...');
    
    // Invalidate all tRPC queries to force refetch
    queryClient.invalidateQueries().then(() => {
      console.log('[Language Change] Queries invalidated, refetching...');
      return refetch();
    }).then(() => {
      console.log('[Language Change] Refetch completed');
    });
  }, [language, dateStr, queryClient, refetch]);

  // Fetch available prayer dates for calendar
  const { data: availableDates = [] } = trpc.prayers.availableDates.useQuery({
    language,
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

  // Auto-generate if prayer doesn't exist for today
  const isToday = dateStr === format(new Date(), 'yyyy-MM-dd');
  useEffect(() => {
    if (isToday && !isLoading && !prayer && !hasTriedGeneration && !generateMutation.isPending) {
      setHasTriedGeneration(true);
      generateMutation.mutate({
        language,
        date: dateStr,
      });
    }
  }, [isToday, isLoading, prayer, hasTriedGeneration, generateMutation.isPending, language, dateStr]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setHasTriedGeneration(false);
    setShowCalendar(false);
  };

  const isGenerating = generateMutation.isPending;
  const showLoading = isLoading || isGenerating;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-border px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif font-medium text-xl text-foreground">{t.appName}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <LanguageSelector 
              currentLanguage={language} 
              onLanguageChange={setLanguage} 
            />
            {isAuthenticated ? (
              <>
                <Link href="/saved">
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted text-foreground/70" title={t.savedPrayers}>
                    <Heart className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/journal">
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted text-foreground/70" title={t.journal}>
                    <BookOpen className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/chat">
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted text-foreground/70" title={t.chat}>
                    <MessageCircle className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted text-foreground/70" title={t.settings}>
                    <SettingsIcon className="w-5 h-5" />
                  </Button>
                </Link>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <SignInButton mode="modal">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 text-foreground/70">
                  <User className="w-5 h-5" />
                </Button>
              </SignInButton>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 pt-20 pb-32">
        {/* Calendar Toggle Button */}
        <div className="max-w-5xl mx-auto px-6 mb-6">
          <Button
            variant="outline"
            onClick={() => setShowCalendar(!showCalendar)}
            className="flex items-center gap-2"
          >
            <CalendarIcon className="h-4 w-4" />
            {showCalendar ? t.close : t.browsePrayerHistory}
          </Button>
        </div>

        {/* Calendar */}
        {showCalendar && (
          <div className="max-w-5xl mx-auto px-6 mb-8">
            <PrayerCalendar
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              availableDates={availableDates}
            />
          </div>
        )}

        {showLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary/50" />
            <p className="text-muted-foreground font-serif">
              {isGenerating ? t.craftingPrayer : t.loading}
            </p>
          </div>
        ) : error || generateMutation.isError ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <p className="text-destructive font-serif">{t.errorLoading}</p>
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
              {t.tryAgain}
            </Button>
          </div>
        ) : prayer ? (
          <PrayerDisplay
            id={prayer.id}
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
