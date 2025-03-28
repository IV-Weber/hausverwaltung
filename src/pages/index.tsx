import React from "react";
import Head from "next/head";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Building, Users, FileText, Calendar, Home, Store, BarChart3 } from "lucide-react";
import { useRouter } from "next/router";

export default function Dashboard() {
  const router = useRouter();
  
  // Placeholder data for dashboard metrics
  const metrics = {
    properties: 12,
    apartments: 87,
    commercialUnits: 14,
    contacts: 156,
    archivedDocuments: 243,
  };

  // Placeholder data for upcoming appointments
  const upcomingAppointments = [
    { id: 1, title: "Eigentümerversammlung", date: "30.03.2025", time: "14:00", location: "Musterstraße 1" },
    { id: 2, title: "Wartung Heizungsanlage", date: "02.04.2025", time: "09:30", location: "Beispielweg 5" },
    { id: 3, title: "Besichtigung Wohnung 4B", date: "05.04.2025", time: "11:00", location: "Testplatz 8" },
  ];

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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Building className="h-5 w-5 text-primary" />
                    Liegenschaften
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{metrics.properties}</div>
                  <p className="text-sm text-muted-foreground">Verwaltete Objekte</p>
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
                    <Home className="h-5 w-5 text-primary" />
                    Wohnungen
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{metrics.apartments}</div>
                  <p className="text-sm text-muted-foreground">Wohneinheiten gesamt</p>
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
                    <Store className="h-5 w-5 text-primary" />
                    Gewerbeeinheiten
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{metrics.commercialUnits}</div>
                  <p className="text-sm text-muted-foreground">Gewerbeeinheiten gesamt</p>
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
                    Kontakte
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{metrics.contacts}</div>
                  <p className="text-sm text-muted-foreground">Eigentümer und Mieter</p>
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
                    <FileText className="h-5 w-5 text-primary" />
                    Archivierte Dokumente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{metrics.archivedDocuments}</div>
                  <p className="text-sm text-muted-foreground">Dokumente gesamt</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => router.push("/archiv")}>
                    Details anzeigen
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Auslastung
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">94%</div>
                  <p className="text-sm text-muted-foreground">Vermietungsquote</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => router.push("/liegenschaften")}>
                    Details anzeigen
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