import { createClient } from '@supabase/supabase-js';
import { siteData, LocaleContent } from './siteData';

export interface SiteContentSchema {
  en: LocaleContent;
  bn: LocaleContent;
  lastUpdated?: string;
  adminConfig?: {
    username: string;
    secretKey: string;
  };
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SECRET_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// In-memory cache for fast reads
let memoryCache: SiteContentSchema | null = null;

const RECORD_ID = 1;

/**
 * Initializes and retrieves the site content.
 */
export async function getSiteContent(): Promise<SiteContentSchema> {
  if (memoryCache) {
    return memoryCache;
  }

  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('data')
      .eq('id', RECORD_ID)
      .single();

    if (!error && data?.data) {
      const parsed = data.data as SiteContentSchema;
      if (parsed.en && parsed.bn) {
        const mergedEn: LocaleContent = {
          ...siteData.en,
          ...parsed.en,
          hero: {
            ...siteData.en.hero,
            ...parsed.en.hero,
            scarcityBadge: {
              ...(siteData.en.hero.scarcityBadge || { visible: false, text: '', status: 'available' }),
              ...(parsed.en.hero?.scarcityBadge || {})
            }
          },
          about: { ...siteData.en.about, ...parsed.en.about },
          labels: { ...siteData.en.labels, ...parsed.en.labels },
          socialLinks: { ...siteData.en.socialLinks, ...parsed.en.socialLinks },
          footer: { ...siteData.en.footer, ...parsed.en.footer },
          projects: parsed.en.projects || siteData.en.projects,
          experience: parsed.en.experience || siteData.en.experience,
        };
        const mergedBn: LocaleContent = {
          ...siteData.bn,
          ...parsed.bn,
          hero: {
            ...siteData.bn.hero,
            ...parsed.bn.hero,
            scarcityBadge: {
              ...(siteData.bn.hero.scarcityBadge || { visible: false, text: '', status: 'available' }),
              ...(parsed.bn.hero?.scarcityBadge || {})
            }
          },
          about: { ...siteData.bn.about, ...parsed.bn.about },
          labels: { ...siteData.bn.labels, ...parsed.bn.labels },
          socialLinks: { ...siteData.bn.socialLinks, ...parsed.bn.socialLinks },
          footer: { ...siteData.bn.footer, ...parsed.bn.footer },
          projects: parsed.bn.projects || siteData.bn.projects,
          experience: parsed.bn.experience || siteData.bn.experience,
        };
        const mergedSchema: SiteContentSchema = {
          ...parsed,
          en: mergedEn,
          bn: mergedBn,
        };
        memoryCache = mergedSchema;
        return mergedSchema;
      }
    }
  } catch (err) {
    console.error('Error fetching site content from Supabase:', err);
  }

  const initialData: SiteContentSchema = {
    en: siteData.en,
    bn: siteData.bn,
    lastUpdated: new Date().toISOString(),
    adminConfig: {
      username: 'hadi@hadi111',
      secretKey: 'hadi',
    },
  };

  try {
    await supabase.from('site_content').upsert({
      id: RECORD_ID,
      data: initialData,
    });
  } catch (error) {
    console.warn('Failed to persist initial content to Supabase:', error);
  }

  memoryCache = initialData;
  return initialData;
}

/**
 * Updates the site content and persists to Supabase.
 */
export async function saveSiteContent(
  updatedContent: { en: LocaleContent; bn: LocaleContent },
  secretKey?: string
): Promise<SiteContentSchema> {
  const current = await getSiteContent();
  const newSchema: SiteContentSchema = {
    en: updatedContent.en,
    bn: updatedContent.bn,
    lastUpdated: new Date().toISOString(),
    adminConfig: {
      username: 'hadi@hadi111',
      secretKey: secretKey || current.adminConfig?.secretKey || 'hadi',
    },
  };

  try {
    await supabase.from('site_content').upsert({
      id: RECORD_ID,
      data: newSchema,
      previous_data: current,
    });
  } catch (error) {
    console.warn('Failed to save content to Supabase:', error);
  }

  memoryCache = newSchema;
  return newSchema;
}

/**
 * Resets site content back to initial hardcoded defaults in lib/siteData.ts
 */
export async function resetSiteContent(): Promise<SiteContentSchema> {
  const current = await getSiteContent();
  const defaultData: SiteContentSchema = {
    en: siteData.en,
    bn: siteData.bn,
    lastUpdated: new Date().toISOString(),
    adminConfig: {
      username: 'hadi@hadi111',
      secretKey: 'hadi',
    },
  };

  try {
    await supabase.from('site_content').upsert({
      id: RECORD_ID,
      data: defaultData,
      previous_data: current,
    });
  } catch (error) {
    console.warn('Failed to reset content in Supabase:', error);
  }

  memoryCache = defaultData;
  return defaultData;
}

/**
 * Undo the last edit.
 */
export async function undoSiteContent(): Promise<SiteContentSchema> {
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('previous_data')
      .eq('id', RECORD_ID)
      .single();

    if (!error && data?.previous_data) {
      const previousData = data.previous_data as SiteContentSchema;
      const current = await getSiteContent();

      await supabase.from('site_content').upsert({
        id: RECORD_ID,
        data: previousData,
        previous_data: current,
      });

      memoryCache = previousData;
      return previousData;
    }
  } catch (err) {
    console.error('Error undoing site content in Supabase:', err);
  }

  // Fallback if no previous data
  return getSiteContent();
}
