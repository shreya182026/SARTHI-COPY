import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

class SarthiErrorBoundary extends React.Component<{children:React.ReactNode},{error:Error|null}>{
  state={error:null as Error|null};
  static getDerivedStateFromError(error:Error){return {error};}
  componentDidCatch(error:Error,info:React.ErrorInfo){console.error('Sarthi render error:',error,info);}
  render(){
    if(this.state.error){
      return <div style={{minHeight:'100vh',display:'grid',placeItems:'center',padding:24,fontFamily:'system-ui,sans-serif',background:'#f6f8fb',color:'#17304f'}}>
        <div style={{maxWidth:520,background:'#fff',borderRadius:20,padding:28,boxShadow:'0 12px 40px rgba(23,48,79,.12)'}}>
          <h1 style={{marginTop:0}}>Sarthi could not render this screen</h1>
          <p>The app hit a rendering error. Refresh once; if it returns, the error details below identify what failed.</p>
          <details style={{margin:'16px 0',fontSize:13,color:'#5b6b7f'}}>
            <summary style={{cursor:'pointer',fontWeight:700}}>Technical error details</summary>
            <pre style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere',marginTop:10}}>{this.state.error?.message || 'Unknown render error'}</pre>
          </details>
          <button onClick={()=>window.location.reload()} style={{padding:'12px 18px',border:0,borderRadius:12,cursor:'pointer'}}>Refresh Sarthi</button>
        </div>
      </div>;
    }
    return this.props.children;
  }
}

const root = document.getElementById('root');
if (!root) throw new Error('Sarthi root element was not found.');
createRoot(root).render(
  <SarthiErrorBoundary>
    <App />
  </SarthiErrorBoundary>
);
