import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Assuming a Document model like this:
// model Document {
//   id          String   @id @default(cuid())
//   name        String
//   type        String // e.g., 'Mietvertrag', 'Protokoll', 'Rechnung'
//   date        DateTime @default(now())
//   filePath    String?  // Path to the stored file, if applicable
//   propertyId  String
//   property    Property @relation(fields: [propertyId], references: [id])
//   createdAt   DateTime @default(now())
//   updatedAt   DateTime @updatedAt
// }

type DocumentData = {
  propertyId: string;
  name: string;
  type: string; // Document type/category
  date?: string; // Optional date string, defaults to now() in schema
  // filePath might be handled by a separate upload mechanism
};

type SuccessResponse = {
  message: string;
  documentId: string;
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

  const { propertyId, name, type, date } = req.body as DocumentData;

  if (!propertyId || !name || !type) {
    return res.status(400).json({ error: 'Missing required fields: propertyId, name, type.' });
  }

  try {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return res.status(404).json({ error: 'Property not found.' });
    }

    const documentDate = date ? new Date(date) : new Date();

    const newDocument = await prisma.document.create({
      data: {
        property: { connect: { id: propertyId } },
        name,
        type,
        date: documentDate,
        // filePath: "placeholder/path" // Actual file path would come from an upload service
      },
    });

    return res.status(201).json({ message: 'Document metadata added successfully', documentId: newDocument.id });
  } catch (error: any) {
    console.error('Error adding document metadata:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  } finally {
    await prisma.$disconnect();
  }
}