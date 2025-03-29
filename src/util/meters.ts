/**
 * Types of meters commonly used in property management
 */
export const meterTypes = [
  { id: 'water', name: 'Wasser', defaultUnit: 'm³' },
  { id: 'electricity', name: 'Strom', defaultUnit: 'kWh' },
  { id: 'heating', name: 'Heizung', defaultUnit: 'kWh' },
  { id: 'gas', name: 'Gas', defaultUnit: 'm³' },
  { id: 'hotWater', name: 'Warmwasser', defaultUnit: 'm³' },
  { id: 'coldWater', name: 'Kaltwasser', defaultUnit: 'm³' },
] as const;

/**
 * Common units of measurement for different meter types
 */
export const unitOptions = [
  { id: 'm3', name: 'm³', description: 'Kubikmeter' },
  { id: 'kwh', name: 'kWh', description: 'Kilowattstunde' },
  { id: 'mwh', name: 'MWh', description: 'Megawattstunde' },
  { id: 'l', name: 'L', description: 'Liter' },
  { id: 'custom', name: 'Benutzerdefiniert', description: 'Benutzerdefinierte Einheit' },
] as const;

export type MeterType = typeof meterTypes[number]['id'];
export type UnitOption = typeof unitOptions[number]['id'];

/**
 * Interface for a meter reading
 */
export interface MeterReading {
  id: string;
  date: string;
  value: number;
  notes?: string;
}

/**
 * Interface for a meter
 */
export interface Meter {
  id: string;
  name: string;
  type: MeterType;
  unit: string;
  location?: string;
  serialNumber?: string;
  lastReading?: number;
  lastReadingDate?: string;
  readings: MeterReading[];
}

/**
 * Generate a unique ID for a new meter or reading
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

/**
 * Format a meter reading value with its unit
 */
export function formatMeterValue(value: number, unit: string): string {
  return `${value} ${unit}`;
}

/**
 * Calculate consumption between two readings
 */
export function calculateConsumption(currentReading: number, previousReading: number): number {
  return Math.max(0, currentReading - previousReading);
}