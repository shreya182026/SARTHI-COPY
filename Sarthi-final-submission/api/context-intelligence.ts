export default async function handler(req:any,res:any){
  try{
    const {lat,lon,connectivity,battery}=req.query;
    const latitude=Number(lat);
    const longitude=Number(lon);
    if(!Number.isFinite(latitude)||!Number.isFinite(longitude)||latitude<-90||latitude>90||longitude<-180||longitude>180){
      return res.status(400).json({success:false,error:'Valid latitude and longitude are required.'});
    }
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),8000);
    try{
      const r=await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}&current=temperature_2m,precipitation,rain,weather_code,wind_speed_10m&timezone=auto`,
        {headers:{Accept:'application/json'},signal:controller.signal}
      );
      if(!r.ok)throw new Error(`Weather service returned ${r.status}.`);
      const w=await r.json();
      if(!w?.current)throw new Error('Weather service returned no current conditions.');
      return res.status(200).json({
        success:true,
        context:{
          connectivity:connectivity||null,
          battery:battery==null||battery===''?null:Number(battery),
          weather:{
            temperature:w.current.temperature_2m??null,
            precipitation:w.current.precipitation??null,
            rain:w.current.rain??null,
            weatherCode:w.current.weather_code??null,
            windSpeed:w.current.wind_speed_10m??null
          }
        },
        source:'Open-Meteo',
        generatedAt:new Date().toISOString()
      });
    } finally { clearTimeout(timeout); }
  }catch(error:any){
    const message=error?.name==='AbortError'?'Weather service timed out.':error?.message||'Context intelligence failed.';
    return res.status(502).json({success:false,error:message});
  }
}