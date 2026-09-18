export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({success:false,error:'Method not allowed'});
  try {
    const body = req.body || {};
    const reportId = body.reportId || `report-${Date.now()}`;
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;
    if (!supabaseUrl || !supabaseSecretKey) {
      return res.status(200).json({success:true,stored:'local-fallback',reportId});
    }
    const headers = {
      'Content-Type':'application/json',
      'apikey':supabaseSecretKey,
      'Authorization':`Bearer ${supabaseSecretKey}`,
      'Prefer':'return=representation'
    };
    const journeyId = body.journeyId || `journey-${Date.now()}`;
    const journeyPayload = {
      id: journeyId,
      from_location: null,
      to_location: null,
      status: 'started'
    };
    await fetch(`${supabaseUrl}/rest/v1/journeys?on_conflict=id`, {
      method:'POST',
      headers:{...headers,'Prefer':'resolution=merge-duplicates,return=minimal'},
      body:JSON.stringify(journeyPayload)
    });
    const eventPayload = {
      journey_id: journeyId,
      event_type: 'REPORT_SUBMITTED',
      latitude: body.latitude ?? null,
      longitude: body.longitude ?? null,
      battery: null,
      connectivity: null,
      checkpoint: null,
      metadata: {
        reportId,
        reportType: body.type || null,
        description: body.description || null,
        evidenceName: body.evidencePhoto || null,
        status: body.status || 'Under Review',
        createdAt: body.createdAt || new Date().toISOString()
      }
    };
    const response = await fetch(`${supabaseUrl}/rest/v1/journey_events`, {method:'POST',headers,body:JSON.stringify(eventPayload)});
    if (!response.ok) return res.status(500).json({success:false,error:'Failed to save report event'});
    return res.status(200).json({success:true,stored:'supabase',reportId});
  } catch (error:any) {
    return res.status(500).json({success:false,error:error?.message||'Report save failed'});
  }
}
