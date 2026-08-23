import { NextRequest, NextResponse } from 'next/server';
import { dbService, GovernanceMember } from '@/lib/db';

// GET /api/members - Fetch all active governance team members & officials
export async function GET(request: NextRequest) {
  try {
    const members = await dbService.getMembers();
    return NextResponse.json({ success: true, count: members.length, data: members });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch team members', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/members - Add a new governance team member/official
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.title || !body.role) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, title, role' },
        { status: 400 }
      );
    }

    const newMember: GovernanceMember = {
      id: `mem-${Date.now()}`,
      name: body.name.trim(),
      title: body.title.trim(),
      role: body.role,
      department: body.department ? body.department.trim() : 'District Governance Cell',
      wardName: body.wardName ? body.wardName.trim() : 'All Wards',
      email: body.email ? body.email.trim() : `${body.name.toLowerCase().replace(/\s+/g, '.')}@lokseva.gov.in`,
      phone: body.phone ? body.phone.trim() : '+91 98000 00000',
      activeStatus: true
    };

    const created = await dbService.addMember(newMember);

    return NextResponse.json(
      { success: true, message: 'Member added successfully', data: created },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to add member', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/members - Remove a governance team member by ID
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Member ID parameter is required' },
        { status: 400 }
      );
    }

    const removed = await dbService.deleteMember(id);

    if (!removed) {
      return NextResponse.json(
        { success: false, error: 'Member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Member ${removed.name} removed successfully`,
      data: removed
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to remove member', details: error.message },
      { status: 500 }
    );
  }
}
