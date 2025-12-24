import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Share2, Heart, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PrayerProps {
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
  title,
  subtitle,
  body,
  affirmation,
  actionStep,
  whisperPrayer,
  blessing,
  date,
}: PrayerProps) {
  // Animation variants for staggered entrance
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" } as any
    },
  };

  return (
    <motion.article 
      variants={container}
      initial="hidden"
      animate="show"
      className="relative max-w-2xl mx-auto px-6 py-12 md:py-20 space-y-16"
    >
      {/* Header Section */}
      <motion.header variants={item} className="text-center space-y-6">
        <div className="inline-block px-3 py-1 rounded-full glass text-xs font-medium tracking-widest uppercase text-muted-foreground mb-4">
          {date}
        </div>
        <h1 className="text-4xl md:text-6xl font-serif font-medium leading-tight text-balance text-primary">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl md:text-2xl font-serif italic text-muted-foreground text-balance">
            {subtitle}
          </p>
        )}
      </motion.header>

      {/* Prayer Body */}
      <motion.div variants={item} className="prose prose-lg md:prose-xl prose-p:leading-relaxed prose-p:text-foreground/90 font-sans mx-auto">
        {body.split('\n\n').map((paragraph, idx) => (
          <p key={idx} className="mb-6 first-letter:text-5xl first-letter:font-serif first-letter:mr-3 first-letter:float-left first-letter:text-primary">
            {paragraph}
          </p>
        ))}
      </motion.div>

      {/* Daily Affirmation */}
      <motion.section variants={item} className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 blur-3xl -z-10" />
        <div className="glass rounded-2xl p-8 md:p-10 text-center space-y-4 border-primary/10">
          <h3 className="text-sm font-medium tracking-widest uppercase text-primary/70">Daily Affirmation</h3>
          <p className="text-2xl md:text-3xl font-serif italic text-foreground leading-relaxed">
            "{affirmation}"
          </p>
        </div>
      </motion.section>

      {/* Action Step & Whisper Prayer */}
      <motion.section variants={item} className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-xl font-serif font-medium text-primary flex items-center gap-3">
            <span className="h-px flex-1 bg-primary/20"></span>
            Action Step
            <span className="h-px flex-1 bg-primary/20"></span>
          </h3>
          <p className="text-lg text-foreground/80 leading-relaxed text-center">
            {actionStep}
          </p>
        </div>

        {whisperPrayer && (
          <div className="text-center space-y-2">
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Whisper Prayer</span>
            <p className="text-lg font-serif italic text-primary/80">
              "{whisperPrayer}"
            </p>
          </div>
        )}
      </motion.section>

      {/* Blessing */}
      <motion.footer variants={item} className="text-center pt-8 pb-12">
        <div className="w-12 h-12 mx-auto mb-6 text-primary/40">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        </div>
        <p className="text-xl md:text-2xl font-serif text-foreground/90 leading-relaxed max-w-xl mx-auto">
          {blessing}
        </p>
      </motion.footer>

      {/* Action Bar */}
      <motion.div 
        variants={item}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 glass rounded-full px-6 py-3 flex items-center gap-4 z-50"
      >
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 text-primary">
          <Heart className="w-5 h-5" />
        </Button>
        <div className="w-px h-4 bg-primary/20" />
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 text-primary">
          <Volume2 className="w-5 h-5" />
        </Button>
        <div className="w-px h-4 bg-primary/20" />
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 text-primary">
          <Share2 className="w-5 h-5" />
        </Button>
      </motion.div>
    </motion.article>
  );
}
