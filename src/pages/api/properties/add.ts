import type { NextApiRequest, NextApiResponse } from "next";

type Property = {
  id: string;
  name: string;
  address: string;
  buildYear: number;
  units: number;
  image: string;
  owner?: string;
  renovationYear?: number | null;
  totalArea?: number;
  monthlyRent?: number;
  monthlyFee?: number;
};

type ResponseData = {
  success: boolean;
  message: string;
  property?: Property;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    // In a real application, this would save to a database
    // For now, we'll just return success with the property data
    const propertyData = req.body;
    
    // Generate a random ID (in a real app, this would be handled by the database)
    const newProperty = {
      ...propertyData,
      id: Math.random().toString(36).substring(2, 11),
      units_list: [] // Initialize with empty units list
    };

    console.log("Adding new property:", newProperty);
    
    res.status(200).json({ 
      success: true, 
      message: "Property added successfully", 
      property: newProperty 
    });
  } catch (error) {
    console.error("Error adding property:", error);
    res.status(500).json({ success: false, message: "Failed to add property" });
  }
}