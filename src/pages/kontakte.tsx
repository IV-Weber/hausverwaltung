import React, { useState } from "react";
import Head from "next/head";
import Header from "@/components/Header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, User, Building, Phone, Mail, MapPin, FileText, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

type ContactType = 'eigentuemer' | 'mieter' | 'dienstleister';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
}

export default function Kontakte() {
  const [selectedType, setSelectedType] = useState<ContactType | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Fehler",
        description: "Name ist ein Pflichtfeld",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contacts/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: selectedType,
          ...formData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Erfolg",
          description: "Kontakt wurde erfolgreich hinzugefügt",
        });
        
        // Reset form and close dialog
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: '',
          notes: '',
        });
        setIsAddDialogOpen(false);
      } else {
        throw new Error(data.message || "Fehler beim Hinzufügen des Kontakts");
      }
    } catch (error) {
      console.error("Error adding contact:", error);
      toast({
        title: "Fehler",
        description: error instanceof Error ? error.message : "Fehler beim Hinzufügen des Kontakts",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getContactTypeLabel = (type: ContactType | null) => {
    switch (type) {
      case 'eigentuemer':
        return 'Eigentümer';
      case 'mieter':
        return 'Mieter';
      case 'dienstleister':
        return 'Dienstleister';
      default:
        return '';
    }
  };

  return (
    <>
      <Head>
        <title>Kontakte | Immobilienverwaltung</title>
        <meta name="description" content="Verwaltung von Kontakten" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-background min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Kontakte</h1>

            {!selectedType ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedType("eigentuemer")}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Eigentümer
                    </CardTitle>
                    <CardDescription>Verwaltung von Eigentümern</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Verwalten Sie Eigentümer und deren Kontaktdaten.</p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Auswählen</Button>
                  </CardFooter>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedType("mieter")}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Mieter
                    </CardTitle>
                    <CardDescription>Verwaltung von Mietern</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Verwalten Sie Mieter und deren Kontaktdaten.</p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Auswählen</Button>
                  </CardFooter>
                </Card>
                
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedType("dienstleister")}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Dienstleister
                    </CardTitle>
                    <CardDescription>Verwaltung von Dienstleistern</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Verwalten Sie Dienstleister und deren Kontaktdaten.</p>
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
                    {getContactTypeLabel(selectedType)}
                  </h2>
                  <Button variant="outline" onClick={() => setSelectedType(null)}>
                    Zurück zur Auswahl
                  </Button>
                </div>

                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">Alle</TabsTrigger>
                    <TabsTrigger value="active">Aktiv</TabsTrigger>
                    <TabsTrigger value="inactive">Inaktiv</TabsTrigger>
                  </TabsList>
                  
                  <div className="mb-4 flex justify-end">
                    <Button onClick={() => setIsAddDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      {getContactTypeLabel(selectedType)} hinzufügen
                    </Button>
                  </div>
                  
                  <TabsContent value="all">
                    <Card>
                      <CardHeader>
                        <CardTitle>Alle {getContactTypeLabel(selectedType)}</CardTitle>
                        <CardDescription>
                          Übersicht aller {getContactTypeLabel(selectedType)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8">
                          <Users className="h-12 w-12 mx-auto text-muted-foreground" />
                          <p className="mt-4 text-muted-foreground">
                            Keine {getContactTypeLabel(selectedType)} vorhanden
                          </p>
                          <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
                            {getContactTypeLabel(selectedType)} hinzufügen
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="active">
                    <Card>
                      <CardHeader>
                        <CardTitle>Aktive {getContactTypeLabel(selectedType)}</CardTitle>
                        <CardDescription>
                          Übersicht aktiver {getContactTypeLabel(selectedType)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8">
                          <Users className="h-12 w-12 mx-auto text-muted-foreground" />
                          <p className="mt-4 text-muted-foreground">
                            Keine aktiven {getContactTypeLabel(selectedType)} vorhanden
                          </p>
                          <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
                            {getContactTypeLabel(selectedType)} hinzufügen
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="inactive">
                    <Card>
                      <CardHeader>
                        <CardTitle>Inaktive {getContactTypeLabel(selectedType)}</CardTitle>
                        <CardDescription>
                          Übersicht inaktiver {getContactTypeLabel(selectedType)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8">
                          <Users className="h-12 w-12 mx-auto text-muted-foreground" />
                          <p className="mt-4 text-muted-foreground">
                            Keine inaktiven {getContactTypeLabel(selectedType)} vorhanden
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add Contact Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{getContactTypeLabel(selectedType)} hinzufügen</DialogTitle>
            <DialogDescription>
              Fügen Sie einen neuen {getContactTypeLabel(selectedType)} hinzu. Füllen Sie die erforderlichen Felder aus.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddContact}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name*
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  <Mail className="h-4 w-4 inline mr-1" />
                  E-Mail
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  <Phone className="h-4 w-4 inline mr-1" />
                  Telefon
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Adresse
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  <FileText className="h-4 w-4 inline mr-1" />
                  Notizen
                </Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="col-span-3"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Abbrechen
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Wird hinzugefügt..." : "Hinzufügen"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}