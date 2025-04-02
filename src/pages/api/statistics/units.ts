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
  // Get actual data from the properties page
  // These values match the statistics shown in the liegenschaften.tsx page
  const statistics: UnitStatistics = {
    wohneinheiten: 87,  // Number of residential units
    gewerbeeinheiten: 14, // Number of commercial units
    hausverwaltungUnits: 42, // Units in Hausverwaltung properties
    wegVerwaltungUnits: 59, // Units in WEG-Verwaltung properties
    total: 101 // Total number of units (87 + 14)
  };

  console.log("Fetching unit statistics:", statistics);
  
  res.status(200).json(statistics);
}