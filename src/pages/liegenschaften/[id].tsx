import React, { useState, useEffect } from "react";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { UnitStatus, UnitType } from '@prisma/client'; // Assuming these enums exist

// Define types for property data and statistics
interface Unit {
  id: string;
  name: string;
  area: number;
  rooms: number;
  status: string; 
  tenant?: string | null;
  owner?: string | null;
  baseRent: number;
  additionalCosts: number;
}

interface PropertyData {
  id: string;
  name: string;
  address: string;
  buildYear: number | null;
  renovationYear?: number | null;
  units: number; 
  totalArea: number; 
  monthlyRent?: number; 
  monthlyFee?: number; 
  owner?: string | null; 
  image?: string;
  units_list: Unit[];
  type: 'hausverwaltung' | 'wegVerwaltung'; 
}

interface PropertyStatistics {
  totalUnits: number;
  residentialUnits: number;
  commercialUnits: number;
  rentedUnits: number;
  vacantUnits: number;
  selfOccupiedUnits: number;
  totalArea: number;
}

const MOCK_PROPERTIES_DATA_SOURCE = {
  hausverwaltung: [
    {
      id: "1",
      name: "Wohnanlage Sonnenblick",
      type: "hausverwaltung" as "hausverwaltung",
      address: "Sonnenallee 42, 10435 Berlin",
      buildYear: 1998,
      renovationYear: 2015,
      units: 12,
      totalArea: 980,
      monthlyRent: 14500,
      owner: "Immobilien GmbH Berlin",
      image: "/images/rect.png",
      units_list: [
        { id: "101", name: "Wohnung 1A", area: 65, rooms: 2, status: "rented", tenant: "Max Mustermann", baseRent: 750, additionalCosts: 180 },
        { id: "102", name: "Wohnung 1B", area: 85, rooms: 3, status: "rented", tenant: "Anna Schmidt", baseRent: 950, additionalCosts: 220 },
      ]
    },
  ],
  wegVerwaltung: [
    {
      id: "3",
      name: "Eigentümergemeinschaft Parkblick",
      type: "wegVerwaltung" as "wegVerwaltung",
      address: "Parkstraße 78, 10178 Berlin",
      buildYear: 2010,
      units: 24, 
      totalArea: 2150, 
      monthlyFee: 4800,
      image: "/images/rect.png",
      units_list: [
        { id: "301", name: "Wohnung 1A", area: 75, rooms: 3, status: "self-occupied", owner: "Dr. Klaus Schmidt", baseRent: 0, additionalCosts: 180 },
      ]
    }
  ]
};

