import fs from 'fs/promises';
import path from 'path';
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

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'site-content.json');

// In-memory cache for fast reads
let memoryCache: SiteContentSchema | null = null;

/**
 * Initializes and retrieves the site content.
 * Falls back to hardcoded `siteData` if the JSON file is not yet written.
 */
export async function getSiteContent(): Promise<SiteContentSchema> {
  if (memoryCache) {
    return memoryCache;
  }

  try {
    const rawData = await fs.readFile(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(rawData) as SiteContentSchema;
    if (parsed.en && parsed.bn) {
      const mergedEn: LocaleContent = {
        ...siteData.en,
        ...parsed.en,
        hero: { ...siteData.en.hero, ...parsed.en.hero },
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
        hero: { ...siteData.bn.hero, ...parsed.bn.hero },
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
  } catch {
    // File doesn't exist yet or is invalid, seed with siteData
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
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  } catch (error) {
    console.warn('Failed to persist initial site-content.json:', error);
  }

  memoryCache = initialData;
  return initialData;
}

/**
 * Updates the site content and persists to data/site-content.json
 */
export async function saveSiteContent(
  updatedContent: { en: LocaleContent; bn: LocaleContent },
  secretKey?: string
): Promise<SiteContentSchema> {
  await fs.mkdir(DATA_DIR, { recursive: true });

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

  await fs.writeFile(DATA_FILE, JSON.stringify(newSchema, null, 2), 'utf-8');
  memoryCache = newSchema;
  return newSchema;
}

/**
 * Resets site content back to initial hardcoded defaults in lib/siteData.ts
 */
export async function resetSiteContent(): Promise<SiteContentSchema> {
  const defaultData: SiteContentSchema = {
    en: siteData.en,
    bn: siteData.bn,
    lastUpdated: new Date().toISOString(),
    adminConfig: {
      username: 'hadi@hadi111',
      secretKey: 'hadi',
    },
  };

  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
  memoryCache = defaultData;
  return defaultData;
}
