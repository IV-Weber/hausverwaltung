import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, Home, Users, BarChart3, DoorClosed, UserCheck, MapPin, ArrowRight, Plus, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { useToast } from "@/components/ui/use-toast";

export default function Liegenschaften() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Form state for new property
  const [newProperty, setNewProperty] = useState({
    name: "",
    address: "",
    buildYear: new Date().getFullYear(),
    units: 0,
    owner: "",
    image: "/images/rect.png"
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProperty(prev => ({
      ...prev,
      [name]: name === "buildYear" || name === "units" ? parseInt(value) || 0 : value
    }));
  };

  // Handle add property
  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/properties/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newProperty,
          // Add type-specific fields
          ...(selectedType === "hausverwaltung" 
            ? { monthlyRent: 0 } 
            : { monthlyFee: 0 })
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // In a real app, we would update the properties list
        // For now, we'll just show a success message
        toast({
          title: "Objekt hinzugefügt",
          description: `${newProperty.name} wurde erfolgreich hinzugefügt.`,
        });
        
        // Reset form and close dialog
        setNewProperty({
          name: "",
          address: "",
          buildYear: new Date().getFullYear(),
          units: 0,
          owner: "",
          image: "/images/rect.png"
        });
        setIsAddDialogOpen(false);
        
        // Refresh the page to show the new property
        router.reload();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Failed to add property:", error);
      toast({
        title: "Fehler",
        description: "Das Objekt konnte nicht hinzugefügt werden. Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete property
  const handleDeleteProperty = async () => {
    if (!propertyToDelete) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/properties/remove?id=${propertyToDelete}&type=${selectedType === "hausverwaltung" ? "hausverwaltung" : "wegVerwaltung"}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Objekt entfernt",
          description: "Das Objekt wurde erfolgreich entfernt.",
        });
        
        // Reset state and close dialog
        setPropertyToDelete(null);
        setIsDeleteDialogOpen(false);
        
        // Refresh the page to update the properties list
        router.reload();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Failed to delete property:", error);
      toast({
        title: "Fehler",
        description: "Das Objekt konnte nicht entfernt werden. Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Prevent event propagation when clicking on delete button
  const handleDeleteClick = (e: React.MouseEvent, propertyId: string) => {
    e.stopPropagation();
    setPropertyToDelete(propertyId);
    setIsDeleteDialogOpen(true);
  };
  
  // Mock data for statistics
  const statistics = {
    hausverwaltung: {
      buildings: 5,
      units: 42,
      avgUnitsPerBuilding: 8.4,
      tenants: 38,
      rented: 38,
      vacant: 4,
      selfOccupied: 0
    },
    wegVerwaltung: {
      buildings: 7,
      units: 87,
      avgUnitsPerBuilding: 12.4,
      owners: 76,
      tenants: 68,
      rented: 68,
      vacant: 5,
      selfOccupied: 14
    }
  };
  
  // Mock data for properties
  const properties = {
    hausverwaltung: [
      {
        id: "1",
        name: "Wohnanlage Sonnenblick",
        address: "Sonnenallee 42, 10435 Berlin",
        buildYear: 1998,
        units: 12,
        image: "/images/rect.png",
        owner: "Immobilien GmbH Berlin"
      },
      {
        id: "2",
        name: "Stadthaus Grüner Weg",
        address: "Grüner Weg 15, 10115 Berlin",
        buildYear: 2005,
        units: 8,
        image: "/images/rect.png",
        owner: "Wohnbau AG"
      }
    ],
    wegVerwaltung: [
      {
        id: "3",
        name: "Eigentümergemeinschaft Parkblick",
        address: "Parkstraße 78, 10178 Berlin",
        buildYear: 2010,
        units: 24,
        image: "/images/rect.png"
      },
      {
        id: "4",
        name: "WEG Seeblick",
        address: "Seestraße 120, 13353 Berlin",
        buildYear: 2015,
        units: 18,
        image: "/images/rect.png"
      }
    ]
  };

  return (
    <>
      <Head>
        <title>Liegenschaften | Immobilienverwaltung</title>
        <meta name="description" content="Verwaltung von Liegenschaften" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-background min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Liegenschaften</h1>

            {!selectedType ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedType("hausverwaltung")}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Hausverwaltung
                    </CardTitle>
                    <CardDescription>Verwaltung von Mietobjekten</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Verwalten Sie Mietobjekte, Mietverträge und Mietzahlungen.</p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Auswählen</Button>
                  </CardFooter>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedType("weg-verwaltung")}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <Home className="h-5 w-5" />
                      WEG-Verwaltung
                    </CardTitle>
                    <CardDescription>Verwaltung von Wohnungseigentümergemeinschaften</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Verwalten Sie Eigentümergemeinschaften, Umlagen und Beschlüsse.</p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Auswählen</Button>
                  </CardFooter>
                </Card>
              </div>
            ) : (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">
                    {selectedType === "hausverwaltung" ? "Hausverwaltung" : "WEG-Verwaltung"}
                  </h2>
                  <Button variant="outline" onClick={() => setSelectedType(null)}>
                    Zurück zur Auswahl
                  </Button>
                </div>

                <Tabs defaultValue="overview" className="w-full mb-6">
                  <TabsList className="mb-4">
                    <TabsTrigger value="overview">Übersicht</TabsTrigger>
                    <TabsTrigger value="objects">Objekte</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview">
                    <Card>
                      <CardHeader>
                        <CardTitle>Übersicht</CardTitle>
                        <CardDescription>
                          {selectedType === "hausverwaltung" 
                            ? "Zusammenfassung Ihrer verwalteten Mietobjekte" 
                            : "Zusammenfassung Ihrer verwalteten Eigentümergemeinschaften"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">Objekte</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-3xl font-bold">
                                {selectedType === "hausverwaltung" 
                                  ? statistics.hausverwaltung.buildings 
                                  : statistics.wegVerwaltung.buildings}
                              </p>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">Einheiten</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-3xl font-bold">
                                {selectedType === "hausverwaltung" 
                                  ? statistics.hausverwaltung.units 
                                  : statistics.wegVerwaltung.units}
                              </p>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">
                                {selectedType === "hausverwaltung" ? "Mieter" : "Eigentümer"}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-3xl font-bold">
                                {selectedType === "hausverwaltung" 
                                  ? statistics.hausverwaltung.tenants 
                                  : statistics.wegVerwaltung.owners}
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                        
                        {/* Statistics Section - Now inside the Overview tab */}
                        <div className="mt-6">
                          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-primary" />
                            Statistik
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                              <h3 className="text-lg font-medium mb-4">Immobilien</h3>
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Building className="h-4 w-4 text-primary" />
                                    <span>Häuser</span>
                                  </div>
                                  <span className="font-medium">
                                    {selectedType === "hausverwaltung" 
                                      ? statistics.hausverwaltung.buildings 
                                      : statistics.wegVerwaltung.buildings}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Home className="h-4 w-4 text-primary" />
                                    <span>Einheiten</span>
                                  </div>
                                  <span className="font-medium">
                                    {selectedType === "hausverwaltung" 
                                      ? statistics.hausverwaltung.units 
                                      : statistics.wegVerwaltung.units}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <DoorClosed className="h-4 w-4 text-primary" />
                                    <span>Ø Einheiten pro Haus</span>
                                  </div>
                                  <span className="font-medium">
                                    {selectedType === "hausverwaltung" 
                                      ? statistics.hausverwaltung.avgUnitsPerBuilding 
                                      : statistics.wegVerwaltung.avgUnitsPerBuilding}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h3 className="text-lg font-medium mb-4">Personen</h3>
                              <div className="space-y-4">
                                {selectedType === "weg-verwaltung" && (
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <UserCheck className="h-4 w-4 text-primary" />
                                      <span>Eigentümer</span>
                                    </div>
                                    <span className="font-medium">{statistics.wegVerwaltung.owners}</span>
                                  </div>
                                )}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-primary" />
                                    <span>Mieter</span>
                                  </div>
                                  <span className="font-medium">
                                    {selectedType === "hausverwaltung" 
                                      ? statistics.hausverwaltung.tenants 
                                      : statistics.wegVerwaltung.tenants}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h3 className="text-lg font-medium mb-4">Nutzung</h3>
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                                    <span>Vermietet</span>
                                  </div>
                                  <span className="font-medium">
                                    {selectedType === "hausverwaltung" 
                                      ? statistics.hausverwaltung.rented 
                                      : statistics.wegVerwaltung.rented}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                                    <span>Leerstand</span>
                                  </div>
                                  <span className="font-medium">
                                    {selectedType === "hausverwaltung" 
                                      ? statistics.hausverwaltung.vacant 
                                      : statistics.wegVerwaltung.vacant}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                                    <span>Selbstbewohnt</span>
                                  </div>
                                  <span className="font-medium">
                                    {selectedType === "hausverwaltung" 
                                      ? statistics.hausverwaltung.selfOccupied 
                                      : statistics.wegVerwaltung.selfOccupied}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="objects">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle>Objekte</CardTitle>
                          <CardDescription>
                            {selectedType === "hausverwaltung" 
                              ? "Verwaltete Mietobjekte" 
                              : "Verwaltete Eigentümergemeinschaften"}
                          </CardDescription>
                        </div>
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                          <DialogTrigger asChild>
                            <Button className="gap-1">
                              <Plus className="h-4 w-4" /> Objekt hinzufügen
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[550px]">
                            <form onSubmit={handleAddProperty}>
                              <DialogHeader>
                                <DialogTitle>Neues Objekt hinzufügen</DialogTitle>
                                <DialogDescription>
                                  {selectedType === "hausverwaltung" 
                                    ? "Fügen Sie ein neues Mietobjekt hinzu." 
                                    : "Fügen Sie eine neue Eigentümergemeinschaft hinzu."}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="name" className="text-right">
                                    Name
                                  </Label>
                                  <Input 
                                    id="name" 
                                    name="name"
                                    value={newProperty.name}
                                    onChange={handleInputChange}
                                    placeholder={selectedType === "hausverwaltung" 
                                      ? "z.B. Wohnanlage Sonnenblick" 
                                      : "z.B. WEG Parkblick"} 
                                    className="col-span-3" 
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="address" className="text-right">
                                    Adresse
                                  </Label>
                                  <Input 
                                    id="address" 
                                    name="address"
                                    value={newProperty.address}
                                    onChange={handleInputChange}
                                    placeholder="Straße, PLZ Ort" 
                                    className="col-span-3" 
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="buildYear" className="text-right">
                                    Baujahr
                                  </Label>
                                  <Input 
                                    id="buildYear" 
                                    name="buildYear"
                                    type="number" 
                                    value={newProperty.buildYear}
                                    onChange={handleInputChange}
                                    placeholder="z.B. 2010" 
                                    className="col-span-3" 
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="units" className="text-right">
                                    Einheiten
                                  </Label>
                                  <Input 
                                    id="units" 
                                    name="units"
                                    type="number" 
                                    value={newProperty.units}
                                    onChange={handleInputChange}
                                    placeholder="Anzahl der Einheiten" 
                                    className="col-span-3" 
                                    required
                                  />
                                </div>
                                {selectedType === "hausverwaltung" && (
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="owner" className="text-right">
                                      Eigentümer
                                    </Label>
                                    <Input 
                                      id="owner" 
                                      name="owner"
                                      value={newProperty.owner}
                                      onChange={handleInputChange}
                                      placeholder="Name des Eigentümers" 
                                      className="col-span-3" 
                                      required
                                    />
                                  </div>
                                )}
                              </div>
                              <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                  Abbrechen
                                </Button>
                                <Button type="submit" disabled={isLoading}>
                                  {isLoading ? "Wird hinzugefügt..." : "Objekt hinzufügen"}
                                </Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </CardHeader>
                      <CardContent>
                        {selectedType && properties[selectedType === "hausverwaltung" ? "hausverwaltung" : "wegVerwaltung"].length > 0 ? (
                          <div className="overflow-hidden rounded-md border">
                            <table className="w-full">
                              <thead>
                                <tr className="bg-muted/50">
                                  <th className="p-3 text-left font-medium">Name</th>
                                  <th className="p-3 text-left font-medium">Adresse</th>
                                  <th className="p-3 text-left font-medium">Baujahr</th>
                                  <th className="p-3 text-left font-medium">Einheiten</th>
                                  {selectedType === "hausverwaltung" && (
                                    <th className="p-3 text-left font-medium">Eigentümer</th>
                                  )}
                                  <th className="p-3 text-right font-medium">Aktionen</th>
                                </tr>
                              </thead>
                              <tbody>
                                {properties[selectedType === "hausverwaltung" ? "hausverwaltung" : "wegVerwaltung"]
                                  .slice() // Create a copy to avoid mutating the original array
                                  .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }))
                                  .map((property, index, sortedArray) => (
                                  <tr 
                                    key={property.id}
                                    className={`hover:bg-muted/50 ${index !== sortedArray.length - 1 ? 'border-b' : ''}`}
                                    onClick={() => router.push({
                                      pathname: `/liegenschaften/${property.id}`,
                                      query: { type: selectedType === "hausverwaltung" ? "hausverwaltung" : "wegVerwaltung" }
                                    })}
                                  >
                                    <td className="p-3 font-medium">{property.name}</td>
                                    <td className="p-3">{property.address}</td>
                                    <td className="p-3">{property.buildYear}</td>
                                    <td className="p-3">{property.units}</td>
                                    {selectedType === "hausverwaltung" && (
                                      <td className="p-3">{property.owner}</td>
                                    )}
                                    <td className="p-3 text-right">
                                      <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="sm" className="gap-1">
                                          Details <ArrowRight className="h-3 w-3" />
                                        </Button>
                                        <Button 
                                          variant="ghost" 
                                          size="sm"
                                          className="text-red-500 hover:text-red-700 hover:bg-red-100"
                                          onClick={(e) => handleDeleteClick(e, property.id)}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <Building className="h-12 w-12 mx-auto text-muted-foreground" />
                            <p className="mt-4 text-muted-foreground">Keine Objekte vorhanden</p>
                            <Button 
                              className="mt-4 gap-1"
                              onClick={() => setIsAddDialogOpen(true)}
                            >
                              <Plus className="h-4 w-4" /> Objekt hinzufügen
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    {/* Delete Confirmation Dialog */}
                    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Objekt löschen</AlertDialogTitle>
                          <AlertDialogDescription>
                            Sind Sie sicher, dass Sie dieses Objekt löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setPropertyToDelete(null)}>Abbrechen</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={handleDeleteProperty}
                            className="bg-red-500 hover:bg-red-600"
                            disabled={isLoading}
                          >
                            {isLoading ? "Wird gelöscht..." : "Löschen"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TabsContent>
                  

                </Tabs>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}