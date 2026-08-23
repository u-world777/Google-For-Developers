import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/db';
import { processGrievanceWithAI } from '@/lib/gemini';
import { Grievance } from '@/lib/constituency-data';

// GET /api/grievances - Retrieve all grievances with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const status = searchParams.get('status') || undefined;
    const priority = searchParams.get('priority') || undefined;

    const grievances = await dbService.getGrievances({ category, status, priority });
    return NextResponse.json({ success: true, count: grievances.length, data: grievances });
  } catch (error) {
    console.error('Error fetching grievances:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch grievances' }, { status: 500 });
  }
}

// POST /api/grievances - Submit raw citizen complaint (AI parses, classifies & registers ticket)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rawInput, source = 'PORTAL', citizenName = 'Constituent Resident', phone, wardName = 'Ward 3 - Chowk Cluster' } = body;

    if (!rawInput || typeof rawInput !== 'string' || !rawInput.trim()) {
      return NextResponse.json({ success: false, error: 'rawInput string is required' }, { status: 400 });
    }

    // Process complaint using Gemini 3.6 Flash AI
    const aiResult = await processGrievanceWithAI(rawInput.trim(), source, citizenName, wardName);

    const ticketId = `LOK-2026-0${Math.floor(900 + Math.random() * 90)}`;
    const newGrievance: Grievance = {
      id: `griev-${Date.now()}`,
      ticketId,
      createdAt: new Date().toISOString(),
      citizenName,
      phone: phone || '+91 98000 DEMO',
      source,
      rawInput: rawInput.trim(),
      category: aiResult.category || 'Roads & Public Works',
      priority: aiResult.priority || 'HIGH',
      status: 'AI_PROCESSED',
      assignedLevel: 1,
      assignedRole: 'COUNCILLOR',
      assignedOfficer: 'Smt. Priya Gupta (Ward 3 Councillor)',
      wardId: 'ward-3',
      wardName,
      locationDetails: wardName,
      sentiment: aiResult.sentiment || 'NEGATIVE',
      sentimentScore: aiResult.sentimentScore ?? -0.65,
      aiSummary: aiResult.aiSummary || rawInput.trim(),
      aiKeyEntities: aiResult.aiKeyEntities || { location: wardName, department: 'Municipal Administration' },
      assignedDepartment: aiResult.assignedDepartment || 'Municipal Public Works Dept',
      officerInCharge: 'Smt. Priya Gupta (Ward 3 Councillor)',
      slaDays: aiResult.slaDays || 3,
      aiSuggestedAction: aiResult.aiSuggestedAction || 'Dispatch department team for site inspection.',
      generatedConstituentReply: aiResult.generatedConstituentReply || {
        hi: 'आपकी शिकायत दर्ज कर ली गई है। शीघ्र कार्रवाई की जाएगी।',
        en: 'Your grievance has been logged. Action will be taken shortly.'
      }
    };

    // Save to Database
    await dbService.addGrievance(newGrievance);

    // Audit Log Entry
    await dbService.addAuditLog({
      actorRole: 'CITIZEN',
      actorName: citizenName,
      actionType: 'STATUS_UPDATE',
      targetItem: `Ticket #${ticketId} (${aiResult.category})`,
      details: `Registered via ${source}. Assigned to Level 1 Ward Councillor with ${aiResult.slaDays}-day SLA.`,
      impactMetric: `Priority: ${aiResult.priority}`
    });

    return NextResponse.json({ success: true, ticketId, data: newGrievance }, { status: 201 });
  } catch (error) {
    console.error('Error creating grievance:', error);
    return NextResponse.json({ success: false, error: 'Internal AI Grievance Processing Error' }, { status: 500 });
  }
}

// PATCH /api/grievances - Role-based status updates & executive directives
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, officerInCharge, assignedLevel, actorRole = 'MP', actorName = 'Executive Authority', directiveNote } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'id and status are required' }, { status: 400 });
    }

    const updated = await dbService.updateGrievanceStatus(id, status, officerInCharge, assignedLevel);

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Grievance not found' }, { status: 404 });
    }

    // Append Audit Log for role action
    await dbService.addAuditLog({
      actorRole,
      actorName,
      actionType: status === 'RESOLVED' ? 'STATUS_UPDATE' : 'DIRECTIVE_ISSUED',
      targetItem: `Ticket #${updated.ticketId}`,
      details: directiveNote || `Status updated to ${status} (Level ${assignedLevel || updated.assignedLevel || 1}) by ${actorRole}.`,
      impactMetric: `Level: ${assignedLevel || updated.assignedLevel || 1}`
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating grievance:', error);
    return NextResponse.json({ success: false, error: 'Failed to update grievance status' }, { status: 500 });
  }
}
