import React, { useState } from "react";
import Head from "next/head";
import Header from "@/components/Header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, FileText, Gavel, ClipboardList, Plus, Building } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Versammlungen() {
  const [selectedObject, setSelectedObject] = useState<string | null>(null);

  return (
    <>
      <Head>
        <title>Versammlungen | Immobilienverwaltung</title>
        <meta name="description" content="Verwaltung von Versammlungen" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-background min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <h1 className="text-3xl font-bold mb-4 md:mb-0">Versammlungen</h1>
              
              <div className="w-full md:w-64">
                <Select onValueChange={(value) => setSelectedObject(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Objekt auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="placeholder">Keine Objekte vorhanden</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {!selectedObject ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Building className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">Bitte wählen Sie ein Objekt aus</p>
                  <p className="text-muted-foreground mb-6">Um Versammlungen anzuzeigen, müssen Sie zuerst ein Objekt auswählen.</p>
                  <Button>Objekt hinzufügen</Button>
                </CardContent>
              </Card>
            ) : (
              <Tabs defaultValue="beschluesse" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="beschluesse">Beschlüsse</TabsTrigger>
                  <TabsTrigger value="protokolle">Protokolle</TabsTrigger>
                </TabsList>
                
                <TabsContent value="beschluesse">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Gavel className="h-5 w-5" />
                            Beschlüsse
                          </CardTitle>
                          <CardDescription>Übersicht aller Beschlüsse der Eigentümerversammlungen</CardDescription>
                        </div>
                        <Button className="flex items-center gap-1">
                          <Plus className="h-4 w-4" />
                          Beschluss hinzufügen
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Beschlüsse gesamt</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-3xl font-bold">0</p>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Offene Beschlüsse</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-3xl font-bold">0</p>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Umgesetzte Beschlüsse</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-3xl font-bold">0</p>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="text-center py-8">
                        <Gavel className="h-12 w-12 mx-auto text-muted-foreground" />
                        <p className="mt-4 text-muted-foreground">Keine Beschlüsse vorhanden</p>
                        <Button className="mt-4">Beschluss hinzufügen</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="protokolle">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <ClipboardList className="h-5 w-5" />
                            Protokolle
                          </CardTitle>
                          <CardDescription>Protokolle der Eigentümerversammlungen</CardDescription>
                        </div>
                        <Button className="flex items-center gap-1">
                          <Plus className="h-4 w-4" />
                          Protokoll hinzufügen
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Versammlungen gesamt</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-3xl font-bold">0</p>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Letzte Versammlung</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-lg font-medium">-</p>
                            <p className="text-sm text-muted-foreground">Keine Versammlung vorhanden</p>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
                        <p className="mt-4 text-muted-foreground">Keine Protokolle vorhanden</p>
                        <Button className="mt-4">Protokoll hinzufügen</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </main>
      </div>
    </>
  );
}