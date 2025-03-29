import type { NextApiRequest, NextApiResponse } from "next";

type UnitStatistics = {
  wohneinheiten: number;
  gewerbeeinheiten: number;
  hausverwaltungUnits: number;
  wegVerwaltungUnits: number;
  total: number;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<UnitStatistics>
) {
  // Mock data for now - in a real application, this would fetch from a database
  const statistics: UnitStatistics = {
    wohneinheiten: 87,
    gewerbeeinheiten: 14,
    hausverwaltungUnits: 42,
    wegVerwaltungUnits: 59,
    total: 101
  };

  console.log("Fetching unit statistics:", statistics);
  
  res.status(200).json(statistics);
}