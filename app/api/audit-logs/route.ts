import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/db';

// GET /api/audit-logs - Retrieve real-time cross-departmental audit feed
export async function GET() {
  try {
    const logs = await dbService.getAuditLogs();
    return NextResponse.json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch audit logs' }, { status: 500 });
  }
}

// POST /api/audit-logs - Record an executive action entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { actorRole, actorName, actionType, targetItem, details, impactMetric } = body;

    if (!actorRole || !actorName || !actionType || !targetItem || !details) {
      return NextResponse.json({ success: false, error: 'Missing required audit parameters' }, { status: 400 });
    }

    const log = await dbService.addAuditLog({
      actorRole,
      actorName,
      actionType,
      targetItem,
      details,
      impactMetric
    });

    return NextResponse.json({ success: true, data: log }, { status: 201 });
  } catch (error) {
    console.error('Error recording audit log:', error);
    return NextResponse.json({ success: false, error: 'Failed to log executive action' }, { status: 500 });
  }
}
