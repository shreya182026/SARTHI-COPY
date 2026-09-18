export default async function handler(req: any, res: any) {
  try {
    const { fromLat, fromLon, toLat, toLon } = req.query;

    if (!fromLat || !fromLon || !toLat || !toLon) {
      return res.status(400).json({
        success: false,
        error: "fromLat, fromLon, toLat and toLon are required"
      });
    }

    /*
     * OpenStreetMap Overpass is used only to discover nearby
     * public-transport infrastructure.
     *
     * This does NOT provide live metro arrival times or
     * real-time vehicle availability.
     */

    const lat1 = Number(fromLat);
    const lon1 = Number(fromLon);
    const lat2 = Number(toLat);
    const lon2 = Number(toLon);

    const radius = 1500;

    const query = `
      [out:json][timeout:15];

      (
        node(around:${radius},${lat1},${lon1})["railway"="station"];
        node(around:${radius},${lat1},${lon1})["station"="subway"];
        node(around:${radius},${lat1},${lon1})["public_transport"="station"];

        node(around:${radius},${lat2},${lon2})["railway"="station"];
        node(around:${radius},${lat2},${lon2})["station"="subway"];
        node(around:${radius},${lat2},${lon2})["public_transport"="station"];
      );

      out center tags;
    `;

    const response = await fetch(
      "https://overpass-api.de/api/interpreter",
      {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
          "User-Agent": "Sarthi Journey Assistant"
        },
        body: query
      }
    );

    if (!response.ok) {
      throw new Error("Transit infrastructure service unavailable");
    }

    const data = await response.json();

    const elements = Array.isArray(data?.elements)
      ? data.elements
      : [];

    const stations = elements.map((item: any) => ({
      id: String(item.id),

      name:
        item.tags?.name ||
        item.tags?.["name:en"] ||
        "Unnamed transit station",

      type:
        item.tags?.station === "subway"
          ? "Metro"
          : item.tags?.railway === "station"
          ? "Rail"
          : "Public Transport",

      latitude:
        item.lat ??
        item.center?.lat ??
        null,

      longitude:
        item.lon ??
        item.center?.lon ??
        null
    }));

    const uniqueStations = Array.from(
      new Map(
        stations.map((station: any) => [
          `${station.name}-${station.latitude}-${station.longitude}`,
          station
        ])
      ).values()
    );

    return res.status(200).json({
      success: true,

      source: "OpenStreetMap / Overpass",

      live: false,

      note:
        "Transit infrastructure is real map data. " +
        "Live arrival times, vehicle availability and " +
        "fare data are not provided by this endpoint.",

      stations: uniqueStations.slice(0, 20)
    });

  } catch (error) {

    console.error("Transit intelligence error:", error);

    return res.status(500).json({
      success: false,
      error: "Transit service temporarily unavailable"
    });
  }
}
