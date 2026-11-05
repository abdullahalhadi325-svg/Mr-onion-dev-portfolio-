import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const { username, password, secret } = await req.json();

    const envUsername = process.env.ADMIN_USERNAME || 'hadi@hadi111';
    const envPassword = process.env.ADMIN_PASSWORD || 'hadi@2026';

    // Accepted usernames
    const validUsernames = [envUsername.toLowerCase()];
    
    // Accepted passwords
    const validPasswords = [envPassword];

    const isUserValid = validUsernames.includes(username?.trim().toLowerCase());
    const isPasswordValid = validPasswords.includes(password?.trim());

    if (!isUserValid || !isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials. Please verify your username and password.' },
        { status: 401 }
      );
    }

    // Generate secure session token
    const randomBytes = crypto.randomBytes(16).toString('hex');
    const token = `hadi_auth_${Date.now()}_${randomBytes}`;

    return NextResponse.json({
      success: true,
      message: 'Authentication successful.',
      token,
      user: {
        username: envUsername,
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
