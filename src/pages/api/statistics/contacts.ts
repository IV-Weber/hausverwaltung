import type { NextApiRequest, NextApiResponse } from "next";

type ContactStatistics = {
  eigentuemer: number;
  mieter: number;
  dienstleister: number;
  total: number;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ContactStatistics>
) {
  // Mock data for now - in a real application, this would fetch from a database
  const statistics: ContactStatistics = {
    eigentuemer: 68,
    mieter: 76,
    dienstleister: 12,
    total: 156
  };

  console.log("Fetching contact statistics:", statistics);
  
  res.status(200).json(statistics);
}