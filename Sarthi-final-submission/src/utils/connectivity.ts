export type ConnectivityState = 'Normal' | 'Unstable' | 'Low connectivity' | 'Offline';

export async function checkSarthiConnectivity(): Promise<{state: ConnectivityState; latency: number | null}> {
  if (!navigator.onLine) return { state: 'Offline', latency: null };
  const started = performance.now();
  try {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 5000);
    const response = await fetch('/api/health?check=1', { method: 'GET', cache: 'no-store', signal: controller.signal });
    window.clearTimeout(timeout);
    if (!response.ok) return { state: 'Unstable', latency: Math.round(performance.now() - started) };
    const latency = Math.round(performance.now() - started);
    if (latency < 800) return { state: 'Normal', latency };
    if (latency < 2000) return { state: 'Unstable', latency };
    return { state: 'Low connectivity', latency };
  } catch { return { state: 'Offline', latency: null }; }
}
