import { useEffect, useMemo, useRef, useState } from 'react';
import { checkSarthiConnectivity } from './utils/connectivity';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  ArrowLeft, ArrowRight, Bell, CalendarDays, Check, ChevronRight, CircleCheck, CircleHelp, Compass,
  ExternalLink, Footprints, Globe2, HeartHandshake, Hospital, Home as HomeIcon, Info, Languages,
  LocateFixed, MapPin, Navigation, Phone, RefreshCw, Route as RouteIcon, Search, Settings as SettingsIcon,
  Share2, Shield, Star, TrainFront, User, Users, WalletCards, Wifi, WifiOff, X, Zap, Clock3,
  AlertTriangle, Building2, Car, Bus, Bike, Moon, Sun, Play, MessageSquare, CloudRain, Smartphone,
  Map, Flag, Send, ChevronDown, LogOut, Sparkles, Plus
} from 'lucide-react';

type Screen =
  | 'welcome'|'auth'|'phone'|'otp'|'location'|'language'|'disha-intro'|'profile'|'onboarding'|'home'
  | 'journey-type'|'start-point'|'destination'|'mode'|'priorities'|'route-analysis'|'routes'|'route-detail'|'compare'|'preparation'
  | 'onboarding-preferences'|'live'|'journey-health'|'offline'|'changed'|'emergency'|'get-safety'|'contacts'|'uem'|'report'|'review'|'complete'|'my-journeys'|'frequent'|'settings'|'sample';

type Coords={lat:number;lng:number};
type Place={display_name:string;lat:string|number;lon:string|number};
type Route={id:string;title:string;duration:number;distance:number;cost:number;walking:number;transfers:number;modes:string[];reason:string;context:string;confidence:'High'|'Moderate'|'Limited';updated:string;firstMile:string;lastMile:string;steps:string[];geometry:[number,number][];traffic:'Light'|'Moderate'|'Heavy';fingerprint?:string[]};
type Profile={name:string;phone:string;age:string;career:string;income:string;walkingComfort:'Low'|'Moderate'|'Comfortable';travelModes:string[];priorities:string[];completed:boolean;isGuest?:boolean;memberSince?:string};
type Contact={id:string;name:string;relation:string;phone:string;primary:boolean};
type JourneyPoint={id:string;name:string;kind:'checkpoint'|'help';coords:Coords;category:string;distanceKm:number;source:'OpenStreetMap'|'Route fallback';details?:string;routeIndex?:number};

type Lang={code:string;native:string;english:string};
const LANGS:Lang[]=[
 {code:'en',native:'English',english:'English'},{code:'hi',native:'हिन्दी',english:'Hindi'},{code:'mr',native:'मराठी',english:'Marathi'},{code:'gu',native:'ગુજરાતી',english:'Gujarati'},
 {code:'bn',native:'বাংলা',english:'Bengali'},{code:'ta',native:'தமிழ்',english:'Tamil'},{code:'te',native:'తెలుగు',english:'Telugu'},{code:'kn',native:'ಕನ್ನಡ',english:'Kannada'},
 {code:'ml',native:'മലയാളം',english:'Malayalam'},{code:'pa',native:'ਪੰਜਾਬੀ',english:'Punjabi'},{code:'or',native:'ଓଡ଼ିଆ',english:'Odia'},{code:'as',native:'অসমীয়া',english:'Assamese'}
];
const MODES=[['Walk',Footprints],['Metro',TrainFront],['Bus',Bus],['Auto / Rickshaw',Navigation],['Cab',Car],['Bike / Scooter',Bike],['Personal vehicle',Car]] as const;
const PRIORITY_OPTIONS=['Faster travel','Lower walking','Fewer transfers','Lower cost','Public activity','Lighting continuity','Visibility','Predictability','Weather comfort','Connectivity','Help access','Easy first / last mile'];
const DEFAULT_PROFILE:Profile={name:'',phone:'',age:'',career:'',income:'',walkingComfort:'Comfortable',travelModes:['Metro','Walk'],priorities:[],completed:false};
const DEMO_PHONE='9876543210';
const DEMO_PROFILE:Profile={name:'Aarohi Sharma',phone:DEMO_PHONE,age:'24',career:'Software Engineer',income:'₹6–10L',walkingComfort:'Moderate',travelModes:['Metro','Walk','Cab'],priorities:['Faster travel','Lower walking','Fewer transfers','Help access','Connectivity','Easy first / last mile'],completed:true,isGuest:false,memberSince:'January 2026'};
const DEMO_CONTACTS:Contact[]=[
 {id:'demo-1',name:'Riya Sharma',relation:'Sister',phone:'9876500001',primary:true},
 {id:'demo-2',name:'Neha Verma',relation:'Friend',phone:'9876500002',primary:true},
 {id:'demo-3',name:'Ankit Sharma',relation:'Brother',phone:'9876500003',primary:false},
 {id:'demo-4',name:'Meera Kapoor',relation:'Friend',phone:'9876500004',primary:false},
 {id:'demo-5',name:'Kavya Singh',relation:'Colleague',phone:'9876500005',primary:false},
];
const DEMO_HISTORY=[
 {date:'2026-09-12T18:10:00.000Z',from:'Home, Gurugram',to:'Cyber Hub, Gurugram',route:'Route 1',mode:'Metro + Walk',duration:34,cost:45,walking:8,events:['Journey Capsule prepared','Journey completed'],checkpoints:[],helpPoints:[],battery:62,connectivity:'Normal',geometry:[]},
 {date:'2026-09-08T09:05:00.000Z',from:'Home, Gurugram',to:'IGDTUW, Delhi',route:'Route 2',mode:'Metro + Auto / Rickshaw',duration:58,cost:70,walking:6,events:['Journey Capsule prepared','Connectivity unstable','Journey completed'],checkpoints:[],helpPoints:[],battery:48,connectivity:'Unstable',geometry:[]},
 {date:'2026-09-05T18:35:00.000Z',from:'Home, Gurugram',to:'Cyber Hub, Gurugram',route:'Route 1',mode:'Metro + Walk',duration:35,cost:45,walking:8,events:['Journey Capsule prepared','Journey completed'],checkpoints:[],helpPoints:[],battery:66,connectivity:'Normal',geometry:[]},
 {date:'2026-09-02T08:30:00.000Z',from:'Home, Gurugram',to:'IGDTUW, Delhi',route:'Route 1',mode:'Metro + Walk',duration:55,cost:55,walking:7,events:['Journey Capsule prepared','Journey completed'],checkpoints:[],helpPoints:[],battery:71,connectivity:'Normal',geometry:[]},
];
const FALLBACK_PLACES=['Connaught Place, New Delhi','India Gate, New Delhi','Rajiv Chowk Metro Station, New Delhi','AIIMS New Delhi','Cyber Hub, Gurugram','Huda City Centre, Gurugram','Bandra West, Mumbai','MG Road, Bengaluru','Salt Lake, Kolkata','Hitech City, Hyderabad'];

