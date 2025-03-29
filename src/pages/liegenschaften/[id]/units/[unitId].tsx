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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, User, Gauge, Euro, Home, Plus, Edit, Trash2, Calendar } from "lucide-react";
import { meterTypes, unitOptions, Meter, MeterReading, generateId, formatMeterValue } from "@/util/meters";

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
  
  // State for meters management
  const [meters, setMeters] = useState<Meter[]>([
    {
      id: "water-1",
      name: "Wasserzähler",
      type: "water",
      unit: "m³",
      serialNumber: "WZ-12345",
      lastReading: 1250,
      lastReadingDate: "2025-03-15",
      readings: [
        { id: "wr-1", date: "2025-03-15", value: 1250, notes: "Jahresablesung" },
        { id: "wr-2", date: "2024-12-15", value: 1180, notes: "Quartalsablesung" },
        { id: "wr-3", date: "2024-09-15", value: 1120, notes: "Quartalsablesung" }
      ]
    },
    {
      id: "electricity-1",
      name: "Stromzähler",
      type: "electricity",
      unit: "kWh",
      serialNumber: "SZ-67890",
      lastReading: 8750,
      lastReadingDate: "2025-03-15",
      readings: [
        { id: "er-1", date: "2025-03-15", value: 8750, notes: "Jahresablesung" },
        { id: "er-2", date: "2024-12-15", value: 8200, notes: "Quartalsablesung" },
        { id: "er-3", date: "2024-09-15", value: 7600, notes: "Quartalsablesung" }
      ]
    },
    {
      id: "heating-1",
      name: "Heizungszähler",
      type: "heating",
      unit: "kWh",
      serialNumber: "HZ-54321",
      lastReading: 6500,
      lastReadingDate: "2025-03-15",
      readings: [
        { id: "hr-1", date: "2025-03-15", value: 6500, notes: "Jahresablesung" },
        { id: "hr-2", date: "2024-12-15", value: 5800, notes: "Quartalsablesung" },
        { id: "hr-3", date: "2024-09-15", value: 4900, notes: "Quartalsablesung" }
      ]
    }
  ]);
  
  // State for new meter form
  const [isAddMeterOpen, setIsAddMeterOpen] = useState(false);
  const [newMeterName, setNewMeterName] = useState("");
  const [newMeterType, setNewMeterType] = useState<MeterType>("water");
  const [newMeterUnit, setNewMeterUnit] = useState("m³");
  const [newMeterSerialNumber, setNewMeterSerialNumber] = useState("");
  const [newMeterLocation, setNewMeterLocation] = useState("");
  const [customUnit, setCustomUnit] = useState("");
  
  // State for new reading form
  const [isAddReadingOpen, setIsAddReadingOpen] = useState(false);
  const [selectedMeterId, setSelectedMeterId] = useState("");
  const [newReadingValue, setNewReadingValue] = useState("");
  const [newReadingDate, setNewReadingDate] = useState(new Date().toISOString().split("T")[0]);
  const [newReadingNotes, setNewReadingNotes] = useState("");
  
  // State for meter details dialog
  const [isViewMeterOpen, setIsViewMeterOpen] = useState(false);
  const [selectedMeter, setSelectedMeter] = useState<Meter | null>(null);
  
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
            
            <Tabs defaultValue={type === "wegVerwaltung" ? "owner" : "tenant"} className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="tenant">Mieter</TabsTrigger>
                {type === "wegVerwaltung" && (
                  <TabsTrigger value="owner">Eigentümer</TabsTrigger>
                )}
                <TabsTrigger value="meters">Zählerstände</TabsTrigger>
                <TabsTrigger value="documents">Dokumente</TabsTrigger>
                <TabsTrigger value="notes">Notizen</TabsTrigger>
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
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="tenant-start-date">Mietbeginn</Label>
                            <Input 
                              id="tenant-start-date" 
                              type="date"
                              placeholder="Mietbeginn"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="tenant-end-date">Mietende</Label>
                            <Input 
                              id="tenant-end-date" 
                              type="date"
                              placeholder="Mietende"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Speichern</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {type === "wegVerwaltung" && (
                <TabsContent value="owner">
                  <Card>
                    <CardHeader>
                      <CardTitle>Eigentümerdaten</CardTitle>
                      <CardDescription>
                        Informationen zum Eigentümer dieser Einheit
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="owner-name">Name</Label>
                            <Input 
                              id="owner-name" 
                              defaultValue={unit.owner || ""} 
                              placeholder="Name des Eigentümers"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="owner-address">Adresse</Label>
                            <Input 
                              id="owner-address" 
                              placeholder="Adresse des Eigentümers"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="owner-email">E-Mail</Label>
                            <Input 
                              id="owner-email" 
                              type="email" 
                              placeholder="E-Mail-Adresse"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="owner-phone">Telefon</Label>
                            <Input 
                              id="owner-phone" 
                              placeholder="Telefonnummer"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="owner-fee">Monatliche Hausgeldzahlungen (€)</Label>
                            <Input 
                              id="owner-fee" 
                              type="number"
                              defaultValue={unit.additionalCosts || 0}
                              placeholder="Monatliche Hausgeldzahlungen"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="owner-share">Miteigentumsanteil</Label>
                            <Input 
                              id="owner-share" 
                              placeholder="z.B. 125/1000"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="owner-since">Eigentümer seit</Label>
                              <Input 
                                id="owner-since" 
                                type="date"
                                placeholder="Eigentümer seit"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="owner-bank">Bankverbindung</Label>
                              <Input 
                                id="owner-bank" 
                                placeholder="IBAN"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button>Speichern</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              )}
              
              <TabsContent value="meters">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Zählerverwaltung</CardTitle>
                      <CardDescription>
                        Verwalten Sie die Zähler und Zählerstände dieser Einheit
                      </CardDescription>
                    </div>
                    <Dialog open={isAddMeterOpen} onOpenChange={setIsAddMeterOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="mr-2 h-4 w-4" />
                          Zähler hinzufügen
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Neuen Zähler hinzufügen</DialogTitle>
                          <DialogDescription>
                            Fügen Sie einen neuen Zähler für diese Einheit hinzu.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="meter-name" className="text-right">
                              Name
                            </Label>
                            <Input
                              id="meter-name"
                              value={newMeterName}
                              onChange={(e) => setNewMeterName(e.target.value)}
                              className="col-span-3"
                              placeholder="z.B. Hauptwasserzähler"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="meter-type" className="text-right">
                              Typ
                            </Label>
                            <Select 
                              value={newMeterType} 
                              onValueChange={(value) => {
                                setNewMeterType(value as any);
                                // Set default unit based on meter type
                                const defaultUnit = meterTypes.find(t => t.id === value)?.defaultUnit || "";
                                setNewMeterUnit(defaultUnit);
                              }}
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Zählertyp auswählen" />
                              </SelectTrigger>
                              <SelectContent>
                                {meterTypes.map((type) => (
                                  <SelectItem key={type.id} value={type.id}>
                                    {type.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="meter-unit" className="text-right">
                              Einheit
                            </Label>
                            <Select 
                              value={newMeterUnit === "custom" ? "custom" : newMeterUnit} 
                              onValueChange={(value) => {
                                setNewMeterUnit(value);
                                if (value !== "custom") {
                                  setCustomUnit("");
                                }
                              }}
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Einheit auswählen" />
                              </SelectTrigger>
                              <SelectContent>
                                {unitOptions.map((unit) => (
                                  <SelectItem key={unit.id} value={unit.name}>
                                    {unit.name} ({unit.description})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          {newMeterUnit === "custom" && (
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="custom-unit" className="text-right">
                                Benutzerdefiniert
                              </Label>
                              <Input
                                id="custom-unit"
                                value={customUnit}
                                onChange={(e) => setCustomUnit(e.target.value)}
                                className="col-span-3"
                                placeholder="z.B. kJ, kcal, etc."
                              />
                            </div>
                          )}
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="meter-serial" className="text-right">
                              Seriennummer
                            </Label>
                            <Input
                              id="meter-serial"
                              value={newMeterSerialNumber}
                              onChange={(e) => setNewMeterSerialNumber(e.target.value)}
                              className="col-span-3"
                              placeholder="z.B. SN-12345678"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="meter-location" className="text-right">
                              Standort
                            </Label>
                            <Input
                              id="meter-location"
                              value={newMeterLocation}
                              onChange={(e) => setNewMeterLocation(e.target.value)}
                              className="col-span-3"
                              placeholder="z.B. Keller, Flur, etc."
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsAddMeterOpen(false)}>
                            Abbrechen
                          </Button>
                          <Button onClick={() => {
                            const newMeter: Meter = {
                              id: generateId(),
                              name: newMeterName,
                              type: newMeterType,
                              unit: newMeterUnit === "custom" ? customUnit : newMeterUnit,
                              serialNumber: newMeterSerialNumber,
                              location: newMeterLocation,
                              readings: []
                            };
                            setMeters([...meters, newMeter]);
                            setIsAddMeterOpen(false);
                            // Reset form
                            setNewMeterName("");
                            setNewMeterType("water");
                            setNewMeterUnit("m³");
                            setNewMeterSerialNumber("");
                            setNewMeterLocation("");
                            setCustomUnit("");
                          }}>
                            Hinzufügen
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    {meters.length === 0 ? (
                      <div className="text-center py-8">
                        <Gauge className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-4">Keine Zähler vorhanden</p>
                        <Button onClick={() => setIsAddMeterOpen(true)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Zähler hinzufügen
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Typ</TableHead>
                              <TableHead>Letzter Stand</TableHead>
                              <TableHead>Datum</TableHead>
                              <TableHead>Einheit</TableHead>
                              <TableHead className="text-right">Aktionen</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {meters.map((meter) => (
                              <TableRow key={meter.id}>
                                <TableCell className="font-medium">{meter.name}</TableCell>
                                <TableCell>
                                  {meterTypes.find(t => t.id === meter.type)?.name || meter.type}
                                </TableCell>
                                <TableCell>{meter.lastReading || "–"}</TableCell>
                                <TableCell>{meter.lastReadingDate || "–"}</TableCell>
                                <TableCell>{meter.unit}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end space-x-2">
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => {
                                        setSelectedMeter(meter);
                                        setIsViewMeterOpen(true);
                                      }}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => {
                                        setSelectedMeterId(meter.id);
                                        setIsAddReadingOpen(true);
                                      }}
                                    >
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => {
                                        setMeters(meters.filter(m => m.id !== meter.id));
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Dialog for adding a new meter reading */}
                <Dialog open={isAddReadingOpen} onOpenChange={setIsAddReadingOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Neuen Zählerstand erfassen</DialogTitle>
                      <DialogDescription>
                        Erfassen Sie einen neuen Zählerstand für {meters.find(m => m.id === selectedMeterId)?.name}.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="reading-value" className="text-right">
                          Zählerstand
                        </Label>
                        <Input
                          id="reading-value"
                          type="number"
                          value={newReadingValue}
                          onChange={(e) => setNewReadingValue(e.target.value)}
                          className="col-span-3"
                          placeholder={`z.B. 1250 ${meters.find(m => m.id === selectedMeterId)?.unit || ''}`}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="reading-date" className="text-right">
                          Datum
                        </Label>
                        <Input
                          id="reading-date"
                          type="date"
                          value={newReadingDate}
                          onChange={(e) => setNewReadingDate(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="reading-notes" className="text-right">
                          Notizen
                        </Label>
                        <Textarea
                          id="reading-notes"
                          value={newReadingNotes}
                          onChange={(e) => setNewReadingNotes(e.target.value)}
                          className="col-span-3"
                          placeholder="z.B. Jahresablesung, Eigentümerwechsel, etc."
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddReadingOpen(false)}>
                        Abbrechen
                      </Button>
                      <Button onClick={() => {
                        const meterIndex = meters.findIndex(m => m.id === selectedMeterId);
                        if (meterIndex !== -1) {
                          const newReading: MeterReading = {
                            id: generateId(),
                            date: newReadingDate,
                            value: parseFloat(newReadingValue),
                            notes: newReadingNotes
                          };
                          
                          const updatedMeters = [...meters];
                          updatedMeters[meterIndex].readings = [
                            newReading,
                            ...updatedMeters[meterIndex].readings
                          ];
                          updatedMeters[meterIndex].lastReading = parseFloat(newReadingValue);
                          updatedMeters[meterIndex].lastReadingDate = newReadingDate;
                          
                          setMeters(updatedMeters);
                          setIsAddReadingOpen(false);
                          
                          // Reset form
                          setNewReadingValue("");
                          setNewReadingDate(new Date().toISOString().split("T")[0]);
                          setNewReadingNotes("");
                        }
                      }}>
                        Speichern
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                {/* Dialog for viewing meter details and history */}
                <Dialog open={isViewMeterOpen} onOpenChange={setIsViewMeterOpen}>
                  <DialogContent className="max-w-3xl">
                    {selectedMeter && (
                      <>
                        <DialogHeader>
                          <DialogTitle>{selectedMeter.name}</DialogTitle>
                          <DialogDescription>
                            {meterTypes.find(t => t.id === selectedMeter.type)?.name || selectedMeter.type} • 
                            {selectedMeter.serialNumber ? `SN: ${selectedMeter.serialNumber} • ` : ""}
                            {selectedMeter.location ? `Standort: ${selectedMeter.location}` : ""}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <h3 className="text-lg font-medium mb-2">Zählerhistorie</h3>
                          {selectedMeter.readings.length === 0 ? (
                            <p className="text-muted-foreground">Keine Zählerstände vorhanden</p>
                          ) : (
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Datum</TableHead>
                                  <TableHead>Zählerstand</TableHead>
                                  <TableHead>Verbrauch</TableHead>
                                  <TableHead>Notizen</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {selectedMeter.readings.map((reading, index) => {
                                  const prevReading = selectedMeter.readings[index + 1];
                                  const consumption = prevReading 
                                    ? Math.max(0, reading.value - prevReading.value)
                                    : null;
                                    
                                  return (
                                    <TableRow key={reading.id}>
                                      <TableCell>{reading.date}</TableCell>
                                      <TableCell>
                                        {reading.value} {selectedMeter.unit}
                                      </TableCell>
                                      <TableCell>
                                        {consumption !== null 
                                          ? `${consumption} ${selectedMeter.unit}`
                                          : "–"}
                                      </TableCell>
                                      <TableCell>{reading.notes || "–"}</TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          )}
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsViewMeterOpen(false)}>
                            Schließen
                          </Button>
                          <Button
                            onClick={() => {
                              setSelectedMeterId(selectedMeter.id);
                              setIsViewMeterOpen(false);
                              setIsAddReadingOpen(true);
                            }}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Zählerstand erfassen
                          </Button>
                        </DialogFooter>
                      </>
                    )}
                  </DialogContent>
                </Dialog>
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
              
              <TabsContent value="notes">
                <Card>
                  <CardHeader>
                    <CardTitle>Notizen</CardTitle>
                    <CardDescription>
                      Notizen zu dieser Einheit
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Textarea 
                        placeholder="Notizen zu dieser Einheit eingeben..." 
                        className="min-h-[200px]"
                      />
                      <Button>Speichern</Button>
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