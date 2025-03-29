import React, { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Header from "@/components/Header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, User, Gauge, Euro, Home } from "lucide-react";

// Mock data for properties
const properties = {
  hausverwaltung: [
    {
      id: "1",
      name: "Wohnanlage Sonnenblick",
      address: "Sonnenallee 42, 10435 Berlin",
      buildYear: 1998,
      renovationYear: 2015,
      units: 12,
      totalArea: 980,
      monthlyRent: 14500,
      owner: "Immobilien GmbH Berlin",
      image: "/images/rect.png",
      units_list: [
        { 
          id: "101", 
          name: "Wohnung 1A", 
          area: 65, 
          rooms: 2, 
          status: "rented", 
          tenant: "Max Mustermann",
          baseRent: 750,
          additionalCosts: 180
        },
        { 
          id: "102", 
          name: "Wohnung 1B", 
          area: 85, 
          rooms: 3, 
          status: "rented", 
          tenant: "Anna Schmidt",
          baseRent: 950,
          additionalCosts: 220
        },
        { 
          id: "103", 
          name: "Wohnung 2A", 
          area: 75, 
          rooms: 2, 
          status: "vacant", 
          tenant: null,
          baseRent: 850,
          additionalCosts: 200
        },
        { 
          id: "104", 
          name: "Wohnung 2B", 
          area: 95, 
          rooms: 4, 
          status: "rented", 
          tenant: "Familie Müller",
          baseRent: 1100,
          additionalCosts: 250
        },
      ]
    },
    {
      id: "2",
      name: "Stadthaus Grüner Weg",
      address: "Grüner Weg 15, 10115 Berlin",
      buildYear: 2005,
      renovationYear: 2020,
      units: 8,
      totalArea: 720,
      monthlyRent: 11200,
      owner: "Wohnbau AG",
      image: "/images/rect.png",
      units_list: [
        { 
          id: "201", 
          name: "Wohnung 1", 
          area: 80, 
          rooms: 3, 
          status: "rented", 
          tenant: "Julia Weber",
          baseRent: 900,
          additionalCosts: 210
        },
        { 
          id: "202", 
          name: "Wohnung 2", 
          area: 95, 
          rooms: 4, 
          status: "rented", 
          tenant: "Thomas Becker",
          baseRent: 1050,
          additionalCosts: 240
        },
      ]
    }
  ],
  wegVerwaltung: [
    {
      id: "3",
      name: "Eigentümergemeinschaft Parkblick",
      address: "Parkstraße 78, 10178 Berlin",
      buildYear: 2010,
      renovationYear: null,
      units: 24,
      totalArea: 2150,
      monthlyFee: 4800,
      image: "/images/rect.png",
      units_list: [
        { 
          id: "301", 
          name: "Wohnung 1A", 
          area: 75, 
          rooms: 3, 
          status: "self-occupied", 
          owner: "Dr. Klaus Schmidt",
          baseRent: 0,
          additionalCosts: 180
        },
        { 
          id: "302", 
          name: "Wohnung 1B", 
          area: 65, 
          rooms: 2, 
          status: "rented", 
          owner: "Sabine Müller", 
          tenant: "Peter Wagner",
          baseRent: 750,
          additionalCosts: 170
        },
        { 
          id: "303", 
          name: "Wohnung 2A", 
          area: 90, 
          rooms: 4, 
          status: "self-occupied", 
          owner: "Familie Hoffmann",
          baseRent: 0,
          additionalCosts: 210
        },
      ]
    },
    {
      id: "4",
      name: "WEG Seeblick",
      address: "Seestraße 120, 13353 Berlin",
      buildYear: 2015,
      renovationYear: null,
      units: 18,
      totalArea: 1650,
      monthlyFee: 3600,
      image: "/images/rect.png",
      units_list: [
        { 
          id: "401", 
          name: "Wohnung 1", 
          area: 85, 
          rooms: 3, 
          status: "rented", 
          owner: "Markus Fischer", 
          tenant: "Laura König",
          baseRent: 950,
          additionalCosts: 220
        },
        { 
          id: "402", 
          name: "Wohnung 2", 
          area: 110, 
          rooms: 4, 
          status: "self-occupied", 
          owner: "Familie Schneider",
          baseRent: 0,
          additionalCosts: 260
        },
      ]
    }
  ]
};

export default function UnitDetail() {
  const router = useRouter();
  const { id, unitId, type } = router.query;
  
  // Determine which property list to use based on the type
  const propertyList = type === "hausverwaltung" ? properties.hausverwaltung : properties.wegVerwaltung;
  
  // Find the property with the matching ID
  const property = propertyList?.find(p => p.id === id);
  
  // Find the unit with the matching ID
  const unit = property?.units_list?.find(u => u.id === unitId);
  
  // State for tenant form
  const [tenantName, setTenantName] = useState(unit?.tenant || "");
  const [tenantEmail, setTenantEmail] = useState("");
  const [tenantPhone, setTenantPhone] = useState("");
  
  // State for meter readings
  const [waterMeter, setWaterMeter] = useState("");
  const [electricityMeter, setElectricityMeter] = useState("");
  const [heatingMeter, setHeatingMeter] = useState("");
  
  if (!property || !unit) {
    return (
      <div className="bg-background min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <Link href={`/liegenschaften/${id}?type=${type}`} className="flex items-center text-primary mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück zur Liegenschaft
            </Link>
            <div className="text-center py-12">
              <Home className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h1 className="text-2xl font-bold mb-2">Einheit nicht gefunden</h1>
              <p className="text-muted-foreground mb-6">Die gesuchte Einheit konnte nicht gefunden werden.</p>
              <Button onClick={() => router.push(`/liegenschaften/${id}?type=${type}`)}>
                Zurück zur Liegenschaft
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{unit.name} | {property.name} | Immobilienverwaltung</title>
        <meta name="description" content={`Details zu ${unit.name} in ${property.name}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-background min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <Link href={`/liegenschaften/${id}?type=${type}`} className="flex items-center text-primary mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück zur Liegenschaft
            </Link>
            
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">{unit.name}</h1>
              <p className="text-muted-foreground">{property.name} • {property.address}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Basisdaten</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fläche</span>
                      <span className="font-medium">{unit.area} m²</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Zimmer</span>
                      <span className="font-medium">{unit.rooms}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <span className={`font-medium ${
                        unit.status === "vacant" 
                          ? "text-red-500" 
                          : unit.status === "self-occupied" 
                            ? "text-blue-500" 
                            : "text-green-500"
                      }`}>
                        {unit.status === "vacant" 
                          ? "Leerstand" 
                          : unit.status === "self-occupied" 
                            ? "Selbstbewohnt" 
                            : "Vermietet"}
                      </span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Kaltmiete</span>
                      <span className="font-medium">{unit.baseRent} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nebenkosten</span>
                      <span className="font-medium">{unit.additionalCosts} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gesamtmiete</span>
                      <span className="font-medium">{unit.baseRent + unit.additionalCosts} €</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {type === "wegVerwaltung" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Eigentümer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name</span>
                        <span className="font-medium">{unit.owner}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <Tabs defaultValue="tenant" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="tenant">Mieter</TabsTrigger>
                <TabsTrigger value="meters">Zählerstände</TabsTrigger>
                <TabsTrigger value="documents">Dokumente</TabsTrigger>
              </TabsList>
              
              <TabsContent value="tenant">
                <Card>
                  <CardHeader>
                    <CardTitle>Mieterdaten</CardTitle>
                    <CardDescription>
                      Informationen zum aktuellen Mieter
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="tenant-name">Name</Label>
                          <Input 
                            id="tenant-name" 
                            value={tenantName} 
                            onChange={(e) => setTenantName(e.target.value)} 
                            placeholder="Name des Mieters"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="tenant-email">E-Mail</Label>
                          <Input 
                            id="tenant-email" 
                            type="email" 
                            value={tenantEmail} 
                            onChange={(e) => setTenantEmail(e.target.value)} 
                            placeholder="E-Mail-Adresse"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="tenant-phone">Telefon</Label>
                          <Input 
                            id="tenant-phone" 
                            value={tenantPhone} 
                            onChange={(e) => setTenantPhone(e.target.value)} 
                            placeholder="Telefonnummer"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Speichern</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="meters">
                <Card>
                  <CardHeader>
                    <CardTitle>Zählerstände</CardTitle>
                    <CardDescription>
                      Aktuelle Zählerstände der Einheit
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="water-meter">Wasserzähler</Label>
                          <Input 
                            id="water-meter" 
                            value={waterMeter} 
                            onChange={(e) => setWaterMeter(e.target.value)} 
                            placeholder="Zählerstand in m³"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="electricity-meter">Stromzähler</Label>
                          <Input 
                            id="electricity-meter" 
                            value={electricityMeter} 
                            onChange={(e) => setElectricityMeter(e.target.value)} 
                            placeholder="Zählerstand in kWh"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="heating-meter">Heizungszähler</Label>
                          <Input 
                            id="heating-meter" 
                            value={heatingMeter} 
                            onChange={(e) => setHeatingMeter(e.target.value)} 
                            placeholder="Zählerstand"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Speichern</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="documents">
                <Card>
                  <CardHeader>
                    <CardTitle>Dokumente</CardTitle>
                    <CardDescription>
                      Dokumente zu dieser Einheit
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">Keine Dokumente vorhanden</p>
                      <Button>Dokument hinzufügen</Button>
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