function read<T>(k:string,f:T):T{try{const x=localStorage.getItem(k);return x?JSON.parse(x) as T:f}catch{return f}}
const SARTHI_DATA_VERSION='sarthi-clean-final-2026-09-15';
try{if(localStorage.getItem('sarthi-data-version')!==SARTHI_DATA_VERSION){Object.keys(localStorage).filter(k=>k.startsWith('sarthi-')).forEach(k=>localStorage.removeItem(k));localStorage.setItem('sarthi-data-version',SARTHI_DATA_VERSION)}}catch{}
function write(k:string,v:unknown){localStorage.setItem(k,JSON.stringify(v))}
function normalize(p:Partial<Profile>|null):Profile{return {...DEFAULT_PROFILE,...(p||{}),travelModes:Array.isArray(p?.travelModes)?p!.travelModes!:DEFAULT_PROFILE.travelModes,priorities:Array.isArray(p?.priorities)?p!.priorities!:DEFAULT_PROFILE.priorities}}
function InfoBtn({text}:{text:string}){const [o,setO]=useState(false);return <span className="info-wrap"><button className="info-btn" onClick={e=>{e.stopPropagation();setO(!o)}} title="Why I’m asking"><Info size={14}/></button>{o&&<span className="info-pop"><b>Why I’m asking</b>{text}</span>}</span>}
function Logo({small=false}:{small?:boolean}){return <div className={`logo ${small?'small':''}`}><img src="/assets/sarthi-logo.png" alt="Sarthi — journey companion"/></div>}
function Disha({size=72}:{size?:number}){return <div className="disha" style={{width:size,height:size}} aria-label="Disha AI guide"><img src="/assets/disha-chatbot.png" alt="Disha"/></div>}
function Bubble({text}:{text:string}){return <div className="disha-bubble"><Disha size={48}/><div><b>Disha</b><span>{text}</span></div></div>}
function MapView({center,path,markers,live=false,onMarkerClick}:{center:Coords;path?:Coords[];markers?:{coords:Coords;label:string;kind:'checkpoint'|'help'}[];live?:boolean;onMarkerClick?:(m:{coords:Coords;label:string;kind:'checkpoint'|'help'})=>void}){
 const ref=useRef<HTMLDivElement|null>(null); const mapRef=useRef<L.Map|null>(null); const layerRef=useRef<L.LayerGroup|null>(null);
 useEffect(()=>{if(!ref.current)return; const map=L.map(ref.current,{zoomControl:false,attributionControl:true}).setView([center.lat,center.lng],13);L.control.zoom({position:'bottomright'}).addTo(map);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'}).addTo(map);mapRef.current=map;layerRef.current=L.layerGroup().addTo(map);return()=>{map.remove();mapRef.current=null}},[]);
 useEffect(()=>{const map=mapRef.current;if(!map||!layerRef.current)return;layerRef.current.clearLayers();
   L.circleMarker([center.lat,center.lng],{radius:9,color:'#f53f7c',fillColor:'#f53f7c',fillOpacity:.95,weight:3}).bindTooltip(live?'You are here':'Current / selected location',{permanent:false}).addTo(layerRef.current);
   if(path&&path.length>1){L.polyline(path.map(p=>[p.lat,p.lng] as [number,number]),{color:'#13a8b1',weight:6,opacity:.85}).addTo(layerRef.current)}
   (markers||[]).forEach(m=>{L.circleMarker([m.coords.lat,m.coords.lng],{radius:7,color:m.kind==='help'?'#f5a03a':'#17304f',fillColor:m.kind==='help'?'#f5a03a':'#fff',fillOpacity:1,weight:3}).bindTooltip(`${m.kind==='help'?'Help point':'Checkpoint'}: ${m.label}`)
     .on('click',()=>onMarkerClick?.(m)).addTo(layerRef.current!)})
 },[center.lat,center.lng,path,markers,live,onMarkerClick]);
 useEffect(()=>{mapRef.current?.setView([center.lat,center.lng],mapRef.current.getZoom(),{animate:true})},[center.lat,center.lng]);
 return <div className="map-view" ref={ref}/>
}

export default function App(){
 const [profile,setProfile]=useState<Profile>(normalize(read<Partial<Profile>|null>('sarthi-profile',null)));
 const initialScreen:Screen=profile.completed?'home':'welcome';
 const [screen,setScreen]=useState<Screen>(initialScreen);
 const historyRef=useRef<Screen[]>([initialScreen]);
 const historyIndexRef=useRef(0);
 const [phone,setPhone]=useState(profile.phone||''); const [otp,setOtp]=useState(['','','','','','']); const [otpRef]=useState(()=>Array<HTMLInputElement|null>(6).fill(null));
 const [location,setLocation]=useState<Coords|null>(read<Coords|null>('sarthi-location',null)); const [locationText,setLocationText]=useState(read('sarthi-location-text','Location not connected yet'));
 const [language,setLanguage]=useState(read('sarthi-language','en')); const [recommended,setRecommended]=useState<string[]>(['en','hi','mr']); const [showAllLang,setShowAllLang]=useState(false);
 const [tourStep,setTourStep]=useState(0); const [sampleStepNo,setSampleStepNo]=useState(0); const [profileStep,setProfileStep]=useState(0); const [sampleReturnScreen,setSampleReturnScreen]=useState<Screen>('auth');
 const [journeyType,setJourneyType]=useState<'right-now'|'pre-journey'>('right-now'); const [plannedDate,setPlannedDate]=useState(''); const [plannedTime,setPlannedTime]=useState('');
 const [from,setFrom]=useState('Current location'); const [fromCoords,setFromCoords]=useState<Coords|null>(null); const [to,setTo]=useState(''); const [toCoords,setToCoords]=useState<Coords|null>(null);
 const [search,setSearch]=useState(''); const [results,setResults]=useState<Place[]>([]); const [searching,setSearching]=useState(false); const [startSearch,setStartSearch]=useState(''); const [startResults,setStartResults]=useState<Place[]>([]); const [searchingStart,setSearchingStart]=useState(false);
 const [selectedMode,setSelectedMode]=useState('Let Sarthi decide'); const [adjustPrefs,setAdjustPrefs]=useState(false); const [priorities,setPriorities]=useState<string[]>(profile.priorities||[]);
 const [routes,setRoutes]=useState<Route[]>([]); const [selectedRoute,setSelectedRoute]=useState(0); const [loadingRoutes,setLoadingRoutes]=useState(false);
 const [livePos,setLivePos]=useState<Coords|null>(location); const [journeyStep,setJourneyStep]=useState(0); const [battery,setBattery]=useState(74); const [connectivity,setConnectivity]=useState<'Normal'|'Unstable'|'Low connectivity'|'Offline'>('Normal');
 const [lastSync,setLastSync]=useState(new Date().toLocaleTimeString()); const [journeyActive,setJourneyActive]=useState(false); const [buzz,setBuzz]=useState<'none'|'light'|'tight'>('none'); const [demoPlaying,setDemoPlaying]=useState(false); const [stopState,setStopState]=useState<'moving'|'checking'|'escalated'>('moving');
 const [toast,setToast]=useState(''); const [reportText,setReportText]=useState(''); const [reportStatus,setReportStatus]=useState<'Under Review'|'Verified'|'Questionable'|'Outdated'>('Under Review'); const evidenceInputRef=useRef<HTMLInputElement|null>(null); const [evidencePhoto,setEvidencePhoto]=useState('');
 const [contacts,setContacts]=useState<Contact[]>(read<Contact[]>('sarthi-contacts',[]));
 const [contactsSetup,setContactsSetup]=useState(false);
 const [pointStatus,setPointStatus]=useState<'idle'|'loading'|'live'|'fallback'>('idle'); const [pointUpdatedAt,setPointUpdatedAt]=useState('');
 const [journeyPoints,setJourneyPoints]=useState<JourneyPoint[]>([]);
 const [uemCancelCode]=useState('2468'); const [cancelCode,setCancelCode]=useState(''); const [showCancelCode,setShowCancelCode]=useState(false); const [stateName,setStateName]=useState('Delhi'); const [helpline,setHelpline]=useState('181'); const [weather,setWeather]=useState<{label:string;temp:string;rain:string} | null>(null);
 const [profileDraft,setProfileDraft]=useState(profile); const [editingProfile,setEditingProfile]=useState(false); const [editingPreferences,setEditingPreferences]=useState(false); const [replay,setReplay]=useState<any|null>(null);

 const persistContacts=(next:Contact[])=>{setContacts(next);write('sarthi-contacts',next)};
 const openContactPicker=async()=>{const navAny=navigator as Navigator & {contacts?:{select:(props:string[],opts?:{multiple?:boolean})=>Promise<Array<{name?:string[];tel?:string[]}>>}};if(!navAny.contacts?.select){toastMsg('Your browser does not expose phone contacts. Use Add contact below instead.');return}try{const picked=await navAny.contacts.select(['name','tel'],{multiple:true});const normalized=picked.map((c,i)=>({id:`contact-${Date.now()}-${i}`,name:c.name?.[0]||'Contact',relation:'Phone contact',phone:c.tel?.[0]||'',primary:false})).filter(c=>c.phone);const merged=[...contacts];normalized.forEach(c=>{if(!merged.some(x=>x.phone===c.phone))merged.push(c)});persistContacts(merged);toastMsg(`${normalized.length} contact${normalized.length===1?'':'s'} added from your phone.`)}catch{toastMsg('Contact access was cancelled or unavailable.')}};
 const goToPoint=(p:JourneyPoint)=>{const url=`https://www.google.com/maps/dir/?api=1&destination=${p.coords.lat},${p.coords.lng}`;window.open(url,'_blank','noopener,noreferrer')};
 const addManualContact=()=>{const name=window.prompt('Contact name');if(!name)return;const phoneNumber=window.prompt('Phone number');if(!phoneNumber)return;persistContacts([...contacts,{id:`contact-${Date.now()}`,name,relation:'Trusted person',phone:phoneNumber,primary:false}]);};
 const saveContactSetup=()=>{if(contacts.length<5){toastMsg('Please add at least five trusted contacts for emergency escalation.');return}persistContacts(contacts);setContactsSetup(false);nav('onboarding')};
 const nav=(target:Screen,replace=false)=>{let s=target;if(s==='home'&&!profile.completed)s='welcome';if(replace){historyRef.current[historyIndexRef.current]=s}else{historyRef.current=historyRef.current.slice(0,historyIndexRef.current+1);historyRef.current.push(s);historyIndexRef.current++}setScreen(s);window.scrollTo({top:0,behavior:'smooth'})};
 const goBack=()=>{if(historyIndexRef.current>0){historyIndexRef.current--;setScreen(historyRef.current[historyIndexRef.current]);window.scrollTo({top:0,behavior:'smooth'})}else{setScreen(profile.completed?'home':'welcome')}};
 const goForward=()=>{if(historyIndexRef.current<historyRef.current.length-1){historyIndexRef.current++;setScreen(historyRef.current[historyIndexRef.current]);window.scrollTo({top:0,behavior:'smooth'})}};
 const exitFlow=()=>{setBuzz('none');if(screen==='sample'){const backTo=sampleReturnScreen;historyRef.current=[backTo];historyIndexRef.current=0;setScreen(backTo);window.scrollTo({top:0,behavior:'smooth'});return}if(profile.completed){historyRef.current=['home'];historyIndexRef.current=0;setScreen('home')}else{historyRef.current=['welcome'];historyIndexRef.current=0;setScreen('welcome')}window.scrollTo({top:0,behavior:'smooth'})};
 const openSample=()=>{setSampleStepNo(0);setBuzz('none');setSampleReturnScreen(screen);nav('sample')};
 const loadDemoAccount=()=>{setProfile(DEMO_PROFILE);setProfileDraft(DEMO_PROFILE);setPriorities(DEMO_PROFILE.priorities);setPhone(DEMO_PHONE);setContacts(DEMO_CONTACTS);write('sarthi-profile',DEMO_PROFILE);write('sarthi-contacts',DEMO_CONTACTS);write('sarthi-history',DEMO_HISTORY);setEditingProfile(false);setEditingPreferences(false);toastMsg('Demo profile loaded — Aarohi Sharma.');historyRef.current=['home'];historyIndexRef.current=0;setScreen('home')};
 const logout=()=>{setJourneyActive(false);setBuzz('none');localStorage.removeItem('sarthi-profile');localStorage.removeItem('sarthi-contacts');localStorage.removeItem('sarthi-history');localStorage.removeItem('sarthi-active');localStorage.removeItem('sarthi-journey-capsule');setProfile(DEFAULT_PROFILE);setProfileDraft(DEFAULT_PROFILE);setContacts([]);setPhone('');setOtp(['','','','','','']);setPriorities([]);historyRef.current=['welcome'];historyIndexRef.current=0;setScreen('welcome');toastMsg('You have been logged out. A new user can start fresh.')};
 const activateUem=()=>{const active=read<any>('sarthi-journey-capsule',null);const journeyId=active?.journeyId||'active-journey';showTightBuzz();setShowCancelCode(false);fetch('/api/uem-event',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({journeyId,eventType:'ESCALATION_REQUIRED',latitude:livePos?.lat??null,longitude:livePos?.lng??null,battery,connectivity,lastCheckpoint:journeyStep,destination:to})}).catch(()=>{});toastMsg('UEM activated. Every configured contact receives urgent journey context.')};
 const deactivateUem=()=>{if(buzz!=='tight'){activateUem();return}setShowCancelCode(true);};
 const PublicBack=()=> <button className="public-back" onClick={goBack}><ArrowLeft size={15}/> Back</button>;
 const toastMsg=(m:string)=>{setToast(m);window.setTimeout(()=>setToast(''),3200)};
 const requestLocation=()=>{if(!navigator.geolocation){toastMsg('Location is not available in this browser.');return} navigator.geolocation.getCurrentPosition(async p=>{const c={lat:p.coords.latitude,lng:p.coords.longitude};setLocation(c);setLivePos(c);setFromCoords(c);write('sarthi-location',c);setLocationText(`${c.lat.toFixed(4)}, ${c.lng.toFixed(4)}`);try{const r=await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${c.lat}&lon=${c.lng}&zoom=10`,{headers:{Accept:'application/json'}});const j=await r.json();const st=j?.address?.state||'Your state';setStateName(st);const map:Record<string,string>={'Delhi':'181','NCT of Delhi':'181','Haryana':'181','Maharashtra':'181','Gujarat':'181'};setHelpline(map[st]||'181'); try{const w=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lng}&current=temperature_2m,precipitation,weather_code&forecast_days=1`); const wj=await w.json(); const code=Number(wj?.current?.weather_code??0); const label=code===0?'Clear':code<60?'Cloudy / partly cloudy':code<80?'Rain possible':'Unsettled weather'; setWeather({label,temp:`${Math.round(wj?.current?.temperature_2m??0)}°C`,rain:`${wj?.current?.precipitation??0} mm`})}catch{} setLocationText(j?.display_name||`${c.lat.toFixed(4)}, ${c.lng.toFixed(4)}`);write('sarthi-location-text',j?.display_name||`${c.lat.toFixed(4)}, ${c.lng.toFixed(4)}`)}catch{}},()=>toastMsg('Location access was not granted. You can continue with demo data.'),{enableHighAccuracy:true,timeout:10000,maximumAge:10000})};
 useEffect(()=>{if(!journeyActive||!navigator.geolocation)return;const id=navigator.geolocation.watchPosition(p=>{const c={lat:p.coords.latitude,lng:p.coords.longitude};setLivePos(c);setLastSync(new Date().toLocaleTimeString())},()=>{} ,{enableHighAccuracy:true,maximumAge:5000,timeout:10000});return()=>navigator.geolocation.clearWatch(id)},[journeyActive]);
 useEffect(() => {
   let cancelled=false;
   const check=async()=>{
     const result=await checkSarthiConnectivity();
     if(cancelled)return;
     if(journeyActive){try{const active=read<any>('sarthi-journey-capsule',null);await fetch('/api/journey-event',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({journeyId:active?.journeyId||'active-journey',eventType:'CONNECTIVITY_CHANGED',latitude:livePos?.lat??null,longitude:livePos?.lng??null,battery,connectivity:result.state,checkpoint:null})})}catch{}}
     setConnectivity(prev=>{if(prev!==result.state){if(result.state==='Normal'&&prev!=='Normal'){toastMsg('Connection restored — Sarthi is synced.');setLastSync(new Date().toLocaleTimeString())}if(result.state==='Unstable')toastMsg('Connectivity is unstable. Sarthi is preparing fallback support.');if(result.state==='Low connectivity')toastMsg('Low connectivity detected. Essential journey support stays available.');if(result.state==='Offline')toastMsg('We are offline. Your Journey Capsule remains available.')}return result.state});
     if(result.state==='Normal')setLastSync(new Date().toLocaleTimeString());
   };
   check(); const interval=window.setInterval(check,15000); const handleOnline=()=>check(); const handleOffline=()=>setConnectivity('Offline');
   window.addEventListener('online',handleOnline);window.addEventListener('offline',handleOffline);
   return()=>{cancelled=true;window.clearInterval(interval);window.removeEventListener('online',handleOnline);window.removeEventListener('offline',handleOffline)};
 },[journeyActive,livePos,battery]);
 useEffect(()=>{if(screen==='live'){if(battery<=40&&battery>20)toastMsg('40%: Low-Power Journey Mode prepared.'); if(battery===20)showLightBuzz('Battery is at 20%.'); if(battery===10)showLightBuzz('Battery has reached 10%.'); if(battery<=5)toastMsg('Critical Low Battery Mode — essential support only.')}},[battery,screen]);
 useEffect(()=>{if(profile.completed)write('sarthi-profile',profile)},[profile]);
 const showLightBuzz=(reason:string)=>{setBuzz('light');toastMsg(`LIGHT BUZZ to ${contacts.filter(c=>c.primary).length} primary contact${contacts.filter(c=>c.primary).length===1?'':'s'}: ${reason}`)};
 const showTightBuzz=()=>{setBuzz('tight');toastMsg('TIGHT BUZZ / UEM: all contacts alerted with urgent context.')};
 const simulateUnexpectedStop=()=>{const active=read<any>('sarthi-journey-capsule',null);const journeyId=active?.journeyId||'active-journey';setStopState('checking');toastMsg('Your journey appears to have stopped. Are you okay?');fetch('/api/uem-event',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({journeyId,eventType:'UNEXPECTED_STOP',latitude:livePos?.lat??null,longitude:livePos?.lng??null,battery,connectivity,lastCheckpoint:journeyStep,destination:to})}).catch(()=>{});window.setTimeout(()=>{showLightBuzz('Unexpected stop remains unresolved.');fetch('/api/uem-event',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({journeyId,eventType:'CHECK_IN_NO_RESPONSE',latitude:livePos?.lat??null,longitude:livePos?.lng??null,battery,connectivity,lastCheckpoint:journeyStep,destination:to})}).catch(()=>{})},2200);window.setTimeout(()=>{setStopState('escalated');showTightBuzz();fetch('/api/uem-event',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({journeyId,eventType:'ESCALATION_REQUIRED',latitude:livePos?.lat??null,longitude:livePos?.lng??null,battery,connectivity,lastCheckpoint:journeyStep,destination:to})}).catch(()=>{})},7000)};
 const sendSms=(kind:'light'|'tight'|'normal')=>{let msg='';const recipients=(kind==='normal'||kind==='light'?contacts.filter(c=>c.primary):contacts).map(c=>c.phone).filter(Boolean);const toList=recipients.join(',');const pointText=visiblePoints.length?visiblePoints.slice(0,8).map(p=>`${p.kind==='checkpoint'?'Checkpoint':'Help point'}: ${p.name} (${p.distanceKm.toFixed(1)} km)`).join(' | '):'Point data unavailable';if(kind==='normal')msg=`SARTHI JOURNEY STARTED
Traveller: ${profile.name||'Traveller'}
Start: ${from}
Destination: ${to||'journey destination'}
Route: ${selected?.title||'Route 1'}
Mode: ${selected?.modes.join(' + ')||selectedMode}
Estimated time: ${selected?.duration||'—'} min
Current status: Journey active
Live-location sharing is intended for the selected primary contacts while this journey is active.
Points: ${pointText}`;if(kind==='light')msg=`SARTHI JOURNEY ALERT
${profile.name||'Traveller'}’s journey appears to have stopped.
Between: ${checkpointName(0)} and ${checkpointName(1)}
Last known location: ${locationText}
Destination: ${to||'journey destination'}
Route: ${selected?.title||'Route 1'}
Please call/check the traveller.
Journey points: ${pointText}
This is an awareness alert, not a claim that an emergency has occurred.`;if(kind==='tight')msg=`URGENT SARTHI ALERT — UEM ACTIVE
Traveller: ${profile.name||'Traveller'}
Last known location: ${locationText}
Destination: ${to||'journey destination'}
Last update: ${lastSync}
Travel mode: ${selected?.modes.join(' + ')||selectedMode}
Route: ${selected?.title||'Route 1'}
Checkpoints/help points: ${pointText}
Helplines: ${stateName} Women Helpline ${helpline} • National Women Helpline 181 • Emergency 112
Please contact the traveller immediately.
View the Sarthi journey screen for the full route and support context.`;window.location.href=`sms:${toList}?body=${encodeURIComponent(msg)}`};
 const checkpointName=(i:number)=>['Metro Station','Main Crossing','Destination Approach'][i%3];
