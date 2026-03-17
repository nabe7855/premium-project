'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * 公開用のコメント一覧を取得（非表示のものを除く）
 */
export async function getCommentsByPostId(postId: string) {
  try {
    const comments = await prisma.blogComment.findMany({
      where: {
        blog_id: postId,
        is_hidden: false,
      },
      orderBy: {
        created_at: 'asc',
      },
    });
    return { success: true, data: comments };
  } catch (error) {
    console.error('❌ Error fetching comments:', error);
    return { success: false, error: 'コメントの取得に失敗しました' };
  }
}

/**
 * キャスト管理用のコメント一覧を取得（全て）
 */
export async function getAllCommentsByPostId(postId: string) {
  try {
    const comments = await prisma.blogComment.findMany({
      where: {
        blog_id: postId,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
    return { success: true, data: comments };
  } catch (error) {
    console.error('❌ Error fetching all comments:', error);
    return { success: false, error: 'コメントの取得に失敗しました' };
  }
}

/**
 * コメントを投稿
 */
export async function postComment(postId: string, authorName: string, content: string) {
  try {
    const comment = await prisma.blogComment.create({
      data: {
        blog_id: postId,
        author_name: authorName || '匿名',
        content: content,
      },
    });
    revalidatePath(`/store/[slug]/diary/post/${postId}`, 'page');
    return { success: true, data: comment };
  } catch (error) {
    console.error('❌ Error posting comment:', error);
    return { success: false, error: 'コメントの投稿に失敗しました' };
  }
}

/**
 * コメントの表示/非表示を切り替え
 */
export async function toggleCommentVisibility(commentId: string, isHidden: boolean) {
  try {
    const comment = await prisma.blogComment.update({
      where: { id: commentId },
      data: { is_hidden: isHidden },
    });
    revalidatePath('/', 'layout'); // 広範囲に再検証
    return { success: true, data: comment };
  } catch (error) {
    console.error('❌ Error toggling comment visibility:', error);
    return { success: false, error: '設定の変更に失敗しました' };
  }
}
