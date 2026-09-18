export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  try {
    const body = req.body || {};

    const journeyId =
      body.journeyId ||
      body.journey_id ||
      `journey-${Date.now()}`;

    const eventType =
      body.eventType ||
      body.event_type ||
      "UNKNOWN";

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !supabaseSecretKey) {
      return res.status(500).json({
        success: false,
        error: "Supabase environment variables are missing"
      });
    }

    const headers = {
      "Content-Type": "application/json",
      "apikey": supabaseSecretKey,
      "Authorization": `Bearer ${supabaseSecretKey}`,
      "Prefer": "return=representation"
    };

    // Make sure the journey exists before inserting events.
    const journeyPayload = {
      id: journeyId,
      from_location: body.from || body.fromLocation || null,
      to_location: body.to || body.toLocation || body.destination || null,
      route_id: body.routeId || body.route_id || null,
      status:
        ['JOURNEY_FINISHED','JOURNEY_COMPLETED'].includes(eventType)
          ? "completed"
          : "started"
    };

    await fetch(
      `${supabaseUrl}/rest/v1/journeys?on_conflict=id`,
      {
        method: "POST",
        headers: {
          ...headers,
          "Prefer": "resolution=merge-duplicates,return=representation"
        },
        body: JSON.stringify(journeyPayload)
      }
    );

    // Store the actual journey event.
    const eventPayload = {
      journey_id: journeyId,
      event_type: eventType,
      latitude: body.latitude ?? body.lat ?? null,
      longitude: body.longitude ?? body.lng ?? null,
      battery: body.battery ?? null,
      connectivity: body.connectivity ?? null,
      checkpoint:
        body.checkpoint ??
        body.lastCheckpoint ??
        null,
      metadata: body.metadata ?? body
    };

    const eventResponse = await fetch(
      `${supabaseUrl}/rest/v1/journey_events`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(eventPayload)
      }
    );

    if (!eventResponse.ok) {
      const errorText = await eventResponse.text();

      return res.status(500).json({
        success: false,
        error: "Failed to save journey event",
        details: errorText
      });
    }

    const savedEvent = await eventResponse.json();

    return res.status(200).json({
      success: true,
      message: "Journey event saved",
      journeyId,
      eventType,
      event: savedEvent
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error?.message || "Journey event failed"
    });
  }
}
