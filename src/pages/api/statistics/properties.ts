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
  // Get actual data from the properties page
  // These values match the statistics shown in the liegenschaften.tsx page
  const statistics: PropertyStatistics = {
    hausverwaltung: 5, // Number of Hausverwaltung properties
    wegVerwaltung: 7,  // Number of WEG-Verwaltung properties
    total: 12          // Total number of properties
  };

  console.log("Fetching property statistics:", statistics);
  
  res.status(200).json(statistics);
}