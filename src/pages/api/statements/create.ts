import type { NextApiRequest, NextApiResponse } from 'next';

type StatementType = 'utilities' | 'owner' | 'profit-loss' | 'wirtschaftsplan' | 'other';

type CostCategory = {
  id: string;
  name: string;
  amount: number;
  allocationMethod: string;
  isHeatingCost?: boolean;
};

type Statement = {
  id: string;
  propertyId: string;
  type: StatementType;
  title: string;
  periodStart: string;
  periodEnd: string;
  createdAt: string;
  totalAmount: number;
  costCategories: CostCategory[];
  notes?: string;
};

type ApiResponse = {
  success: boolean;
  message: string;
  statement?: Statement;
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
    const { 
      propertyId, 
      type, 
      title, 
      periodStart, 
      periodEnd, 
      costCategories,
      notes 
    } = req.body;

    // Validate required fields
    if (!propertyId || !type || !periodStart || !periodEnd) {
      return res.status(400).json({
        success: false,
        message: 'Property ID, type, and period dates are required fields',
      });
    }

    // Calculate total amount from cost categories
    const totalAmount = costCategories?.reduce(
      (sum: number, category: CostCategory) => sum + category.amount, 
      0
    ) || 0;

    // Create a new statement with a random ID
    const newStatement: Statement = {
      id: Math.random().toString(36).substring(2, 15),
      propertyId,
      type,
      title: title || `${type === 'utilities' ? 'Nebenkostenabrechnung' : 'Abrechnung'} ${new Date(periodStart).getFullYear()}`,
      periodStart,
      periodEnd,
      createdAt: new Date().toISOString(),
      totalAmount,
      costCategories: costCategories || [],
      notes,
    };

    console.log('Created new statement:', newStatement);

    return res.status(201).json({
      success: true,
      message: 'Statement created successfully',
      statement: newStatement,
    });
  } catch (error) {
    console.error('Error creating statement:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create statement',
    });
  }
}