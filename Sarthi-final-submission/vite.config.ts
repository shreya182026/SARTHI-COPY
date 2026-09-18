import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import contextIntelligence from './api/context-intelligence';
import geocode from './api/geocode';
import routeIntelligence from './api/route-intelligence';
import routeSuitability from './api/route-suitability';
import mlRouteSuitability from './api/ml-route-suitability';
import transitIntelligence from './api/transit-intelligence';
import health from './api/health';
import journeyEvent from './api/journey-event';
import uemEvent from './api/uem-event';

type ApiHandler=(req:any,res:any)=>unknown|Promise<unknown>;

function localVercelApi(): Plugin {
  const handlers:Record<string,ApiHandler>={
    'context-intelligence':contextIntelligence,
    geocode,
    'route-intelligence':routeIntelligence,
    'route-suitability':routeSuitability,
    'ml-route-suitability':mlRouteSuitability,
    'transit-intelligence':transitIntelligence,
    health,
    'journey-event':journeyEvent,
    'uem-event':uemEvent,
  };

  return {
    name:'sarthi-local-vercel-api',
    enforce:'pre',
    configureServer(server){
      server.middlewares.use(async(req:any,res:any,next:any)=>{
        const url=new URL(req.url||'/', 'http://localhost');
        const match=url.pathname.match(/^\/api\/([^/]+)$/);
        const handler=match?handlers[match[1]]:undefined;
        if(!handler)return next();

        try{
          req.query=Object.fromEntries(url.searchParams.entries());
          if(req.method==='POST'){
            const chunks:Buffer[]=[];
            for await(const chunk of req)chunks.push(Buffer.isBuffer(chunk)?chunk:Buffer.from(String(chunk)));
            const raw=Buffer.concat(chunks).toString('utf8');
            req.body=raw?JSON.parse(raw):{};
          }

          let finished=false;
          const apiRes:any={
            status(code:number){res.statusCode=code;return apiRes;},
            setHeader(name:string,value:string){res.setHeader(name,value);return apiRes;},
            json(data:any){
              finished=true;
              if(!res.headersSent)res.setHeader('Content-Type','application/json');
              res.end(JSON.stringify(data));
              return apiRes;
            },
            end(data?:any){finished=true;res.end(data);return apiRes;},
          };
          await handler(req,apiRes);
          if(!finished&&!res.writableEnded)res.end();
        }catch(error:any){
          console.error(`[local api] ${url.pathname}`,error);
          if(!res.headersSent){
            res.statusCode=500;
            res.setHeader('Content-Type','application/json');
            res.end(JSON.stringify({success:false,error:error?.message||'Local API error'}));
          }
        }
      });
    }
  };
}

export default defineConfig({
  plugins:[react(),localVercelApi()],
  resolve:{alias:{'@':fileURLToPath(new URL('./src',import.meta.url))}},
});
