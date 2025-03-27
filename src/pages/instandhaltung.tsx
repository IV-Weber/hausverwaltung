import React from "react";
import Head from "next/head";
import Header from "@/components/Header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wrench, Tool, AlertTriangle, Plus, Calendar } from "lucide-react";

export default function Instandhaltung() {
  return (
    <>
      <Head>
        <title>Instandhaltung | Immobilienverwaltung</title>
        <meta name="description" content="Verwaltung von Instandhaltungsmaßnahmen" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-background min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Instandhaltung</h1>

            <Tabs defaultValue="wartungen" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="wartungen">Wartungen</TabsTrigger>
                <TabsTrigger value="reparaturen">Reparaturen</TabsTrigger>
              </TabsList>
              
              <TabsContent value="wartungen">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Tool className="h-5 w-5" />
                          Wartungen
                        </CardTitle>
                        <CardDescription>Übersicht aller geplanten und durchgeführten Wartungen</CardDescription>
                      </div>
                      <Button className="flex items-center gap-1">
                        <Plus className="h-4 w-4" />
                        Wartung hinzufügen
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Geplante Wartungen</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-3xl font-bold">0</p>
                          <p className="text-sm text-muted-foreground">Nächste 30 Tage</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Durchgeführte Wartungen</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-3xl font-bold">0</p>
                          <p className="text-sm text-muted-foreground">Letzten 12 Monate</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Überfällige Wartungen</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-3xl font-bold text-red-500">0</p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="mt-4 text-muted-foreground">Keine Wartungen vorhanden</p>
                      <Button className="mt-4">Wartung hinzufügen</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reparaturen">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Wrench className="h-5 w-5" />
                          Reparaturen
                        </CardTitle>
                        <CardDescription>Übersicht aller gemeldeten und durchgeführten Reparaturen</CardDescription>
                      </div>
                      <Button className="flex items-center gap-1">
                        <Plus className="h-4 w-4" />
                        Reparatur hinzufügen
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Offene Reparaturen</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-3xl font-bold">0</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">In Bearbeitung</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-3xl font-bold">0</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Abgeschlossen</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-3xl font-bold">0</p>
                          <p className="text-sm text-muted-foreground">Letzten 12 Monate</p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="text-center py-8">
                      <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="mt-4 text-muted-foreground">Keine Reparaturen vorhanden</p>
                      <Button className="mt-4">Reparatur hinzufügen</Button>
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