'use server';

import { sendInterviewReservationNotification, sendRecruitNotification, sendRecruitAutoReply } from '@/lib/mail';
import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabaseClient';
import { revalidatePath } from 'next/cache';

export async function submitRecruitApplication(formData: FormData) {
  console.log('🚀 submitRecruitApplication called');
  try {
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const age = formData.get('age') as string;
    const height = formData.get('height') as string;
    const weight = formData.get('weight') as string;
    const address = formData.get('address') as string;
    const message = formData.get('message') as string;
    const store = formData.get('store') as string;
    const type = formData.get('type') as string;

    console.log('📝 Application info:', { name, email, store, type });
    const simulationResultStr = formData.get('simulationResult') as string;
    const simulationResult = simulationResultStr ? JSON.parse(simulationResultStr) : null;

    // その他の項目を details JSON にまとめる
    const details = {
      employment: formData.get('employment') as string,
      qualifications: formData.get('qualifications') as string,
      experience: formData.get('experience') as string,
      therapist_exp: formData.get('therapist_exp') as string,
      youtube: formData.get('youtube') as string,
      transport: formData.get('transport') as string,
      source: formData.get('source') as string,
      keyword: formData.get('keyword') as string,
    };

    // 1. 応募者基本情報をデータベースに保存
    const application = await prisma.recruitApplication.create({
      data: {
        type,
        name,
        phone,
        email,
        age,
        height,
        weight,
        address,
        message,
        store,
        simulationResult,
        details,
        status: 'pending',
      },
    });

    // 2. 写真の処理
    const photoFiles = formData.getAll('photos') as File[];
    const uploadedPhotos = [];

    for (const file of photoFiles) {
      if (file.size === 0) continue;

      const fileExt = file.name.split('.').pop();
      const fileName = `${application.id}/${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `applications/${fileName}`;

      const { error } = await supabase.storage.from('recruit-photos').upload(filePath, file);

      if (error) {
        console.error('Photo upload error:', error);
        continue;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('recruit-photos').getPublicUrl(filePath);

      // 写真情報をデータベースに保存
      const photo = await prisma.recruitPhoto.create({
        data: {
          url: publicUrl,
          applicationId: application.id,
        },
      });
      uploadedPhotos.push(photo);
    }

    // 3. メール通知の送信
    let emailResult = null;
    try {
      console.log('📧 Sending recruitment notification email...');
      emailResult = await sendRecruitNotification(application, uploadedPhotos);
      if (emailResult && !emailResult.success) {
        console.error('❌ Email notification returned failure:', emailResult.error);
      } else {
        console.log('✅ Recruitment notification email sent successfully');
      }

      // 4. 応募者への自動返信メール
      if (application.email) {
        console.log('📧 Sending auto-reply email to applicant...');
        const autoReplyResult = await sendRecruitAutoReply(application);
        if (autoReplyResult && !autoReplyResult.success) {
          console.error('❌ Auto-reply email failed:', autoReplyResult.error);
        } else {
          console.log('✅ Auto-reply email sent successfully');
        }
      }
    } catch (emailError) {
      // メール送信に失敗しても応募自体は成功とする（ログ出力のみ）
      console.error('Notification email failed with exception:', emailError);
      emailResult = { success: false, error: String(emailError) };
    }

    revalidatePath('/admin/admin/interview-reservations');

    return { 
      success: true, 
      id: application.id, 
      debug: { 
        emailStatus: emailResult
      } 
    };
  } catch (error: any) {
    console.error('Recruit submission error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      meta: error.meta,
    });
    return {
      success: false,
      error: `送信に失敗しました。詳細: ${error.message || '不明なエラー'}`,
    };
  }
}

export async function deleteRecruitApplication(id: string) {
  try {
    // 1. 紐づく写真情報を取得
    const photos = await prisma.recruitPhoto.findMany({
      where: { applicationId: id },
    });

    // 2. Storage から画像を削除
    if (photos.length > 0) {
      const filePaths = photos
        .map((photo: { url: string }) => {
          const url = photo.url;
          const parts = url.split('/recruit-photos/');
          return parts.length > 1 ? parts[1].split('?')[0] : null;
        })
        .filter(Boolean) as string[];

      if (filePaths.length > 0) {
        console.log('🗑️ Deleting files from storage:', filePaths);
        const { error: storageError } = await supabase.storage
          .from('recruit-photos')
          .remove(filePaths);

        if (storageError) {
          console.error('Storage deletion error:', storageError);
        }
      }
    }

    // 3. データベースから削除
    await prisma.recruitApplication.delete({
      where: { id },
    });

    revalidatePath('/admin/admin/interview-reservations');
    return { success: true };
  } catch (error) {
    console.error('Delete application error:', error);
    return { success: false, error: '削除に失敗しました。' };
  }
}

export async function updateApplicationStatus(id: string, status: string) {
  try {
    await prisma.recruitApplication.update({
      where: { id },
      data: { status },
    });
    revalidatePath('/admin/admin/interview-reservations');
    return { success: true };
  } catch (error) {
    console.error('Update status error:', error);
    return { success: false, error: '更新に失敗しました。' };
  }
}

export async function updateRecruitAdminData(
  id: string,
  data: { adminMemo?: string; interviewDate?: string },
) {
  console.log('🚀 updateRecruitAdminData called with:', { id, ...data });
  try {
    const updatedApplication = await prisma.recruitApplication.update({
      where: { id },
      data: {
        adminMemo: data.adminMemo,
        interviewDate: data.interviewDate,
      },
    });

    if (data.interviewDate) {
      console.log('Sending interview notification for ID:', id);
      try {
        await sendInterviewReservationNotification(updatedApplication);
      } catch (mailError) {
        console.error('Failed to send interview notification email:', mailError);
      }
    } else {
      console.log('ℹ️ Notification skipped: interviewDate is empty.');
    }

    revalidatePath('/admin/admin/interview-reservations');
    return { success: true };
  } catch (error) {
    console.error('Update admin data error:', error);
    return { success: false, error: '更新に失敗しました。' };
  }
}

export async function getRecruitApplications() {
  try {
    return await prisma.recruitApplication.findMany({
      include: {
        photos: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (error) {
    console.error('Fetch applications error:', error);
    return [];
  }
}

export async function getPendingApplicationsCount() {
  try {
    return await prisma.recruitApplication.count({
      where: { status: 'pending' },
    });
  } catch (error) {
    console.error('Fetch pending count error:', error);
    return 0;
  }
}

export async function getRecruitPageConfig(slug: string) {
  console.log(`📡 getRecruitPageConfig called for slug: ${slug}`);
  try {
    const store = await prisma.store.findUnique({
      where: { slug },
      include: {
        recruit_pages: true,
        store_top_config: true,
      },
    });

    if (!store) {
      console.warn(`⚠️ Store not found for slug: ${slug}`);
      return { success: false, error: '店舗が見つかりません。' };
    }

    const config: any = {};
    store.recruit_pages.forEach((page: any) => {
      config[page.section_key] = page.content;
    });

    const storeInfo = {
      name: store.name,
      address: store.address,
      phone: store.phone,
      slug: store.slug,
    };

    const { getStoreTopConfig } = await import('@/lib/store/getStoreTopConfig');
    const topConfigResult = await getStoreTopConfig(slug);
    const topConfig = topConfigResult.success ? topConfigResult.config : null;
    return { success: true, config, storeInfo, topConfig };
  } catch (error) {
    console.error('Failed to get recruit page config:', error);
    return { success: false, error: '設定の取得に失敗しました。' };
  }
}

export async function saveRecruitPageConfig(slug: string, config: any) {
  console.log(`💾 saveRecruitPageConfig called for slug: ${slug}`);
  try {
    const store = await prisma.store.findUnique({
      where: { slug },
    });

    if (!store) {
      console.error(`❌ Store not found for slug: ${slug}`);
      return { success: false, error: '店舗が見つかりません。' };
    }

    for (const [sectionKey, content] of Object.entries(config)) {
      try {
        await prisma.recruitPage.upsert({
          where: {
            store_id_section_key: {
              store_id: store.id,
              section_key: sectionKey,
            },
          },
          update: {
            content: content as any,
          },
          create: {
            store_id: store.id,
            section_key: sectionKey,
            content: content as any,
          },
        });
      } catch (upsertError: any) {
        console.error(`❌ Failed to upsert ${sectionKey}:`, upsertError);
        throw upsertError;
      }
    }

    revalidatePath(`/store/${slug}/recruit`);
    return { success: true };
  } catch (error) {
    console.error('Failed to save recruit page config:', error);
    return { success: false, error: '設定の保存に失敗しました。' };
  }
}
