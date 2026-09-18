export default async function handler(req: any, res: any) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const { from, to, fromLat, fromLon, toLat, toLon } = req.query;

    if (!from || !to) {
      return res.status(400).json({ success:false, error:'Please provide both from and to locations.' });
    }

    const geocode = async (place: string) => {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=in&addressdetails=1&q=${encodeURIComponent(place)}`,
        { headers:{Accept:'application/json',"User-Agent":'Sarthi Journey Assistant/1.0'}, signal:controller.signal }
      );
      if (!response.ok) throw new Error(`Location lookup returned ${response.status}.`);
      const data = await response.json();
      if (!Array.isArray(data)||!data.length) throw new Error(`Location not found: ${place}`);
      const lat=Number(data[0].lat), lon=Number(data[0].lon);
      if(!Number.isFinite(lat)||!Number.isFinite(lon)) throw new Error(`Location coordinates are invalid: ${place}`);
      return {lat,lon,displayName:data[0].display_name};
    };

    const hasCoordinates=[fromLat,fromLon,toLat,toLon].every(
      (value) => value !== undefined && value !== null && value !== '' && Number.isFinite(Number(value))
    );

    const start=hasCoordinates
      ? {lat:Number(fromLat),lon:Number(fromLon),displayName:String(from)}
      : await geocode(String(from));
    const destination=hasCoordinates
      ? {lat:Number(toLat),lon:Number(toLon),displayName:String(to)}
      : await geocode(String(to));

    const routeUrl =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${start.lon},${start.lat};${destination.lon},${destination.lat}` +
      `?overview=full&geometries=geojson&steps=true&alternatives=true`;

    const routeResponse=await fetch(routeUrl,{
      headers:{Accept:'application/json',"User-Agent":'Sarthi Journey Assistant/1.0'},
      signal:controller.signal
    });
    if(!routeResponse.ok) throw new Error(`Routing service returned ${routeResponse.status}.`);

    const routeData=await routeResponse.json();
    if(routeData?.code&&routeData.code!=='Ok') throw new Error(routeData.message||'No road route found for the selected locations.');
    if(!Array.isArray(routeData.routes)||routeData.routes.length===0) throw new Error('No road route found for the selected locations.');

    const formatStep=(step:any)=>{
      const name=String(step?.name||'').trim();
      const ref=String(step?.ref||'').trim();
      const road=name||ref;
      const type=String(step?.maneuver?.type||'').toLowerCase();
      const modifier=String(step?.maneuver?.modifier||'').toLowerCase();
      const destination=String(step?.destinations||'').trim();
      const target=road||destination;
      if(type==='depart') return target?`Head toward ${target}`:'Start from the selected location';
      if(type==='arrive') return target?`Arrive at ${target}`:'Arrive at the selected destination';
      if(type==='roundabout' || type==='rotary') return target?`Enter the roundabout toward ${target}`:'Enter the roundabout';
      if(type==='merge') return target?`Merge onto ${target}`:'Merge with the next road';
      if(type==='on ramp') return target?`Take the ramp toward ${target}`:'Take the ramp';
      if(type==='off ramp') return target?`Take the exit toward ${target}`:'Take the exit';
      if(type==='fork') return target?`Keep ${modifier||'ahead'} at the fork onto ${target}`:`Keep ${modifier||'ahead'} at the fork`;
      if(type==='new name') return target?`Continue on ${target}`:'Continue on the route';
      if(type==='turn' || type==='end of road') return target?`Turn ${modifier||'ahead'} onto ${target}`:`Turn ${modifier||'ahead'}`;
      if(type==='continue') return target?`Continue on ${target}`:'Continue on the route';
      return target?`Continue on ${target}`:'Continue on the route';
    };

    const routes=routeData.routes
      .filter((route:any)=>Array.isArray(route?.geometry?.coordinates)&&route.geometry.coordinates.length>1&&Number.isFinite(Number(route.distance))&&Number.isFinite(Number(route.duration)))
      .slice(0,3)
      .map((route:any,index:number)=>{
        const distanceKm=Number((route.distance/1000).toFixed(2));
        const durationMin=Math.max(1,Math.round(route.duration/60));
        const steps=route.legs?.flatMap((leg:any)=>leg.steps||[])||[];
        const checkpoints:any[]=[];
        const seen=new Set<string>();
        steps.forEach((step:any,stepIndex:number)=>{
          const name=String(step?.name||step?.ref||'').trim();
          const location=step?.maneuver?.location;
          if(!name||!Array.isArray(location)||location.length<2)return;
          const key=name.toLowerCase();
          const type=String(step?.maneuver?.type||'').toLowerCase();
          if(seen.has(key)||!['depart','turn','merge','fork','roundabout','rotary','arrive'].includes(type))return;
          seen.add(key);
          checkpoints.push({
            name,
            lat:Number(location[1]),
            lon:Number(location[0]),
            category:'Route step',
            routeIndex:stepIndex,
            details:String(step?.ref||'')
          });
        });
        return {
          id:`route-${index+1}`,
          distanceKm,
          durationMin,
          estimatedCost:Math.max(35,Math.round(35+distanceKm*12)),
          geometry:route.geometry,
          steps:steps.map(formatStep),
          checkpoints,
          source:'OSRM/OpenStreetMap',
          isAlternative:index>0
        };
      });

    if(!routes.length) throw new Error('The routing service returned no usable road geometry.');

    return res.status(200).json({
      success:true,
      from:{requested:from,...start},
      to:{requested:to,...destination},
      routes,
      alternativesReturned:routes.length,
      generatedAt:new Date().toISOString()
    });
  } catch(error:any) {
    console.error('Route intelligence error:',error);
    const message=error?.name==='AbortError'
      ? 'The routing service timed out. Please try again.'
      : error?.message||'Route intelligence failed.';
    return res.status(502).json({success:false,error:message});
  } finally {
    clearTimeout(timeout);
  }
}
