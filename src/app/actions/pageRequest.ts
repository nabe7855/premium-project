'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Type definitions ensuring consistency with frontend
// (Ideally these should be shared in a types file, but defining here for independent action)

interface GridElement {
  id: string;
  type: string;
  label: string;
  comment: string;
  gridPosition: { row: number; col: number };
  rowSpan: number;
  colSpan: number;
}

interface Section {
  id: string;
  name: string;
  type: string;
  content: string;
  comment: string;
  gridElements: GridElement[];
}

export interface PageRequestData {
  id: string;
  title: string;
  slug: string;
  referenceUrls: string[];
  sections: Section[];
  updatedAt: string;
  status: 'draft' | 'published';
}

export async function getPageRequests(): Promise<PageRequestData[]> {
  try {
    const requests = await prisma.pageRequest.findMany({
      orderBy: { updatedAt: 'desc' },
    });

    return requests.map((req: any) => ({
      id: req.id,
      title: req.title,
      slug: req.slug,
      referenceUrls: (req.referenceUrls as string[]) || [], // array of strings
      sections: (req.sections as unknown as Section[]) || [], // complex json object
      status: req.status as 'draft' | 'published',
      updatedAt: req.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error('Failed to fetch page requests:', error);
    return [];
  }
}

export async function createPageRequest(data: {
  title: string;
  slug: string;
  referenceUrls: string[];
  sections: Section[];
}) {
  try {
    const newRequest = await prisma.pageRequest.create({
      data: {
        title: data.title,
        slug: data.slug,
        referenceUrls: data.referenceUrls, // Prisma handles string[] -> json auto if typed correctly
        sections: data.sections as any, // Cast to any for Json input
        status: 'draft',
      },
    });

    revalidatePath('/admin/admin/page-request');
    return { success: true, id: newRequest.id };
  } catch (error) {
    console.error('Failed to create page request:', error);
    return { success: false, error: 'Failed to create request' };
  }
}

export async function updatePageRequest(
  id: string,
  data: {
    title: string;
    slug: string;
    referenceUrls: string[];
    sections: Section[];
  },
) {
  try {
    await prisma.pageRequest.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        referenceUrls: data.referenceUrls,
        sections: data.sections as any,
      },
    });

    revalidatePath('/admin/admin/page-request');
    return { success: true };
  } catch (error) {
    console.error('Failed to update page request:', error);
    return { success: false, error: 'Failed to update request' };
  }
}

export async function deletePageRequest(id: string) {
  try {
    await prisma.pageRequest.delete({
      where: { id },
    });

    revalidatePath('/admin/admin/page-request');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete page request:', error);
    return { success: false, error: 'Failed to delete request' };
  }
}
