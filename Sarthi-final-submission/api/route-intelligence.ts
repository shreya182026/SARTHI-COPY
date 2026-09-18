export default async function handler(req: any, res: any) {
  try {
    const { from, to } = req.query;
    if (!from || !to) return res.status(400).json({ success:false, error:'Please provide both from and to locations.' });
    const geocode = async (place: string) => {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(place)}`, { headers:{'User-Agent':'Sarthi-Hackathon-App/1.0'} });
      if (!response.ok) throw new Error('Geocoding service failed.');
      const data = await response.json();
      if (!data.length) throw new Error(`Location not found: ${place}`);
      return { lat:Number(data[0].lat), lon:Number(data[0].lon), displayName:data[0].display_name };
    };
    const start=await geocode(from), destination=await geocode(to);
    const routeUrl=`https://router.project-osrm.org/route/v1/driving/${start.lon},${start.lat};${destination.lon},${destination.lat}?overview=full&geometries=geojson&steps=true&alternatives=true`;
    const routeResponse=await fetch(routeUrl);
    if (!routeResponse.ok) throw new Error('Routing service failed.');
    const routeData=await routeResponse.json();
    if (!routeData.routes?.length) throw new Error('No route found.');
    const routes=routeData.routes.slice(0,3).map((route:any,index:number)=>({ id:`route-${index+1}`, distanceKm:Number((route.distance/1000).toFixed(2)), durationMin:Math.round(route.duration/60), estimatedCost:Math.round(35+(route.distance/1000)*12), geometry:route.geometry, steps:route.legs?.[0]?.steps||[], source:'OSRM/OpenStreetMap' }));
    return res.status(200).json({success:true,from:{requested:from,...start},to:{requested:to,...destination},routes,generatedAt:new Date().toISOString()});
  } catch(error:any) { return res.status(500).json({success:false,error:error?.message||'Route intelligence failed.'}); }
}
