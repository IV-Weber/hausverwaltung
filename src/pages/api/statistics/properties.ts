import type { NextApiRequest, NextApiResponse } from "next";

type PropertyStatistics = {
  hausverwaltung: number;
  wegVerwaltung: number;
  total: number;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<PropertyStatistics>
) {
  // Mock data for now - in a real application, this would fetch from a database
  const statistics: PropertyStatistics = {
    hausverwaltung: 5,
    wegVerwaltung: 7,
    total: 12
  };

  console.log("Fetching property statistics:", statistics);
  
  res.status(200).json(statistics);
}