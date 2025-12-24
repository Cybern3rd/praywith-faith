#!/usr/bin/env node

/**
 * Automated Daily Prayer Generation Script
 * 
 * This script generates prayers for all languages (en, es, fr, pt) for the current date.
 * It should be run daily via cron at midnight (server time).
 * 
 * Usage: node scripts/generate-daily-prayers.mjs
 */

import { db } from '../server/db.js';
import { prayers } from '../shared/schema.js';
import { eq, and } from 'drizzle-orm';
import { generatePrayer } from '../server/ai.js';

const LANGUAGES = ['en', 'es', 'fr', 'pt'];

async function generateDailyPrayers() {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  
  console.log(`[${new Date().toISOString()}] Starting daily prayer generation for ${today}`);
  
  for (const language of LANGUAGES) {
    try {
      console.log(`  Checking if prayer exists for ${language}...`);
      
      // Check if prayer already exists for this language and date
      const existingPrayer = await db
        .select()
        .from(prayers)
        .where(and(eq(prayers.language, language), eq(prayers.date, today)))
        .limit(1);
      
      if (existingPrayer.length > 0) {
        console.log(`  ✓ Prayer already exists for ${language}, skipping`);
        continue;
      }
      
      console.log(`  Generating prayer for ${language}...`);
      
      // Generate prayer using AI
      const prayerContent = await generatePrayer(language, today);
      
      // Insert into database
      await db.insert(prayers).values({
        language,
        date: today,
        title: prayerContent.title,
        subtitle: prayerContent.subtitle,
        content: prayerContent.body,
        reflection: prayerContent.actionStep,
        affirmation: prayerContent.affirmation,
        whisperPrayer: prayerContent.whisperPrayer,
        blessing: prayerContent.blessing,
      });
      
      console.log(`  ✓ Successfully generated prayer for ${language}`);
    } catch (error) {
      console.error(`  ✗ Failed to generate prayer for ${language}:`, error.message);
    }
  }
  
  console.log(`[${new Date().toISOString()}] Daily prayer generation completed`);
}

// Run the script
generateDailyPrayers()
  .then(() => {
    console.log('Script finished successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
