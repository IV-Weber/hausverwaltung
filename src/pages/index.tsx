import React from "react";
import Head from "next/head";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Building, Users, Wallet, Wrench, FileText, MessageSquare, Calendar } from "lucide-react";

export default function Home() {
  return (
    <>
      <Head>
        <title>Haus & WEG Verwaltung</title>
        <meta name="description" content="Haus und WEG-Verwaltungssoftware" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-background min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Haus & WEG Verwaltung</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Immobilien
                  </CardTitle>
                  <CardDescription>Verwalten Sie Ihre Immobilien und Einheiten</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Erfassen und verwalten Sie Gebäude, Wohnungen und Gewerbeeinheiten.</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Öffnen</Button>
                </CardFooter>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Eigentümer & Mieter
                  </CardTitle>
                  <CardDescription>Verwalten Sie Personen und Kontakte</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Erfassen und verwalten Sie Eigentümer, Mieter und deren Kontaktdaten.</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Öffnen</Button>
                </CardFooter>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Finanzen
                  </CardTitle>
                  <CardDescription>Verwalten Sie Zahlungen und Abrechnungen</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Erfassen Sie Hausgeld, Nebenkosten und erstellen Sie Abrechnungen.</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Öffnen</Button>
                </CardFooter>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5" />
                    Instandhaltung
                  </CardTitle>
                  <CardDescription>Verwalten Sie Wartungen und Reparaturen</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Planen und verfolgen Sie Wartungsarbeiten und Reparaturen.</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Öffnen</Button>
                </CardFooter>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Dokumente
                  </CardTitle>
                  <CardDescription>Verwalten Sie wichtige Unterlagen</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Speichern und organisieren Sie Verträge, Protokolle und andere Dokumente.</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Öffnen</Button>
                </CardFooter>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Versammlungen
                  </CardTitle>
                  <CardDescription>Planen Sie Eigentümerversammlungen</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Organisieren Sie Versammlungen, Abstimmungen und Protokolle.</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Öffnen</Button>
                </CardFooter>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Aktuelle Aufgaben</CardTitle>
                  <CardDescription>Anstehende Termine und Aufgaben</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Keine anstehenden Aufgaben.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Neuigkeiten</CardTitle>
                  <CardDescription>Aktuelle Informationen</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Keine neuen Nachrichten.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}