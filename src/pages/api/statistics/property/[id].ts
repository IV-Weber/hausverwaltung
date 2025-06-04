import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type PropertyStatistics = {
  totalUnits: number;
  residentialUnits: number;
  commercialUnits: number;
  rentedUnits: number;
  vacantUnits: number;
  selfOccupiedUnits: number;
  totalArea: number;
  // Add more specific stats as needed, e.g., financial summaries
};

type ErrorResponse = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PropertyStatistics | ErrorResponse>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Property ID must be a string.' });
  }

  try {
    const property = await prisma.property.findUnique({
      where: { id: id },
      include: {
        units: true, // Assuming a relation exists: Property -> Units
      },
    });

    if (!property) {
      return res.status(404).json({ error: 'Property not found.' });
    }

    const units = property.units;

    const totalUnits = units.length;
    const residentialUnits = units.filter(unit => unit.type === 'RESIDENTIAL').length; // Assuming unit.type can be 'RESIDENTIAL' or 'COMMERCIAL'
    const commercialUnits = units.filter(unit => unit.type === 'COMMERCIAL').length;
    
    const rentedUnits = units.filter(unit => unit.status === 'RENTED').length; // Assuming unit.status can be 'RENTED', 'VACANT', 'SELF_OCCUPIED'
    const vacantUnits = units.filter(unit => unit.status === 'VACANT').length;
    const selfOccupiedUnits = units.filter(unit => unit.status === 'SELF_OCCUPIED').length;
    
    const totalArea = units.reduce((sum, unit) => sum + (unit.area || 0), 0); // Assuming unit.area is a number

    const statistics: PropertyStatistics = {
      totalUnits,
      residentialUnits,
      commercialUnits,
      rentedUnits,
      vacantUnits,
      selfOccupiedUnits,
      totalArea,
    };

    return res.status(200).json(statistics);
  } catch (error) {
    console.error(`Error fetching statistics for property ${id}:`, error);
    return res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
}