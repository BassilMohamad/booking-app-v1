"use client";
import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import { Switch } from "@/app/components/ui/switch";
import { Textarea } from "@/app/components/ui/textarea";
import { Badge } from "@/app/components/ui/badge";
import { Calendar } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import { CalendarIcon, Save, X, Upload } from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface BarberProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo?: string;
  bio: string;
  specialties: string[];
  workingHours: {
    [key: string]: { start: string; end: string; available: boolean };
  };
  unavailableDates: Date[];
}

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
}

export default function BarberSettings() {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<BarberProfile>({
    id: "1",
    name: "John Smith",
    email: "john@salon.com",
    phone: "+1234567890",
    bio: "Professional barber with 10+ years of experience in classic and modern cuts.",
    specialties: ["Classic Cuts", "Beard Styling", "Hair Styling"],
    workingHours: {
      monday: { start: "09:00", end: "17:00", available: true },
      tuesday: { start: "09:00", end: "17:00", available: true },
      wednesday: { start: "09:00", end: "17:00", available: true },
      thursday: { start: "09:00", end: "17:00", available: true },
      friday: { start: "09:00", end: "17:00", available: true },
      saturday: { start: "10:00", end: "16:00", available: true },
      sunday: { start: "10:00", end: "14:00", available: false },
    },
    unavailableDates: [],
  });

  const [services] = useState<Service[]>([
    { id: "haircut", name: "Haircut", duration: 30, price: 25 },
    { id: "beard-trim", name: "Beard Trim", duration: 15, price: 15 },
    { id: "hair-wash", name: "Hair Wash", duration: 20, price: 10 },
    { id: "styling", name: "Hair Styling", duration: 25, price: 20 },
  ]);

  const [assignedServices, setAssignedServices] = useState<string[]>([
    "haircut",
    "beard-trim",
  ]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [newSpecialty, setNewSpecialty] = useState("");

  const days = [
    { key: "monday", label: t("days.monday") },
    { key: "tuesday", label: t("days.tuesday") },
    { key: "wednesday", label: t("days.wednesday") },
    { key: "thursday", label: t("days.thursday") },
    { key: "friday", label: t("days.friday") },
    { key: "saturday", label: t("days.saturday") },
    { key: "sunday", label: t("days.sunday") },
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfile({ ...profile, photo: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    toast.success("Profile saved successfully");
  };

  const handleAddUnavailableDate = () => {
    if (
      selectedDate &&
      !profile.unavailableDates.some(
        (date) =>
          format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
      )
    ) {
      setProfile({
        ...profile,
        unavailableDates: [...profile.unavailableDates, selectedDate],
      });
      setSelectedDate(undefined);
      toast.success("Unavailable date added");
    }
  };

  const handleRemoveUnavailableDate = (dateToRemove: Date) => {
    setProfile({
      ...profile,
      unavailableDates: profile.unavailableDates.filter(
        (date) =>
          format(date, "yyyy-MM-dd") !== format(dateToRemove, "yyyy-MM-dd")
      ),
    });
    toast.success("Unavailable date removed");
  };

  const handleAddSpecialty = () => {
    if (
      newSpecialty.trim() &&
      !profile.specialties.includes(newSpecialty.trim())
    ) {
      setProfile({
        ...profile,
        specialties: [...profile.specialties, newSpecialty.trim()],
      });
      setNewSpecialty("");
      toast.success("Specialty added");
    }
  };

  const handleRemoveSpecialty = (specialty: string) => {
    setProfile({
      ...profile,
      specialties: profile.specialties.filter((s) => s !== specialty),
    });
    toast.success("Specialty removed");
  };

  const handleWorkingHoursChange = (
    day: string,
    field: "start" | "end" | "available",
    value: string | boolean
  ) => {
    setProfile({
      ...profile,
      workingHours: {
        ...profile.workingHours,
        [day]: {
          ...profile.workingHours[day],
          [field]: value,
        },
      },
    });
  };

  const toggleServiceAssignment = (serviceId: string) => {
    if (assignedServices.includes(serviceId)) {
      setAssignedServices(assignedServices.filter((id) => id !== serviceId));
    } else {
      setAssignedServices([...assignedServices, serviceId]);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1>{t("barber.settings.title")}</h1>
        <p className="text-muted-foreground">{t("barber.settings.subtitle")}</p>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>{t("barber.profile.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Photo */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.photo} />
              <AvatarFallback>
                {profile.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                {t("barber.profile.photo")}
              </Button>
              {profile.photo && (
                <Button
                  variant="outline"
                  onClick={() => setProfile({ ...profile, photo: undefined })}>
                  Remove
                </Button>
              )}
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="email">{t("form.email")}</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <Label htmlFor="phone">{t("form.phone")}</Label>
            <Input
              id="phone"
              value={profile.phone}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="bio">{t("barber.profile.bio")}</Label>
            <Textarea
              id="bio"
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder={t("barber.profile.bio.placeholder")}
            />
          </div>

          {/* Specialties */}
          <div>
            <Label>{t("barber.profile.specialties")}</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {profile.specialties.map((specialty) => (
                <Badge
                  key={specialty}
                  variant="secondary"
                  className="flex items-center gap-1">
                  {specialty}
                  <button
                    onClick={() => handleRemoveSpecialty(specialty)}
                    className="ml-1 hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder={t("barber.profile.specialties.add")}
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddSpecialty()}
              />
              <Button onClick={handleAddSpecialty}>{t("form.add")}</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Working Hours */}
      <Card>
        <CardHeader>
          <CardTitle>{t("barber.hours.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {days.map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-24">{label}</div>
                  <Switch
                    checked={profile.workingHours[key]?.available || false}
                    onCheckedChange={(checked) =>
                      handleWorkingHoursChange(key, "available", checked)
                    }
                  />
                  {profile.workingHours[key]?.available && (
                    <>
                      <Input
                        type="time"
                        className="w-28"
                        value={profile.workingHours[key]?.start || "09:00"}
                        onChange={(e) =>
                          handleWorkingHoursChange(key, "start", e.target.value)
                        }
                      />
                      <span>to</span>
                      <Input
                        type="time"
                        className="w-28"
                        value={profile.workingHours[key]?.end || "17:00"}
                        onChange={(e) =>
                          handleWorkingHoursChange(key, "end", e.target.value)
                        }
                      />
                    </>
                  )}
                  {!profile.workingHours[key]?.available && (
                    <span className="text-muted-foreground">
                      {t("days.off")}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Unavailable Dates */}
      <Card>
        <CardHeader>
          <CardTitle>{t("barber.unavailable.title")}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {t("barber.unavailable.subtitle")}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  //   selected={selectedDate}
                  //   onSelect={setSelectedDate}
                  //   initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button onClick={handleAddUnavailableDate} disabled={!selectedDate}>
              {t("barber.unavailable.add")}
            </Button>
          </div>

          {profile.unavailableDates.length > 0 && (
            <div className="space-y-2">
              <Label>Unavailable Dates:</Label>
              <div className="flex flex-wrap gap-2">
                {profile.unavailableDates.map((date) => (
                  <Badge
                    key={format(date, "yyyy-MM-dd")}
                    variant="outline"
                    className="flex items-center gap-1">
                    {format(date, "MMM dd, yyyy")}
                    <button
                      onClick={() => handleRemoveUnavailableDate(date)}
                      className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Service Assignment */}
      <Card>
        <CardHeader>
          <CardTitle>{t("barber.services.title")}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {t("barber.services.subtitle")}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {services.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={assignedServices.includes(service.id)}
                    onCheckedChange={() => toggleServiceAssignment(service.id)}
                  />
                  <div>
                    <h4>{service.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {service.duration}min - ${service.price}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveProfile} className="w-32">
          <Save className="h-4 w-4 mr-2" />
          {t("barber.save")}
        </Button>
      </div>
    </div>
  );
}
