export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body || {};

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({
        success: false,
        error: "Supabase environment variables are missing",
      });
    }

    const journeyId = body.journeyId;

    if (!journeyId) {
      return res.status(400).json({
        success: false,
        error: "journeyId is required",
      });
    }

    // Save / update journey
    const journeyResponse = await fetch(
      `${supabaseUrl}/rest/v1/journeys?on_conflict=id`,
      {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates,return=minimal",
        },
        body: JSON.stringify({
          id: journeyId,
          from_location: body.from || body.from_location || null,
          to_location: body.to || body.to_location || null,
          route_id: body.routeId || body.route_id || null,
          status: body.status || "started",
        }),
      }
    );

    if (!journeyResponse.ok) {
      const errorText = await journeyResponse.text();

      return res.status(500).json({
        success: false,
        error: `Journey save failed: ${errorText}`,
      });
    }

    // Save journey event
    const eventResponse = await fetch(
      `${supabaseUrl}/rest/v1/journey_events`,
      {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          journey_id: journeyId,
          event_type: body.eventType || "JOURNEY_EVENT",
          latitude: body.latitude ?? null,
          longitude: body.longitude ?? null,
          battery: body.battery ?? null,
          connectivity: body.connectivity || null,
          checkpoint: body.checkpoint || null,
          metadata: body.metadata || {},
        }),
      }
    );

    if (!eventResponse.ok) {
      const errorText = await eventResponse.text();

      return res.status(500).json({
        success: false,
        error: `Journey event save failed: ${errorText}`,
      });
    }

    return res.status(200).json({
      success: true,
      saved: true,
      eventId: `journey-event-${Date.now()}`,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error?.message || "Database error",
    });
  }
}
