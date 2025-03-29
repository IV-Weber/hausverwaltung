import type { NextApiRequest, NextApiResponse } from "next";

type OccupancyStatistics = {
  vermietet: number;
  selbstbewohnt: number;
  leerstand: number;
  vermieteteWohneinheiten: number;
  vermieteteGewerbeeinheiten: number;
  selbstbewohnteWohneinheiten: number;
  leerstandWohneinheiten: number;
  leerstandGewerbeeinheiten: number;
  total: number;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<OccupancyStatistics>
) {
  // Mock data for now - in a real application, this would fetch from a database
  const statistics: OccupancyStatistics = {
    vermietet: 82 + 12, // WE + GE
    selbstbewohnt: 14,
    leerstand: 5 + 2, // WE + GE
    vermieteteWohneinheiten: 82,
    vermieteteGewerbeeinheiten: 12,
    selbstbewohnteWohneinheiten: 14,
    leerstandWohneinheiten: 5,
    leerstandGewerbeeinheiten: 2,
    total: 101
  };

  console.log("Fetching occupancy statistics:", statistics);
  
  res.status(200).json(statistics);
}