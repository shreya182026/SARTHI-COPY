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
      "UEM_EVENT";

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

    // Ensure the journey exists.
    await fetch(
      `${supabaseUrl}/rest/v1/journeys?on_conflict=id`,
      {
        method: "POST",
        headers: {
          ...headers,
          "Prefer": "resolution=merge-duplicates,return=representation"
        },
        body: JSON.stringify({
          id: journeyId,
          to_location:
            body.destination ||
            body.to ||
            body.toLocation ||
            null,
          status:
            eventType === "ESCALATION_REQUIRED"
              ? "uem_active"
              : "started"
        })
      }
    );

    // Save UEM event.
    const uemPayload = {
      journey_id: journeyId,
      event_type: eventType,
      latitude: body.latitude ?? body.lat ?? null,
      longitude: body.longitude ?? body.lng ?? null,
      battery: body.battery ?? null,
      connectivity: body.connectivity ?? null,
      last_checkpoint:
        body.lastCheckpoint ??
        body.checkpoint ??
        null,
      destination:
        body.destination ??
        body.to ??
        body.toLocation ??
        null,
      metadata: body.metadata ?? body
    };

    const eventResponse = await fetch(
      `${supabaseUrl}/rest/v1/uem_events`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(uemPayload)
      }
    );

    if (!eventResponse.ok) {
      const errorText = await eventResponse.text();

      return res.status(500).json({
        success: false,
        error: "Failed to save UEM event",
        details: errorText
      });
    }

    const savedEvent = await eventResponse.json();

    return res.status(200).json({
      success: true,
      message: "UEM event saved",
      journeyId,
      eventType,
      event: savedEvent
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error?.message || "UEM event failed"
    });
  }
}
