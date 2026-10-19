import { Motorcycle, ServiceRecord } from './types';

const STORAGE_KEY_MOTORCYCLES = 'motorcycle_service_log_bikes_v1';
const STORAGE_KEY_SERVICES = 'motorcycle_service_log_services_v1';

// Seed data based directly on documentation examples (Page 2 & 3: Oil change 25k, Brake adjustment 40k, Chain replacement 15k = 80k UGX)
export const SEED_MOTORCYCLES: Motorcycle[] = [
  {
    id: 'bike-001',
    regNumber: 'UBD 452K',
    make: 'Bajaj',
    model: 'Boxer BM 100',
    year: 2022,
    notes: 'Main commercial boda-boda. Serviced at Katwe garage.',
    createdAt: new Date('2024-01-10').toISOString(),
  },
  {
    id: 'bike-002',
    regNumber: 'UFA 319X',
    make: 'TVS',
    model: 'Star HLX 125',
    year: 2023,
    notes: 'Express courier bike. High mileage routine service.',
    createdAt: new Date('2024-03-01').toISOString(),
  },
];

export const SEED_SERVICES: ServiceRecord[] = [
  {
    id: 'srv-001',
    motorcycleId: 'bike-001',
    date: '2024-05-10',
    workPerformed: 'Oil change',
    costUgx: 25000,
    notes: 'Replaced 20W-50 4T engine oil and cleaned oil strainer screen.',
    createdAt: new Date('2024-05-10T09:30:00').toISOString(),
  },
  {
    id: 'srv-002',
    motorcycleId: 'bike-001',
    date: '2024-05-24',
    workPerformed: 'Brake adjustment',
    costUgx: 40000,
    notes: 'Tightened rear brake rod and replaced front drum brake shoes.',
    createdAt: new Date('2024-05-24T14:15:00').toISOString(),
  },
  {
    id: 'srv-003',
    motorcycleId: 'bike-001',
    date: '2024-06-12',
    workPerformed: 'Chain replacement',
    costUgx: 15000,
    notes: 'New 428H heavy duty drive chain installed with proper tensioning.',
    createdAt: new Date('2024-06-12T11:00:00').toISOString(),
  },
  {
    id: 'srv-004',
    motorcycleId: 'bike-002',
    date: '2024-06-05',
    workPerformed: 'Full routine service & spark plug',
    costUgx: 35000,
    notes: 'Spark plug change, air filter cleaning, clutch cable lubrication.',
    createdAt: new Date('2024-06-05T10:00:00').toISOString(),
  },
  {
    id: 'srv-005',
    motorcycleId: 'bike-002',
    date: '2024-06-28',
    workPerformed: 'Rear tire tube replacement & patch',
    costUgx: 22000,
    notes: 'Puncture repair and new heavy-duty inner tube.',
    createdAt: new Date('2024-06-28T16:20:00').toISOString(),
  },
];

export function loadMotorcycles(): Motorcycle[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MOTORCYCLES);
    if (!raw) {
      saveMotorcycles(SEED_MOTORCYCLES);
      return SEED_MOTORCYCLES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading motorcycles from storage:', e);
    return SEED_MOTORCYCLES;
  }
}

export function saveMotorcycles(motorcycles: Motorcycle[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_MOTORCYCLES, JSON.stringify(motorcycles));
  } catch (e) {
    console.error('Error saving motorcycles to storage:', e);
  }
}

export function loadServices(): ServiceRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SERVICES);
    if (!raw) {
      saveServices(SEED_SERVICES);
      return SEED_SERVICES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading services from storage:', e);
    return SEED_SERVICES;
  }
}

export function saveServices(services: ServiceRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(services));
  } catch (e) {
    console.error('Error saving services to storage:', e);
  }
}

export function resetToSeedData(): { motorcycles: Motorcycle[]; services: ServiceRecord[] } {
  saveMotorcycles(SEED_MOTORCYCLES);
  saveServices(SEED_SERVICES);
  return { motorcycles: SEED_MOTORCYCLES, services: SEED_SERVICES };
}

export function clearAllData(): { motorcycles: Motorcycle[]; services: ServiceRecord[] } {
  saveMotorcycles([]);
  saveServices([]);
  return { motorcycles: [], services: [] };
}

// Utility: Format currency in Ugandan Shillings (UGX)
export function formatUgx(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'UGX 0';
  }
  return `UGX ${Math.round(amount).toLocaleString('en-US')}`;
}

// Format date nicely
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  try {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      return d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
    return dateString;
  } catch {
    return dateString;
  }
}
