import React, { useState } from "react";
import Head from "next/head";
import Header from "@/components/Header";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { CalendarClock, Plus } from "lucide-react";

type Appointment = {
  id: string;
  title: string;
  date: Date;
  time: string;
  description: string;
  type: string;
};

export default function KalenderPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [newAppointment, setNewAppointment] = useState<Partial<Appointment>>({
    date: new Date(),
    type: "meeting"
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddAppointment = () => {
    if (newAppointment.title && newAppointment.date && newAppointment.time) {
      const appointment: Appointment = {
        id: Date.now().toString(),
        title: newAppointment.title,
        date: newAppointment.date,
        time: newAppointment.time,
        description: newAppointment.description || "",
        type: newAppointment.type || "meeting"
      };
      
      setAppointments([...appointments, appointment]);
      setNewAppointment({
        date: new Date(),
        type: "meeting"
      });
      setIsDialogOpen(false);
    }
  };

  const appointmentsForSelectedDate = appointments.filter(
    (appointment) => 
      appointment.date.toDateString() === (date?.toDateString() || "")
  );

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <Head>
        <title>Kalender | Immobilienverwaltung</title>
        <meta name="description" content="Kalender für Termine und Ereignisse" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-background min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Kalender</h1>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    <span>Termin hinzufügen</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Neuen Termin erstellen</DialogTitle>
                    <DialogDescription>
                      Fügen Sie einen neuen Termin zu Ihrem Kalender hinzu.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Titel</Label>
                      <Input
                        id="title"
                        placeholder="Titel des Termins"
                        value={newAppointment.title || ""}
                        onChange={(e) => setNewAppointment({...newAppointment, title: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Datum</Label>
                      <Calendar
                        mode="single"
                        selected={newAppointment.date}
                        onSelect={(date) => setNewAppointment({...newAppointment, date: date || new Date()})}
                        className="border rounded-md"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="time">Uhrzeit</Label>
                      <Input
                        id="time"
                        type="time"
                        value={newAppointment.time || ""}
                        onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="type">Typ</Label>
                      <Select 
                        value={newAppointment.type} 
                        onValueChange={(value) => setNewAppointment({...newAppointment, type: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Typ auswählen" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="meeting">Besprechung</SelectItem>
                          <SelectItem value="maintenance">Wartung</SelectItem>
                          <SelectItem value="viewing">Besichtigung</SelectItem>
                          <SelectItem value="other">Sonstiges</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Beschreibung</Label>
                      <Textarea
                        id="description"
                        placeholder="Beschreibung des Termins"
                        value={newAppointment.description || ""}
                        onChange={(e) => setNewAppointment({...newAppointment, description: e.target.value})}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Abbrechen</Button>
                    <Button onClick={handleAddAppointment}>Speichern</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Kalender</CardTitle>
                  <CardDescription>Wählen Sie ein Datum aus</CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="border rounded-md"
                  />
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Termine für {date ? formatDate(date) : "Heute"}</CardTitle>
                  <CardDescription>
                    {appointmentsForSelectedDate.length} Termine gefunden
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {appointmentsForSelectedDate.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <CalendarClock className="mx-auto h-12 w-12 opacity-20 mb-2" />
                      <p>Keine Termine für diesen Tag</p>
                      <p className="text-sm">Klicken Sie auf "Termin hinzufügen", um einen neuen Termin zu erstellen</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {appointmentsForSelectedDate.map((appointment) => (
                        <Card key={appointment.id}>
                          <CardHeader className="py-3">
                            <div className="flex justify-between">
                              <CardTitle className="text-base">{appointment.title}</CardTitle>
                              <span className="text-sm font-medium">{appointment.time} Uhr</span>
                            </div>
                            <CardDescription>
                              {appointment.type === "meeting" && "Besprechung"}
                              {appointment.type === "maintenance" && "Wartung"}
                              {appointment.type === "viewing" && "Besichtigung"}
                              {appointment.type === "other" && "Sonstiges"}
                            </CardDescription>
                          </CardHeader>
                          {appointment.description && (
                            <CardContent className="py-2">
                              <p className="text-sm">{appointment.description}</p>
                            </CardContent>
                          )}
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        <span>Termin hinzufügen</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Neuen Termin erstellen</DialogTitle>
                        <DialogDescription>
                          Fügen Sie einen neuen Termin zu Ihrem Kalender hinzu.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="title">Titel</Label>
                          <Input
                            id="title"
                            placeholder="Titel des Termins"
                            value={newAppointment.title || ""}
                            onChange={(e) => setNewAppointment({...newAppointment, title: e.target.value})}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>Datum</Label>
                          <Calendar
                            mode="single"
                            selected={newAppointment.date}
                            onSelect={(date) => setNewAppointment({...newAppointment, date: date || new Date()})}
                            className="border rounded-md"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="time">Uhrzeit</Label>
                          <Input
                            id="time"
                            type="time"
                            value={newAppointment.time || ""}
                            onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="type">Typ</Label>
                          <Select 
                            value={newAppointment.type} 
                            onValueChange={(value) => setNewAppointment({...newAppointment, type: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Typ auswählen" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="meeting">Besprechung</SelectItem>
                              <SelectItem value="maintenance">Wartung</SelectItem>
                              <SelectItem value="viewing">Besichtigung</SelectItem>
                              <SelectItem value="other">Sonstiges</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="description">Beschreibung</Label>
                          <Textarea
                            id="description"
                            placeholder="Beschreibung des Termins"
                            value={newAppointment.description || ""}
                            onChange={(e) => setNewAppointment({...newAppointment, description: e.target.value})}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Abbrechen</Button>
                        <Button onClick={handleAddAppointment}>Speichern</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}