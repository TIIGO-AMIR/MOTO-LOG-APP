export interface Motorcycle {
  id: string;
  regNumber: string; // Registration / plate number (e.g. UBD 452K)
  make: string; // Make (e.g. Bajaj, TVS, Yamaha, Honda)
  model: string; // Model (e.g. Boxer 100, Star HLX 125)
  year?: number | null; // Year of manufacture (e.g. 2022)
  notes?: string; // Optional owner or notes
  createdAt: string;
}

export interface ServiceRecord {
  id: string;
  motorcycleId: string; // Link to the relevant motorcycle
  date: string; // Service date (YYYY-MM-DD)
  workPerformed: string; // Work completed (e.g. Oil change, Brake adjustment)
  costUgx: number; // Cost in Ugandan shillings (UGX)
  notes?: string; // Optional mechanic or parts notes
  createdAt: string;
}

export type ActiveScreen = 'dashboard' | 'motorcycles' | 'services' | 'expenditure';
