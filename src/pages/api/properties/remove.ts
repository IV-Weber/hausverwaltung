import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  success: boolean;
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Only allow DELETE requests
  if (req.method !== "DELETE") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { id, type } = req.query;
    
    if (!id || !type) {
      return res.status(400).json({ 
        success: false, 
        message: "Property ID and type are required" 
      });
    }

    // In a real application, this would delete from a database
    // For now, we'll just return success
    console.log(`Removing property: ${id} of type: ${type}`);
    
    res.status(200).json({ 
      success: true, 
      message: "Property removed successfully" 
    });
  } catch (error) {
    console.error("Error removing property:", error);
    res.status(500).json({ success: false, message: "Failed to remove property" });
  }
}