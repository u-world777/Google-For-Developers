import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db';
import { MOCK_USERS } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email) {
      return NextResponse.json({ success: false, message: 'Email address is required' }, { status: 400 });
    }

    const trimmedEmail = email.toLowerCase().trim();

    // Query members from database
    const members = await dbService.getMembers();
    const dbMember = members.find(m => m.email.toLowerCase() === trimmedEmail);

    let authenticatedUser;

    if (dbMember) {
      authenticatedUser = {
        id: dbMember.id,
        name: dbMember.name,
        email: dbMember.email,
        role: dbMember.role,
        title: dbMember.title,
        department: dbMember.department,
        token: `tok-db-${Date.now()}`
      };
    } else if (MOCK_USERS[trimmedEmail]) {
      authenticatedUser = MOCK_USERS[trimmedEmail];
    } else {
      // Fallback matching by role keyword in email
      let fallbackRole: 'CITIZEN' | 'COUNCILLOR' | 'ENGINEER' | 'COLLECTOR' | 'MP' = 'CITIZEN';
      if (trimmedEmail.includes('mp')) fallbackRole = 'MP';
      else if (trimmedEmail.includes('collector') || trimmedEmail.includes('dm')) fallbackRole = 'COLLECTOR';
      else if (trimmedEmail.includes('engineer') || trimmedEmail.includes('pwd')) fallbackRole = 'ENGINEER';
      else if (trimmedEmail.includes('councillor') || trimmedEmail.includes('ward')) fallbackRole = 'COUNCILLOR';

      authenticatedUser = {
        id: `usr-${Date.now()}`,
        name: email.split('@')[0].toUpperCase(),
        email: trimmedEmail,
        role: fallbackRole,
        title: `${fallbackRole} Authenticated Officer`,
        department: 'LokSeva Digital Infrastructure',
        token: `tok-gen-${Date.now()}`
      };
    }

    // Prepare response & set session cookie
    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful',
      user: authenticatedUser
    });

    response.cookies.set('lokseva_role', authenticatedUser.role, {
      path: '/',
      maxAge: 86400,
      httpOnly: false
    });

    return response;
  } catch (error: any) {
    console.error('Auth Login API Error:', error);
    return NextResponse.json({ success: false, message: 'Internal authentication server error' }, { status: 500 });
  }
}
