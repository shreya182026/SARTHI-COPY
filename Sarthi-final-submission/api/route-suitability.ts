export default function handler(req:any,res:any){
  try{
    const {duration=30,cost=50,walking=10,transfers=1,connectivity='Normal',battery=80,helpPoints=3,rain=0,windSpeed=0,priority='balanced'}=req.query;
    const d=Number(duration),c=Number(cost),w=Number(walking),t=Number(transfers),b=Number(battery),h=Number(helpPoints),rv=Number(rain),wind=Number(windSpeed);
    const timeScore=Math.max(0,1-d/120),costScore=Math.max(0,1-c/300),walkingScore=Math.max(0,1-w/60),transferScore=Math.max(0,1-t/4),batteryScore=b/100,helpScore=Math.min(1,h/5);
    const connectivityScore=connectivity==='Normal'?1:connectivity==='Unstable'?.7:connectivity==='Low connectivity'?.4:.2;
    const weatherPenalty=Math.min(.35,rv*.15+wind/100);
    let score=timeScore*.18+costScore*.12+walkingScore*.15+transferScore*.10+batteryScore*.10+connectivityScore*.15+helpScore*.15-weatherPenalty;
    if(priority==='fastest')score+=timeScore*.10;if(priority==='low_cost')score+=costScore*.10;if(priority==='less_walking')score+=walkingScore*.10;
    score=Math.max(0,Math.min(1,score));
    return res.status(200).json({success:true,suitabilityScore:Number(score.toFixed(3)),recommendation:score>=.75?'Strong fit for the current journey context.':score>=.55?'Reasonable fit for the current journey context.':'Consider another available route.',factors:{timeScore:Number(timeScore.toFixed(2)),costScore:Number(costScore.toFixed(2)),walkingScore:Number(walkingScore.toFixed(2)),connectivityScore:Number(connectivityScore.toFixed(2)),batteryScore:Number(batteryScore.toFixed(2)),helpScore:Number(helpScore.toFixed(2)),weatherPenalty:Number(weatherPenalty.toFixed(2))},model:'Sarthi Context Suitability Model v2',generatedAt:new Date().toISOString()});
  }catch{return res.status(500).json({success:false,error:'Suitability calculation failed.'});}
}
