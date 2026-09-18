export default function handler(req: any, res: any) {
  res.status(200).json({ success: true, service: 'sarthi-backend', message: 'Sarthi backend is working', timestamp: new Date().toISOString() });
}
