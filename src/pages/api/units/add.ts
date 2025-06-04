import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, UnitStatus, UnitType } from '@prisma/client'; // Assuming UnitStatus and UnitType enums exist

const prisma = new PrismaClient();

type UnitData = {
  propertyId: string;
  name: string;
  area: number;
  rooms: number;
  status: UnitStatus; // e.g., RENTED, VACANT, SELF_OCCUPIED
  type: UnitType; // e.g., RESIDENTIAL, COMMERCIAL - Assuming this field exists on Unit model
  baseRent?: number;
  additionalCosts?: number;
  // Tenant/Owner details might be handled separately or included here
  tenantName?: string;
  tenantEmail?: string;
  tenantPhone?: string;
  tenantStartDate?: string; // Date string
  ownerName?: string; // For WEG
  // Ausstattung
  hasKitchen?: boolean;
  hasBathroom?: boolean;
};

type SuccessResponse = {
  message: string;
  unitId: string;
};

type ErrorResponse = {
  error: string;
  details?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const {
    propertyId,
    name,
    area,
    rooms,
    status,
    type = UnitType.RESIDENTIAL, // Default to RESIDENTIAL if not provided
    baseRent,
    additionalCosts,
    tenantName,
    tenantEmail,
    tenantPhone,
    tenantStartDate,
    ownerName,
    hasKitchen,
    hasBathroom,
  } = req.body as UnitData;

  if (!propertyId || !name || area == null || rooms == null || !status) {
    return res.status(400).json({ error: 'Missing required unit fields: propertyId, name, area, rooms, status.' });
  }

  if (typeof area !== 'number' || typeof rooms !== 'number') {
      return res.status(400).json({ error: 'Area and rooms must be numbers.' });
  }
  if (baseRent != null && typeof baseRent !== 'number') {
    return res.status(400).json({ error: 'Base rent must be a number if provided.' });
  }
  if (additionalCosts != null && typeof additionalCosts !== 'number') {
    return res.status(400).json({ error: 'Additional costs must be a number if provided.' });
  }


  try {
    // Validate property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });
    if (!property) {
      return res.status(404).json({ error: 'Property not found.' });
    }

    // TODO: If tenantName is provided, potentially create/link a Contact entry for the tenant.
    // For now, we'll assume tenant/owner names are stored directly or handled by a simplified approach.

    const newUnit = await prisma.unit.create({
      data: {
        property: { connect: { id: propertyId } },
        name,
        area,
        rooms,
        status: status as UnitStatus, // Ensure status is a valid enum value
        type: type as UnitType, // Ensure type is a valid enum value
        baseRent: baseRent ?? 0,
        additionalCosts: additionalCosts ?? 0,
        // Store tenant/owner info directly for simplicity, or link to contacts
        // This part needs alignment with the actual Prisma schema for tenant/owner relationships
        // For example, if tenant is a relation:
        // tenant: tenantName ? { create: { name: tenantName, email: tenantEmail, phone: tenantPhone } } : undefined,
        // owner: ownerName ? { create: { name: ownerName } } : undefined, // Simplified
        // For now, let's assume simple string fields if they exist on the Unit model:
        // tenantName: tenantName, (if your schema has such fields)
        // ownerName: ownerName, (if your schema has such fields)
        // hasKitchen: hasKitchen ?? false,
        // hasBathroom: hasBathroom ?? false,
        // rentStartDate: tenantStartDate ? new Date(tenantStartDate) : undefined,
      },
    });

    return res.status(201).json({ message: 'Unit added successfully', unitId: newUnit.id });
  } catch (error: any) {
    console.error('Error adding unit:', error);
    if (error.code === 'P2002') { // Unique constraint violation
        return res.status(409).json({ error: 'A unit with this name or identifier already exists for this property.' });
    }
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  } finally {
    await prisma.$disconnect();
  }
}

// Helper to ensure enum values are valid - Prisma does this, but good for type safety
function isValidUnitStatus(status: any): status is UnitStatus {
  return Object.values(UnitStatus).includes(status);
}
function isValidUnitType(type: any): type is UnitType {
  return Object.values(UnitType).includes(type);
}