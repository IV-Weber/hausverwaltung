import React, { useState } from "react";
import Head from "next/head";
import Header from "@/components/Header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, User, Home, Building, Phone, Mail } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Kontakte() {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  return (
    <>
      <Head>
        <title>Kontakte | Immobilienverwaltung</title>
        <meta name="description" content="Verwaltung von Kontakten" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-background min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Kontakte</h1>

            {!selectedType ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedType("eigentuemer")}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Eigentümer
                    </CardTitle>
                    <CardDescription>Verwaltung von Eigentümern</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Verwalten Sie Eigentümer und deren Kontaktdaten.</p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Auswählen</Button>
                  </CardFooter>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedType("mieter")}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Mieter
                    </CardTitle>
                    <CardDescription>Verwaltung von Mietern</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Verwalten Sie Mieter und deren Kontaktdaten.</p>
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
                    {selectedType === "eigentuemer" ? "Eigentümer" : "Mieter"}
                  </h2>
                  <Button variant="outline" onClick={() => setSelectedType(null)}>
                    Zurück zur Auswahl
                  </Button>
                </div>

                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">Alle</TabsTrigger>
                    <TabsTrigger value="active">Aktiv</TabsTrigger>
                    <TabsTrigger value="inactive">Inaktiv</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all">
                    <Card>
                      <CardHeader>
                        <CardTitle>Alle {selectedType === "eigentuemer" ? "Eigentümer" : "Mieter"}</CardTitle>
                        <CardDescription>
                          Übersicht aller {selectedType === "eigentuemer" ? "Eigentümer" : "Mieter"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8">
                          <Users className="h-12 w-12 mx-auto text-muted-foreground" />
                          <p className="mt-4 text-muted-foreground">
                            Keine {selectedType === "eigentuemer" ? "Eigentümer" : "Mieter"} vorhanden
                          </p>
                          <Button className="mt-4">
                            {selectedType === "eigentuemer" ? "Eigentümer" : "Mieter"} hinzufügen
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="active">
                    <Card>
                      <CardHeader>
                        <CardTitle>Aktive {selectedType === "eigentuemer" ? "Eigentümer" : "Mieter"}</CardTitle>
                        <CardDescription>
                          Übersicht aktiver {selectedType === "eigentuemer" ? "Eigentümer" : "Mieter"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8">
                          <Users className="h-12 w-12 mx-auto text-muted-foreground" />
                          <p className="mt-4 text-muted-foreground">
                            Keine aktiven {selectedType === "eigentuemer" ? "Eigentümer" : "Mieter"} vorhanden
                          </p>
                          <Button className="mt-4">
                            {selectedType === "eigentuemer" ? "Eigentümer" : "Mieter"} hinzufügen
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="inactive">
                    <Card>
                      <CardHeader>
                        <CardTitle>Inaktive {selectedType === "eigentuemer" ? "Eigentümer" : "Mieter"}</CardTitle>
                        <CardDescription>
                          Übersicht inaktiver {selectedType === "eigentuemer" ? "Eigentümer" : "Mieter"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8">
                          <Users className="h-12 w-12 mx-auto text-muted-foreground" />
                          <p className="mt-4 text-muted-foreground">
                            Keine inaktiven {selectedType === "eigentuemer" ? "Eigentümer" : "Mieter"} vorhanden
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}