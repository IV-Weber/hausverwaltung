import React, { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Header from "@/components/Header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, Home, MapPin, Calendar, Euro, ArrowLeft, Plus, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

export default function PropertyDetail() {
  const router = useRouter();
  const { id, type } = router.query;
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>();
  
  // Function to handle status change
  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
  };
  
  // Determine which property list to use based on the type
  const propertyList = type === "hausverwaltung" ? properties.hausverwaltung : properties.wegVerwaltung;
  
  // Find the property with the matching ID
  const property = propertyList?.find(p => p.id === id);
  
  if (!property) {
    return (
      <div className="bg-background min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <Link href="/liegenschaften" className="flex items-center text-primary mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück zur Übersicht
            </Link>
            <div className="text-center py-12">
              <Building className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h1 className="text-2xl font-bold mb-2">Liegenschaft nicht gefunden</h1>
              <p className="text-muted-foreground mb-6">Die gesuchte Liegenschaft konnte nicht gefunden werden.</p>
              <Button onClick={() => router.push("/liegenschaften")}>
                Zurück zur Übersicht
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
        <title>{property.name} | Immobilienverwaltung</title>
        <meta name="description" content={`Details zu ${property.name}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-background min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <Link href="/liegenschaften" className="flex items-center text-primary mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück zur Übersicht
            </Link>
            
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="md:w-1/3">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-4">
                  <img 
                    src={property.image} 
                    alt={property.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="md:w-2/3">
                <h1 className="text-3xl font-bold mb-2">{property.name}</h1>
                <div className="flex items-center text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{property.address}</span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Baujahr</p>
                    <p className="font-medium">{property.buildYear}</p>
                  </div>
                  {property.renovationYear && (
                    <div>
                      <p className="text-sm text-muted-foreground">Sanierung</p>
                      <p className="font-medium">{property.renovationYear}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Einheiten</p>
                    <p className="font-medium">{property.units}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Gesamtfläche</p>
                    <p className="font-medium">{property.totalArea} m²</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {type === "hausverwaltung" ? "Monatliche Miete" : "Monatliche Umlage"}
                    </p>
                    <p className="font-medium">
                      {type === "hausverwaltung" 
                        ? `${property.monthlyRent} €` 
                        : `${property.monthlyFee} €`}
                    </p>
                  </div>
                  {type === "hausverwaltung" && property.owner && (
                    <div>
                      <p className="text-sm text-muted-foreground">Eigentümer</p>
                      <p className="font-medium">{property.owner}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="units" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="units">Einheiten</TabsTrigger>
                <TabsTrigger value="documents">Dokumente</TabsTrigger>
                <TabsTrigger value="maintenance">Instandhaltung</TabsTrigger>
                {type === "wegVerwaltung" && (
                  <TabsTrigger value="meetings">Versammlungen</TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="units">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Einheiten</CardTitle>
                      <CardDescription>
                        Übersicht aller Einheiten in dieser Liegenschaft
                      </CardDescription>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="gap-1">
                          <Plus className="h-4 w-4" /> Einheit hinzufügen
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Neue Einheit hinzufügen</DialogTitle>
                          <DialogDescription>
                            Fügen Sie eine neue Einheit zu dieser Liegenschaft hinzu.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                              Name
                            </Label>
                            <Input id="name" placeholder="z.B. Wohnung 3A" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="area" className="text-right">
                              Fläche (m²)
                            </Label>
                            <Input id="area" type="number" placeholder="75" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="rooms" className="text-right">
                              Zimmer
                            </Label>
                            <Input id="rooms" type="number" placeholder="3" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="baseRent" className="text-right">
                              Kaltmiete (€)
                            </Label>
                            <Input id="baseRent" type="number" placeholder="850" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="additionalCosts" className="text-right">
                              Nebenkosten (€)
                            </Label>
                            <Input id="additionalCosts" type="number" placeholder="200" className="col-span-3" />
                          </div>
                          
                          {/* Ausstattung: Küche und Bad */}
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">
                              Ausstattung
                            </Label>
                            <div className="col-span-3 flex space-x-4">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id="hasKitchen"
                                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <Label htmlFor="hasKitchen" className="text-sm font-normal">
                                  Küche
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id="hasBathroom"
                                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <Label htmlFor="hasBathroom" className="text-sm font-normal">
                                  Bad
                                </Label>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right">
                              Status
                            </Label>
                            <Select id="status" onValueChange={handleStatusChange}>
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Status auswählen" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="vacant">Leerstand</SelectItem>
                                <SelectItem value="rented">Vermietet</SelectItem>
                                {type === "wegVerwaltung" && (
                                  <SelectItem value="self-occupied">Selbstbewohnt</SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          {/* Conditional tenant fields */}
                          <div id="tenantFields" className={`space-y-4 ${selectedStatus === 'rented' ? 'block' : 'hidden'}`}>
                            <Separator className="my-2" />
                            <h4 className="font-medium">Mieterdaten</h4>
                            
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="tenantName" className="text-right">
                                Name
                              </Label>
                              <Input id="tenantName" placeholder="Name des Mieters" className="col-span-3" />
                            </div>
                            
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="tenantEmail" className="text-right">
                                E-Mail
                              </Label>
                              <Input id="tenantEmail" type="email" placeholder="E-Mail-Adresse" className="col-span-3" />
                            </div>
                            
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="tenantPhone" className="text-right">
                                Telefon
                              </Label>
                              <Input id="tenantPhone" placeholder="Telefonnummer" className="col-span-3" />
                            </div>
                            
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="tenantStartDate" className="text-right">
                                Mietbeginn
                              </Label>
                              <Input id="tenantStartDate" type="date" className="col-span-3" />
                            </div>
                          </div>
                          
                          {type === "wegVerwaltung" && (
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="owner" className="text-right">
                                Eigentümer
                              </Label>
                              <Input id="owner" placeholder="Name des Eigentümers" className="col-span-3" />
                            </div>
                          )}
                        </div>
                        <DialogFooter>
                          <Button type="submit">Einheit hinzufügen</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    {property.units_list.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {property.units_list.map((unit) => (
                          <Card 
                            key={unit.id} 
                            className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => router.push({
                              pathname: `/liegenschaften/${id}/units/${unit.id}`,
                              query: { type }
                            })}
                          >
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">{unit.name}</CardTitle>
                              <CardDescription>
                                {unit.area} m² • {unit.rooms} {unit.rooms === 1 ? "Zimmer" : "Zimmer"}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Status</span>
                                  <span className={`text-sm font-medium ${
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
                                
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Kaltmiete</span>
                                  <span className="text-sm font-medium">{unit.baseRent} €</span>
                                </div>
                                
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Nebenkosten</span>
                                  <span className="text-sm font-medium">{unit.additionalCosts} €</span>
                                </div>
                                
                                {type === "wegVerwaltung" && (
                                  <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Eigentümer</span>
                                    <span className="text-sm font-medium">{unit.owner}</span>
                                  </div>
                                )}
                                
                                {unit.tenant && (
                                  <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Mieter</span>
                                    <span className="text-sm font-medium">{unit.tenant}</span>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                            <CardFooter className="pt-0 flex justify-end">
                              <Button variant="ghost" size="sm">Details</Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Home className="h-12 w-12 mx-auto text-muted-foreground" />
                        <p className="mt-4 text-muted-foreground">Keine Einheiten vorhanden</p>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="mt-4 gap-1">
                              <Plus className="h-4 w-4" /> Einheit hinzufügen
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Neue Einheit hinzufügen</DialogTitle>
                              <DialogDescription>
                                Fügen Sie eine neue Einheit zu dieser Liegenschaft hinzu.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                  Name
                                </Label>
                                <Input id="name" placeholder="z.B. Wohnung 3A" className="col-span-3" />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="area" className="text-right">
                                  Fläche (m²)
                                </Label>
                                <Input id="area" type="number" placeholder="75" className="col-span-3" />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="rooms" className="text-right">
                                  Zimmer
                                </Label>
                                <Input id="rooms" type="number" placeholder="3" className="col-span-3" />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="baseRent" className="text-right">
                                  Kaltmiete (€)
                                </Label>
                                <Input id="baseRent" type="number" placeholder="850" className="col-span-3" />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="additionalCosts" className="text-right">
                                  Nebenkosten (€)
                                </Label>
                                <Input id="additionalCosts" type="number" placeholder="200" className="col-span-3" />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="status" className="text-right">
                                  Status
                                </Label>
                                <Select>
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Status auswählen" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="vacant">Leerstand</SelectItem>
                                    <SelectItem value="rented">Vermietet</SelectItem>
                                    {type === "wegVerwaltung" && (
                                      <SelectItem value="self-occupied">Selbstbewohnt</SelectItem>
                                    )}
                                  </SelectContent>
                                </Select>
                              </div>
                              {type === "wegVerwaltung" && (
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="owner" className="text-right">
                                    Eigentümer
                                  </Label>
                                  <Input id="owner" placeholder="Name des Eigentümers" className="col-span-3" />
                                </div>
                              )}
                            </div>
                            <DialogFooter>
                              <Button type="submit">Einheit hinzufügen</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="documents">
                <Card>
                  <CardHeader>
                    <CardTitle>Dokumente</CardTitle>
                    <CardDescription>Dokumente zu dieser Liegenschaft</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="mt-4 text-muted-foreground">Keine Dokumente vorhanden</p>
                      <Button className="mt-4">Dokument hinzufügen</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="maintenance">
                <Card>
                  <CardHeader>
                    <CardTitle>Instandhaltung</CardTitle>
                    <CardDescription>Instandhaltungsmaßnahmen und Reparaturen</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Building className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="mt-4 text-muted-foreground">Keine Instandhaltungsmaßnahmen vorhanden</p>
                      <Button className="mt-4">Maßnahme hinzufügen</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {type === "wegVerwaltung" && (
                <TabsContent value="meetings">
                  <Card>
                    <CardHeader>
                      <CardTitle>Eigentümerversammlungen</CardTitle>
                      <CardDescription>Protokolle und Beschlüsse</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 mx-auto text-muted-foreground" />
                        <p className="mt-4 text-muted-foreground">Keine Versammlungen vorhanden</p>
                        <Button className="mt-4">Versammlung hinzufügen</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </main>
      </div>
    </>
  );
}