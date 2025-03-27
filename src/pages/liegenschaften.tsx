import React, { useState } from "react";
import Head from "next/head";
import Header from "@/components/Header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, Home, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Liegenschaften() {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  return (
    <>
      <Head>
        <title>Liegenschaften | Immobilienverwaltung</title>
        <meta name="description" content="Verwaltung von Liegenschaften" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-background min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Liegenschaften</h1>

            {!selectedType ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedType("hausverwaltung")}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Hausverwaltung
                    </CardTitle>
                    <CardDescription>Verwaltung von Mietobjekten</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Verwalten Sie Mietobjekte, Mietverträge und Mietzahlungen.</p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Auswählen</Button>
                  </CardFooter>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedType("weg-verwaltung")}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <Home className="h-5 w-5" />
                      WEG-Verwaltung
                    </CardTitle>
                    <CardDescription>Verwaltung von Wohnungseigentümergemeinschaften</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Verwalten Sie Eigentümergemeinschaften, Umlagen und Beschlüsse.</p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Auswählen</Button>
                  </CardFooter>
                </Card>
              </div>
            ) : (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">
                    {selectedType === "hausverwaltung" ? "Hausverwaltung" : "WEG-Verwaltung"}
                  </h2>
                  <Button variant="outline" onClick={() => setSelectedType(null)}>
                    Zurück zur Auswahl
                  </Button>
                </div>

                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="overview">Übersicht</TabsTrigger>
                    <TabsTrigger value="objects">Objekte</TabsTrigger>
                    <TabsTrigger value="units">Einheiten</TabsTrigger>
                    {selectedType === "weg-verwaltung" && (
                      <TabsTrigger value="owners">Eigentümer</TabsTrigger>
                    )}
                    {selectedType === "hausverwaltung" && (
                      <TabsTrigger value="tenants">Mieter</TabsTrigger>
                    )}
                  </TabsList>
                  
                  <TabsContent value="overview">
                    <Card>
                      <CardHeader>
                        <CardTitle>Übersicht</CardTitle>
                        <CardDescription>
                          {selectedType === "hausverwaltung" 
                            ? "Zusammenfassung Ihrer verwalteten Mietobjekte" 
                            : "Zusammenfassung Ihrer verwalteten Eigentümergemeinschaften"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">Objekte</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-3xl font-bold">0</p>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">Einheiten</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-3xl font-bold">0</p>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">
                                {selectedType === "hausverwaltung" ? "Mieter" : "Eigentümer"}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-3xl font-bold">0</p>
                            </CardContent>
                          </Card>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="objects">
                    <Card>
                      <CardHeader>
                        <CardTitle>Objekte</CardTitle>
                        <CardDescription>
                          {selectedType === "hausverwaltung" 
                            ? "Verwaltete Mietobjekte" 
                            : "Verwaltete Eigentümergemeinschaften"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8">
                          <Building className="h-12 w-12 mx-auto text-muted-foreground" />
                          <p className="mt-4 text-muted-foreground">Keine Objekte vorhanden</p>
                          <Button className="mt-4">Objekt hinzufügen</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="units">
                    <Card>
                      <CardHeader>
                        <CardTitle>Einheiten</CardTitle>
                        <CardDescription>Wohn- und Gewerbeeinheiten</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8">
                          <Home className="h-12 w-12 mx-auto text-muted-foreground" />
                          <p className="mt-4 text-muted-foreground">Keine Einheiten vorhanden</p>
                          <Button className="mt-4">Einheit hinzufügen</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {selectedType === "weg-verwaltung" && (
                    <TabsContent value="owners">
                      <Card>
                        <CardHeader>
                          <CardTitle>Eigentümer</CardTitle>
                          <CardDescription>Eigentümer der Wohneinheiten</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center py-8">
                            <Users className="h-12 w-12 mx-auto text-muted-foreground" />
                            <p className="mt-4 text-muted-foreground">Keine Eigentümer vorhanden</p>
                            <Button className="mt-4">Eigentümer hinzufügen</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  )}
                  
                  {selectedType === "hausverwaltung" && (
                    <TabsContent value="tenants">
                      <Card>
                        <CardHeader>
                          <CardTitle>Mieter</CardTitle>
                          <CardDescription>Mieter der Wohneinheiten</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center py-8">
                            <Users className="h-12 w-12 mx-auto text-muted-foreground" />
                            <p className="mt-4 text-muted-foreground">Keine Mieter vorhanden</p>
                            <Button className="mt-4">Mieter hinzufügen</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  )}
                </Tabs>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}