import { NextRequest, NextResponse } from 'next/server';
import { processWhatsAppWithAI } from '@/lib/gemini';
import { dbService } from '@/lib/db';
import { Grievance } from '@/lib/constituency-data';

// GET /api/whatsapp-webhook - Meta Webhook Verification Handler
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'lokseva_whatsapp_secret';

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('WhatsApp Webhook Verified Successfully!');
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
}

// POST /api/whatsapp-webhook - Process Incoming WhatsApp Citizen Complaints
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Extract message body (supports Meta Cloud API and Twilio Webhooks)
    let userText = '';
    let fromNumber = '+91 98000 WHATSAPP';
    let senderName = 'WhatsApp Constituent';

    if (body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
      const msg = body.entry[0].changes[0].value.messages[0];
      userText = msg.text?.body || '';
      fromNumber = msg.from || fromNumber;
      senderName = body.entry[0].changes[0].value.contacts?.[0]?.profile?.name || senderName;
    } else if (body.Body) {
      // Twilio Payload
      userText = body.Body;
      fromNumber = body.From || fromNumber;
      senderName = body.ProfileName || senderName;
    } else if (body.text) {
      userText = body.text;
    }

    if (!userText.trim()) {
      return NextResponse.json({ success: false, error: 'Empty message text' }, { status: 400 });
    }

    // Process constituent message via Gemini 3.6 Flash AI
    const aiResult = await processWhatsAppWithAI(userText);

    // Save ticket to Database
    const newGrievance: Grievance = {
      id: `griev-${Date.now()}`,
      ticketId: aiResult.ticketId,
      createdAt: new Date().toISOString(),
      citizenName: senderName,
      phone: fromNumber,
      source: 'WHATSAPP',
      rawInput: userText,
      category: aiResult.category,
      priority: aiResult.priority,
      status: 'DISPATCHED',
      wardId: 'ward-3',
      wardName: aiResult.wardName,
      locationDetails: aiResult.wardName,
      sentiment: aiResult.priority === 'CRITICAL' ? 'VERY_NEGATIVE' : 'NEGATIVE',
      sentimentScore: aiResult.priority === 'CRITICAL' ? -0.85 : -0.50,
      aiSummary: aiResult.aiSummary,
      aiKeyEntities: {
        location: aiResult.wardName,
        affectedCount: 'Local Community',
        urgencyReason: aiResult.aiSummary,
        department: aiResult.assignedDepartment
      },
      assignedDepartment: aiResult.assignedDepartment,
      officerInCharge: aiResult.officerInCharge,
      slaDays: aiResult.slaDays,
      aiSuggestedAction: `Dispatch ${aiResult.assignedDepartment} team for resolution.`,
      generatedConstituentReply: {
        hi: aiResult.replyText,
        en: aiResult.replyText
      }
    };

    await dbService.addGrievance(newGrievance);

    // Log to Executive Audit Ledger
    await dbService.addAuditLog({
      actorRole: 'CITIZEN',
      actorName: `${senderName} (${fromNumber})`,
      actionType: 'STATUS_UPDATE',
      targetItem: `WhatsApp Ticket #${aiResult.ticketId}`,
      details: `Registered via WhatsApp. AI routed to ${aiResult.assignedDepartment} (${aiResult.slaDays} Days SLA).`,
      impactMetric: `Priority: ${aiResult.priority}`
    });

    return NextResponse.json({
      success: true,
      ticketId: aiResult.ticketId,
      replyText: aiResult.replyText,
      grievance: newGrievance
    });
  } catch (error) {
    console.error('WhatsApp Webhook Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to process WhatsApp message' }, { status: 500 });
  }
}
