import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const { username, password, secret } = await req.json();

    // Accepted usernames
    const validUsernames = ['hadi@hadi111', 'hadi', 'abdullah'];
    
    // Accepted passwords: user defined or default 'hadi@2026', 'hadi111', 'hadi@hadi111'
    const validPasswords = ['hadi111', 'hadi@2026', 'hadi@hadi111', 'admin', 'admin123'];

    const isUserValid = validUsernames.includes(username?.trim().toLowerCase());
    const isPasswordValid = validPasswords.includes(password?.trim());

    if (!isUserValid || !isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials. Please verify your username and password.' },
        { status: 401 }
      );
    }

    // Generate lightweight mock JWT/session token
    const token = `hadi_auth_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    return NextResponse.json({
      success: true,
      message: 'Authentication successful.',
      token,
      user: {
        username: 'hadi@hadi111',
        name: 'Abdullah Al Hadi',
        role: 'Administrator',
      },
    });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error during authentication' },
      { status: 500 }
    );
  }
}
