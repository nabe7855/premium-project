'use server';

import { prisma } from '@/lib/prisma';

export interface PartnerLinkData {
  id?: string;
  site_name: string;
  site_url: string;
  banner_url?: string | null;
  description?: string | null;
  seo_keywords?: string | null;
  category?: string;
  location?: string;
  display_order?: number;
  is_active?: boolean;
}

export async function getAllPartnerLinks() {
  try {
    const links = await prisma.partnerLink.findMany({
      orderBy: { display_order: 'asc' },
    });
    return { success: true, links };
  } catch (error: any) {
    console.error('getAllPartnerLinks error:', error);
    return { success: false, error: error.message, links: [] };
  }
}

export async function getActivePartnerLinks(locationSlug?: string) {
  try {
    const whereClause: any = {
      is_active: true,
    };

    // If location is provided, get 'all' OR that specific location
    if (locationSlug) {
      whereClause.OR = [
        { location: 'all' },
        { location: locationSlug },
      ];
    }

    const links = await prisma.partnerLink.findMany({
      where: whereClause,
      orderBy: {
        display_order: 'asc',
      },
    });
    return { success: true, links };
  } catch (error) {
    console.error('Error fetching active partner links:', error);
    return { success: false, error: 'パートナーリンクの取得に失敗しました' };
  }
}

export async function upsertPartnerLink(data: PartnerLinkData) {
  try {
    const payload = {
      site_name: data.site_name,
      site_url: data.site_url,
      banner_url: data.banner_url ?? null,
      description: data.description,
      seo_keywords: data.seo_keywords,
      category: data.category ?? 'general',
      location: data.location ?? 'all',
      display_order: data.display_order ?? 0,
      is_active: data.is_active ?? true,
    };

    if (data.id) {
      const link = await prisma.partnerLink.update({
        where: { id: data.id },
        data: payload,
      });
      return { success: true, link };
    } else {
      const link = await prisma.partnerLink.create({ data: payload });
      return { success: true, link };
    }
  } catch (error: any) {
    console.error('upsertPartnerLink error:', error);
    return { success: false, error: error.message };
  }
}

export async function deletePartnerLink(id: string) {
  try {
    await prisma.partnerLink.delete({ where: { id } });
    return { success: true };
  } catch (error: any) {
    console.error('deletePartnerLink error:', error);
    return { success: false, error: error.message };
  }
}
