export default async function handler(req: any, res: any) {
  const { q, reverse, lat, lon } = req.query;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const commonHeaders = {
      Accept: "application/json",
      "Accept-Language": "en",
      "User-Agent": "Sarthi Journey Assistant/1.0"
    };

    if (reverse === "true") {
      const latitude=Number(lat), longitude=Number(lon);
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return res.status(400).json({ success:false, error:"Valid lat and lon are required" });
      }

      const url =
        `https://nominatim.openstreetmap.org/reverse` +
        `?format=jsonv2&lat=${encodeURIComponent(latitude)}` +
        `&lon=${encodeURIComponent(longitude)}` +
        `&zoom=18&addressdetails=1`;

      const response = await fetch(url, { headers: commonHeaders, signal: controller.signal });
      if (!response.ok) throw new Error(`Reverse geocoding returned ${response.status}.`);
      const data = await response.json();

      return res.status(200).json({ success:true, place:data });
    }

    const query=String(q||"").trim();
    if (query.length < 2) {
      return res.status(400).json({ success:false, error:"Search query is too short" });
    }

    const url =
      `https://nominatim.openstreetmap.org/search` +
      `?format=jsonv2&limit=7&countrycodes=in&addressdetails=1` +
      `&q=${encodeURIComponent(query)}`;

    const response = await fetch(url, { headers: commonHeaders, signal: controller.signal });
    if (!response.ok) throw new Error(`Geocoding returned ${response.status}.`);
    const data = await response.json();
    const places=Array.isArray(data)
      ? data.filter((p:any)=>Number.isFinite(Number(p.lat))&&Number.isFinite(Number(p.lon)))
      : [];

    return res.status(200).json({ success:true, places });
  } catch (error:any) {
    console.error("Geocode error:", error);
    const message=error?.name==="AbortError"
      ? "Location service timed out. Please try again."
      : error?.message||"Location service temporarily unavailable";
    return res.status(502).json({ success:false, error:message });
  } finally {
    clearTimeout(timeout);
  }
}
