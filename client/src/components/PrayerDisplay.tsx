import { motion } from "framer-motion";
import { Share2, Heart, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

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
  
  // Save prayer mutation
  const saveMutation = trpc.prayers.save.useMutation({
    onSuccess: () => {
      toast.success("Prayer saved to your collection");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to save prayer");
    },
  });
  
  const handleSave = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to save prayers");
      window.location.href = getLoginUrl();
      return;
    }
    if (!id) {
      toast.error("Prayer ID not available");
      return;
    }
    saveMutation.mutate({ prayerId: id });
  };
  
  const handleShare = async () => {
    const shareText = `${title}\n\n${body}\n\n- ${affirmation}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: shareText,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        toast.success("Prayer copied to clipboard");
      } catch (error) {
        toast.error("Failed to copy prayer");
      }
    }
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
            Daily Affirmation
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
            Action Step
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
            Whisper Prayer
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
          {saveMutation.isPending ? "Saving..." : "Save"}
        </Button>
        <Button variant="outline" size="lg" className="gap-2" disabled>
          <Volume2 className="w-4 h-4" />
          Listen
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          className="gap-2"
          onClick={handleShare}
        >
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      </motion.div>
    </motion.article>
  );
}
