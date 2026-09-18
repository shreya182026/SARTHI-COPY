export default async function handler(req: any, res: any) {
  try {
    const { q, reverse, lat, lon } = req.query;

    if (reverse === "true") {
      if (!lat || !lon) {
        return res.status(400).json({
          success: false,
          error: "lat and lon are required"
        });
      }

      const url =
        `https://nominatim.openstreetmap.org/reverse` +
        `?format=jsonv2&lat=${encodeURIComponent(lat)}` +
        `&lon=${encodeURIComponent(lon)}` +
        `&zoom=18&addressdetails=1`;

      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "User-Agent": "Sarthi Journey Assistant"
        }
      });

      if (!response.ok) {
        throw new Error("Reverse geocoding failed");
      }

      const data = await response.json();

      return res.status(200).json({
        success: true,
        place: data
      });
    }

    if (!q || String(q).trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: "Search query is too short"
      });
    }

    const url =
      `https://nominatim.openstreetmap.org/search` +
      `?format=jsonv2` +
      `&limit=7` +
      `&countrycodes=in` +
      `&addressdetails=1` +
      `&q=${encodeURIComponent(String(q).trim())}`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Sarthi Journey Assistant"
      }
    });

    if (!response.ok) {
      throw new Error("Geocoding failed");
    }

    const data = await response.json();

    return res.status(200).json({
      success: true,
      places: Array.isArray(data) ? data : []
    });
  } catch (error) {
    console.error("Geocode error:", error);

    return res.status(500).json({
      success: false,
      error: "Location service temporarily unavailable"
    });
  }
}
