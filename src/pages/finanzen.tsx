import React from "react";
import Head from "next/head";
import Header from "@/components/Header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, TrendingUp, TrendingDown, Plus } from "lucide-react";

export default function Finanzen() {
  return (
    <>
      <Head>
        <title>Finanzen | Immobilienverwaltung</title>
        <meta name="description" content="Verwaltung von Finanzen" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-background min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Finanzen</h1>

            <Tabs defaultValue="einnahmen" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="einnahmen">Einnahmen</TabsTrigger>
                <TabsTrigger value="ausgaben">Ausgaben</TabsTrigger>
              </TabsList>
              
              <TabsContent value="einnahmen">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-green-500" />
                          Einnahmen
                        </CardTitle>
                        <CardDescription>Übersicht aller Einnahmen</CardDescription>
                      </div>
                      <Button className="flex items-center gap-1">
                        <Plus className="h-4 w-4" />
                        Einnahme hinzufügen
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Gesamt Einnahmen</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-3xl font-bold">0,00 €</p>
                          <p className="text-sm text-muted-foreground">Aktuelles Jahr</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Mietzahlungen</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-3xl font-bold">0,00 €</p>
                          <p className="text-sm text-muted-foreground">Aktuelles Jahr</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Sonstige Einnahmen</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-3xl font-bold">0,00 €</p>
                          <p className="text-sm text-muted-foreground">Aktuelles Jahr</p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="text-center py-8">
                      <Wallet className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="mt-4 text-muted-foreground">Keine Einnahmen vorhanden</p>
                      <Button className="mt-4">Einnahme hinzufügen</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="ausgaben">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingDown className="h-5 w-5 text-red-500" />
                          Ausgaben
                        </CardTitle>
                        <CardDescription>Übersicht aller Ausgaben</CardDescription>
                      </div>
                      <Button className="flex items-center gap-1">
                        <Plus className="h-4 w-4" />
                        Ausgabe hinzufügen
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Gesamt Ausgaben</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-3xl font-bold">0,00 €</p>
                          <p className="text-sm text-muted-foreground">Aktuelles Jahr</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Instandhaltung</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-3xl font-bold">0,00 €</p>
                          <p className="text-sm text-muted-foreground">Aktuelles Jahr</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Sonstige Ausgaben</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-3xl font-bold">0,00 €</p>
                          <p className="text-sm text-muted-foreground">Aktuelles Jahr</p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="text-center py-8">
                      <Wallet className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="mt-4 text-muted-foreground">Keine Ausgaben vorhanden</p>
                      <Button className="mt-4">Ausgabe hinzufügen</Button>
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