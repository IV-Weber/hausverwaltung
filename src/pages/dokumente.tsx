import React from "react";
import Head from "next/head";
import Header from "@/components/Header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, FilePlus, Database, Files, Upload } from "lucide-react";

export default function Dokumente() {
  return (
    <>
      <Head>
        <title>Dokumente | Immobilienverwaltung</title>
        <meta name="description" content="Verwaltung von Dokumenten" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-background min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Dokumente</h1>

            <Tabs defaultValue="stammdokumente" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="stammdokumente">Stammdokumente</TabsTrigger>
                <TabsTrigger value="verwaltungsdokumente">Verwaltungsdokumente</TabsTrigger>
              </TabsList>
              
              <TabsContent value="stammdokumente">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Database className="h-5 w-5" />
                          Stammdokumente
                        </CardTitle>
                        <CardDescription>Grundlegende Dokumente zu Liegenschaften und Kontakten</CardDescription>
                      </div>
                      <Button className="flex items-center gap-1">
                        <Upload className="h-4 w-4" />
                        Dokument hochladen
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Verträge</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-3xl font-bold">0</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Grundbuchauszüge</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-3xl font-bold">0</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Baupläne</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-3xl font-bold">0</p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="mt-4 text-muted-foreground">Keine Stammdokumente vorhanden</p>
                      <Button className="mt-4">Dokument hochladen</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="verwaltungsdokumente">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Files className="h-5 w-5" />
                          Verwaltungsdokumente
                        </CardTitle>
                        <CardDescription>Dokumente zur laufenden Verwaltung</CardDescription>
                      </div>
                      <Button className="flex items-center gap-1">
                        <Upload className="h-4 w-4" />
                        Dokument hochladen
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Abrechnungen</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-3xl font-bold">0</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Korrespondenz</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-3xl font-bold">0</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Sonstige Dokumente</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-3xl font-bold">0</p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="text-center py-8">
                      <FilePlus className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="mt-4 text-muted-foreground">Keine Verwaltungsdokumente vorhanden</p>
                      <Button className="mt-4">Dokument hochladen</Button>
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