export default function PropertyDetail() {
  const router = useRouter();
  const { id, type: queryType } = router.query; 

  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [stats, setStats] = useState<PropertyStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedStatus, setSelectedStatus] = useState<string | undefined>();
  const [selectedTransactionType, setSelectedTransactionType] = useState<string>("expense");
  const [isSubmittingUnit, setIsSubmittingUnit] = useState(false);
  const [addUnitDialogOpen, setAddUnitDialogOpen] = useState(false);
  const [addDocumentDialogOpen, setAddDocumentDialogOpen] = useState(false);
  const [isSubmittingDocument, setIsSubmittingDocument] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id || typeof id !== 'string' || !queryType || typeof queryType !== 'string' || (queryType !== 'hausverwaltung' && queryType !== 'wegVerwaltung')) {
        setError("Ungültige Liegenschafts-ID oder Typ.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setPropertyData(null);
      setStats(null);

      try {
        const currentPropertyType = queryType as 'hausverwaltung' | 'wegVerwaltung';
        const basePropertyList = MOCK_PROPERTIES_DATA_SOURCE[currentPropertyType];
        const foundBaseProperty = basePropertyList.find(p => p.id === id);

        if (!foundBaseProperty) {
          setError("Liegenschaft nicht in Mock-Daten gefunden.");
          setLoading(false);
          return;
        }
        
        const initialPropertyData: PropertyData = {
            ...foundBaseProperty,
            type: currentPropertyType
        };
        setPropertyData(initialPropertyData);

        const statsRes = await fetch(`/api/statistics/property/${id}`);
        if (!statsRes.ok) {
          const errorData = await statsRes.json();
          throw new Error(errorData.error || `Statistiken konnten nicht geladen werden: ${statsRes.status}`);
        }
        const statsData: PropertyStatistics = await statsRes.json();
        setStats(statsData);

      } catch (err: any) {
        console.error("Fehler beim Laden der Liegenschaftsdetails oder Statistiken:", err);
        setError(err.message || "Ein unbekannter Fehler ist aufgetreten.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, queryType]);
  
  const handleUnitDialogStatusChange = (value: string) => {
    setSelectedStatus(value);
  };
  
  const handleTransactionTypeChange = (value: string) => {
    setSelectedTransactionType(value);
  };

  const handleAddUnitSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!propertyData) return;

    setIsSubmittingUnit(true);
    
    const formData = new FormData(event.currentTarget);
    const unitDataPayload: any = {
      propertyId: propertyData.id,
      name: formData.get("add-unit-name") as string,
      area: parseFloat(formData.get("add-unit-area") as string || "0"),
      rooms: parseInt(formData.get("add-unit-rooms") as string || "0", 10),
      status: selectedStatus as UnitStatus, // Relies on selectedStatus state
      type: UnitType.RESIDENTIAL, // Default, consider adding a form field for this
      baseRent: parseFloat(formData.get("add-unit-baseRent") as string || "0"),
      additionalCosts: parseFloat(formData.get("add-unit-additionalCosts") as string || "0"),
      hasKitchen: formData.get("add-unit-hasKitchen") === "on",
      hasBathroom: formData.get("add-unit-hasBathroom") === "on",
    };

    if (selectedStatus === UnitStatus.RENTED) {
        unitDataPayload.tenantName = formData.get("add-unit-tenantName") as string;
        unitDataPayload.tenantEmail = formData.get("add-unit-tenantEmail") as string;
        unitDataPayload.tenantPhone = formData.get("add-unit-tenantPhone") as string;
        unitDataPayload.tenantStartDate = formData.get("add-unit-tenantStartDate") as string;
    }
    if (propertyData.type === 'wegVerwaltung' && formData.get("add-unit-owner")) {
        unitDataPayload.ownerName = formData.get("add-unit-owner") as string;
    }

    if (!unitDataPayload.name || !unitDataPayload.status || isNaN(unitDataPayload.area) || unitDataPayload.area <= 0 || isNaN(unitDataPayload.rooms) || unitDataPayload.rooms <= 0) {
      alert("Bitte füllen Sie alle erforderlichen Felder für die Einheit korrekt aus (Name, Fläche > 0, Zimmer > 0, Status).");
      setIsSubmittingUnit(false);
      return;
    }

    try {
      const response = await fetch('/api/units/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(unitDataPayload),
      });

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.error || `Fehler beim Hinzufügen der Einheit: ${response.statusText}`);
      }

      const successResult = await response.json();
      alert(successResult.message);
      setAddUnitDialogOpen(false); 
      setSelectedStatus(undefined); // Reset status for next dialog opening
      
      // Refresh data by re-fetching
      // A more direct state update would be better for UX but this is simpler for now
      const currentPath = router.asPath;
      router.replace(currentPath, currentPath, { scroll: false });


    } catch (err: any) {
      console.error("Fehler beim Senden der Einheitendaten:", err);
      alert(`Fehler: ${err.message}`);
    } finally {
      setIsSubmittingUnit(false);
    }
  };

  const handleAddDocumentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!propertyData) return;

    setIsSubmittingDocument(true);
    const formData = new FormData(event.currentTarget);
    const documentData = {
      propertyId: propertyData.id,
      name: formData.get("doc-name") as string,
      type: formData.get("doc-type") as string,
      date: formData.get("doc-date") as string,
    };

    if (!documentData.name || !documentData.type) {
      alert("Bitte geben Sie Name und Typ des Dokuments an.");
      setIsSubmittingDocument(false);
      return;
    }

    try {
      const response = await fetch('/api/documents/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(documentData),
      });

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.error || `Fehler beim Hinzufügen des Dokuments: ${response.statusText}`);
      }
      const successResult = await response.json();
      alert(successResult.message);
      setAddDocumentDialogOpen(false);
      // Consider refreshing document list or propertyData if documents are part of it
      router.replace(router.asPath, undefined, { scroll: false });


    } catch (err: any) {
      console.error("Fehler beim Senden der Dokumentendaten:", err);
      alert(`Fehler: ${err.message}`);
    } finally {
      setIsSubmittingDocument(false);
    }
  };
  
  if (loading) {
    return (
      <div className="bg-background min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-6 flex items-center justify-center">
          <p>Lade Liegenschaftsdetails...</p>
        </main>
      </div>
    );
  }

  if (error) {
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
              <h1 className="text-2xl font-bold mb-2">Fehler</h1>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button onClick={() => router.push("/liegenschaften")}>
                Zurück zur Übersicht
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  if (!propertyData) {
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

  const renderAddUnitDialogContent = (formId: string) => (
    <form onSubmit={handleAddUnitSubmit} id={formId}>
      <DialogHeader>
        <DialogTitle>Neue Einheit hinzufügen</DialogTitle>
        <DialogDescription>
          Fügen Sie eine neue Einheit zu dieser Liegenschaft hinzu.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor={`${formId}-add-unit-name`} className="text-right">Name*</Label>
          <Input id={`${formId}-add-unit-name`} name="add-unit-name" placeholder="z.B. Wohnung 3A" className="col-span-3" required />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor={`${formId}-add-unit-area`} className="text-right">Fläche (m²)*</Label>
          <Input id={`${formId}-add-unit-area`} name="add-unit-area" type="number" step="0.01" placeholder="75" className="col-span-3" required />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor={`${formId}-add-unit-rooms`} className="text-right">Zimmer*</Label>
          <Input id={`${formId}-add-unit-rooms`} name="add-unit-rooms" type="number" placeholder="3" className="col-span-3" required />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor={`${formId}-add-unit-baseRent`} className="text-right">Kaltmiete (€)</Label>
          <Input id={`${formId}-add-unit-baseRent`} name="add-unit-baseRent" type="number" step="0.01" placeholder="850" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor={`${formId}-add-unit-additionalCosts`} className="text-right">Nebenkosten (€)</Label>
          <Input id={`${formId}-add-unit-additionalCosts`} name="add-unit-additionalCosts" type="number" step="0.01" placeholder="200" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Ausstattung</Label>
          <div className="col-span-3 flex space-x-4">
            <div className="flex items-center space-x-2">
              <Input type="checkbox" id={`${formId}-add-unit-hasKitchen`} name="add-unit-hasKitchen" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
              <Label htmlFor={`${formId}-add-unit-hasKitchen`} className="text-sm font-normal">Küche</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Input type="checkbox" id={`${formId}-add-unit-hasBathroom`} name="add-unit-hasBathroom" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
              <Label htmlFor={`${formId}-add-unit-hasBathroom`} className="text-sm font-normal">Bad</Label>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor={`${formId}-add-unit-status`} className="text-right">Status*</Label>
          <Select name="add-unit-status" onValueChange={handleUnitDialogStatusChange} value={selectedStatus} required>
            <SelectTrigger id={`${formId}-add-unit-status`} className="col-span-3">
              <SelectValue placeholder="Status auswählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={UnitStatus.VACANT}>Leerstand</SelectItem>
              <SelectItem value={UnitStatus.RENTED}>Vermietet</SelectItem>
              {propertyData.type === "wegVerwaltung" && (
                <SelectItem value={UnitStatus.SELF_OCCUPIED}>Selbstbewohnt</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        <div id={`${formId}-tenantFields`} className={`space-y-4 ${selectedStatus === UnitStatus.RENTED ? 'block' : 'hidden'}`}>
          <Separator className="my-2" />
          <h4 className="font-medium">Mieterdaten</h4>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={`${formId}-add-unit-tenantName`} className="text-right">Name</Label>
            <Input id={`${formId}-add-unit-tenantName`} name="add-unit-tenantName" placeholder="Name des Mieters" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={`${formId}-add-unit-tenantEmail`} className="text-right">E-Mail</Label>
            <Input id={`${formId}-add-unit-tenantEmail`} name="add-unit-tenantEmail" type="email" placeholder="E-Mail-Adresse" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={`${formId}-add-unit-tenantPhone`} className="text-right">Telefon</Label>
            <Input id={`${formId}-add-unit-tenantPhone`} name="add-unit-tenantPhone" placeholder="Telefonnummer" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={`${formId}-add-unit-tenantStartDate`} className="text-right">Mietbeginn</Label>
            <Input id={`${formId}-add-unit-tenantStartDate`} name="add-unit-tenantStartDate" type="date" className="col-span-3" />
          </div>
        </div>
        {propertyData.type === "wegVerwaltung" && (
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={`${formId}-add-unit-owner`} className="text-right">Eigentümer</Label>
            <Input id={`${formId}-add-unit-owner`} name="add-unit-owner" placeholder="Name des Eigentümers" className="col-span-3" />
          </div>
        )}
      </div>
      <DialogFooter>
        <Button type="submit" disabled={isSubmittingUnit}>
          {isSubmittingUnit ? "Wird hinzugefügt..." : "Einheit hinzufügen"}
        </Button>
      </DialogFooter>
    </form>
  );

  return (
    <>
      <Head>
        <title>{propertyData.name} | Immobilienverwaltung</title>
        <meta name="description" content={`Details zu ${propertyData.name}`} />
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
                    src={propertyData.image || '/images/rect.png'} 
                    alt={propertyData.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="md:w-2/3">
                <h1 className="text-3xl font-bold mb-2">{propertyData.name}</h1>
                <div className="flex items-center text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{propertyData.address}</span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Baujahr</p>
                    <p className="font-medium">{propertyData.buildYear ?? 'N/A'}</p>
                  </div>
                  {propertyData.renovationYear && (
                    <div>
                      <p className="text-sm text-muted-foreground">Sanierung</p>
                      <p className="font-medium">{propertyData.renovationYear}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Einheiten</p>
                    <p className="font-medium">{stats?.totalUnits ?? '...'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Gesamtfläche</p>
                    <p className="font-medium">{stats?.totalArea ?? '...'} m²</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {propertyData.type === "hausverwaltung" ? "Monatliche Miete" : "Hausgeldzahlungen"}
                    </p>
                    <p className="font-medium">
                      {propertyData.type === "hausverwaltung" 
                        ? `${propertyData.monthlyRent ?? 0} €` 
                        : `${propertyData.monthlyFee ?? 0} €`}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Verkehrswert</p>
                    <p className="font-medium">1.850.000 €</p> {/* Placeholder */}
                  </div>
                  {propertyData.type === "hausverwaltung" ? (
                    <div>
                      <p className="text-sm text-muted-foreground">Rendite</p>
                      <p className="font-medium">4,2 %</p> {/* Placeholder */}
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-muted-foreground">Miteigentumsanteile</p>
                      <p className="font-medium">1000/1000</p> {/* Placeholder */}
                    </div>
                  )}
                  {propertyData.type === "hausverwaltung" && propertyData.owner ? (
                    <div>
                      <p className="text-sm text-muted-foreground">Eigentümer</p>
                      <p className="font-medium">{propertyData.owner}</p>
                    </div>
                  ) : propertyData.type === "wegVerwaltung" && (
                    <div>
                      <p className="text-sm text-muted-foreground">Anzahl Eigentümer</p>
                      <p className="font-medium">{stats?.totalUnits ?? '...'}</p> 
                    </div>
                  )}
                   {stats && (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground">Wohneinheiten</p>
                        <p className="font-medium">{stats.residentialUnits}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Gewerbeeinheiten</p>
                        <p className="font-medium">{stats.commercialUnits}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Vermietet</p>
                        <p className="font-medium">{stats.rentedUnits}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Leerstand</p>
                        <p className="font-medium">{stats.vacantUnits}</p>
                      </div>
                      {propertyData.type === "wegVerwaltung" && (
                        <div>
                          <p className="text-sm text-muted-foreground">Selbstbewohnt</p>
                          <p className="font-medium">{stats.selfOccupiedUnits}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="units" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="units">Einheiten ({stats?.totalUnits ?? '...'})</TabsTrigger>
                <TabsTrigger value="documents">Dokumente</TabsTrigger>
                <TabsTrigger value="maintenance">Instandhaltung</TabsTrigger>
                <TabsTrigger value="finances">Finanzen</TabsTrigger>
                <TabsTrigger value="statements">Abrechnungen</TabsTrigger>
                {propertyData.type === "wegVerwaltung" && (
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
                    <Dialog open={addUnitDialogOpen} onOpenChange={setAddUnitDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="gap-1" onClick={() => setAddUnitDialogOpen(true)} disabled={isSubmittingUnit}>
                          <Plus className="h-4 w-4" /> {isSubmittingUnit ? "Wird hinzugefügt..." : "Einheit hinzufügen"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        {renderAddUnitDialogContent("dialog-form-1")}
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    {propertyData.units_list && propertyData.units_list.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {propertyData.units_list
                          .slice() 
                          .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }))
                          .map((unit) => (
                          <Card 
                            key={unit.id} 
                            className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => router.push({
                              pathname: `/liegenschaften/${id}/units/${unit.id}`,
                              query: { type: propertyData.type }
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
                                {propertyData.type === "wegVerwaltung" ? (
                                  <>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-muted-foreground">Mieter</span>
                                      <span className="text-sm font-medium">{unit.tenant || (unit.status === "self-occupied" ? unit.owner : "—")}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-muted-foreground">Kaltmiete</span>
                                      <span className="text-sm font-medium">{unit.baseRent > 0 ? `${unit.baseRent} €` : "—"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-muted-foreground">Nebenkosten</span>
                                      <span className="text-sm font-medium">{unit.additionalCosts} €</span>
                                    </div>
                                    <Separator className="my-2" />
                                    <div className="flex justify-between">
                                      <span className="text-sm text-muted-foreground">Eigentümer</span>
                                      <span className="text-sm font-medium">{unit.owner}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-muted-foreground">Hausgeld</span>
                                      <span className="text-sm font-medium">{unit.additionalCosts} €</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-muted-foreground">Miteigentumsanteile</span>
                                      <span className="text-sm font-medium">-</span> {/* Placeholder */}
                                    </div>
                                  </>
                                ) : ( 
                                  <>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-muted-foreground">Status</span>
                                      <span className={`text-sm font-medium ${
                                        unit.status === "vacant" 
                                          ? "text-destructive" 
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
                                    {unit.tenant && (
                                      <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Mieter</span>
                                        <span className="text-sm font-medium">{unit.tenant}</span>
                                      </div>
                                    )}
                                  </>
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
                        <Dialog open={addUnitDialogOpen} onOpenChange={setAddUnitDialogOpen}>
                          <DialogTrigger asChild>
                            <Button className="mt-4 gap-1" onClick={() => setAddUnitDialogOpen(true)} disabled={isSubmittingUnit}>
                             <Plus className="h-4 w-4" /> {isSubmittingUnit ? "Wird hinzugefügt..." : "Einheit hinzufügen"}
                            </Button>
                          </DialogTrigger>
                          <DialogContent> 
                           {renderAddUnitDialogContent("dialog-form-2")}
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
                      <Dialog open={addDocumentDialogOpen} onOpenChange={setAddDocumentDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="mt-4" onClick={() => setAddDocumentDialogOpen(true)} disabled={isSubmittingDocument}>
                            {isSubmittingDocument ? "Wird hinzugefügt..." : "Dokument hinzufügen"}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <form onSubmit={handleAddDocumentSubmit}>
                            <DialogHeader>
                              <DialogTitle>Neues Dokument hinzufügen</DialogTitle>
                              <DialogDescription>
                                Fügen Sie Metadaten für ein neues Dokument hinzu. Der Datei-Upload wird hier nicht behandelt.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="doc-name" className="text-right">Name*</Label>
                                <Input id="doc-name" name="doc-name" placeholder="z.B. Mietvertrag Wohnung 1A" className="col-span-3" required />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="doc-type" className="text-right">Typ/Kategorie*</Label>
                                <Input id="doc-type" name="doc-type" placeholder="z.B. Mietvertrag, Protokoll" className="col-span-3" required />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="doc-date" className="text-right">Datum</Label>
                                <Input id="doc-date" name="doc-date" type="date" className="col-span-3" />
                              </div>
                              {/* Placeholder for file input if we were to handle uploads client-side
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="doc-file" className="text-right">Datei</Label>
                                <Input id="doc-file" name="doc-file" type="file" className="col-span-3" />
                              </div>
                              */}
                            </div>
                            <DialogFooter>
                              <Button type="submit" disabled={isSubmittingDocument}>
                                {isSubmittingDocument ? "Wird hinzugefügt..." : "Dokumentmetadaten hinzufügen"}
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
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
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="mt-4" onClick={() => alert("TODO: Implement add maintenance functionality")}>Maßnahme hinzufügen</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Neue Instandhaltungsmaßnahme hinzufügen</DialogTitle>
                            <DialogDescription>
                              Fügen Sie eine neue Instandhaltungsmaßnahme für diese Liegenschaft hinzu.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="maintenance-title" className="text-right">
                                Titel
                              </Label>
                              <Input
                                id="maintenance-title"
                                placeholder="z.B. Fassadenrenovierung"
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="maintenance-date" className="text-right">
                                Datum
                              </Label>
                              <Input
                                id="maintenance-date"
                                type="date"
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="maintenance-cost" className="text-right">
                                Kosten (€)
                              </Label>
                              <Input
                                id="maintenance-cost"
                                type="number"
                                placeholder="0.00"
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="maintenance-status" className="text-right">
                                Status
                              </Label>
                              <Select defaultValue="planned">
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Status auswählen" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="planned">Geplant</SelectItem>
                                  <SelectItem value="in-progress">In Bearbeitung</SelectItem>
                                  <SelectItem value="completed">Abgeschlossen</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="maintenance-description" className="text-right">
                                Beschreibung
                              </Label>
                              <Textarea
                                id="maintenance-description"
                                placeholder="Detaillierte Beschreibung der Maßnahme"
                                className="col-span-3 min-h-[100px]"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit" onClick={() => alert("TODO: Implement add maintenance functionality")}>Maßnahme hinzufügen</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="finances">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Finanzübersicht</CardTitle>
                      <CardDescription>Finanzielle Übersicht der Liegenschaft</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-muted p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground mb-1">Monatliche Einnahmen</p>
                            <p className="text-2xl font-bold text-green-500"> 
                              {propertyData.type === "hausverwaltung" 
                                ? `${propertyData.monthlyRent ?? 0} €` 
                                : `${propertyData.monthlyFee ?? 0} €`}
                            </p>
                          </div>
                          <div className="bg-muted p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground mb-1">Offene Forderungen</p>
                            <p className="text-2xl font-bold text-red-500">1.250 €</p> {/* Placeholder */}
                          </div>
                        </div>
                        
                        <div className="pt-4">
                          <h3 className="text-lg font-medium mb-2">Einnahmen nach Einheiten</h3>
                          <div className="space-y-2">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  {propertyData.type === "wegVerwaltung" ? (
                                    <>
                                      <TableHead>Einheit</TableHead>
                                      <TableHead>Miteigentumsanteile</TableHead>
                                      <TableHead>Hausgeld</TableHead>
                                      <TableHead>Eigentümer</TableHead>
                                    </>
                                  ) : (
                                    <>
                                      <TableHead>Einheit</TableHead>
                                      <TableHead>Kaltmiete</TableHead>
                                      <TableHead>Nebenkosten</TableHead>
                                      <TableHead>Gesamt</TableHead>
                                    </>
                                  )}
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {propertyData.units_list.map((unit) => (
                                  <TableRow key={unit.id}>
                                    {propertyData.type === "wegVerwaltung" ? (
                                      <>
                                        <TableCell className="font-medium">{unit.name}</TableCell>
                                        <TableCell>-</TableCell> 
                                        <TableCell>{unit.additionalCosts} €</TableCell>
                                        <TableCell>{unit.owner}</TableCell>
                                      </>
                                    ) : (
                                      <>
                                        <TableCell className="font-medium">{unit.name}</TableCell>
                                        <TableCell>{unit.baseRent} €</TableCell>
                                        <TableCell>{unit.additionalCosts} €</TableCell>
                                        <TableCell className="font-medium">{unit.baseRent + unit.additionalCosts} €</TableCell>
                                      </>
                                    )}
                                  </TableRow>
                                ))}
                                <TableRow>
                                  {propertyData.type === "wegVerwaltung" ? (
                                    <>
                                      <TableCell className="font-bold">Gesamt</TableCell>
                                      <TableCell className="font-bold">1000/1000</TableCell> 
                                      <TableCell className="font-bold">
                                        {propertyData.units_list.reduce((sum, unit) => sum + unit.additionalCosts, 0)} €
                                      </TableCell>
                                      <TableCell></TableCell>
                                    </>
                                  ) : (
                                    <>
                                      <TableCell className="font-bold">Gesamt</TableCell>
                                      <TableCell className="font-bold">
                                        {propertyData.units_list.reduce((sum, unit) => sum + unit.baseRent, 0)} €
                                      </TableCell>
                                      <TableCell className="font-bold">
                                        {propertyData.units_list.reduce((sum, unit) => sum + unit.additionalCosts, 0)} €
                                      </TableCell>
                                      <TableCell className="font-bold">
                                        {propertyData.units_list.reduce((sum, unit) => sum + unit.baseRent + unit.additionalCosts, 0)} €
                                      </TableCell>
                                    </>
                                  )}
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Rechnungen</CardTitle>
                        <CardDescription>Verwaltung von Rechnungen</CardDescription>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" onClick={() => alert("TODO: Implement add transaction functionality")}>
                            <Plus className="mr-2 h-4 w-4" />
                            Buchung hinzufügen
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Neue Buchung hinzufügen</DialogTitle>
                            <DialogDescription>
                              Fügen Sie eine neue Buchung für diese Liegenschaft hinzu.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="transaction-type-dialog" className="text-right">
                                Buchungstyp
                              </Label>
                              <Select defaultValue="expense" onValueChange={handleTransactionTypeChange}>
                                <SelectTrigger id="transaction-type-dialog" className="col-span-3">
                                  <SelectValue placeholder="Buchungstyp auswählen" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="expense">Ausgabe</SelectItem>
                                  <SelectItem value="income">Einnahme</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="invoice-number-dialog" className="text-right">
                                Rechnungsnummer
                              </Label>
                              <Input
                                id="invoice-number-dialog"
                                placeholder="z.B. RE-12345"
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="invoice-date-dialog" className="text-right">
                                Rechnungsdatum
                              </Label>
                              <Input
                                id="invoice-date-dialog"
                                type="date"
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="invoice-amount-dialog" className="text-right">
                                Betrag (€)
                              </Label>
                              <Input
                                id="invoice-amount-dialog"
                                type="number"
                                placeholder="0.00"
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="invoice-vendor-dialog" className="text-right">
                                Dienstleister
                              </Label>
                              <Input
                                id="invoice-vendor-dialog"
                                placeholder="Name des Dienstleisters"
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="invoice-category-dialog" className="text-right">
                                Kategorie
                              </Label>
                              <Select>
                                <SelectTrigger id="invoice-category-dialog" className="col-span-3">
                                  <SelectValue placeholder="Kategorie auswählen" />
                                </SelectTrigger>
                                <SelectContent>
                                  {selectedTransactionType === "expense" ? (
                                    <>
                                      <SelectItem value="allocatable">umlegbar</SelectItem>
                                      <SelectItem value="non-allocatable">nicht umlegbar</SelectItem>
                                    </>
                                  ) : (
                                    <>
                                      <SelectItem value="credit">Gutschrift</SelectItem>
                                      <SelectItem value="refund">Rückbuchung</SelectItem>
                                      <SelectItem value="other">Sonstiges</SelectItem>
                                    </>
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="invoice-notes-dialog" className="text-right">
                                Notizen
                              </Label>
                              <Textarea
                                id="invoice-notes-dialog"
                                placeholder="Zusätzliche Informationen"
                                className="col-span-3"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit" onClick={() => alert("TODO: Implement add transaction functionality")}>Buchung hinzufügen</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <Euro className="h-12 w-12 mx-auto text-muted-foreground" />
                        <p className="mt-4 text-muted-foreground">Keine Rechnungen vorhanden</p>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="mt-4" onClick={() => alert("TODO: Implement add transaction functionality")}>
                              <Plus className="mr-2 h-4 w-4" />
                              Buchung hinzufügen
                            </Button>
                          </DialogTrigger>
                           <DialogContent> 
                            <DialogHeader>
                              <DialogTitle>Neue Buchung hinzufügen</DialogTitle>
                              <DialogDescription>
                                Fügen Sie eine neue Buchung für diese Liegenschaft hinzu.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4"> 
                              <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="transaction-type-dialog-2" className="text-right">
                                Buchungstyp
                              </Label>
                              <Select defaultValue="expense" onValueChange={handleTransactionTypeChange}>
                                <SelectTrigger id="transaction-type-dialog-2" className="col-span-3">
                                  <SelectValue placeholder="Buchungstyp auswählen" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="expense">Ausgabe</SelectItem>
                                  <SelectItem value="income">Einnahme</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="invoice-number-dialog-2" className="text-right">
                                  Rechnungsnummer
                                </Label>
                                <Input
                                  id="invoice-number-dialog-2"
                                  placeholder="z.B. RE-12345"
                                  className="col-span-3"
                                />
                              </div>
                               <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="invoice-date-dialog-2" className="text-right">
                                  Rechnungsdatum
                                </Label>
                                <Input
                                  id="invoice-date-dialog-2"
                                  type="date"
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="invoice-amount-dialog-2" className="text-right">
                                  Betrag (€)
                                </Label>
                                <Input
                                  id="invoice-amount-dialog-2"
                                  type="number"
                                  placeholder="0.00"
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="invoice-vendor-dialog-2" className="text-right">
                                  Dienstleister
                                </Label>
                                <Input
                                  id="invoice-vendor-dialog-2"
                                  placeholder="Name des Dienstleisters"
                                  className="col-span-3"
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="submit" onClick={() => alert("TODO: Implement add transaction functionality")}>Buchung hinzufügen</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>{propertyData.type === "wegVerwaltung" ? "Hausgeldeingänge" : "Mieteingänge"}</CardTitle>
                      <CardDescription>
                        {propertyData.type === "wegVerwaltung" 
                          ? "Übersicht der Hausgeldeingänge nach Einheiten" 
                          : "Übersicht der Mieteingänge nach Einheiten"}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Einheit</TableHead>
                            {propertyData.type === "wegVerwaltung" ? (
                              <TableHead>Eigentümer</TableHead>
                            ) : (
                              <TableHead>Mieter</TableHead>
                            )}
                            <TableHead>Betrag</TableHead>
                            <TableHead>Fälligkeit</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Aktionen</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {propertyData.type === "wegVerwaltung" ? (
                            propertyData.units_list.map((unit) => (
                              <TableRow key={unit.id}>
                                <TableCell className="font-medium">{unit.name}</TableCell>
                                <TableCell>{unit.owner}</TableCell>
                                <TableCell>{unit.additionalCosts} €</TableCell>
                                <TableCell>01.04.2025</TableCell> 
                                <TableCell>
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"> 
                                    Ausstehend
                                  </span>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button variant="outline" size="sm" onClick={() => alert("TODO: Implement payment status update")}>
                                    Als bezahlt markieren
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            propertyData.units_list
                              .filter(unit => unit.status === "rented")
                              .map((unit) => (
                                <TableRow key={unit.id}>
                                  <TableCell className="font-medium">{unit.name}</TableCell>
                                  <TableCell>{unit.tenant}</TableCell>
                                  <TableCell>{unit.baseRent + unit.additionalCosts} €</TableCell>
                                  <TableCell>01.04.2025</TableCell> 
                                  <TableCell>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"> 
                                      Ausstehend
                                    </span>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button variant="outline" size="sm" onClick={() => alert("TODO: Implement payment status update")}>
                                      Als bezahlt markieren
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="statements">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Abrechnungen</CardTitle>
                      <CardDescription>Erstellung und Verwaltung von Abrechnungen für die Liegenschaft</CardDescription>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="gap-1" onClick={() => alert("TODO: Implement create statement functionality")}>
                          <Plus className="h-4 w-4" /> Abrechnung erstellen
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Neue Abrechnung erstellen</DialogTitle>
                          <DialogDescription>
                            Erstellen Sie eine neue Abrechnung für diese Liegenschaft.
                          </DialogDescription>
                        </DialogHeader>
                        <form id="create-statement-form"> 
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="statement-type" className="text-right">
                                Abrechnungstyp
                              </Label>
                              <Select name="statementType" defaultValue="utilities">
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Typ auswählen" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="owner">Eigentümerabrechnung</SelectItem>
                                  <SelectItem value="utilities">Nebenkostenabrechnung</SelectItem>
                                  <SelectItem value="profit-loss">Gewinn- und Verlustrechnung (GUV)</SelectItem>
                                  {propertyData.type === "wegVerwaltung" && (
                                    <SelectItem value="wirtschaftsplan">Wirtschaftsplan</SelectItem>
                                  )}
                                  <SelectItem value="other">Sonstige Abrechnung</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="statement-period-start" className="text-right">
                                Zeitraum
                              </Label>
                              <div className="col-span-3 flex items-center gap-2">
                                <div className="flex-1">
                                  <Label htmlFor="statement-period-start" className="sr-only">
                                    Von
                                  </Label>
                                  <Input
                                    id="statement-period-start"
                                    name="periodStart"
                                    type="date"
                                    placeholder="Von"
                                    required
                                  />
                                </div>
                                <span className="text-muted-foreground">bis</span>
                                <div className="flex-1">
                                  <Label htmlFor="statement-period-end" className="sr-only">
                                    Bis
                                  </Label>
                                  <Input
                                    id="statement-period-end"
                                    name="periodEnd"
                                    type="date"
                                    placeholder="Bis"
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="statement-title" className="text-right">
                                Titel
                              </Label>
                              <Input
                                id="statement-title"
                                name="title"
                                placeholder="z.B. Nebenkostenabrechnung 2025"
                                className="col-span-3"
                              />
                            </div>
                            
                            <div className="mt-4 mb-2">
                              <h3 className="text-lg font-medium">Kostenpositionen</h3>
                              <p className="text-sm text-muted-foreground">Fügen Sie die Kostenpositionen für die Nebenkostenabrechnung hinzu.</p>
                            </div>
                            
                            <div className="space-y-4" id="cost-categories">
                              <div className="grid grid-cols-12 gap-2 items-center">
                                <Label className="col-span-3 font-medium">Kostenart</Label>
                                <Label className="col-span-2 font-medium">Betrag (€)</Label>
                                <Label className="col-span-3 font-medium">Umlageschlüssel</Label>
                                <Label className="col-span-3 font-medium">Heizkosten</Label>
                                <Label className="col-span-1 font-medium"></Label>
                              </div>
                              
                              <div className="grid grid-cols-12 gap-2 items-center cost-category-row">
                                <Input 
                                  name="costCategory[0].name" 
                                  placeholder="z.B. Grundsteuer" 
                                  className="col-span-3"
                                  required
                                />
                                <Input 
                                  name="costCategory[0].amount" 
                                  type="number" 
                                  placeholder="0.00" 
                                  className="col-span-2"
                                  required
                                />
                                <Select name="costCategory[0].allocationMethod" defaultValue="area">
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Umlageschlüssel" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="area">Nach Fläche</SelectItem>
                                    <SelectItem value="units">Nach Einheiten</SelectItem>
                                    <SelectItem value="consumption">Nach Verbrauch</SelectItem>
                                    <SelectItem value="custom">Individuell</SelectItem>
                                  </SelectContent>
                                </Select>
                                <div className="col-span-3 flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id="isHeatingCost-0"
                                    name="costCategory[0].isHeatingCost"
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                  />
                                  <Label htmlFor="isHeatingCost-0" className="text-sm font-normal">
                                    Heizkosten
                                  </Label>
                                </div>
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="icon" 
                                  className="col-span-1"
                                  onClick={() => {
                                    const row = document.querySelector('.cost-category-row');
                                    if (row) {
                                      const clone = row.cloneNode(true) as HTMLElement;
                                      const inputs = clone.querySelectorAll('input, select');
                                      const index = document.querySelectorAll('.cost-category-row').length;
                                      
                                      inputs.forEach(input => {
                                        const name = input.getAttribute('name');
                                        if (name) {
                                          input.setAttribute('name', name.replace('[0]', `[${index}]`));
                                        }
                                        if (input.id && input.id.includes('isHeatingCost')) {
                                          input.id = `isHeatingCost-${index}`;
                                          const label = clone.querySelector(`label[for="isHeatingCost-0"]`);
                                          if (label) {
                                            label.setAttribute('for', `isHeatingCost-${index}`);
                                          }
                                        }
                                        if (input.tagName.toLowerCase() !== 'select') {
                                          (input as HTMLInputElement).value = '';
                                        }
                                      });
                                      
                                      document.getElementById('cost-categories')?.appendChild(clone);
                                    }
                                  }}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-4 items-center gap-4 mt-4">
                              <Label htmlFor="statement-notes" className="text-right">
                                Notizen
                              </Label>
                              <Textarea
                                id="statement-notes"
                                name="notes"
                                placeholder="Zusätzliche Informationen zur Abrechnung"
                                className="col-span-3"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button 
                              type="button" 
                              onClick={async () => {
                                const form = document.getElementById('create-statement-form') as HTMLFormElement;
                                const formData = new FormData(form);
                                
                                const costCategories: any[] = [];
                                const entries = Array.from(formData.entries());
                                
                                const categoryEntries = entries.filter(([key]) => key.startsWith('costCategory'));
                                const indices = new Set<number>();
                                
                                categoryEntries.forEach(([key]) => {
                                  const match = key.match(/costCategory\[(\d+)\]/);
                                  if (match) {
                                    indices.add(parseInt(match[1]));
                                  }
                                });
                                
                                indices.forEach(index => {
                                  const name = formData.get(`costCategory[${index}].name`) as string;
                                  const amount = parseFloat(formData.get(`costCategory[${index}].amount`) as string);
                                  const allocationMethod = formData.get(`costCategory[${index}].allocationMethod`) as string;
                                  const isHeatingCost = formData.has(`costCategory[${index}].isHeatingCost`);
                                  
                                  if (name && !isNaN(amount)) {
                                    costCategories.push({
                                      id: Math.random().toString(36).substring(2, 15),
                                      name,
                                      amount,
                                      allocationMethod,
                                      isHeatingCost
                                    });
                                  }
                                });
                                
                                const data = {
                                  propertyId: id,
                                  type: formData.get('statementType'),
                                  title: formData.get('title'),
                                  periodStart: formData.get('periodStart'),
                                  periodEnd: formData.get('periodEnd'),
                                  costCategories,
                                  notes: formData.get('notes')
                                };
                                
                                try {
                                  const response = await fetch('/api/statements/create', {
                                    method: 'POST',
                                    headers: {
                                      'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(data),
                                  });
                                  
                                  const result = await response.json();
                                  
                                  if (result.success) {
                                    alert('Nebenkostenabrechnung wurde erfolgreich erstellt!');
                                    const closeButton = document.querySelector('#create-statement-form button[aria-label="Close"]'); // More specific close
                                    if (closeButton) {
                                      (closeButton as HTMLButtonElement).click();
                                    }
                                  } else {
                                    alert(`Fehler: ${result.message}`);
                                  }
                                } catch (error) {
                                  console.error('Error creating statement:', error);
                                  alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
                                }
                              }}
                            >
                              Abrechnung erstellen
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="mt-4 text-muted-foreground">Keine Abrechnungen vorhanden</p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="mt-4 gap-1" onClick={() => alert("TODO: Implement create statement functionality")}>
                            <Plus className="h-4 w-4" /> Abrechnung erstellen
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Neue Abrechnung erstellen</DialogTitle>
                            <DialogDescription>
                              Erstellen Sie eine neue Abrechnung für diese Liegenschaft.
                            </DialogDescription>
                          </DialogHeader>
                          <form id="create-statement-form-2"> 
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="statement-type-2" className="text-right">
                                  Abrechnungstyp
                                </Label>
                                <Select name="statementType" defaultValue="utilities">
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Typ auswählen" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="owner">Eigentümerabrechnung</SelectItem>
                                    <SelectItem value="utilities">Nebenkostenabrechnung</SelectItem>
                                    <SelectItem value="profit-loss">Gewinn- und Verlustrechnung (GUV)</SelectItem>
                                    {propertyData.type === "wegVerwaltung" && (
                                      <SelectItem value="wirtschaftsplan">Wirtschaftsplan</SelectItem>
                                    )}
                                    <SelectItem value="other">Sonstige Abrechnung</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="statement-period-start-2" className="text-right">
                                  Zeitraum
                                </Label>
                                <div className="col-span-3 flex items-center gap-2">
                                  <div className="flex-1">
                                    <Label htmlFor="statement-period-start-2" className="sr-only">
                                      Von
                                    </Label>
                                    <Input
                                      id="statement-period-start-2"
                                      name="periodStart"
                                      type="date"
                                      placeholder="Von"
                                      required
                                    />
                                  </div>
                                  <span className="text-muted-foreground">bis</span>
                                  <div className="flex-1">
                                    <Label htmlFor="statement-period-end-2" className="sr-only">
                                      Bis
                                    </Label>
                                    <Input
                                      id="statement-period-end-2"
                                      name="periodEnd"
                                      type="date"
                                      placeholder="Bis"
                                      required
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="statement-title-2" className="text-right">
                                  Titel
                                </Label>
                                <Input
                                  id="statement-title-2"
                                  name="title"
                                  placeholder="z.B. Nebenkostenabrechnung 2025"
                                  className="col-span-3"
                                />
                              </div>
                              
                              <div className="mt-4 mb-2">
                                <h3 className="text-lg font-medium">Kostenpositionen</h3>
                                <p className="text-sm text-muted-foreground">Fügen Sie die Kostenpositionen für die Nebenkostenabrechnung hinzu.</p>
                              </div>
                              
                              <div className="space-y-4" id="cost-categories-2">
                                <div className="grid grid-cols-12 gap-2 items-center">
                                  <Label className="col-span-3 font-medium">Kostenart</Label>
                                  <Label className="col-span-2 font-medium">Betrag (€)</Label>
                                  <Label className="col-span-3 font-medium">Umlageschlüssel</Label>
                                  <Label className="col-span-3 font-medium">Heizkosten</Label>
                                  <Label className="col-span-1 font-medium"></Label>
                                </div>
                                
                                <div className="grid grid-cols-12 gap-2 items-center cost-category-row-2">
                                  <Input 
                                    name="costCategory[0].name" 
                                    placeholder="z.B. Grundsteuer" 
                                    className="col-span-3"
                                    required
                                  />
                                  <Input 
                                    name="costCategory[0].amount" 
                                    type="number" 
                                    placeholder="0.00" 
                                    className="col-span-2"
                                    required
                                  />
                                  <Select name="costCategory[0].allocationMethod" defaultValue="area">
                                    <SelectTrigger className="col-span-3">
                                      <SelectValue placeholder="Umlageschlüssel" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="area">Nach Fläche</SelectItem>
                                      <SelectItem value="units">Nach Einheiten</SelectItem>
                                      <SelectItem value="consumption">Nach Verbrauch</SelectItem>
                                      <SelectItem value="custom">Individuell</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <div className="col-span-3 flex items-center space-x-2">
                                    <input
                                      type="checkbox"
                                      id="isHeatingCost-2-0"
                                      name="costCategory[0].isHeatingCost"
                                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <Label htmlFor="isHeatingCost-2-0" className="text-sm font-normal">
                                      Heizkosten
                                    </Label>
                                  </div>
                                  <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="icon" 
                                    className="col-span-1"
                                    onClick={() => {
                                      const row = document.querySelector('.cost-category-row-2');
                                      if (row) {
                                        const clone = row.cloneNode(true) as HTMLElement;
                                        const inputs = clone.querySelectorAll('input, select');
                                        const index = document.querySelectorAll('.cost-category-row-2').length;
                                        
                                        inputs.forEach(input => {
                                          const name = input.getAttribute('name');
                                          if (name) {
                                            input.setAttribute('name', name.replace('[0]', `[${index}]`));
                                          }
                                          if (input.id && input.id.includes('isHeatingCost-2')) {
                                            input.id = `isHeatingCost-2-${index}`;
                                            const label = clone.querySelector(`label[for="isHeatingCost-2-0"]`);
                                            if (label) {
                                              label.setAttribute('for', `isHeatingCost-2-${index}`);
                                            }
                                          }
                                          if (input.tagName.toLowerCase() !== 'select') {
                                            (input as HTMLInputElement).value = '';
                                          }
                                        });
                                        
                                        document.getElementById('cost-categories-2')?.appendChild(clone);
                                      }
                                    }}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-4 items-center gap-4 mt-4">
                                <Label htmlFor="statement-notes-2" className="text-right">
                                  Notizen
                                </Label>
                                <Textarea
                                  id="statement-notes-2"
                                  name="notes"
                                  placeholder="Zusätzliche Informationen zur Abrechnung"
                                  className="col-span-3"
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button 
                                type="button" 
                                onClick={async () => {
                                  const form = document.getElementById('create-statement-form-2') as HTMLFormElement;
                                  const formData = new FormData(form);
                                  
                                  const costCategories: any[] = [];
                                  const entries = Array.from(formData.entries());
                                  
                                  const categoryEntries = entries.filter(([key]) => key.startsWith('costCategory'));
                                  const indices = new Set<number>();
                                  
                                  categoryEntries.forEach(([key]) => {
                                    const match = key.match(/costCategory\[(\d+)\]/);
                                    if (match) {
                                      indices.add(parseInt(match[1]));
                                    }
                                  });
                                  
                                  indices.forEach(index => {
                                    const name = formData.get(`costCategory[${index}].name`) as string;
                                    const amount = parseFloat(formData.get(`costCategory[${index}].amount`) as string);
                                    const allocationMethod = formData.get(`costCategory[${index}].allocationMethod`) as string;
                                    const isHeatingCost = formData.has(`costCategory[${index}].isHeatingCost`);
                                    
                                    if (name && !isNaN(amount)) {
                                      costCategories.push({
                                        id: Math.random().toString(36).substring(2, 15),
                                        name,
                                        amount,
                                        allocationMethod,
                                        isHeatingCost
                                      });
                                    }
                                  });
                                  
                                  const data = {
                                    propertyId: id,
                                    type: formData.get('statementType'),
                                    title: formData.get('title'),
                                    periodStart: formData.get('periodStart'),
                                    periodEnd: formData.get('periodEnd'),
                                    costCategories,
                                    notes: formData.get('notes')
                                  };
                                  
                                  try {
                                    const response = await fetch('/api/statements/create', {
                                      method: 'POST',
                                      headers: {
                                        'Content-Type': 'application/json',
                                      },
                                      body: JSON.stringify(data),
                                    });
                                    
                                    const result = await response.json();
                                    
                                    if (result.success) {
                                      alert('Nebenkostenabrechnung wurde erfolgreich erstellt!');
                                      const closeButton = document.querySelector('#create-statement-form-2 button[aria-label="Close"]'); // More specific close
                                      if (closeButton) {
                                        (closeButton as HTMLButtonElement).click();
                                      }
                                    } else {
                                      alert(`Fehler: ${result.message}`);
                                    }
                                  } catch (error) {
                                    console.error('Error creating statement:', error);
                                    alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
                                  }
                                }}
                              >
                                Abrechnung erstellen
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {propertyData.type === "wegVerwaltung" && (
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
                        <Button className="mt-4" onClick={() => alert("TODO: Implement add meeting functionality")}>Versammlung hinzufügen</Button>
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