export type BranchData = {
  id: string;
  name: string;
  totalEmployees: number;
  powerConsumption: number;
  waterConsumption: number;
  seats: SeatData[];
}

export type SeatData = {
  id: number;
  status: 'occupied' | 'available' | 'maintenance';
  employeeId?: string;
  powerUsage: number;
  waterUsage: number;
}

export const branchData: Record<string, BranchData> = {
  branch1: {
    id: 'branch1',
    name: 'Branch 1 - New York',
    totalEmployees: 739,
    powerConsumption: 2622.67,
    waterConsumption: 920.95,
    seats: Array.from({ length: 200 }, (_, i) => ({
      id: i + 1,
      status: Math.random() > 0.6 ? 'occupied' : 'available',
      employeeId: Math.random() > 0.6 ? `EMP${1000 + i}` : undefined,
      powerUsage: parseFloat((Math.random() * 15 + 5).toFixed(2)),
      waterUsage: parseFloat((Math.random() * 5 + 1).toFixed(2)),
    }))
  },
  branch2: {
    id: 'branch2',
    name: 'Branch 2 - Mumbai',
    totalEmployees: 542,
    powerConsumption: 1845.32,
    waterConsumption: 750.45,
    seats: Array.from({ length: 200 }, (_, i) => ({
      id: i + 1,
      status: Math.random() > 0.5 ? 'occupied' : 'available',
      employeeId: Math.random() > 0.5 ? `EMP${2000 + i}` : undefined,
      powerUsage: parseFloat((Math.random() * 15 + 5).toFixed(2)),
      waterUsage: parseFloat((Math.random() * 5 + 1).toFixed(2)),
    }))
  },
  branch3: {
    id: 'branch3',
    name: 'Branch 3 - Chennai',
    totalEmployees: 423,
    powerConsumption: 1567.89,
    waterConsumption: 620.75,
    seats: Array.from({ length: 200 }, (_, i) => ({
      id: i + 1,
      status: Math.random() > 0.4 ? 'occupied' : 'available',
      employeeId: Math.random() > 0.4 ? `EMP${3000 + i}` : undefined,
      powerUsage: parseFloat((Math.random() * 15 + 5).toFixed(2)),
      waterUsage: parseFloat((Math.random() * 5 + 1).toFixed(2)),
    }))
  }
};