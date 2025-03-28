import React, { useState } from "react";
import Head from "next/head";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Archive, FileText, Search } from "lucide-react";

export default function ArchivPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Placeholder data for archived documents
  const archivedDocuments = [
    { id: 1, name: "Mietvertrag_Mustermann.pdf", type: "Vertrag", date: "15.01.2023", property: "Musterstraße 1" },
    { id: 2, name: "Nebenkostenabrechnung_2022.pdf", type: "Abrechnung", date: "28.02.2023", property: "Beispielweg 5" },
    { id: 3, name: "Protokoll_Eigentümerversammlung.pdf", type: "Protokoll", date: "10.03.2023", property: "Musterstraße 1" },
    { id: 4, name: "Wartungsvertrag_Heizung.pdf", type: "Vertrag", date: "22.04.2023", property: "Beispielweg 5" },
    { id: 5, name: "Versicherungspolice.pdf", type: "Versicherung", date: "05.05.2023", property: "Testplatz 8" },
  ];

  const filteredDocuments = searchQuery 
    ? archivedDocuments.filter(doc => 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.property.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : archivedDocuments;

  return (
    <>
      <Head>
        <title>Archiv | Immobilienverwaltung</title>
        <meta name="description" content="Archivierte Dokumente und Unterlagen" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-background min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h1 className="text-3xl font-bold">Archiv</h1>
              <div className="w-full md:w-auto flex items-center gap-2">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Dokumente durchsuchen..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all">Alle Dokumente</TabsTrigger>
                <TabsTrigger value="contracts">Verträge</TabsTrigger>
                <TabsTrigger value="protocols">Protokolle</TabsTrigger>
                <TabsTrigger value="invoices">Abrechnungen</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Archivierte Dokumente</CardTitle>
                    <CardDescription>
                      Gesamt: {filteredDocuments.length} Dokumente
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {filteredDocuments.length > 0 ? (
                      <div className="rounded-md border">
                        <div className="grid grid-cols-12 gap-2 p-4 font-medium border-b">
                          <div className="col-span-5">Dokument</div>
                          <div className="col-span-2">Typ</div>
                          <div className="col-span-2">Datum</div>
                          <div className="col-span-3">Liegenschaft</div>
                        </div>
                        <div className="divide-y">
                          {filteredDocuments.map((doc) => (
                            <div key={doc.id} className="grid grid-cols-12 gap-2 p-4 items-center hover:bg-muted/50">
                              <div className="col-span-5 flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span>{doc.name}</span>
                              </div>
                              <div className="col-span-2">{doc.type}</div>
                              <div className="col-span-2">{doc.date}</div>
                              <div className="col-span-3">{doc.property}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Archive className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-2" />
                        <h3 className="text-lg font-medium">Keine Dokumente gefunden</h3>
                        <p className="text-muted-foreground mt-1">
                          Versuchen Sie, Ihre Suchanfrage zu ändern oder andere Filter anzuwenden.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="contracts" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Verträge</CardTitle>
                    <CardDescription>
                      Archivierte Verträge und Vereinbarungen
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Archive className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-2" />
                      <h3 className="text-lg font-medium">Kategorie wird vorbereitet</h3>
                      <p className="text-muted-foreground mt-1">
                        Diese Funktion wird in Kürze verfügbar sein.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="protocols" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Protokolle</CardTitle>
                    <CardDescription>
                      Archivierte Protokolle von Versammlungen
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Archive className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-2" />
                      <h3 className="text-lg font-medium">Kategorie wird vorbereitet</h3>
                      <p className="text-muted-foreground mt-1">
                        Diese Funktion wird in Kürze verfügbar sein.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="invoices" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Abrechnungen</CardTitle>
                    <CardDescription>
                      Archivierte Abrechnungen und Rechnungen
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Archive className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-2" />
                      <h3 className="text-lg font-medium">Kategorie wird vorbereitet</h3>
                      <p className="text-muted-foreground mt-1">
                        Diese Funktion wird in Kürze verfügbar sein.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </>
  );
}