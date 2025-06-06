import React, { useEffect, useState } from "react";
import Head from "next/head";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Building, Users, FileText, Calendar, Home, Store, BarChart3, PieChart } from "lucide-react";
import { useRouter } from "next/router";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Cell, Legend, Pie, PieChart as RechartsPieChart, ResponsiveContainer } from "recharts";

// Define types for our statistics
type PropertyStatistics = {
  hausverwaltung: number;
  wegVerwaltung: number;
  total: number;
};

type ContactStatistics = {
  eigentuemer: number;
  mieter: number;
  dienstleister: number;
  total: number;
};

type UnitStatistics = {
  wohneinheiten: number;
  gewerbeeinheiten: number;
  hausverwaltungUnits: number;
  wegVerwaltungUnits: number;
  total: number;
};

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

export default function Dashboard() {
  const router = useRouter();
  
  // State for statistics
  const [propertyStats, setPropertyStats] = useState<PropertyStatistics | null>(null);
  const [contactStats, setContactStats] = useState<ContactStatistics | null>(null);
  const [unitStats, setUnitStats] = useState<UnitStatistics | null>(null);
  const [occupancyStats, setOccupancyStats] = useState<OccupancyStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch statistics data
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        
        // Fetch all statistics in parallel
        const [propertyRes, contactRes, unitRes, occupancyRes] = await Promise.all([
          fetch('/api/statistics/properties'),
          fetch('/api/statistics/contacts'),
          fetch('/api/statistics/units'),
          fetch('/api/statistics/occupancy')
        ]);
        
        const propertyData = await propertyRes.json();
        const contactData = await contactRes.json();
        const unitData = await unitRes.json();
        const occupancyData = await occupancyRes.json();
        
        setPropertyStats(propertyData);
        setContactStats(contactData);
        setUnitStats(unitData);
        setOccupancyStats(occupancyData);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStatistics();
  }, []);
  
  // Real data for dashboard metrics from API
  const metrics = {
    properties: propertyStats?.total || 0,
    apartments: unitStats?.wohneinheiten || 0,
    commercialUnits: unitStats?.gewerbeeinheiten || 0,
    contacts: contactStats?.total || 0,
    tenants: contactStats?.mieter || 0,
    archivedDocuments: 243, // This is still a placeholder as we don't have real data for documents
  };

  // Create chart data from fetched statistics
  const propertyTypeData = [
    { name: "WEG-Verwaltung", value: propertyStats?.wegVerwaltung || 0, fill: "#0ea5e9" },
    { name: "Hausverwaltung", value: propertyStats?.hausverwaltung || 0, fill: "#8b5cf6" },
  ];

  const contactTypeData = [
    { name: "Eigentümer", value: contactStats?.eigentuemer || 0, fill: "#10b981" },
    { name: "Mieter", value: contactStats?.mieter || 0, fill: "#f59e0b" },
    { name: "Dienstleister", value: contactStats?.dienstleister || 0, fill: "#ef4444" },
  ];

  const unitTypeData = [
    { name: "Wohneinheiten", value: unitStats?.wohneinheiten || 0, fill: "#0ea5e9" },
    { name: "Gewerbeeinheiten", value: unitStats?.gewerbeeinheiten || 0, fill: "#8b5cf6" },
  ];

  const occupancyData = [
    { name: "Vermietet", value: occupancyStats?.vermietet || 0, fill: "#10b981" },
    { name: "Selbstbewohnt", value: occupancyStats?.selbstbewohnt || 0, fill: "#0ea5e9" },
    { name: "Leerstand", value: occupancyStats?.leerstand || 0, fill: "#ef4444" },
  ];

  // Placeholder data for upcoming appointments
  const upcomingAppointments = [
    { id: 1, title: "Eigentümerversammlung", date: "30.03.2025", time: "14:00", location: "Musterstraße 1" },
    { id: 2, title: "Wartung Heizungsanlage", date: "02.04.2025", time: "09:30", location: "Beispielweg 5" },
    { id: 3, title: "Besichtigung Wohnung 4B", date: "05.04.2025", time: "11:00", location: "Testplatz 8" },
  ];

  // Chart configuration
  const chartConfig = {
    property: { label: "Liegenschaften" },
    contact: { label: "Kontakte" },
    unit: { label: "Einheiten" },
    occupancy: { label: "Auslastung" },
  };

  // Custom render for pie chart labels
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="#fff" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <>
      <Head>
        <title>Dashboard | Immobilienverwaltung</title>
        <meta name="description" content="Dashboard der Immobilienverwaltungssoftware" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-background min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Building className="h-5 w-5 text-primary" />
                    Liegenschaftsübersicht
                  </CardTitle>
                  <CardDescription>
                    Verhältnis zwischen WEG- und Hausverwaltungen
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="flex">
                    <div className="w-1/3 pr-4">
                      <ul className="space-y-2">
                        {propertyTypeData.map((item, index) => (
                          <li key={index} className="flex items-center">
                            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.fill }}></div>
                            <span className="text-sm">{item.name}: {item.value} ({metrics.properties > 0 ? ((item.value / metrics.properties) * 100).toFixed(0) : 0}%)</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4">
                        <div className="font-bold">Gesamt: {metrics.properties}</div>
                      </div>
                    </div>
                    <div className="w-2/3 h-[200px]">
                      <ChartContainer config={chartConfig}>
                        <RechartsPieChart>
                          <Pie
                            data={propertyTypeData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {propertyTypeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Legend />
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </RechartsPieChart>
                      </ChartContainer>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => router.push("/liegenschaften")}>
                    Details anzeigen
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Kontaktübersicht
                  </CardTitle>
                  <CardDescription>
                    Verhältnis zwischen Mietern, Eigentümern und Dienstleistern
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="flex">
                    <div className="w-1/3 pr-4">
                      <ul className="space-y-2">
                        {contactTypeData.map((item, index) => (
                          <li key={index} className="flex items-center">
                            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.fill }}></div>
                            <span className="text-sm">{item.name}: {item.value} ({metrics.contacts > 0 ? ((item.value / metrics.contacts) * 100).toFixed(0) : 0}%)</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4">
                        <div className="font-bold">Gesamt: {metrics.contacts}</div>
                      </div>
                    </div>
                    <div className="w-2/3 h-[200px]">
                      <ChartContainer config={chartConfig}>
                        <RechartsPieChart>
                          <Pie
                            data={contactTypeData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {contactTypeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Legend />
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </RechartsPieChart>
                      </ChartContainer>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => router.push("/kontakte")}>
                    Details anzeigen
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Home className="h-5 w-5 text-primary" />
                    Einheitenübersicht
                  </CardTitle>
                  <CardDescription>
                    Verhältnis von Wohneinheiten zu Gewerbeeinheiten
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="flex">
                    <div className="w-1/3 pr-4">
                      <ul className="space-y-2">
                        {unitTypeData.map((item, index) => (
                          <li key={index} className="flex items-center">
                            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.fill }}></div>
                            <span className="text-sm">{item.name}: {item.value} ({(metrics.apartments + metrics.commercialUnits) > 0 ? ((item.value / (metrics.apartments + metrics.commercialUnits)) * 100).toFixed(0) : 0}%)</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4">
                        <div className="font-bold">Gesamt: {metrics.apartments + metrics.commercialUnits}</div>
                      </div>
                    </div>
                    <div className="w-2/3 h-[200px]">
                      <ChartContainer config={chartConfig}>
                        <RechartsPieChart>
                          <Pie
                            data={unitTypeData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {unitTypeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Legend />
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </RechartsPieChart>
                      </ChartContainer>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => router.push("/liegenschaften")}>
                    Details anzeigen
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Auslastungen
                  </CardTitle>
                  <CardDescription>
                    Vermietungsquote für Wohn- und Gewerbeeinheiten
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="flex">
                    <div className="w-1/3 pr-4">
                      <ul className="space-y-2">
                        {occupancyData.map((item, index) => (
                          <li key={index} className="flex items-center">
                            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.fill }}></div>
                            <span className="text-sm">{item.name}: {item.value} ({(metrics.apartments + metrics.commercialUnits) > 0 ? ((item.value / (metrics.apartments + metrics.commercialUnits)) * 100).toFixed(0) : 0}%)</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4">
                        {occupancyStats && (
                          <div className="font-bold">
                            Vermietungsquote: {((occupancyStats.vermietet / (metrics.apartments + metrics.commercialUnits)) * 100).toFixed(0)}%
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="w-2/3 h-[200px]">
                      <ChartContainer config={chartConfig}>
                        <RechartsPieChart>
                          <Pie
                            data={occupancyData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {occupancyData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Legend />
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </RechartsPieChart>
                      </ChartContainer>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => router.push("/liegenschaften")}>
                    Details anzeigen
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Dokumenten-Archiv
                  </CardTitle>
                  <CardDescription>
                    Gesamtzahl aller gespeicherten Dateien
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center py-6">
                    <div className="text-center">
                      <div className="text-5xl font-bold">{metrics.archivedDocuments}</div>
                      <p className="text-sm text-muted-foreground mt-2">Archivierte Dokumente</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => router.push("/archiv")}>
                    Zum Archiv
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Anstehende Termine
                  </CardTitle>
                  <CardDescription>Die nächsten Termine aus dem Kalender</CardDescription>
                </CardHeader>
                <CardContent>
                  {upcomingAppointments.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingAppointments.map((appointment) => (
                        <div key={appointment.id} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                          <div>
                            <p className="font-medium">{appointment.title}</p>
                            <p className="text-sm text-muted-foreground">{appointment.location}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{appointment.date}</p>
                            <p className="text-sm text-muted-foreground">{appointment.time} Uhr</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Keine anstehenden Termine.</p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => router.push("/kalender")}>
                    Alle Termine anzeigen
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Aktivitätsübersicht</CardTitle>
                  <CardDescription>Letzte Aktivitäten im System</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 border-b pb-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Dokument hinzugefügt</p>
                        <p className="text-sm text-muted-foreground">Mietvertrag_Schmidt.pdf wurde archiviert</p>
                        <p className="text-xs text-muted-foreground">Heute, 08:32 Uhr</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 border-b pb-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Building className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Liegenschaft aktualisiert</p>
                        <p className="text-sm text-muted-foreground">Daten für Musterstraße 1 wurden aktualisiert</p>
                        <p className="text-xs text-muted-foreground">Gestern, 16:45 Uhr</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Calendar className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Termin erstellt</p>
                        <p className="text-sm text-muted-foreground">Eigentümerversammlung wurde geplant</p>
                        <p className="text-xs text-muted-foreground">Gestern, 14:20 Uhr</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}