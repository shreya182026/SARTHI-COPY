export default async function handler(req:any,res:any){
  try{
    const {lat,lon,connectivity='Normal',battery=80}=req.query;
    if(!lat||!lon)return res.status(400).json({success:false,error:'Latitude and longitude are required.'});
    const r=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,rain,weather_code,wind_speed_10m`);
    if(!r.ok)throw new Error('Weather service failed.');
    const w=await r.json();
    return res.status(200).json({success:true,context:{connectivity,battery:Number(battery),weather:{temperature:w.current?.temperature_2m??null,precipitation:w.current?.precipitation??null,rain:w.current?.rain??null,weatherCode:w.current?.weather_code??null,windSpeed:w.current?.wind_speed_10m??null}},source:'Open-Meteo',generatedAt:new Date().toISOString()});
  }catch(error:any){return res.status(500).json({success:false,error:error?.message||'Context intelligence failed.'});}
}
