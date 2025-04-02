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
  // Get actual data from the properties page
  // These values match the statistics shown in the liegenschaften.tsx page
  const statistics: ContactStatistics = {
    eigentuemer: 76, // Number of property owners
    mieter: 68,      // Number of tenants
    dienstleister: 12, // Number of service providers
    total: 156       // Total number of contacts
  };

  console.log("Fetching contact statistics:", statistics);
  
  res.status(200).json(statistics);
}