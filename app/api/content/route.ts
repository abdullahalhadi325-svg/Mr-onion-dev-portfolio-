import { NextRequest, NextResponse } from 'next/server';
import { getSiteContent, saveSiteContent, resetSiteContent, undoSiteContent } from '@/lib/contentStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const content = await getSiteContent();
    return NextResponse.json({
      success: true,
      data: content,
    });
  } catch (error) {
    console.error('Error fetching site content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { en, bn, secretKey } = body;

    if (!en || !bn) {
      return NextResponse.json(
        { success: false, error: 'Invalid content schema: "en" and "bn" are required.' },
        { status: 400 }
      );
    }

    const updated = await saveSiteContent({ en, bn }, secretKey);
    return NextResponse.json({
      success: true,
      message: 'Website content updated successfully.',
      data: updated,
    });
  } catch (error) {
    console.error('Error saving site content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save content' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    if (body.action === 'reset') {
      const reset = await resetSiteContent();
      return NextResponse.json({
        success: true,
        message: 'Content successfully reset to factory defaults.',
        data: reset,
      });
    } else if (body.action === 'undo') {
      const undo = await undoSiteContent();
      return NextResponse.json({
        success: true,
        message: 'Content successfully reverted to previous state.',
        data: undo,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Unknown action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error resetting site content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reset content' },
      { status: 500 }
    );
  }
}
