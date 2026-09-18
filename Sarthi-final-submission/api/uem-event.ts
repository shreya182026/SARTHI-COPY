export default async function handler(req:any,res:any){
  if(req.method!=='POST')return res.status(405).json({success:false,error:'Method not allowed'});
  try{
    const body=typeof req.body==='string'?JSON.parse(req.body):req.body||{};
    return res.status(200).json({success:true,received:true,eventId:`uem-event-${Date.now()}`,event:body,recordedAt:new Date().toISOString()});
  }catch(error:any){return res.status(400).json({success:false,error:error?.message||'Invalid UEM payload'});}
}
