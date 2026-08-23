import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/db';
import { ProjectData } from '@/lib/constituency-data';

// GET /api/projects - Retrieve all MPLADS infrastructure projects
export async function GET() {
  try {
    const projects = await dbService.getProjects();
    return NextResponse.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST /api/projects - Sanction new MPLADS infrastructure project (MP Executive Order)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, wardName, sanctionedBudgetCr, contractorName, actorName = 'Dr. Rajeshwar Sharma (MP)' } = body;

    if (!title || !sanctionedBudgetCr) {
      return NextResponse.json({ success: false, error: 'title and sanctionedBudgetCr are required' }, { status: 400 });
    }

    const newProject: ProjectData = {
      id: `proj-${Date.now()}`,
      name: title,
      wardId: 'ward-5',
      wardName: wardName || 'Ward 5 - Shivpur Peri-Urban Sector',
      category: 'ROADS',
      sanctionedBudgetCr: Number(sanctionedBudgetCr),
      spentBudgetCr: Number((Number(sanctionedBudgetCr) * 0.4).toFixed(2)),
      progressPercentage: 15,
      status: 'IN_PROGRESS',
      contractorName: contractorName || 'Varanasi Municipal Infra Works',
      startDate: new Date().toISOString().split('T')[0],
      targetCompletionDate: '2026-11-30',
      description: `MPLADS funded infrastructure project for ${wardName || 'Ward 5'}.`
    };

    await dbService.addProject(newProject);

    // Append to Audit Ledger
    await dbService.addAuditLog({
      actorRole: 'MP',
      actorName,
      actionType: 'FUND_SANCTION',
      targetItem: title,
      details: `MPLADS Fund Sanctioned: ₹${sanctionedBudgetCr} Cr. Treasury Release Order #MPLADS-2026 issued.`,
      impactMetric: `₹${sanctionedBudgetCr} Cr Approved`
    });

    return NextResponse.json({ success: true, data: newProject }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ success: false, error: 'Failed to sanction project' }, { status: 500 });
  }
}

// PATCH /api/projects - Update progress percentage or audit status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, progressPercentage, actorRole = 'ENGINEER', actorName = 'Chief Engineer' } = body;

    if (!id || progressPercentage === undefined) {
      return NextResponse.json({ success: false, error: 'id and progressPercentage are required' }, { status: 400 });
    }

    const updated = await dbService.updateProjectProgress(id, Number(progressPercentage));

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    // Append Audit Log
    await dbService.addAuditLog({
      actorRole,
      actorName,
      actionType: 'MACHINERY_DISPATCH',
      targetItem: updated.name,
      details: `Project progress advanced to ${updated.progressPercentage}%. Verification geotag logged.`,
      impactMetric: `${updated.progressPercentage}% Complete`
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ success: false, error: 'Failed to update project progress' }, { status: 500 });
  }
}
