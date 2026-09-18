import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

function localVercelApi(): Plugin {
  const apiFiles = new Set([
    'context-intelligence',
    'geocode',
    'route-intelligence',
    'route-suitability',
    'ml-route-suitability',
    'transit-intelligence',
    'health',
    'journey-event',
    'uem-event'
  ]);

  return {
    name: 'sarthi-local-vercel-api',
    enforce: 'pre',
    configureServer(server) {
      server.middlewares.use(async (req:any,res:any,next:any) => {
        const pathname=new URL(req.url||'/', 'http://localhost').pathname;
        const match=pathname.match(/^\/api\/([^/]+)$/);
        if(!match||!apiFiles.has(match[1])) return next();

        try {
          const query=Object.fromEntries(new URL(req.url||'/', 'http://localhost').searchParams.entries());
          req.query=query;

          if(req.method==='POST'){
            const chunks:string[]=[];
            for await (const chunk of req) chunks.push(String(chunk));
            const body=chunks.join('');
            req.body=body?JSON.parse(body):{};
          }

          const mod=await server.ssrLoadModule(`/api/${match[1]}.ts`);
          const apiRes:any={
            status(code:number){res.statusCode=code;return apiRes;},
            json(data:any){if(!res.headersSent)res.setHeader('Content-Type','application/json');res.end(JSON.stringify(data));return apiRes;}
          };
          await mod.default(req,apiRes);
        } catch(error:any) {
          console.error(`[local api] ${pathname}`,error);
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
  plugins: [react(), localVercelApi()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
