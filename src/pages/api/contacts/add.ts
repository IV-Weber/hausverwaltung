import type { NextApiRequest, NextApiResponse } from 'next';

type ContactType = 'eigentuemer' | 'mieter' | 'dienstleister';

type Contact = {
  id: string;
  type: ContactType;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
  active: boolean;
  createdAt: string;
};

type ApiResponse = {
  success: boolean;
  message: string;
  contact?: Contact;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // In a real application, this would save to a database
    // For now, we'll just return success with the contact data
    const { type, name, email, phone, address, notes } = req.body;

    // Validate required fields
    if (!type || !name) {
      return res.status(400).json({
        success: false,
        message: 'Type and name are required fields',
      });
    }

    // Create a new contact with a random ID
    const newContact: Contact = {
      id: Math.random().toString(36).substring(2, 15),
      type,
      name,
      email: email || '',
      phone: phone || '',
      address: address || '',
      notes,
      active: true,
      createdAt: new Date().toISOString(),
    };

    console.log('Created new contact:', newContact);

    return res.status(201).json({
      success: true,
      message: 'Contact added successfully',
      contact: newContact,
    });
  } catch (error) {
    console.error('Error adding contact:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add contact',
    });
  }
}