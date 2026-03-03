'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// -- 記事の型定義 --
export interface MediaArticleData {
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  thumbnail_url?: string | null;
  target_audience: 'user' | 'recruit';
  status: 'draft' | 'published';
  author_name?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  published_at?: Date | null;
}

// -- 全記事取得（管理画面用） --
export async function getMediaArticles(targetAudience?: 'user' | 'recruit') {
  try {
    const whereClause = targetAudience ? { target_audience: targetAudience } : {};
    const articles = await prisma.mediaArticle.findMany({
      where: whereClause,
      orderBy: { created_at: 'desc' },
      include: {
        tags: {
          include: { tag: true },
        },
      },
    });
    return { success: true, articles };
  } catch (error: any) {
    console.error('Error fetching media articles:', error);
    return { success: false, error: error.message };
  }
}

// -- 単一記事取得 --
export async function getMediaArticleById(id: string) {
  try {
    const article = await prisma.mediaArticle.findUnique({
      where: { id },
      include: {
        tags: {
          include: { tag: true },
        },
      },
    });
    return { success: true, article };
  } catch (error: any) {
    console.error('Error fetching media article:', error);
    return { success: false, error: error.message };
  }
}

// -- 記事の新規作成 --
export async function createMediaArticle(data: MediaArticleData, tags: string[] = []) {
  try {
    // 1. スラグの重複チェック
    const existing = await prisma.mediaArticle.findUnique({ where: { slug: data.slug } });
    if (existing) {
      return { success: false, error: 'このURLスラグは既に使用されています。' };
    }

    // 2. 記事の作成
    const article = await prisma.mediaArticle.create({
      data: {
        ...data,
        published_at: data.status === 'published' ? new Date() : null,
      },
    });

    // 3. タグの処理（もしあれば）
    if (tags.length > 0) {
      for (const tagName of tags) {
        // タグが存在しなければ作成
        let tag = await prisma.mediaTag.findUnique({ where: { name: tagName } });
        if (!tag) {
          tag = await prisma.mediaTag.create({ data: { name: tagName } });
        }
        // 中間テーブルに登録
        await prisma.mediaArticleTag.create({
          data: {
            article_id: article.id,
            tag_id: tag.id,
          },
        });
      }
    }

    revalidatePath('/admin');
    return { success: true, article };
  } catch (error: any) {
    console.error('Error creating media article:', error);
    return { success: false, error: error.message };
  }
}

// -- 記事の更新 --
export async function updateMediaArticle(id: string, data: MediaArticleData, tags: string[] = []) {
  try {
    // スラグ重複チェック（自分自身は除く）
    const existing = await prisma.mediaArticle.findUnique({ where: { slug: data.slug } });
    if (existing && existing.id !== id) {
      return { success: false, error: 'このURLスラグは他の記事で既に使用されています。' };
    }

    // 更新処理
    const articleInfo = await prisma.mediaArticle.findUnique({ where: { id } });

    // 初めて公開状態になった時にpublished_atを入れる
    let publishedAt = articleInfo?.published_at;
    if (articleInfo?.status !== 'published' && data.status === 'published') {
      publishedAt = new Date();
    }

    const article = await prisma.mediaArticle.update({
      where: { id },
      data: {
        ...data,
        published_at: publishedAt,
      },
    });

    // --- タグの更新処理 ---
    // 一旦既存の紐付けを全削除
    await prisma.mediaArticleTag.deleteMany({
      where: { article_id: id },
    });

    // 新たに紐付け
    for (const tagName of tags) {
      let tag = await prisma.mediaTag.findUnique({ where: { name: tagName } });
      if (!tag) {
        tag = await prisma.mediaTag.create({ data: { name: tagName } });
      }
      await prisma.mediaArticleTag.create({
        data: {
          article_id: article.id,
          tag_id: tag.id,
        },
      });
    }

    revalidatePath('/admin');
    return { success: true, article };
  } catch (error: any) {
    console.error('Error updating media article:', error);
    return { success: false, error: error.message };
  }
}

// -- 記事の削除 --
export async function deleteMediaArticle(id: string) {
  try {
    await prisma.mediaArticle.delete({
      where: { id },
    });
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting media article:', error);
    return { success: false, error: error.message };
  }
}