const searchPlaces = async (q: string) => {
  setSearch(q);

  if (q.trim().length < 2) {
    setResults([]);
    return;
  }

  setSearching(true);

  try {
    const r = await fetch(
      `/api/geocode?q=${encodeURIComponent(q.trim())}`
    );

    if (!r.ok) throw new Error("Location search failed");

    const data = await r.json();

    setResults(
      Array.isArray(data?.places) ? data.places : []
    );
  } catch {
    setResults(
      FALLBACK_PLACES
        .filter(x =>
          x.toLowerCase().includes(q.toLowerCase())
        )
        .map(x => ({
          display_name: x,
          lat: String((location || { lat: 28.6139 }).lat),
          lon: String((location || { lng: 77.209 }).lng)
        })) as Place[]
    );
  } finally {
    setSearching(false);
  }
};
const searchStartPlaces = async (q: string) => {
  setStartSearch(q);

  if (q.trim().length < 2) {
    setStartResults([]);
    return;
  }

  setSearchingStart(true);

  try {
    const r = await fetch(
      `/api/geocode?q=${encodeURIComponent(q.trim())}`
    );

    if (!r.ok) throw new Error("Start location search failed");

    const data = await r.json();

    setStartResults(
      Array.isArray(data?.places) ? data.places : []
    );
  } catch {
    setStartResults(
      FALLBACK_PLACES
        .filter(x =>
          x.toLowerCase().includes(q.toLowerCase())
        )
        .map(x => ({
          display_name: x,
          lat: String((location || { lat: 28.6139 }).lat),
          lon: String((location || { lng: 77.209 }).lng)
        })) as Place[]
    );
  } finally {
    setSearchingStart(false);
  }
};
 const selected=routes[selectedRoute] || null;
 const buildRoute = async () => {
  if (!fromCoords || !toCoords) {
    setRoutes(makeFallbackRoutes());
    nav('routes');
    return;
  }

  setLoadingRoutes(true);

  try {
    const qs =
      `?from=${encodeURIComponent(from)}` +
      `&to=${encodeURIComponent(to)}`;

  const [routeRes, contextRes, transitRes] = await Promise.all([
  fetch(`/api/route-intelligence${qs}`),

  fetch(
    `/api/context-intelligence?lat=${fromCoords.lat}` +
    `&lon=${fromCoords.lng}` +
    `&connectivity=${encodeURIComponent(connectivity)}` +
    `&battery=${battery}`
  ),

  fetch(
    `/api/transit-intelligence` +
    `?fromLat=${fromCoords.lat}` +
    `&fromLon=${fromCoords.lng}` +
    `&toLat=${toCoords.lat}` +
    `&toLon=${toCoords.lng}`
  )
]);

    if (!routeRes.ok) {
      throw new Error('Backend route intelligence unavailable');
    }

    const routeJson = await routeRes.json();

    if (!routeJson.success || !routeJson.routes?.length) {
      throw new Error('No backend route');
    }

    const weather = await contextRes
      .json()
      .catch(() => ({ context: { weather: {} } }));

    const w = weather.context?.weather || {};
    const transitJson = await transitRes
  .json()
  .catch(() => ({
    success: false,
    stations: []
  }));

const transitStations = Array.isArray(
  transitJson?.stations
)
  ? transitJson.stations
  : [];

    const priority =
      priorities.includes('Faster travel')
        ? 'fastest'
        : priorities.includes('Lower walking')
        ? 'less_walking'
        : priorities.includes('Lower cost')
        ? 'low_cost'
        : 'balanced';

    const raw = routeJson.routes.slice(0, 3);

    const rts: Route[] = await Promise.all(
      raw.map(async (route: any, index: number) => {

        /*
         * IMPORTANT:
         * OSRM currently gives us real road-routing data.
         * It does NOT give us verified Metro/Auto/Cab availability
         * or live traffic.
         *
         * Therefore we only label the route according to the
         * actual routing source instead of pretending those
         * transport details are live.
         */

        const walk = 0;
        const transfers = 0;
       const hasTransit =
  transitStations.length > 0;

const modes = hasTransit
  ? ['Road', 'Public Transit']
  : ['Road'];
const priorityMatch =
  priority === 'fastest'
    ? route.durationMin <= 35
      ? 1
      : 0
    : priority === 'low_cost'
    ? route.estimatedCost <= 80
      ? 1
      : 0
    : priority === 'less_walking'
    ? walk <= 8
      ? 1
      : 0
    : 0.5;

const mlRes = await fetch(
  `/api/ml-route-suitability` +
  `?duration=${route.durationMin}` +
  `&cost=${route.estimatedCost}` +
  `&walking=${walk}` +
  `&transfers=${transfers}` +
  `&connectivity=${encodeURIComponent(connectivity)}` +
  `&battery=${battery}` +
  `&helpPoints=3` +
  `&rain=${w.rain ?? 0}` +
  `&windSpeed=${w.windSpeed ?? 0}` +
  `&priorityMatch=${priorityMatch}`
);

const ml = mlRes.ok
  ? await mlRes.json()
  : null;
        const suitRes = await fetch(
          `/api/route-suitability` +
          `?duration=${route.durationMin}` +
          `&cost=${route.estimatedCost}` +
          `&walking=${walk}` +
          `&transfers=${transfers}` +
          `&connectivity=${encodeURIComponent(connectivity)}` +
          `&battery=${battery}` +
          `&helpPoints=3` +
          `&rain=${w.rain ?? 0}` +
          `&windSpeed=${w.windSpeed ?? 0}` +
          `&priority=${priority}`
        );

        const suit = suitRes.ok
          ? await suitRes.json()
          : null;

        return {
          id: `r${index + 1}`,

          title: `Route ${index + 1}`,

          duration: route.durationMin,

          cost: route.estimatedCost,

          distance: route.distanceKm,

          walking: walk,

          transfers,

          modes,

          reason:
            index === 0
              ? 'Direct road route based on the current routing result and your saved priorities.'
              : index === 1
              ? 'Alternative road route from the routing service.'
              : 'Additional road-route alternative from the routing service.',

         context:
  `Backend route intelligence • ${route.source}` +
  (
    ml?.model
      ? ` • ${ml.model}`
      : ''
  ) +
  (
    suit?.recommendation
      ? ` • ${suit.recommendation}`
      : ''
  ),
  (hasTransit
    ? ' • Nearby public-transit infrastructure found'
    : ' • No nearby public-transit infrastructure found') +
            (
              suit?.recommendation
                ? ` • ${suit.recommendation}`
                : ''
            ),

          confidence:
            suit?.suitabilityScore >= 0.75
              ? 'High'
              : suit?.suitabilityScore >= 0.55
              ? 'Moderate'
              : 'Limited',

          updated: 'Backend • just now',

          firstMile:
  hasTransit
    ? `Road access + nearby transit infrastructure (${transitStations.length} station${transitStations.length === 1 ? '' : 's'})`
    : 'Road journey starts from selected location',

lastMile:
  hasTransit
    ? 'Transit/road connection to selected destination'
    : 'Road journey ends at selected destination',

          steps:
            (route.steps || [])
              .slice(0, 5)
              .map(
                (x: any) =>
                  x.name ||
                  x.maneuver?.instruction ||
                  'Continue'
              ),

          geometry:
            (route.geometry?.coordinates || [])
              .map(
                ([lng, lat]: [number, number]) =>
                  [lat, lng] as [number, number]
              ),

          /*
           * Traffic is NOT currently coming from a live traffic API.
           * Keep this explicit instead of displaying a fabricated
           * Heavy/Moderate/Light value.
           */
          traffic: 'Unavailable',

         fingerprint: [
  route.distanceKm,
  route.durationMin,
  route.estimatedCost,
  suit?.suitabilityScore ?? null,
  ml?.suitabilityScore ?? null
].map(String)
        };
      })
    );

    setRoutes(
      rts.length
        ? rts
        : makeFallbackRoutes()
    );

    setSelectedRoute(0);

    nav('routes');

  } catch (error) {

    console.error('Route build error:', error);

    setRoutes(makeFallbackRoutes());

    nav('routes');

  } finally {

    setLoadingRoutes(false);

  }
};
 const makeFallbackRoutes=():Route[]=>{const c=fromCoords||location||{lat:28.6139,lng:77.209};const d=toCoords||{lat:c.lat+0.03,lng:c.lng+0.02};const geom: [number,number][]=[[c.lat,c.lng],[c.lat+(d.lat-c.lat)*.35,c.lng+(d.lng-c.lng)*.35],[c.lat+(d.lat-c.lat)*.7,c.lng+(d.lng-c.lng)*.7],[d.lat,d.lng]];return [
  {id:'r1',title:'Route 1',duration:32,cost:40,distance:9.2,walking:7,transfers:1,modes:['Walk','Metro'],reason:'Currently fits your saved priorities well.',context:'Demo road/transit context used because live routing is unavailable.',confidence:'Moderate',updated:'Moments ago',firstMile:'5 min walk → Metro',lastMile:'6 min walk → destination',steps:['Walk to Metro','Metro journey','Walk to destination'],geometry:geom,traffic:'Moderate'},
  {id:'r2',title:'Route 2',duration:28,cost:70,distance:8.6,walking:5,transfers:1,modes:['Auto / Rickshaw','Metro'],reason:'Quicker with lower walking, but more expensive.',context:'Demo transport context.',confidence:'Moderate',updated:'Moments ago',firstMile:'Auto pickup → Metro',lastMile:'5 min walk',steps:['Auto pickup','Metro journey','Final walk'],geometry:geom,traffic:'Heavy'},
  {id:'r3',title:'Route 3',duration:31,cost:180,distance:9.4,walking:2,transfers:0,modes:['Cab'],reason:'Minimal walking and no transfer.',context:'Cab integration is represented with demo data.',confidence:'Limited',updated:'Moments ago',firstMile:'Cab pickup',lastMile:'Drop-off',steps:['Cab pickup','Direct ride','Drop-off'],geometry:geom,traffic:'Light'}]};
 const startJourney=async()=>{const c=fromCoords||location||{lat:28.6139,lng:77.209};const journeyId=`journey-${Date.now()}`;const capsule={journeyId,startedAt:new Date().toISOString(),route:selected?.title||'Route 1',from,to,mode:selected?.modes||[selectedMode],geometry:selected?.geometry||[],steps:selected?.steps||[],checkpoints:visiblePoints.filter(m=>m.kind==='checkpoint'),helpPoints:visiblePoints.filter(m=>m.kind==='help'),destination:to,contacts,helpline,stateName,lastSync};setJourneyActive(true);setLivePos(c);setBattery(74);setConnectivity(navigator.onLine?'Normal':'Offline');setStopState('moving');write('sarthi-active',capsule);write('sarthi-journey-capsule',capsule);try{await fetch('/api/journey-event',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({journeyId,eventType:'JOURNEY_STARTED',latitude:c.lat,longitude:c.lng,battery:74,connectivity:navigator.onLine?'Normal':'Offline',checkpoint:null})})}catch{}nav('live')};
 const finishProfile=()=>{if(editingProfile){const p={...profileDraft,completed:true,phone};setProfile(p);write('sarthi-profile',p);setEditingProfile(false);toastMsg('Profile updated. Your usual travel style is saved.');goBack()}else{const p={...profileDraft,completed:false,phone,priorities:[]};setProfile(p);setPriorities([]);write('sarthi-profile',p);nav('onboarding-preferences')}};
 const finishOnboardingPreferences=()=>{if(priorities.length<6){toastMsg('Choose at least 6 priorities so I can understand what matters to you.');return}const p={...profile,priorities,completed:false};setProfile(p);write('sarthi-profile',p);setContactsSetup(true);nav('contacts')};
 const finishOnboarding=()=>{const p={...profile,completed:true};setProfile(p);write('sarthi-profile',p);historyRef.current=['home'];historyIndexRef.current=0;setScreen('home');window.scrollTo({top:0,behavior:'smooth'})};
 const selectPlace=(p:Place)=>{setTo(p.display_name.split(',').slice(0,3).join(', '));setToCoords({lat:Number(p.lat),lng:Number(p.lon)});setSearch('');setResults([]);toastMsg('Destination selected. Continue when you are ready.')};
 const savePriority=(p:string)=>setPriorities(x=>x.includes(p)?x.filter(y=>y!==p):x.length<7?[...x,p]:x);
 const useCurrent=()=>{if(location){setFrom('Current location');setFromCoords(location)}else requestLocation()};
 const pointDistance=(a:Coords,b:Coords)=>{const R=6371,dLat=(b.lat-a.lat)*Math.PI/180,dLng=(b.lng-a.lng)*Math.PI/180;const x=Math.sin(dLat/2)**2+Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLng/2)**2;return R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x))};
 const nearestRouteStats=(c:Coords,geometry:[number,number][])=>{let min=Infinity,index=0;geometry.forEach(([lat,lng],i)=>{const d=pointDistance(c,{lat,lng});if(d<min){min=d;index=i}});return {distanceKm:min,routeIndex:index}};
 const fetchJourneyPoints=async(geometry:[number,number][])=>{if(!geometry.length){setJourneyPoints([]);setPointStatus('idle');return}setPointStatus('loading');const sample=Array.from({length:Math.min(12,geometry.length)},(_,i)=>geometry[Math.floor(i*(geometry.length-1)/Math.max(1,Math.min(12,geometry.length)-1))]);const qParts=sample.flatMap(([lat,lng])=>[`nwr(around:700,${lat},${lng})["public_transport"];`,`nwr(around:700,${lat},${lng})["railway"~"station|halt|subway|tram_stop"];`,`nwr(around:700,${lat},${lng})["highway"="bus_stop"];`,`nwr(around:700,${lat},${lng})["amenity"~"police|hospital|clinic|pharmacy|fire_station|school|college|university|community_centre|library|shelter|social_facility"];`,`nwr(around:700,${lat},${lng})["healthcare"];`,`nwr(around:700,${lat},${lng})["tourism"~"attraction|museum"];`,`nwr(around:700,${lat},${lng})["historic"];`]);const q=`[out:json][timeout:25];(${qParts.join('')});out center tags;`;try{const r=await fetch('https://overpass-api.de/api/interpreter',{method:'POST',headers:{'Content-Type':'text/plain;charset=UTF-8'},body:q});if(!r.ok)throw new Error('Overpass unavailable');const j=await r.json();const raw=(j.elements||[]).map((e:any)=>{const c=e.type==='node'?{lat:e.lat,lng:e.lon}:e.center?{lat:e.center.lat,lng:e.center.lon}:null;if(!c)return null;const t=e.tags||{};const name=t.name as string|undefined;if(!name)return null;let kind:'checkpoint'|'help'='checkpoint';let category='Landmark';const amen=t.amenity as string|undefined;if(['police','hospital','clinic','pharmacy','fire_station','community_centre','social_facility','shelter'].includes(amen||'')){kind='help';category=(amen||'support').replace(/_/g,' ')}else if(t.healthcare){kind='help';category=String(t.healthcare).replace(/_/g,' ')}else if(t.public_transport||t.railway||t.highway==='bus_stop'){kind='checkpoint';category=String(t.railway||t.public_transport||'bus stop').replace(/_/g,' ')}else if(['school','college','university'].includes(amen||'')){kind='checkpoint';category=String(amen)}else if(t.tourism||t.historic){kind='checkpoint';category=String(t.tourism||t.historic).replace(/_/g,' ')}else return null;return {id:`osm-${e.type}-${e.id}`,name,kind,coords:c,category,...nearestRouteStats(c,geometry),source:'OpenStreetMap' as const,details:t.operator||t.description||''} as JourneyPoint}).filter(Boolean) as JourneyPoint[];const dedup=new Map<string,JourneyPoint>();raw.filter(p=>p.distanceKm<=0.75).sort((a,b)=>a.distanceKm-b.distanceKm).forEach(p=>{const key=`${p.kind}-${p.name.toLowerCase()}`;if(!dedup.has(key))dedup.set(key,p)});const all=[...dedup.values()].sort((a,b)=>a.distanceKm-b.distanceKm);setJourneyPoints(all);setPointUpdatedAt(new Date().toLocaleTimeString());setPointStatus(all.length?'live':'fallback')}catch{setJourneyPoints([]);setPointUpdatedAt(new Date().toLocaleTimeString());setPointStatus('fallback')}};
 useEffect(()=>{setJourneyPoints([]);setPointUpdatedAt('');if(selected?.geometry?.length)fetchJourneyPoints(selected.geometry);else setPointStatus('idle')},[selected?.id]);
 useEffect(()=>{if(!journeyActive||!selected?.geometry?.length)return;const id=window.setInterval(()=>{if(navigator.onLine)fetchJourneyPoints(selected.geometry)},60000);return()=>window.clearInterval(id)},[journeyActive,selected?.id]);
 useEffect(()=>{if(!journeyActive||!journeyPoints.length)return;const active=read<any>('sarthi-journey-capsule',null);if(active){write('sarthi-journey-capsule',{...active,checkpoints:journeyPoints.filter(p=>p.kind==='checkpoint'),helpPoints:journeyPoints.filter(p=>p.kind==='help'),lastSync:pointUpdatedAt||active.lastSync})}},[journeyPoints,journeyActive,pointUpdatedAt]);
 const fallbackPoints=useMemo<JourneyPoint[]>(()=>{if(!selected?.geometry.length)return[];const g=selected.geometry;const at=(ratio:number)=>g[Math.min(g.length-1,Math.max(0,Math.floor(g.length*ratio)))];const pts:JourneyPoint[]= [at(.18),at(.36),at(.54),at(.72),at(.86)].map((x,i)=>({id:`fallback-c-${i}`,name:`Route checkpoint ${i+1}`,kind:'checkpoint',coords:{lat:x[0],lng:x[1]},category:'Route milestone',distanceKm:0,source:'Route fallback',routeIndex:Math.floor((i+1)*g.length/6),details:'Named place data was not available from the live map source.'}));pts.push({id:'fallback-h-1',name:'Nearby help point',kind:'help',coords:{lat:at(.68)[0],lng:at(.68)[1]},category:'Public assistance',distanceKm:0,source:'Route fallback',routeIndex:Math.floor(.68*g.length),details:'Live help-point data was unavailable at the moment.'});return pts},[selected]);
 const visiblePoints=journeyPoints.length?journeyPoints:fallbackPoints;
 const liveCenter=livePos||fromCoords||location||{lat:28.6139,lng:77.209};
 const currentRouteIndex=liveCenter&&selected?.geometry?.length?nearestRouteStats(liveCenter,selected.geometry).routeIndex:0;
 const nextCheckpoint=visiblePoints.filter(p=>p.kind==='checkpoint').sort((a,b)=>(a.routeIndex??0)-(b.routeIndex??0)).find(p=>(p.routeIndex??0)>=currentRouteIndex)||visiblePoints.filter(p=>p.kind==='checkpoint').sort((a,b)=>(a.routeIndex??0)-(b.routeIndex??0))[0];
 const nearestHelp=visiblePoints.filter(p=>p.kind==='help').sort((a,b)=>pointDistance(liveCenter,a.coords)-pointDistance(liveCenter,b.coords))[0];
 const routeMarkers=visiblePoints.map(p=>({coords:p.coords,label:p.name,kind:p.kind}));
 const path=selected?.geometry.map(([lat,lng])=>({lat,lng}))||[];
 const header=(title:string,sub:string,_back:Screen='home')=><><div className="header"><button className="icon-btn" onClick={goBack} disabled={historyIndexRef.current===0} aria-label="Back"><ArrowLeft size={19}/></button><div><span className="eyebrow">SARTHI</span><h1>{title}</h1><p>{sub}</p></div><button className="disha-mini" onClick={()=>toastMsg('I’m Disha. Tap me whenever you want something explained.')}><Disha size={38}/></button></div><div className="flow-controls"><button onClick={goBack} disabled={historyIndexRef.current===0}><ArrowLeft/> Back</button><button onClick={goForward} disabled={historyIndexRef.current>=historyRef.current.length-1}>Forward <ArrowRight/></button><button className="exit" onClick={exitFlow}>Exit</button></div></>;
 const renderWelcome=()=> <div className="public welcome"><div className="hero-bg a"/><div className="hero-bg b"/><div className="welcome-brand"><Logo/></div><div className="welcome-center"><span className="eyebrow">A JOURNEY COMPANION FOR REAL-WORLD TRAVEL</span><h1>Find the journey that <em>fits the moment.</em></h1><p>Not just where to go — Sarthi helps you understand how today’s journey fits your situation and stays with you when things change.</p><button className="hero-cta" onClick={()=>nav('auth')}>Get Started <ArrowRight size={19}/></button></div></div>;
 const renderAuth=()=> <div className="public auth-page"><PublicBack/><div className="auth-intro"><Logo/><h1>Welcome to Sarthi</h1><p>Choose how you want to enter. I recommend <b>Sign Up</b> so your travel style, trusted contacts and journey history can be remembered.</p></div><div className="auth-list"><button className="auth-card featured" onClick={()=>{localStorage.removeItem('sarthi-profile');localStorage.removeItem('sarthi-contacts');localStorage.removeItem('sarthi-history');localStorage.removeItem('sarthi-active');setProfile(DEFAULT_PROFILE);setProfileDraft(DEFAULT_PROFILE);setContacts([]);setPriorities([]);setPhone('');setOtp(['','','','','','']);setEditingProfile(false);setEditingPreferences(false);nav('phone')}}><div className="auth-dot pink"><User/></div><div><b>Sign Up</b><span>Recommended — remember your preferences, contacts and journeys.</span></div><ChevronRight/></button><button className="auth-card" onClick={()=>nav('phone')}><div className="auth-dot navy"><LogOut/></div><div><b>Log In</b><span>Return to your saved Sarthi profile.</span></div><ChevronRight/></button><button className="auth-card" onClick={()=>{setProfile(u=>({...u,phone:'',isGuest:true}));nav('journey-type')}}><div className="auth-dot turq"><Compass/></div><div><b>Guest Mode</b><span>Plan and try the core journey flow without permanent history.</span></div><ChevronRight/></button></div><div className="demo-card"><Play size={17}/><div><b>See the complete sample journey</b><span>One guided demo of the full Sarthi journey.</span></div><button onClick={openSample}>Play sample</button></div></div>;
 const renderPhone=()=> <div className="auth-page simple"><PublicBack/><div className="progress"><span className="on"/><span/><span/><span/></div><Logo small/><h1>{screen==='phone'?'Your phone, then one quick OTP.':'Your phone number'}</h1><p className="lead">For today’s demo, you can enter 9876543210. In the real app this step connects to secure authentication.</p><Bubble text="I’ll only ask for your phone here. The next screen is the OTP — no long form on one page."/><div className="card form"><label>Mobile number <InfoBtn text="Your number is used to identify your login session. Real deployment will use a secure authentication service."/></label><div className="phone-row"><span>+91</span><input inputMode="numeric" maxLength={10} value={phone.replace(/\D/g,'').slice(0,10)} onChange={e=>setPhone(e.target.value.replace(/\D/g,'').slice(0,10))}/></div><small>Demo: 9876543210</small></div><button className="primary pink" disabled={phone.replace(/\D/g,'').length!==10} onClick={()=>nav('otp')}>Continue <ArrowRight/></button></div>;
 const renderOtp=()=> <div className="auth-page simple"><PublicBack/><div className="progress"><span className="on"/><span className="on"/><span/><span/></div><Logo small/><h1>Enter your OTP</h1><p className="lead">We sent a 6-digit code to +91 ••••••{phone.slice(-2)}.</p><Bubble text="For today’s demo, use 123456. I’ll move you forward only when all six digits match."/><div className="card form"><div className="otp-row">{otp.map((v,i)=><input key={i} ref={el=>otpRef[i]=el} autoFocus={i===0} maxLength={1} inputMode="numeric" value={v} onChange={e=>{const val=e.target.value.replace(/\D/g,'').slice(-1);const n=[...otp];n[i]=val;setOtp(n);if(val&&i<5)otpRef[i+1]?.focus()}} onKeyDown={e=>{if(e.key==='Backspace'&&!otp[i]&&i>0)otpRef[i-1]?.focus()}}/> )}</div><button className="demo-otp" onClick={()=>setOtp(['1','2','3','4','5','6'])}>Use demo OTP 123456</button><span className="muted">Resend OTP · Change number</span></div><button className="primary pink" onClick={()=>{if(otp.join('')!=='123456'){toastMsg('Please enter the demo OTP 123456.');return}if(phone.replace(/\D/g,'')===DEMO_PHONE){loadDemoAccount();return}setProfile(p=>({...p,phone:phone.replace(/\D/g,'')}));nav('location')}}>Verify & Continue <Check/></button></div>;
 const renderLocation=()=> <div className="auth-page simple"><PublicBack/><Logo small/><h1>Let’s connect your location</h1><p className="lead">First I’ll understand roughly where you are. This lets Sarthi personalize language choices and later support an active journey.</p><Bubble text="Your live location is not shared just because you allow location access. Live journey sharing starts only after you start a journey."/><div className="card location-card"><LocateFixed size={24}/><div><b>{location?'Location connected':'Location not connected'}</b><span>{locationText}</span></div><button className="secondary turq" onClick={requestLocation}>{location?'Refresh':'Allow location'}</button></div><div className="privacy-note"><Shield size={16}/><span>Live location is used only during an active journey.</span></div><button className="primary turq" onClick={()=>{setRecommended(['en','hi','mr']);nav('language')}}>Continue <ArrowRight/></button></div>;
 const renderLanguage=()=> <div className="auth-page simple"><PublicBack/><Logo small/><h1>Choose the language that feels natural</h1><p className="lead">Likely choices are shown first. Your selected language changes the app’s user-facing text.</p><Bubble text="You can change this later in Settings. I’ll keep the same journey logic underneath."/><div className="card"><div className="section-title">Recommended for you</div><div className="lang-grid">{recommended.map(c=>{const l=LANGS.find(x=>x.code===c)!;return <button className={language===c?'selected':''} key={c} onClick={()=>setLanguage(c)}><span>Recommended</span><b>{l.native}</b><small>{l.english}</small></button>})}</div><button className="other" onClick={()=>setShowAllLang(v=>!v)}><Languages/> All languages <ChevronDown/></button>{showAllLang&&<div className="lang-grid all">{LANGS.filter(l=>!recommended.includes(l.code)).map(l=><button className={language===l.code?'selected':''} key={l.code} onClick={()=>setLanguage(l.code)}><b>{l.native}</b><small>{l.english}</small></button>)}</div>}</div><button className="primary pink" onClick={()=>{write('sarthi-language',language);profile.completed?goBack():nav('disha-intro')}}>Continue <ArrowRight/></button></div>;
 const renderDishaIntro=()=> <div className="auth-page simple"><div className="disha-hero"><Disha size={118}/></div><span className="eyebrow">MEET YOUR AI GUIDE</span><h1>Hi, I’m <em>Disha.</em></h1><p className="lead">I’m not here to make decisions for you. I’m here to explain your choices, help you prepare, and stay with you when the journey changes.</p><div className="disha-points card"><div><Check/> I explain why I ask.</div><div><Check/> I remember your usual travel style.</div><div><Check/> I show uncertainty instead of pretending.</div><div><Check/> I guide you through emergency and offline support.</div></div><button className="primary pink" onClick={()=>nav('profile')}>Let’s get to know you <ArrowRight/></button></div>;
 const renderProfile=()=> <div className="auth-page simple"><PublicBack/><div className="progress"><span className="on"/><span className="on"/><span className="on"/><span className="on"/></div><DishaAvatarBlock step={profileStep}/>{profileStep===0?<div className="card form"><label>Your name <InfoBtn text="I use your name to make Disha’s guidance and journey history feel personal."/></label><input autoFocus value={profileDraft.name} onChange={e=>setProfileDraft({...profileDraft,name:e.target.value})} placeholder="What should I call you?"/><label>Age <InfoBtn text="Age is basic profile context only. It is not used to label places or infer danger."/></label><input inputMode="numeric" maxLength={2} value={profileDraft.age} onChange={e=>setProfileDraft({...profileDraft,age:e.target.value.replace(/\D/g,'').slice(0,2)})} placeholder="Your age"/><label>Career / occupation <InfoBtn text="This helps describe the kind of journeys you may commonly take, such as college, office or shift travel."/></label><input value={profileDraft.career} onChange={e=>setProfileDraft({...profileDraft,career:e.target.value})} placeholder="Student, engineer, designer..."/></div>:<>{profileStep===1?<div className="card form"><label>Income range <span className="optional">Optional</span> <InfoBtn text="Only used for affordability choices. It is never used to infer safety."/></label><div className="choice-grid">{['Below ₹3L','₹3–6L','₹6–10L','₹10L+','Prefer not to say'].map(x=><button key={x} className={profileDraft.income===x?'selected':''} onClick={()=>setProfileDraft({...profileDraft,income:x})}>{x}</button>)}</div><div className="info-box"><WalletCards/> Affordability context only.</div></div>:profileStep===2?<div className="card form"><label>How comfortable are you with walking? <InfoBtn text="This helps me avoid repeating the same walking question. You can still change it for a particular journey."/></label><div className="segmented">{(['Low','Moderate','Comfortable'] as const).map(x=><button className={profileDraft.walkingComfort===x?'selected':''} key={x} onClick={()=>setProfileDraft({...profileDraft,walkingComfort:x})}>{x}</button>)}</div></div>:<div className="card form"><label>Which travel modes do you normally use? <InfoBtn text="These become your usual travel-style defaults. I can still show another practical option when it matters for the journey."/></label><div className="mode-grid">{MODES.map(([name,Icon])=><button className={profileDraft.travelModes.includes(name)?'selected':''} key={name} onClick={()=>setProfileDraft(p=>({...p,travelModes:p.travelModes.includes(name)?p.travelModes.filter(x=>x!==name):[...p.travelModes,name]}))}><Icon/><span>{name}</span></button>)}</div></div>}</>}{profileStep>0&&<p className="note-line">Your usual travel style is saved once. You won’t be asked to recreate it before every journey.</p>}<div className="sticky"><button className="text-btn" onClick={()=>profileStep===0?(editingProfile?goBack():nav('disha-intro')):setProfileStep(profileStep-1)}><ArrowLeft/> Back</button><button className="primary pink" onClick={()=>profileStep<3?setProfileStep(profileStep+1):finishProfile()}>{profileStep<3?'Continue':'Save my travel style'} <ArrowRight/></button></div></div>;
 function DishaAvatarBlock({step}:{step:number}){const tx=['Let’s start with the basics — one small step at a time.','Now just one affordability question. It is optional.','Tell me how walking usually feels for you.','Finally, choose the modes you normally use.'];return <div className="disha-step"><Disha size={62}/><div><span className="eyebrow">STEP {step+1} OF 4</span><b>{tx[step]}</b></div></div>}
 const renderOnboardingPreferences=()=> <div className="auth-page simple"><PublicBack/><div className="progress"><span className="on"/><span className="on"/><span className="on"/><span className="on"/></div><div className="disha-step"><Disha size={62}/><div><span className="eyebrow">YOUR TRAVEL PREFERENCES</span><b>Tell me what matters most. I’ll recommend a starting set, but you stay in control.</b></div></div><h1>What matters most on your journeys?</h1><p className="lead">I’ll recommend a few based on your travel style, but <b>you choose</b> what to save. Nothing is selected automatically.</p><div className="selected-count"><b>{priorities.length}/7</b><span>selected • choose 6–7 for a strong starting profile</span></div><div className="priority-grid">{PRIORITY_OPTIONS.map(p=>{const rec=['Faster travel','Lower walking','Fewer transfers','Help access','Connectivity','Weather comfort','Easy first / last mile'].includes(p);return <button key={p} className={priorities.includes(p)?'selected':''} onClick={()=>savePriority(p)} disabled={!priorities.includes(p)&&priorities.length>=7}><span>{p}{rec&&<em className="recommend-badge">Recommended</em>}</span>{priorities.includes(p)&&<Check/>}<InfoBtn text={`I’m recommending ${p.toLowerCase()} as a starting point because it can matter to a journey, but only your choice becomes part of your saved travel profile.`}/></button>})}</div><div className="info-box"><Sparkles/><span>Recommended ≠ selected. I only save the priorities you tap.</span></div><div className="sticky"><button className="text-btn" onClick={()=>nav('profile')}><ArrowLeft/> Back</button><button className="primary pink" onClick={finishOnboardingPreferences}>Save my preferences <Check/></button></div></div>;
 const renderOnboarding=()=>{const cards=[
  {title:'Dashboard',icon:HomeIcon,text:'Your home base. New Journey starts planning, My Journeys stores completed trips, Journey Health shows battery and connection, and Emergency is always available.'},
  {title:'New Journey',icon:RouteIcon,text:'Choose Travel Right Now or Pre-Journey. Your saved travel style is the default, and you can adjust it for one journey without changing your usual preferences.'},
  {title:'Route choice',icon:Compass,text:'Sarthi compares practical options using time, cost, walking, transfers, modes, your priorities and available context. It explains “Why this route?” instead of giving a safety score.'},
  {title:'Live Journey',icon:Map,text:'During an active journey, the map follows your position. Steps, battery, connectivity, checkpoints, help points and emergency actions remain easy to reach.'},
  {title:'Journey Capsule + Offline',icon:WalletCards,text:'At Start Journey, essential route data, steps, checkpoints, help points, destination, contacts and support details are prepared on-device for low-connectivity moments.'},
  {title:'Something Changed',icon:AlertTriangle,text:'If a meaningful journey condition changes, Sarthi explains what changed and gives you two choices: Re-evaluate or Keep Current. No silent rerouting.'},
  {title:'Journey Health',icon:Zap,text:'40% prepares low-power mode; 20% and 10% increase awareness; 5% preserves essentials. Network states show what is synced and what is still local.'},
  {title:'Emergency & UEM',icon:Shield,text:'Normal support offers Share Location, Get to Safety, Trusted Contacts and 112. UEM is the escalated state, with urgent context, all configured contacts and full support details.'},
  {title:'Get to Safety + Contacts',icon:HeartHandshake,text:'Get to Safety surfaces practical help points. At least five trusted contacts are configured; normal journey sharing can be selective, while emergency/UEM alerts reach every configured contact.'},
  {title:'Reports + Review',icon:MessageSquare,text:'Report route, transport, context or help-point issues with evidence. Reports can be reviewed, flagged as questionable, marked outdated, and reopened if the issue remains.'},
  {title:'My + Frequent Journeys',icon:CalendarDays,text:'My Journeys keeps a date-based history and replay. Frequent Journeys is suggested only from completed history, not shown as a fake default.'},
  {title:'Settings + Disha',icon:SettingsIcon,text:'Change profile, language, travel style, contacts, notifications and privacy anytime. Replay this full tour whenever you want Disha to explain the app again.'},
  {title:'How support alerts work',icon:Bell,text:'A light buzz is early awareness. Continued unresolved concern can escalate to a tight UEM alert. Sarthi shows uncertainty and never pretends a remote message was delivered while offline.'}
 ];const C=cards[tourStep]||cards[cards.length-1];return <div className="public tour"><PublicBack/><div className="tour-top"><Logo/><span>GUIDED TOUR</span></div><div className="tour-content"><Disha size={96}/><span className="eyebrow">YOUR SARTHI, STEP BY STEP</span><h1>Here’s how the whole app works.</h1><p className="lead">Disha explains every major portal and the moments that matter. You can replay this from Settings.</p><div className="tour-card"><div className="tour-icon"><C.icon/></div><div><b>{C.title}</b><p>{C.text}</p></div></div><div className="tour-counter">{tourStep+1} / {cards.length}</div><div className="tour-progress">{cards.map((_,i)=><span className={i===tourStep?'active':''} key={i}/>)}</div><div className="tour-actions"><button className="text-btn" onClick={()=>tourStep>0&&setTourStep(tourStep-1)} disabled={tourStep===0}><ArrowLeft/> Previous</button><button className="secondary" onClick={exitFlow}>Exit</button>{tourStep<cards.length-1?<button className="primary pink" onClick={()=>setTourStep(tourStep+1)}>Next <ArrowRight/></button>:<button className="primary pink" onClick={finishOnboarding}>Finish tour <Check/></button>}</div><div className="tour-note"><Info size={15}/> The complete sample journey is available once from the entry screen.</div></div></div>};
 const JourneyPointsPanel=({compact=false}:{compact?:boolean})=>{const [expanded,setExpanded]=useState(!compact);const checkpoints=visiblePoints.filter(p=>p.kind==='checkpoint').sort((a,b)=>(a.routeIndex??0)-(b.routeIndex??0));const helps=visiblePoints.filter(p=>p.kind==='help').sort((a,b)=>pointDistance(liveCenter,a.coords)-pointDistance(liveCenter,b.coords));const pointButton=(p:JourneyPoint)=><button className="journey-point-row" key={p.id} onClick={()=>toastMsg(`${p.name} • ${p.category} • ${p.distanceKm.toFixed(1)} km from route`)}><span className={`point-icon ${p.kind}`}>{p.kind==='checkpoint'?<Flag/>:<HeartHandshake/>}</span><span><b>{p.name}</b><small>{p.category} • {p.distanceKm.toFixed(1)} km from route • {p.source}</small></span><ChevronRight/></button>;const max=compact&&!expanded?6:30;return <div className={`journey-points ${compact?'compact':''}`}><div className="points-head"><div><b>Journey points</b><span>{pointStatus==='loading'?'Updating from OpenStreetMap…':pointStatus==='live'?`${checkpoints.length} checkpoints • ${helps.length} help points • updated ${pointUpdatedAt||'just now'}`:'Live map points unavailable right now'}</span></div><div className="points-head-actions"><button className="points-toggle" onClick={()=>setExpanded(v=>!v)}>{expanded?'Hide':'View all'}</button><button aria-label="Refresh live journey points" onClick={()=>selected?.geometry?.length&&fetchJourneyPoints(selected.geometry)}><RefreshCw/></button></div></div>{checkpoints.length>0&&<div className="points-section"><span className="eyebrow">CHECKPOINTS ALONG YOUR ROUTE</span>{checkpoints.slice(0,max).map(pointButton)}</div>}{helps.length>0&&<div className="points-section"><span className="eyebrow">HELP POINTS ALONG YOUR ROUTE</span>{helps.slice(0,max).map(pointButton)}</div>}{!checkpoints.length&&!helps.length&&<div className="points-empty"><MapPin/><span>Live named points will appear here when the map source returns them. The fallback route markers are clearly labelled and are not presented as verified places.</span></div>}</div>};
 const renderHome=()=> <div className="app-page home"><div className="home-brand-row"><Logo/><Disha size={58}/></div><div className="home-head"><div><span className="eyebrow">GOOD {new Date().getHours()<12?'MORNING':new Date().getHours()<18?'AFTERNOON':'EVENING'}</span><h1>{profile.name||'Traveller'} 👋</h1><p>What would make today’s journey fit better?</p></div></div>{location?<MapView center={location}/>:<div className="map-placeholder"><LocateFixed/> <span>Connect location for a current map preview</span><button onClick={requestLocation}>Connect</button></div>}<div className="hero-card"><div><span className="eyebrow">READY WHEN YOU ARE</span><h2>Plan a journey that fits <em>today.</em></h2><p>Your saved travel preferences are ready for this journey.</p></div><button onClick={()=>nav('journey-type')}><RouteIcon/> New Journey</button></div><div className="portal-grid"><button className="portal pink" onClick={()=>nav('journey-type')}><RouteIcon/><b>New Journey</b><span>Plan now or later</span></button><button className="portal turq" onClick={()=>nav('my-journeys')}><CalendarDays/><b>My Journeys</b><span>Calendar + map replay</span></button><button className="portal orange" onClick={()=>nav('frequent')}><RefreshCw/><b>Frequent Journeys</b><span>Recurring travel patterns</span></button><button className="portal navy" onClick={()=>nav('emergency')}><Shield/><b>Emergency & Safety</b><span>Help when something feels wrong</span></button></div><div className="health-strip"><div><Zap/><b>{battery}%</b><span>Battery</span></div><div><Wifi/><b>{connectivity}</b><span>Connection</span></div><button onClick={()=>nav('journey-health')}>Journey Health <ChevronRight/></button></div><div className="disha-home"><Disha size={48}/><div><b>Disha is here</b><span>Tap me whenever you want a feature explained.</span></div><button onClick={()=>{setTourStep(0);nav('onboarding')}}>Tour</button></div></div>;
 const renderJourneyType=()=> <div className="app-page">{header('New Journey','Start now or prepare ahead. Your saved travel style is already here.','home')}<Bubble text="You only need to adjust your usual preferences when this journey is different from your normal routine."/><div className="type-grid"><button className={journeyType==='right-now'?'selected':''} onClick={()=>setJourneyType('right-now')}><Sun/><b>Travel Right Now</b><span>Use current context and leave when ready.</span></button><button className={journeyType==='pre-journey'?'selected':''} onClick={()=>setJourneyType('pre-journey')}><CalendarDays/><b>Pre-Journey</b><span>Choose a future time and prepare in advance.</span></button></div>{journeyType==='pre-journey'&&<div className="card form"><label>Date <InfoBtn text="Context such as weather and transport can differ by the time you actually travel."/></label><input type="date" value={plannedDate} onChange={e=>setPlannedDate(e.target.value)}/><label>Expected time <InfoBtn text="The same route can feel different across the day, so timing is part of journey context."/></label><input type="time" value={plannedTime} onChange={e=>setPlannedTime(e.target.value)}/><div className="preflight"><CloudRain/><div><b>Pre-journey context preview</b><span>Weather and transport context will be refreshed for this planned time when connected.</span></div></div>{weather&&<div className="weather-card"><CloudRain/><div><b>{weather.label} • {weather.temp}</b><span>Current rain: {weather.rain} • live weather source connected</span></div></div>}</div>}<div className="card adjust"><div><b>Adjust your saved preferences for this journey?</b><span>Keep your normal travel style or change only what matters today.</span></div><button onClick={()=>setAdjustPrefs(!adjustPrefs)}>{adjustPrefs?'Adjusting':'Keep saved'}</button></div><button className="primary pink" onClick={()=>nav('start-point')}>Continue <ArrowRight/></button></div>;
 const renderStartPoint=()=> <div className="app-page">{header('Where are you starting?','Your starting point matters because first-mile conditions matter too.','journey-type')}<Bubble text="Current location is the default, but you can search across India for any place, landmark or address."/><div className="card choices"><button className={from==='Current location'?'selected':''} onClick={useCurrent}><LocateFixed/><div><b>Use current location</b><span>{location?locationText:'Ask for location access'}</span></div><Check/></button><button className={from==='Home'?'selected':''} onClick={()=>{setFrom('Home');setFromCoords(null);setStartSearch('');setStartResults([])}}><HomeIcon/><div><b>Home</b><span>Saved place</span></div></button><div className="search-inline"><Search/><input placeholder="Search an address, place or landmark" value={startSearch} onChange={e=>searchStartPlaces(e.target.value)}/>{searchingStart&&<span className="spinner"/>}</div>{startResults.length>0&&<div className="start-search-results">{startResults.map((p,i)=><button key={`${p.display_name}-${i}`} onClick={()=>{setFrom(p.display_name.split(',').slice(0,3).join(', '));setFromCoords({lat:Number(p.lat),lng:Number(p.lon)});setStartSearch('');setStartResults([]);toastMsg('Starting point selected.')}}><MapPin/><span>{p.display_name}</span><ChevronRight/></button>)}</div>}{from && from!=='Current location'&&<div className="selected-place-card"><div><span className="eyebrow">STARTING POINT SELECTED</span><b>{from}</b><small>Ready to use for this journey.</small></div><Check/></div>}{from==='Current location'&&fromCoords&&<div className="selected-place-card"><div><span className="eyebrow">STARTING POINT SELECTED</span><b>{locationText}</b><small>Current location is set as your start.</small></div><Check/></div>}</div><button className="primary pink full" onClick={()=>{if(from==='Current location'&&!fromCoords&&location)setFromCoords(location);nav('destination')}}>Use this starting point <ArrowRight/></button></div>;
 const renderDestination=()=> <div className="app-page">{header('Where are you going?','Search across India, choose a suggestion, or use the map.','start-point')}<Bubble text="Connected search uses live OpenStreetMap place data when available. If the connection is limited, I keep demo suggestions rather than showing a dead end."/><div className="search-box big"><Search/><input autoFocus placeholder="Search place, address, college, station or landmark" value={search} onChange={e=>searchPlaces(e.target.value)}/>{searching&&<span className="spinner"/>}</div>{search&&<div className="search-result-list">{results.length?results.map((p,i)=><button key={`${p.display_name}-${i}`} onClick={()=>selectPlace(p)}><MapPin/><div><b>{p.display_name.split(',').slice(0,2).join(', ')}</b><span>{p.display_name}</span></div><ChevronRight/></button>):!searching&&FALLBACK_PLACES.filter(x=>x.toLowerCase().includes(search.toLowerCase())).map(x=><button key={x} onClick={()=>{setTo(x);setToCoords(null);toastMsg('Destination selected. Continue when ready.')}}><MapPin/><span>{x}</span><ChevronRight/></button>)}</div>} {!search&&<><div className="section-title">Suggested places</div><div className="suggestion-grid">{FALLBACK_PLACES.slice(0,6).map(x=><button key={x} onClick={()=>{setTo(x);setToCoords(null);toastMsg('Destination selected. Continue when ready.')}}><MapPin/><span>{x}</span></button>)}</div></>}{to&&<div className="selected-place-card destination-selected"><div><span className="eyebrow">DESTINATION SELECTED</span><b>{to}</b><small>{toCoords?'Location pinned from your selection.':'Demo/suggested destination selected.'}</small></div><Check/></div>}<button className="primary pink full" disabled={!to.trim()} onClick={()=>nav('mode')}>Continue to travel mode <ArrowRight/></button><div className="map-card"><MapView center={toCoords||fromCoords||location||{lat:28.6139,lng:77.209}}/><div className="map-note"><Map size={16}/> Map updates as you choose a location.</div></div></div>;
 const renderMode=()=> <div className="app-page">{header('How would you like to travel?','Your usual modes are already known. You can change them for this journey.','destination')}<Bubble text="I compare practical multimodal options even when a mode is not your usual choice."/><div className="mode-grid large"><button className={selectedMode==='Let Sarthi decide'?'selected':''} onClick={()=>setSelectedMode('Let Sarthi decide')}><Compass/><span>Let Sarthi decide</span></button>{MODES.map(([name,Icon])=><button className={selectedMode===name?'selected':''} key={name} onClick={()=>setSelectedMode(name)}><Icon/><span>{name}</span></button>)}</div>{selectedMode==='Cab'&&<div className="card cab-sync"><Car/><div><b>Cab provider connection</b><span>Prototype shows provider, vehicle number, model and live journey. Real deployment can connect to Uber/Ola/Rapido through an authorised provider API.</span></div><button onClick={()=>toastMsg('Cab provider sync simulated: MetroCab • DL 01 AB 1234 • Sedan')}>Sync provider</button></div>}<button className="primary turq" onClick={()=>nav('priorities')}>Continue to Journey Priorities <ArrowRight/></button></div>;
 const renderPriorities=()=> <div className="app-page">{header('What matters to you?','Your usual choices were collected once. Pick up to 7 for this journey style.','mode')}<Bubble text="You don’t need to rate everything. Choose the things that usually matter most to you; I’ll still consider other relevant conditions and explain them."/><div className="selected-count"><b>{priorities.length}/7</b><span>preferences selected</span></div><div className="priority-grid">{PRIORITY_OPTIONS.map(p=>{const recommendedPriority=['Faster travel','Lower walking','Fewer transfers','Help access','Connectivity','Weather comfort','Easy first / last mile'].includes(p);return <button key={p} className={priorities.includes(p)?'selected':''} onClick={()=>savePriority(p)} disabled={!priorities.includes(p)&&priorities.length>=7}><span>{p}{recommendedPriority&&<em className="recommend-badge">Recommended</em>}</span>{priorities.includes(p)&&<Check/>}<InfoBtn text={`I use ${p.toLowerCase()} as one input when comparing practical journeys. It never becomes a promise of safety.`}/></button>})}</div><div className="info-box"><Info/><span>Saved travel style can be adjusted here for this journey only. Context like weather, connectivity and help access may still matter even when they are not selected.</span></div><button className="primary pink" onClick={()=>{if(editingPreferences){const p={...profile,priorities};setProfile(p);write('sarthi-profile',p);setEditingPreferences(false);toastMsg('Journey preferences updated.');goBack()}else nav('route-analysis')}}>{editingPreferences?'Save journey preferences':'Analyze my journey'} {editingPreferences?<Check/>:<ArrowRight/>}</button></div>;
 const renderRouteAnalysis=()=> <div className="app-page centered"><div className="analysis-orb"><Sparkles/></div><span className="eyebrow">SARTHI CONTEXT ENGINE</span><h1>Understanding the journey around you…</h1><p>Checking route geometry, travel options, context freshness, your saved preferences and available support points.</p><div className="loading-list"><span>✓ Starting point</span><span>✓ Destination</span><span>✓ Travel style</span><span>✓ Available route context</span><span>✓ Help/checkpoint preparation</span></div><button className="primary pink" onClick={buildRoute}>{loadingRoutes?'Loading…':'Show journey options'} <ArrowRight/></button></div>;
 const routeCard=(r:Route,i:number)=><button className={`route-card ${selectedRoute===i?'selected':''}`} onClick={()=>{setSelectedRoute(i);nav('route-detail')}} key={r.id}><div className="route-top"><b>{r.title}</b><span>{r.duration} min</span></div><div className="route-modes">{r.modes.map(x=><span key={x}>{x}</span>)}</div><div className="route-stats"><span>{r.cost?'₹'+r.cost:'—'} est.</span><span>{r.walking} min walking</span><span>{r.transfers} transfer</span><span>{r.traffic} traffic*</span></div><div className="match-row"><span>Matches: {r.fingerprint?.join(', ')||r.reason}</span></div><div className="route-meta"><span>{r.updated}</span><span>{r.confidence} confidence</span></div><div className="why"><b>Why this route?</b><span>{r.reason}</span></div></button>;
 const renderRoutes=()=> <div className="app-page">{header('Your journey options',`${from} → ${to||'Destination'}`,'route-analysis')}<div className="context-banner"><b>Context-aware comparison</b><span>I’m comparing journey fit, not assigning a safety score.</span><InfoBtn text="The recommendation combines your chosen preferences with available route and context information. It does not predict crime or guarantee safety."/></div><MapView center={livePos||fromCoords||location||{lat:28.6139,lng:77.209}} path={path}/><div className="route-list">{routes.map(routeCard)}</div><div className="route-actions"><button className="secondary" onClick={()=>nav('compare')}>Compare</button><button className="secondary turq" onClick={()=>nav('priorities')}>Adjust preferences</button></div><button className="primary pink" onClick={()=>nav('preparation')}>Choose {selected?.title||'this journey'} <ArrowRight/></button><small className="demo-foot">*Traffic status is simulated unless a traffic-enabled provider is connected.</small></div>;
 const renderRouteDetail=()=> selected?<div className="app-page">{header(selected.title,'Detailed route view — map, steps and journey context.','routes')}<MapView center={fromCoords||location||{lat:28.6139,lng:77.209}} path={path} markers={routeMarkers}/><div className="detail-card"><div className="big-stat"><b>{selected.duration} min</b><span>Estimated • {selected.distance.toFixed(1)} km</span></div><div className="stats-row"><span>{selected.walking} min walking</span><span>{selected.transfers} transfer</span><span>₹{selected.cost} est.</span></div><div className="journey-fingerprint"><b>Journey fingerprint</b><span>{selected.reason}</span><div className="chips">{selected.modes.map(x=><em key={x}>{x}</em>)}</div><small>{selected.confidence} confidence • {selected.updated}</small></div></div><JourneyPointsPanel/><div className="card"><div className="section-title">First mile</div><p>{selected.firstMile}</p><div className="step-list">{selected.steps.map((s,i)=><div key={s}><span>{i+1}</span><b>{s}</b></div>)}</div><div className="section-title">Last mile</div><p>{selected.lastMile}</p></div><button className="secondary full" onClick={()=>nav('compare')}>Compare with another route</button><button className="primary pink" onClick={()=>nav('preparation')}>Choose this journey <ArrowRight/></button></div>:null;
 const renderCompare=()=> <div className="app-page">{header('Compare journeys','See the trade-offs before choosing.','routes')}<div className="compare-table"><div className="compare-head"><span></span>{routes.map(r=><b key={r.id}>{r.title}</b>)}</div>{[['Time',...routes.map(r=>`${r.duration} min`)],['Cost',...routes.map(r=>`₹${r.cost}`)],['Walking',...routes.map(r=>`${r.walking} min`)],['Transfers',...routes.map(r=>String(r.transfers))],['Modes',...routes.map(r=>r.modes.join(' + '))],['Confidence',...routes.map(r=>r.confidence)],['Freshness',...routes.map(r=>r.updated)]].map(row=><div className="compare-row" key={String(row[0])}>{row.map((x,i)=><span key={`${row[0]}-${i}`}>{String(x)}</span>)}</div>)}</div><div className="card"><b>What Sarthi is doing</b><p>It compares practical options using your travel style and available context. “Journey Fit” is a ranking concept, not a safety percentage.</p></div><button className="primary pink" onClick={()=>nav('preparation')}>Continue with {selected?.title||'selected route'} <ArrowRight/></button></div>;
 const renderPreparation=()=> selected?<div className="app-page">{header('Prepare before you leave','I’ll prepare the essentials now so the journey can continue even if your battery or internet falls.','routes')}<Bubble text="At Start Journey I create your Journey Capsule: route, checkpoints, help points, destination and emergency essentials."/><div className="prepare-hero"><CircleCheck/><h2>Journey ready</h2><p>{selected.title} • {selected.duration} min • {selected.modes.join(' + ')}</p></div><div className="capsule-grid"><div><RouteIcon/><b>Full route</b><span>Prepared</span></div><div><Flag/><b>Checkpoints</b><span>Prepared</span></div><div><HeartHandshake/><b>Help points</b><span>Prepared</span></div><div><Shield/><b>Emergency</b><span>Ready</span></div></div><JourneyPointsPanel/><div className="card"><div className="section-title">Journey Capsule contents <InfoBtn text="This information is stored locally as the essential fallback when the network is unstable or unavailable."/></div><ul className="plain-list"><li>Complete essential route + steps</li><li>All important checkpoints and distances</li><li>Nearby help points</li><li>Destination + last sync</li><li>Emergency contacts + helpline</li><li>Cab/provider details when available</li></ul></div><button className="primary pink" onClick={startJourney}>START JOURNEY <Navigation/></button></div>:null;
 const renderLive=()=> selected?<div className="app-page live"><div className="live-header"><div><span className="live-chip">● LIVE JOURNEY</span><h1>{to||'Your destination'}</h1><span>{selected.title} • {selected.duration} min estimate</span></div><button className="disha-mini" onClick={()=>nav('journey-health')}><Disha size={40}/></button></div><MapView center={liveCenter} path={path} markers={routeMarkers} live/><div className="live-status-row"><span><LocateFixed/> {liveCenter.lat.toFixed(4)}, {liveCenter.lng.toFixed(4)}</span><span><BatteryIcon v={battery}/>{battery}%</span><span><Wifi size={15}/> {connectivity}</span></div><div className="step-card"><div className="current-step"><span>NOW</span><b>{selected.steps[journeyStep]||selected.steps[0]}</b></div><div className="current-step next"><span>NEXT</span><b>{selected.steps[Math.min(journeyStep+1,selected.steps.length-1)]}</b></div><div className="progress-rail">{selected.steps.map((_,i)=><i className={i<=journeyStep?'done':''} key={i}/>)}</div><button className="secondary full" onClick={async()=>{const nextStep=Math.min(journeyStep+1,selected.steps.length-1);setJourneyStep(nextStep);const active=read<any>('sarthi-journey-capsule',null);try{await fetch('/api/journey-event',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({journeyId:active?.journeyId||'active-journey',eventType:'CHECKPOINT_REACHED',latitude:livePos?.lat??null,longitude:livePos?.lng??null,battery,connectivity,checkpoint:selected.steps[nextStep]||`Step ${nextStep+1}`})})}catch{}toastMsg('Journey checkpoint recorded.')}}><Check/> Step completed</button></div>{(battery<=40||connectivity!=='Normal')&&<div className="health-alert"><div><b>{battery<=5?'Critical Low Battery':battery<=20?'Battery getting low':battery<=40?'Low-Power Journey Mode':'Connectivity changed'}</b><span>{battery<=40?'Essential journey data is already prepared. ':''}{connectivity!=='Normal'?'Offline-ready mode is available.':''}</span></div><button onClick={()=>nav('journey-health')}>View</button></div>}<div className="live-actions"><button onClick={()=>sendSms('normal')}><Share2/><span>Share live update</span></button><button onClick={()=>nav('changed')}><AlertTriangle/><span>Something Changed</span></button><button onClick={()=>nav('offline')}><WifiOff/><span>Offline</span></button><button onClick={simulateUnexpectedStop}><Clock3/><span>{stopState==='moving'?'Simulate stop':stopState==='checking'?'Stop checking':'UEM escalated'}</span></button><button className="danger" onClick={()=>nav('emergency')}><Shield/><span>Emergency</span></button><button onClick={()=>nav('report')}><CircleHelp/><span>Report</span></button></div><JourneyPointsPanel compact/><div className="checkpoint-bar"><div><Flag/><b>Next checkpoint</b><span>{nextCheckpoint?.name||'Route checkpoint'}</span></div><div><HeartHandshake/><b>Nearby help point</b><span>{nearestHelp?.name||'Live lookup pending'}</span></div></div><button className="primary navy full" onClick={()=>nav('complete')}>I’ve arrived <CircleCheck/></button></div>:null;
 function BatteryIcon({v}:{v:number}){return <span className={`battery-icon ${v<=10?'danger':v<=20?'warn':v<=40?'low':''}`}><span style={{width:`${Math.max(8,Math.min(100,v))}%`}}/></span>}
 const renderJourneyHealth=()=> <div className="app-page">{header('Journey Health','One place to understand battery, connectivity and support readiness.','live')}<div className="health-grid"><div className="health-card"><BatteryIcon v={battery}/><b>{battery}%</b><span>Battery</span><div className="mini-controls">{[40,20,10,5].map(v=><button key={v} onClick={()=>setBattery(v)}>{v}%</button>)}</div></div><div className="health-card"><Wifi/><b>{connectivity}</b><span>Connectivity</span><div className="mini-controls">{(['Normal','Unstable','Low connectivity','Offline'] as const).map(v=><button key={v} className={connectivity===v?'active':''} onClick={()=>setConnectivity(v)}>{v}</button>)}</div></div></div><div className="card"><div className="section-title">What happens at each point?</div><p><b>40%</b> → Low-Power Journey Mode prepares essentials.</p><p><b>20%</b> → brief battery/status awareness to selected primary contacts.</p><p><b>10%</b> → stronger battery warning to selected primary contacts.</p><p><b>5%</b> → critical mode keeps route, location, help and emergency essentials.</p><p><b>Unstable network</b> → prepare offline data and awareness update where communication is available.</p><p><b>Offline</b> → Journey Capsule remains available; no false claim of live delivery.</p></div><div className="card"><div className="section-title">Sample contact messages</div><SmsPreview kind="normal"/><SmsPreview kind="light"/><SmsPreview kind="tight"/></div><button className="primary turq" onClick={()=>nav('offline')}>Open Offline Journey <WifiOff/></button></div>;
 const SmsPreview=({kind}:{kind:'normal'|'light'|'tight'})=>{const t=kind==='normal'?'Journey started':kind==='light'?'Light buzz — journey appears stopped':'Tight buzz — UEM activated';return <div className={`sms-preview ${kind}`}><div><MessageSquare size={15}/><b>{t}</b></div><p>{kind==='normal'?`Sarthi: ${profile.name||'Traveller'} has started a journey. Selected trusted contacts can view the temporary journey link.`:kind==='light'?`Sarthi update: The journey appears to have stopped between ${checkpointName(0)} and ${checkpointName(1)}. Please contact ${profile.name||'the traveller'}. Last known location is available in the secure journey view.`:`URGENT SARTHI ALERT: UEM is active for ${profile.name||'the traveller'}. Please check with them now. Location, destination, route, checkpoints, help points, helplines and journey context are available.`}</p><button onClick={()=>sendSms(kind)}>Send sample SMS <Send/></button></div>};
 const renderOffline=()=> <div className="app-page">{header('Offline Journey','Your Journey Capsule is the fallback source for essential guidance.','live')}<div className="offline-banner"><WifiOff/><div><b>We have gone offline.</b><span>Your essential journey is still available on this device.</span></div></div><MapView center={liveCenter} path={path} markers={routeMarkers} live/><JourneyPointsPanel compact/><div className="offline-grid"><div><RouteIcon/><b>Route</b><span>{selected?.title||'Saved route'}</span></div><div><Flag/><b>Checkpoints</b><span>Saved on device</span></div><div><HeartHandshake/><b>Help points</b><span>Saved on device</span></div><div><LocateFixed/><b>Last known</b><span>{liveCenter.lat.toFixed(4)}, {liveCenter.lng.toFixed(4)}</span></div></div><div className="last-sync">Last synced: {lastSync}</div><div className="checkins"><button onClick={()=>toastMsg('I’m OK queued for sync.')}><Check/> I’m OK</button><button onClick={()=>toastMsg('Delayed update queued for sync.')}><Clock3/> Delayed</button><button onClick={()=>nav('emergency')}><CircleHelp/> Need Help</button><button className="danger" onClick={()=>nav('emergency')}><Shield/> Emergency</button></div><button className="secondary full" onClick={()=>{setConnectivity('Normal');setLastSync(new Date().toLocaleTimeString());toastMsg('Journey synced.');nav('live')}}>Connection restored <RefreshCw/></button></div>;
 const renderChanged=()=> <div className="app-page centered">{header('Something Changed','Sarthi never silently reroutes you.','live')}<div className="change-panel"><AlertTriangle/><h2>Something changed along your journey.</h2><p>{connectivity!=='Normal'?'Connectivity is changing.':'A transport/context signal changed in this prototype.'}</p></div><Bubble text="I’ll explain what changed, compare again if useful, and let you decide."/><div className="change-actions"><button className="secondary" onClick={()=>nav('routes')}>Re-evaluate</button><button className="primary navy" onClick={()=>nav('live')}>Keep current journey</button></div></div>;
 const currentHelplineText=`${stateName} Women Helpline`; 
 const renderGetSafety=()=> <div className="app-page">{header('Get to Safety','Practical nearby support points from the current journey context.','emergency')}<div className="card"><div className="section-title"><HeartHandshake/> Nearby help</div><p>Sarthi surfaces mapped assistance points around your route. These are guidance points, not a guarantee that a place is safe.</p></div><JourneyPointsPanel/><div className="card"><div className="section-title">Quick actions</div><div className="emergency-grid"><button onClick={()=>journeyActive?sendSms('normal'):shareLocation()}><Share2/><b>Share Location</b><span>Open a message with the current or last-known journey context.</span></button><button onClick={()=>nav('contacts')}><Users/><b>Trusted Contacts</b><span>Review who can receive journey support.</span></button><button className="red" onClick={()=>{window.location.href='tel:112'}}><Shield/><b>Emergency / 112</b><span>Call emergency services immediately when needed.</span></button></div></div></div>;
 const renderEmergency=()=> <div className="app-page emergency-page">{header('Emergency & Safety','Support when something feels wrong. You stay in control.','home')}<div className="emergency-hero"><div><span className="eyebrow">HELP IS ALWAYS CLOSE</span><h2>Clear support when you need it.</h2><p>{journeyActive?'Your active journey context is available here.':'Your journey has ended, so live tracking is off. Last-known journey context remains available for support.'}</p></div><Disha size={70}/></div><MapView center={liveCenter} path={journeyActive?path:undefined} markers={routeMarkers} live/><div className="emergency-grid"><button onClick={()=>journeyActive?sendSms('normal'):shareLocation()}><Share2/><b>{journeyActive?'Share Location':'Share Last Known Location'}</b><span>{journeyActive?'Open a real SMS with current journey context for primary contacts.':'Share the last-known location and journey context; live tracking is already stopped.'}</span></button><button onClick={()=>nav('get-safety')}><Navigation/><b>Find Help Nearby</b><span>See nearby verified help points and practical places.</span></button><button onClick={()=>nav('contacts')}><Users/><b>Contact Trusted Person</b><span>Choose a trusted contact or review sharing setup.</span></button><button className="red" onClick={()=>{window.location.href='tel:112'}}><Shield/><b>Emergency / 112</b><span>Call 112 immediately. UEM remains available as the urgent escalation layer.</span></button></div><div className="uem-entry"><div><span className="eyebrow">WOW FEATURE • URGENT ESCALATION</span><b>Ultimate Emergency Mode (UEM)</b><span>Activate the urgent support state with full journey context, contact alerts and protected cancellation.</span></div><button className="primary red" onClick={()=>nav('uem')}><Shield/> Open UEM</button></div><div className="helpline-card"><div><Phone/><div><b>Local emergency support</b><span>{currentHelplineText} • 112 • National Women Helpline 181</span></div></div><button onClick={()=>window.location.href='tel:112'}>Call 112</button><button onClick={()=>window.location.href=`tel:${helpline}`}>Call {helpline}</button></div><JourneyPointsPanel compact/><div className="card emergency-detail"><div className="section-title">{journeyActive?'Current journey emergency context':'Last-known journey context'}</div><p><b>Traveller:</b> {profile.name||'Traveller'}</p><p><b>Last known location:</b> {locationText}</p><p><b>Destination:</b> {to||'No destination recorded'}</p><p><b>Primary contacts:</b> {contacts.filter(c=>c.primary).map(c=>c.name).join(', ')||'None selected'}</p><p><b>All configured contacts:</b> {contacts.length}</p><p><b>Points:</b> {visiblePoints.length} journey points loaded from {pointStatus==='live'?'OpenStreetMap live lookup':'the available route data'}.</p></div><div className="card"><div className="section-title">How escalation works</div><div className="escalation"><span className="light-dot"/><div><b>Light buzz</b><span>Early awareness goes to selected primary contacts. Ask them to call/check the traveller.</span></div></div><div className="escalation"><span className="tight-dot"/><div><b>Tight buzz / UEM</b><span>Urgent escalation to all configured contacts with full journey context and nearby support options.</span></div></div></div></div>;
 const renderContacts=()=>{const setup=!profile.completed||contactsSetup;return <div className="app-page contacts-page">{header(setup?'Set up trusted contacts':'Trusted Contacts',setup?'Choose real people from your phone who can receive Sarthi journey support.':'Manage the contacts who receive journey and emergency alerts.','emergency')}<Bubble text={setup?'Sarthi will ask for phone contacts here. You choose who to add. Primary contacts receive normal journey updates; emergency/UEM alerts go to every configured contact.':'Primary contacts receive normal journey-start/live updates and minor journey awareness. During an emergency, every configured contact is alerted.'}/><div className="contact-setup-actions"><button className="primary pink full" onClick={openContactPicker}><Users/> Choose from phone contacts</button><button className="secondary full" onClick={addManualContact}><Plus/> Add contact manually</button></div><div className="contact-count"><b>{contacts.length}</b><span>contacts configured {setup?'• minimum 5 required':''}</span></div><div className="contacts-card">{contacts.map(c=><div className="contact-row" key={c.id}><div className="contact-avatar"><User/></div><div><b>{c.name}</b><span>{c.relation} • {c.phone}</span></div><span className={`tag ${c.primary?'primary':''}`}>{c.primary?'Primary':'Not primary'}</span><button aria-label={`Toggle ${c.name} for normal journey sharing`} onClick={()=>persistContacts(contacts.map(x=>x.id===c.id?{...x,primary:!x.primary}:x))}><Check/></button></div>)}</div>{contacts.length>0&&<div className="card"><div className="section-title">Primary contact meaning</div><p>Primary contacts receive the journey-start live context and minor journey-awareness updates. You can choose any number of your configured contacts as primary.</p><p><b>Emergency/UEM:</b> every configured contact receives the urgent alert and full emergency context.</p></div>}{setup?<button className="primary pink full" disabled={contacts.length<5} onClick={saveContactSetup}>Continue to Disha tour <ArrowRight/></button>:<div className="card"><div className="section-title">Sample SMS</div><SmsPreview kind="normal"/></div>}</div>};
 const renderUem=()=> <div className="app-page uem-page">{header('Ultimate Emergency Mode','The escalated form of emergency support.','emergency')}<div className="uem-hero"><div><span className="eyebrow">URGENT SUPPORT</span><h1>UEM changes the screen — not your control.</h1><p>UEM can activate automatically after an unresolved journey stop or manually when the traveller taps Activate UEM.</p></div><Shield size={52}/></div><MapView center={liveCenter} path={path} markers={routeMarkers} live/><div className="card"><div className="section-title">Automatic activation</div><div className="timeline"><div><span>0–2 min</span><b>Journey appears stopped</b><p>Ask: “Are you okay?”</p></div><div><span>2–5 min</span><b>Context check</b><p>Check available traffic/weather/context and keep contact awareness active.</p></div><div><span>5+ min</span><b>Second contact update</b><p>Send another context-rich alert if the stop remains unresolved.</p></div><div className="red-line"><span>10–15 min</span><b>UEM activates</b><p>Urgent alert to every configured contact and the full support screen appears.</p></div></div></div><div className="card night-note"><Moon/><div><b>Night / unusual context</b><p>If night, severe weather or another unusual context is available, the escalation window can be shorter. Sarthi explains the reason rather than pretending certainty.</p></div></div><div className="uem-actions"><button className={`primary ${buzz==='tight'?'pink':'red'}`} onClick={deactivateUem}>{buzz==='tight'?<><Shield/> DEACTIVATE UEM</>:<><Shield/> ACTIVATE UEM</>}</button><button className="secondary" onClick={()=>toastMsg('Future native capability: hardware trigger such as supported repeated power-button actions. Not part of this browser prototype.')}>Future hardware scope</button></div><JourneyPointsPanel/><div className="card"><div className="section-title">UEM screen shows</div><ul className="plain-list"><li>Current/last known location + destination</li><li>Full planned route + journey status + last update</li><li>All checkpoints between the traveller and destination</li><li>Nearby help points with distance</li><li>Local/state women support + national 181 + 112</li><li>Cab/provider/vehicle details where legitimately synced</li><li>Temporary secure journey view</li><li>Cancellation using the shared secret code</li></ul></div>{buzz==='tight'&&<div className="full-alert tight"><div><span className="alert-label">URGENT SARTHI ALERT</span><b>UEM activated</b><span>Every configured contact is being notified with full journey context.</span></div><button onClick={()=>{setBuzz('none');setShowCancelCode(true)}}>Cancel with code</button></div>}{showCancelCode&&<div className="card cancel-card"><div className="section-title">Cancel UEM</div><p>Enter the shared code known only to the traveller and trusted contacts.</p><input inputMode="numeric" maxLength={6} value={cancelCode} onChange={e=>setCancelCode(e.target.value.replace(/\D/g,'').slice(0,6))} placeholder="Shared code"/><div className="cancel-actions"><button className="secondary" onClick={()=>{setShowCancelCode(false);setCancelCode('')}}>Keep UEM</button><button className="primary pink" onClick={()=>{if(cancelCode===uemCancelCode){setShowCancelCode(false);setCancelCode('');setBuzz('none');toastMsg('UEM cancelled. A cancellation update is sent to every configured contact.')}else{setCancelCode('');toastMsg('Wrong code. Emergency contacts are notified of the attempt.')}}}>Confirm cancellation</button></div><small>Prototype demo code: 2468</small></div>}<div className="card"><div className="section-title">Sample UEM SMS</div><SmsPreview kind="tight"/></div></div>;
 const renderReport=()=> <div className="app-page">{header('Report a journey issue','Keep reporting connected to the journey itself.','live')}<Bubble text="A report can help correct route/context information. Add evidence when available; the system should not automatically trust every report."/><div className="card form"><label>What needs attention?</label><select><option>Incorrect route information</option><option>Outdated information</option><option>Incorrect help point</option><option>Changed transport condition</option><option>Incorrect journey context</option><option>Issue still unresolved</option></select><label>Describe it</label><textarea value={reportText} onChange={e=>setReportText(e.target.value)} placeholder="Tell us what changed..."/><label>Evidence</label><input ref={evidenceInputRef} type="file" accept="image/*" hidden onChange={e=>setEvidencePhoto(e.target.files?.[0]?.name||'')}/><div className="evidence-grid"><button onClick={()=>evidenceInputRef.current?.click()}>{evidencePhoto?'Photo added':'Add photo'}</button><button onClick={()=>toastMsg('Timestamp attached.')}>Timestamp</button><button onClick={()=>toastMsg('Location context attached.')}>Location context</button></div>{evidencePhoto&&<small className="evidence-name">Attached: {evidencePhoto}</small>}</div><button className="primary pink" onClick={()=>nav('review')}>Submit for review <Send/></button></div>;
 const renderReview=()=> <div className="app-page">{header('Evidence & Review','Resolution should remain reviewable.','report')}<div className="review-state"><span>{reportStatus}</span><h2>Your report is now reviewable.</h2><p>Evidence, freshness and corroboration determine whether it is treated as verified, questionable or outdated.</p></div><div className="review-actions"><button className="secondary" onClick={()=>{setReportStatus('Questionable');toastMsg('Evidence flagged as questionable.')}}>Flag evidence</button><button className="secondary" onClick={()=>{setReportStatus('Under Review');toastMsg('Issue reopened for another review.')}}>Reopen issue</button></div><div className="card"><div className="section-title">Status history</div><p>Report submitted → Evidence attached → {reportStatus}</p></div></div>;
 const renderComplete=()=> <div className="app-page centered">{header('Journey complete','Live location sharing ends now and your temporary journey view expires.','live')}<div className="complete"><CircleCheck/><span className="eyebrow">ARRIVED</span><h1>You’ve arrived.</h1><p>Your active journey is complete. Your history can now keep the journey record.</p></div><div className="summary-grid"><div><b>Route</b><span>{selected?.title||'Route 1'}</span></div><div><b>Mode</b><span>{selected?.modes.join(' + ')||'Multimodal'}</span></div><div><b>Time</b><span>{selected?.duration||32} min</span></div><div><b>Walking</b><span>{selected?.walking||7} min</span></div><div><b>Changes</b><span>Stored in timeline</span></div><div><b>Battery</b><span>{battery}%</span></div></div><div className="card"><div className="section-title">How was your journey?</div><div className="feedback-grid">{['Smooth','Delayed','Changed','Needed Help'].map(x=><button key={x} onClick={()=>toastMsg(`Feedback saved: ${x}`)}>{x}</button>)}</div></div><button className="primary pink" onClick={async()=>{const active=read<any>('sarthi-journey-capsule',null);try{await fetch('/api/journey-event',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({journeyId:active?.journeyId||'active-journey',eventType:'JOURNEY_COMPLETED',latitude:livePos?.lat??null,longitude:livePos?.lng??null,battery,connectivity,checkpoint:journeyStep,destination:to})})}catch{}const h=read<any[]>('sarthi-history',[]);h.unshift({date:new Date().toISOString(),from,to,route:selected?.title||'Route 1',mode:selected?.modes.join(' + '),duration:selected?.duration||32,cost:selected?.cost||40,walking:selected?.walking||7,events:['Journey Capsule prepared','Journey completed'],checkpoints:visiblePoints.filter(m=>m.kind==='checkpoint'),helpPoints:visiblePoints.filter(m=>m.kind==='help'),battery,connectivity,geometry:selected?.geometry||[]});write('sarthi-history',h);write('sarthi-active',null);setJourneyActive(false);nav('my-journeys')}}>Save to My Journeys <CalendarDays/></button></div>;
 const hist=read<any[]>('sarthi-history',[]);
 const renderMyJourneys=()=> <><div className="app-page">{header('My Journeys','Your calendar of completed journeys, timelines and map replays.','home')}<div className="calendar"><div className="calendar-head"><b>{new Date().toLocaleString('en-IN',{month:'long',year:'numeric'})}</b><span>Tap any date with a journey</span></div><div className="calendar-grid">{Array.from({length:30},(_,i)=>{const day=i+1;const has=hist.some(h=>new Date(h.date).getDate()===day&&new Date(h.date).getMonth()===new Date().getMonth());return <button className={`${day===new Date().getDate()?'today ':''}${has?'has-journey':''}`} key={day} onClick={()=>has?toastMsg('Journey for this date is listed below with its saved timeline and replay.'):toastMsg('No completed journey recorded for this date yet.')}>{day}</button>})}</div></div>{hist.length===0?<div className="empty"><CalendarDays/><b>No completed journeys yet</b><span>Your first finished journey will appear here by date.</span></div>:hist.slice(0,8).map((h,i)=><div className="history" key={`${h.date}-${i}`} onClick={()=>setReplay(h)}><div className="history-dot"><RouteIcon/></div><div><b>{h.from||'Current location'} → {h.to||'Destination'}</b><span>{new Date(h.date).toLocaleString()} • {h.mode}</span><small>{h.route} • {h.duration} min • {h.walking} min walking</small></div><ChevronRight/></div>)}</div>{replay&&<div className="replay-panel"><div className="replay-head"><div><span className="eyebrow">JOURNEY REPLAY</span><b>{replay.from||'Start'} → {replay.to||'Destination'}</b></div><button onClick={()=>setReplay(null)}><X/></button></div><MapView center={liveCenter} path={(replay.geometry||[]).map(([lat,lng]:[number,number])=>({lat,lng}))} markers={(replay.checkpoints||[]).concat(replay.helpPoints||[])} live/><div className="card"><b>{replay.route||'Route 1'}</b><p>{replay.mode||'Multimodal'} • {replay.duration||32} min • {replay.walking||7} min walking</p><small>Saved events: {(replay.events||[]).join(' → ')}</small></div></div>}</>;
 const renderFrequent=()=> <div className="app-page">{header('Frequent Journeys','Sarthi suggests recurring travel patterns from your history.','home')}<div className="card frequent"><div><b>Home → College</b><span>Recurring pattern</span></div><button onClick={()=>{setFrom('Home');setTo('College');nav('journey-type')}}>Plan</button></div><div className="card frequent"><div><b>Home → Office</b><span>Recurring pattern</span></div><button onClick={()=>{setFrom('Home');setTo('Office');nav('journey-type')}}>Plan</button></div><div className="info-box"><Star/><span>These are suggestions, not manual saved routes.</span></div></div>;
 const renderSettings=()=> <div className="app-page">{header('Settings','Change your information and preferences anytime.','home')}<div className="settings-profile"><Disha size={52}/><div><b>{profile.name||'Traveller'}</b><span>{profile.phone||'Guest mode'}{profile.memberSince?` • Member since ${profile.memberSince}`:''}{read<any[]>('sarthi-history',[]).length?` • ${read<any[]>('sarthi-history',[]).length} journeys`:''}</span></div><button onClick={()=>{setEditingProfile(true);setProfileDraft(profile);setProfileStep(0);nav('profile')}}>Edit</button></div><SettingRow title="Personal information" desc="Name, age, career, income" action={()=>{setEditingProfile(true);setProfileDraft(profile);setProfileStep(0);nav('profile')}}/><SettingRow title="Language" desc={LANGS.find(x=>x.code===language)?.native||'English'} action={()=>nav('language')}/><SettingRow title="Travel style" desc="Usual modes + walking comfort + priorities" action={()=>{setEditingProfile(true);setProfileDraft(profile);setProfileStep(0);nav('profile')}}/><SettingRow title="Journey preferences" desc="What matters most on your journeys" action={()=>{setEditingPreferences(true);setPriorities(profile.priorities);nav('priorities')}}/><SettingRow title="Emergency Contacts" desc={`${contacts.length} configured contacts`}  action={()=>nav('contacts')}/><SettingRow title="Location & Privacy" desc="Live location only during an active journey" action={requestLocation}/><SettingRow title="Notifications" desc="Journey, battery, connectivity and emergency updates" action={()=>nav('journey-health')}/><SettingRow title="Disha guided tour" desc="Replay the full dashboard walkthrough" action={()=>{setTourStep(0);nav('onboarding')}}/><button className="logout-row" onClick={logout}><LogOut/><div><b>Log out</b><span>End this session and start fresh next time.</span></div></button><div className="card"><div className="section-title">Prototype integrations</div><p>Real OTP can later connect to Clerk. Real SMS can connect to an SMS provider. Real traffic, cab/provider data and production routing require authorised API credentials. Native hardware triggers are future mobile scope.</p></div></div>;
 function SettingRow({title,desc,action}:{title:string;desc:string;action:()=>void}){return <button className="setting-row" onClick={action}><div><b>{title}</b><span>{desc}</span></div><ChevronRight/></button>}
 const renderSample=()=>{const sampleSteps=[
 ['01','Enter','Get Started → Sign Up → Phone → OTP','Simple entry and prototype authentication.'],['02','Context setup','Location → Language','Location comes before language recommendations; live-location privacy is explained.'],['03','Disha','Disha introduction → profile','Disha explains each question and the user saves travel style once.'],['04','Tour','Full dashboard tour','Every major portal is introduced before the dashboard.'],['05','Plan','New Journey → Right Now / Pre-Journey','Start now or prepare for a future time with context preview.'],['06','Search','India-wide destination search','Choose a place, address, college, station or landmark without a dead end.'],['07','Compare','2–4 practical route options','See time, cost, walking, transfers, modes, priorities, context, freshness and confidence.'],['08','Explain','Why This Route?','Sarthi explains trade-offs; it does not claim a route is safe or assign a safety percentage.'],['09','Prepare','Journey Capsule','Save route data, checkpoints, help points, destination and support details before leaving.'],['10','Start','Live Journey','GPS marker, route, steps, battery, connectivity and emergency access stay available.'],['11','Adapt','Something Changed','A meaningful change is explained; choose Re-evaluate or Keep Current.'],['12','Low power','40% → 20% → 10% → 5%','Low-power preparation progressively preserves essential journey support.'],['13','Low connectivity','Unstable → Offline','The Capsule remains available; last sync is visible and no false delivery claim is made.'],['14','Offline check-in','I’m OK / Delayed / Need Help / Emergency','Compact check-in keeps support actions close when connectivity is poor.'],['15','Stop check','Unexpected stop','Sarthi asks “Are you okay?” and checks available context before escalating.'],['16','Light buzz','Primary contacts','Early awareness asks trusted contacts to check the traveller.'],['17','Tight buzz','UEM escalation','If unresolved/context warrants it, urgent escalation activates with full journey context.'],['18','Get to Safety','Practical help points','Nearby help options are guidance, not a safety guarantee.'],['19','Emergency','112 + support','Call 112, share location, contact trusted people and use the support map.'],['20','UEM control','Activate / cancel with shared code','The traveller keeps control; cancellation is protected by the shared code.'],['21','Finish','Arrived','Tracking ends, the temporary journey view expires, and the journey can be saved.'],['22','My Journeys','Calendar + replay','Completed trips retain route, modes, timeline and major events.'],['23','Frequent Journeys','Pattern suggestions','Recurring journeys appear only when history supports them.'],['24','Report','Evidence → Review','Incorrect/outdated journey information can be reported and reviewed.'],['25','Reopen','Issue remains','Questionable evidence can be flagged and unresolved issues can be reopened.'],['26','Settings','Edit + replay','Language, preferences, contacts, notifications, privacy and the Disha tour stay editable.']];
 const st=sampleSteps[sampleStepNo];const demoPath=path.length>1?path:[{lat:28.6139,lng:77.209},{lat:28.625,lng:77.218},{lat:28.638,lng:77.226}];const demoMarkers=[{coords:demoPath[Math.max(1,Math.floor(demoPath.length*.35))],label:'Checkpoint A',kind:'checkpoint' as const},{coords:demoPath[Math.max(1,Math.floor(demoPath.length*.65))],label:'Checkpoint B',kind:'checkpoint' as const},{coords:demoPath[Math.max(1,Math.floor(demoPath.length*.5))],label:'Help point (demo)',kind:'help' as const}];const triggerStep=(n:number)=>{setSampleStepNo(n);if(n>=11)setBattery(n>=12?20:40);if(n>=12)setConnectivity('Offline');if(n>=16)setBuzz('light');if(n>=17)setBuzz('tight');if(n<16)setBuzz('none')};return <div className="public sample"><PublicBack/><div className="tour-top"><Logo/><span>COMPLETE SAMPLE JOURNEY</span></div><div className="sample-content"><Disha size={96}/><span className="eyebrow">26-STEP MENTOR DEMO</span><h1>A real journey, from entry to support.</h1><p className="lead">Use Next to walk through the complete product story. Nothing skips the story or silently returns to the dashboard.</p><div className="sample-stage"><div className="sample-bar"><span className="live-chip">{st[0]} • {st[1]}</span><span>{st[2]}</span><BatteryIcon v={sampleStepNo>=12?5:sampleStepNo>=11?40:battery}/><span>{sampleStepNo>=12?5:sampleStepNo>=11?40:battery}%</span></div><MapView center={liveCenter} path={demoPath} markers={demoMarkers} live/><div className="sample-current"><span className="eyebrow">WHAT THE JUDGE SHOULD SEE</span><b>{st[2]}</b><p>{st[3]}</p></div><div className="sample-events">{sampleSteps.slice(Math.max(0,sampleStepNo-2),Math.min(sampleSteps.length,sampleStepNo+3)).map(([num,title])=><button className={num===st[0]?'done':''} key={num} onClick={()=>triggerStep(sampleSteps.findIndex(x=>x[0]===num))}><span>{num}</span>{title}<ChevronRight/></button>)}</div></div><div className="sample-controls"><button className="secondary" onClick={()=>sampleStepNo>0&&triggerStep(sampleStepNo-1)} disabled={sampleStepNo===0}><ArrowLeft/> Back</button><button className="primary pink" onClick={()=>sampleStepNo<sampleSteps.length-1&&triggerStep(sampleStepNo+1)} disabled={sampleStepNo===sampleSteps.length-1}>Next <ArrowRight/></button><button className="secondary" onClick={exitFlow}>Exit</button></div><div className="sample-jump"><span>Jump to key moment</span><button onClick={()=>triggerStep(6)}>Routes</button><button onClick={()=>triggerStep(12)}>Offline</button><button onClick={()=>triggerStep(17)}>UEM</button><button onClick={()=>triggerStep(23)}>Reports</button>{buzz==='tight'&&<button className="sample-uem-off" onClick={deactivateUem}><Shield size={13}/> Deactivate UEM</button>}</div></div></div>};
 const renderBody=()=>{switch(screen){
  case 'welcome':return renderWelcome();case 'auth':return renderAuth();case 'phone':return renderPhone();case 'otp':return renderOtp();case 'location':return renderLocation();case 'language':return renderLanguage();case 'disha-intro':return renderDishaIntro();case 'profile':return renderProfile();case 'onboarding-preferences':return renderOnboardingPreferences();case 'onboarding':return renderOnboarding();case 'home':return renderHome();
  case 'journey-type':return renderJourneyType();case 'start-point':return renderStartPoint();case 'destination':return renderDestination();case 'mode':return renderMode();case 'priorities':return renderPriorities();case 'route-analysis':return renderRouteAnalysis();case 'routes':return renderRoutes();case 'route-detail':return renderRouteDetail();case 'compare':return renderCompare();case 'preparation':return renderPreparation();
  case 'live':return renderLive();case 'journey-health':return renderJourneyHealth();case 'offline':return renderOffline();case 'changed':return renderChanged();case 'emergency':return renderEmergency();case 'get-safety':return renderGetSafety();case 'contacts':return renderContacts();case 'uem':return renderUem();case 'report':return renderReport();case 'review':return renderReview();case 'complete':return renderComplete();case 'my-journeys':return renderMyJourneys();case 'frequent':return renderFrequent();case 'settings':return renderSettings();case 'sample':return renderSample();default:return renderWelcome();}};
 const publicScreens=['welcome','auth','phone','otp','location','language','disha-intro','profile','onboarding-preferences','onboarding','contacts','sample'].includes(screen)&&(!profile.completed||screen==='onboarding'||screen==='sample');
 return <div className="app-shell"><div className="phone-frame"><div className="app-content">{renderBody()}</div>{!publicScreens&&profile.completed&&<><button className="float-disha" onClick={()=>toastMsg('Disha: I’m here to explain any part of the journey.') }><Disha size={54}/></button><div className="bottom-nav"><button className={screen==='home'?'active':''} onClick={()=>nav('home')}><HomeIcon/><span>Home</span></button><button className={['journey-type','start-point','destination','mode','priorities','route-analysis','routes','route-detail','compare','preparation','live','journey-health','offline','changed','report','review','complete'].includes(screen)?'active':''} onClick={()=>nav('journey-type')}><RouteIcon/><span>Journeys</span></button><button className={['emergency','get-safety','contacts','uem'].includes(screen)?'active emergency':''} onClick={()=>nav('emergency')}><Shield/><span>Emergency</span></button><button className={screen==='settings'?'active':''} onClick={()=>nav('settings')}><SettingsIcon/><span>Settings</span></button></div></>}{toast&&<div className="toast"><Sparkles size={15}/>{toast}</div>}{buzz==='light'&&<div className="buzz light-buzz"><Bell/><div><b>LIGHT BUZZ SENT</b><span>Primary contacts received an early awareness message.</span></div><button onClick={()=>setBuzz('none')}><X/></button></div>}{buzz==='tight'&&screen!=='uem'&&<div className="buzz tight-buzz"><Bell/><div><b>URGENT — TIGHT BUZZ</b><span>UEM is active. Every configured contact receives the urgent journey context.</span></div><button onClick={()=>nav('uem')}><Shield/></button></div>}</div></div>;
}
