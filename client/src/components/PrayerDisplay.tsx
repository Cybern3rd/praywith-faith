import { motion } from "framer-motion";
import { Share2, Heart, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
// Removed Manus getLoginUrl - now using Clerk
import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/lib/translations";

interface PrayerProps {
  id?: number;
  title: string;
  subtitle?: string;
  body: string;
  affirmation: string;
  actionStep: string;
  whisperPrayer?: string;
  blessing: string;
  date: string;
  language: string;
}

export function PrayerDisplay({
  id,
  title,
  subtitle,
  body,
  affirmation,
  actionStep,
  whisperPrayer,
  blessing,
  date,
}: PrayerProps) {
  const { isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const t = useTranslation(language);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Check if speech synthesis is supported
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
    }
    
    // Cleanup on unmount
    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  
  // Save prayer mutation
  const saveMutation = trpc.prayers.save.useMutation({
    onSuccess: () => {
      toast.success(t.prayerSaved);
    },
    onError: (error) => {
      toast.error(error.message || t.errorSaving);
    },
  });
  
  const handleSave = () => {
    if (!isAuthenticated) {
      toast.error(t.signInToChat, {
        description: "Create a free account to save prayers and access more features",
        duration: 5000,
      });
      // Clerk sign-in is handled by the SignInButton in the header
      return;
    }
    if (!id) {
      toast.error(t.errorLoading);
      return;
    }
    saveMutation.mutate({ prayerId: id });
  };
  
  const handleListen = () => {
    if (!isSupported) {
      toast.error("Text-to-speech not supported");
      return;
    }

    if (isPlaying) {
      // Stop current playback
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      // Create the text to speak
      const textToSpeak = `${title}. ${subtitle || ''}. ${body}. Daily Affirmation: ${affirmation}. Action Step: ${actionStep}. ${whisperPrayer ? `Whisper Prayer: ${whisperPrayer}.` : ''} ${blessing}`;

      // Create utterance
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utteranceRef.current = utterance;

      // Configure voice settings
      utterance.rate = 0.9; // Slightly slower for contemplative reading
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Event handlers
      utterance.onstart = () => {
        setIsPlaying(true);
        toast.success(t.listen);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        utteranceRef.current = null;
      };

      utterance.onerror = (event) => {
        setIsPlaying(false);
        utteranceRef.current = null;
        console.error("Speech synthesis error:", event);
        
        // Provide more specific error messages
        if (event.error === 'not-allowed') {
          toast.error("Please interact with the page first");
        } else if (event.error === 'network') {
          toast.error("Network error");
        } else {
          toast.error(t.tryAgain);
        }
      };

      // Function to set up and speak with proper voice
      const setupAndSpeak = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          // Map language codes to voice language prefixes
          const languageMap: Record<string, string> = {
            'en': 'en',
            'es': 'es',
            'fr': 'fr',
            'pt': 'pt'
          };
          
          const targetLang = languageMap[language] || 'en';
          
          // Try to find a voice matching the current language
          let selectedVoice = voices.find(voice => voice.lang.startsWith(targetLang));
          
          // Fallback to English if language-specific voice not found
          if (!selectedVoice) {
            selectedVoice = voices.find(voice => voice.lang.startsWith('en'));
          }
          
          if (selectedVoice) {
            utterance.voice = selectedVoice;
            console.log(`[Speech] Using voice: ${selectedVoice.name} (${selectedVoice.lang})`);
          }
        }
        
        // Start speaking
        window.speechSynthesis.speak(utterance);
      };

      // Ensure voices are loaded before speaking
      if (window.speechSynthesis.getVoices().length > 0) {
        setupAndSpeak();
      } else {
        // Wait for voices to load
        window.speechSynthesis.addEventListener('voiceschanged', setupAndSpeak, { once: true });
        // Fallback timeout in case voiceschanged never fires
        setTimeout(setupAndSpeak, 100);
      }
    } catch (error) {
      console.error("Error in handleListen:", error);
      toast.error(t.errorLoading);
    }
  };

  const handleShare = async () => {
    const shareTitle = `PrayWith.Faith - ${title}`;
    const shareText = `${title}\n\n${body.substring(0, 200)}...\n\nRead the full prayer at:`;
    const shareUrl = window.location.href;

    // Try native Web Share API first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        toast.success(t.shared);
        return;
      } catch (error) {
        // User cancelled or error occurred
        if ((error as Error).name !== 'AbortError') {
          console.error('Share error:', error);
        }
      }
    }

    // Fallback: Show share options dialog
    const encodedText = encodeURIComponent(`${shareTitle}\n\n${shareText}`);
    const encodedUrl = encodeURIComponent(shareUrl);
    
    // Create share URLs
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
    
    // For desktop, open a simple share menu
    const shareMenu = document.createElement('div');
    shareMenu.innerHTML = `
      <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 24px; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); z-index: 9999; min-width: 300px;">
        <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Share this prayer</h3>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <a href="${facebookUrl}" target="_blank" style="padding: 12px; background: #1877f2; color: white; text-decoration: none; border-radius: 8px; text-align: center; font-weight: 500;">Share on Facebook</a>
          <a href="${twitterUrl}" target="_blank" style="padding: 12px; background: #1da1f2; color: white; text-decoration: none; border-radius: 8px; text-align: center; font-weight: 500;">Share on Twitter</a>
          <a href="${whatsappUrl}" target="_blank" style="padding: 12px; background: #25d366; color: white; text-decoration: none; border-radius: 8px; text-align: center; font-weight: 500;">Share on WhatsApp</a>
          <button onclick="this.parentElement.parentElement.parentElement.remove()" style="padding: 12px; background: #f3f4f6; color: #374151; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; margin-top: 8px;">Cancel</button>
        </div>
      </div>
      <div onclick="this.parentElement.remove()" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 9998;"></div>
    `;
    document.body.appendChild(shareMenu);
  };
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" } as any
    },
  };

  return (
    <motion.article 
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-2xl mx-auto px-6 py-12 md:py-16 space-y-12"
    >
      {/* Header */}
      <motion.header variants={item} className="text-center space-y-4">
        <p className="text-sm text-muted-foreground uppercase tracking-wider">
          {date}
        </p>
        <h1 className="text-4xl md:text-5xl font-serif font-medium leading-tight text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl text-muted-foreground italic">
            {subtitle}
          </p>
        )}
      </motion.header>

      {/* Prayer Body */}
      <motion.div variants={item} className="space-y-6">
        {body.split('\n\n').map((paragraph, idx) => (
          <p key={idx} className="text-lg leading-relaxed text-foreground/90">
            {paragraph}
          </p>
        ))}
      </motion.div>

      {/* Daily Affirmation */}
      <motion.section variants={item}>
        <div className="bg-muted/30 rounded-lg p-8 text-center space-y-3 border border-border">
          <h3 className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
            {t.dailyAffirmation}
          </h3>
          <p className="text-xl md:text-2xl font-serif italic text-foreground leading-relaxed">
            "{affirmation}"
          </p>
        </div>
      </motion.section>

      {/* Action Step */}
      <motion.section variants={item} className="space-y-4">
        <div className="border-t border-border pt-6">
          <h3 className="text-sm font-medium text-primary uppercase tracking-wider text-center mb-4">
            {t.actionStep}
          </h3>
          <p className="text-lg text-foreground/80 leading-relaxed text-center">
            {actionStep}
          </p>
        </div>
      </motion.section>

      {/* Whisper Prayer */}
      {whisperPrayer && (
        <motion.section variants={item} className="text-center space-y-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {t.whisperPrayer}
          </span>
          <p className="text-lg font-serif italic text-foreground/70">
            "{whisperPrayer}"
          </p>
        </motion.section>
      )}

      {/* Divider */}
      <motion.div variants={item} className="flex justify-center">
        <div className="w-16 h-px bg-border"></div>
      </motion.div>

      {/* Blessing */}
      <motion.footer variants={item} className="text-center">
        <p className="text-xl md:text-2xl font-serif text-foreground/90 leading-relaxed">
          {blessing}
        </p>
      </motion.footer>

      {/* Action Buttons */}
      <motion.div 
        variants={item}
        className="flex justify-center gap-3 pt-8"
      >
        <Button 
          variant="outline" 
          size="lg" 
          className="gap-2"
          onClick={handleSave}
          disabled={saveMutation.isPending}
        >
          <Heart className="w-4 h-4" />
          {saveMutation.isPending ? t.loading : t.save}
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          className="gap-2"
          onClick={handleListen}
          disabled={!isSupported}
        >
          {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          {isPlaying ? t.close : t.listen}
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          className="gap-2"
          onClick={handleShare}
        >
          <Share2 className="w-4 h-4" />
          {t.share}
        </Button>
      </motion.div>
    </motion.article>
  );
}
