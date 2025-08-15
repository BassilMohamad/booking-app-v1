"use client";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";

import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Label } from "@/app/components//ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Textarea } from "@/app/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import {
  Plus,
  Edit,
  Trash2,
  Copy,
  QrCode,
  Share2,
  CalendarIcon,
  Upload,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import QRCodeGenerator from "./QRCodeGenerator";
import { toast } from "sonner";
import { BarberNewData, useAddBarber } from "@/app/api/useAddBarber";
import { useParams } from "next/navigation";
import { useShopBySlug } from "@/hooks/useShopBySlug";
import { useDeleteBarber } from "@/app/api/useDeleteBarber";
import { useUpdateBarber } from "@/app/api/useUpdateBarber";
import {
  useAddService,
  useDeleteService,
  useUpdateService,
} from "@/app/api/useServesesHandling";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

type ServiceForm = Partial<Service>;

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
}

interface Booking {
  customerName: string;
  customerPhoneNumber?: string;
  barberId: string;
  service: string[];
  date: string;
  time: string;
}
type BarberForm = Partial<BarberNewData>;

export default function OwnerDashboard() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const params = useParams();
  const shopSlug = params.slug as string;

  const { mutate: addNewBarberData } = useAddBarber();
  const { mutate: deleteBarber } = useDeleteBarber();
  const { mutate: updateBarber } = useUpdateBarber();
  const { data, refetch } = useShopBySlug(shopSlug);
  const { mutate: addServices } = useAddService();
  const { mutate: deleteService } = useDeleteService();
  const { mutate: updateSer } = useUpdateService();

  const generateBarberId = data ? (data.barbers.length + 1).toString() : "1";
  const generatServiceId = data ? (data.services.length + 1).toString() : "1";

  const [barbers, setBarbers] = useState<BarberNewData[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setbookings] = useState<Booking[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [isAddBarberOpen, setIsAddBarberOpen] = useState(false);
  const [isEditBarberOpen, setIsEditBarberOpen] = useState(false);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [isEditServiceOpen, setIsEditServiceOpen] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [editingService, setEditingService] = useState<ServiceForm>({});
  const [newService, setNewService] = useState<ServiceForm>({});
  const [editingBarber, setEditingBarber] = useState<BarberForm>({});
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const defaultWorkingHours = days.reduce(
    (acc, day) => ({
      ...acc,
      [day]: {
        available: true,
        start: "09:00",
        end: "17:00",
      },
    }),
    {}
  );
  const [newBarber, setNewBarber] = useState<BarberForm>({
    photo: "",
    workingHours: defaultWorkingHours,
  });

  const bookingPageUrl = `https://www.tarteebpro.com/barber/${shopSlug}`;

  useEffect(() => {
    const shopDocRef = doc(db, `shops/${shopSlug}`);
    const unsubscribe = onSnapshot(
      shopDocRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          const updatedBookings: Booking[] = data.bookings || [];
          setbookings(updatedBookings);
        } else {
          setbookings([]);
        }
      },
      (error) => {
        console.error("Firestore listener error:", error);
        toast.error(t("toast.firestoreError"));
      }
    );
    return () => unsubscribe();
  }, [shopSlug, t]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.error("No file selected");
      toast.error(t("toast.noFileSelected"));
      return;
    }
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      console.error("Invalid file type:", file.type);
      toast.error(t("toast.invalidFileType"));
      return;
    }
    const maxSize = 5 * 1024 * 1024; // 5MB limit
    if (file.size > maxSize) {
      console.error("File too large:", file.size);
      toast.error(t("toast.fileTooLarge"));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) {
        console.error("FileReader failed to read file");
        toast.error(t("toast.failedToReadFile"));
        return;
      }

      if (isEditBarberOpen) {
        setEditingBarber({ ...editingBarber, photo: result });
      } else {
        setNewBarber({ ...newBarber, photo: result });
      }
    };
    reader.onerror = () => {
      console.error("FileReader error");
      toast.error(t("toast.errorReadingFile"));
    };
    reader.readAsDataURL(file);
  };

  const handleAddBarber = () => {
    if (newBarber.name) {
      const barber: BarberNewData = {
        id: generateBarberId,
        name: newBarber.name,
        photo: newBarber.photo || "",
        workingHours: newBarber.workingHours || defaultWorkingHours,
      };
      setIsAddBarberOpen(false);
      addNewBarberData(
        { shopSlug, barber: barber },
        {
          onError: (e) => {
            console.error("Add barber error:", e);
            toast.error(t("toast.barberAddFailed"));
          },
          onSuccess: () => {
            toast.success(t("toast.barberAdded"));
            setNewBarber({ photo: "", workingHours: defaultWorkingHours });
            refetch();
          },
        }
      );
    } else {
      toast.error(t("toast.barberNameRequired"));
    }
  };

  const handleEditBarber = (barber: BarberNewData) => {
    setEditingBarber({ ...barber });
    setIsEditBarberOpen(true);
  };

  const handleUpdateBarber = () => {
    if (editingBarber && editingBarber.name) {
      updateBarber(
        { shopSlug, barber: editingBarber as BarberNewData },
        {
          onSuccess: () => {
            setBarbers(
              barbers.map((b) =>
                b.id === editingBarber.id ? (editingBarber as BarberNewData) : b
              )
            );
            setIsEditBarberOpen(false);
            toast.success(t("toast.barberUpdated"));
          },
          onError: () => {
            toast.error(t("toast.barberUpdateFailed"));
          },
        }
      );
    } else {
      toast.error(t("toast.barberNameRequired"));
    }
  };

  const handleDeleteBarber = (barberId: string) => {
    deleteBarber({ shopSlug, barberId });
    refetch();
    setBarbers(barbers.filter((b) => b.id !== barberId));
    toast.success(t("toast.barberDeleted"));
  };

  const handleAddService = () => {
    if (newService.name && newService.price && newService.duration) {
      const service: Service = {
        id: generatServiceId,
        name: newService.name,
        duration: newService.duration,
        price: newService.price,
        description: newService.description || "",
      };
      setServices([...services, service]);
      setIsAddServiceOpen(false);
      addServices(
        {
          shopSlug,
          service,
        },
        {
          onSuccess: () => {
            toast.success(t("toast.serviceAdded"));
            setNewService({});
          },
          onError: (e) => {
            console.error("Add service error:", e);
            toast.error(t("toast.serviceAddFailed"));
          },
        }
      );
    } else {
      toast.error(t("toast.serviceFieldsRequired"));
    }
  };

  const handleEditService = (service: Service) => {
    setEditingService({ ...service });
    setIsEditServiceOpen(true);
  };

  const handleUpdateService = () => {
    if (
      editingService &&
      editingService.name &&
      editingService.price &&
      editingService.duration
    ) {
      setServices(
        services.map((s) =>
          s.id === editingService.id ? (editingService as Service) : s
        )
      );
      updateSer(
        { shopSlug, service: editingService as Service },
        {
          onSuccess: () => {
            toast.success(t("toast.serviceUpdated"));
            refetch();
          },
          onError: () => toast.error(t("toast.serviceUpdateFailed")),
        }
      );
      setIsEditServiceOpen(false);
    } else {
      toast.error(t("toast.serviceFieldsRequired"));
    }
  };

  const handleDeleteService = (serviceId: string) => {
    deleteService(
      { shopSlug, serviceId },
      {
        onSuccess: () => {
          toast.success(t("toast.serviceDeleted"));
          refetch();
        },
        onError: () => {
          toast.error(t("toast.serviceDeleteFailed"));
        },
      }
    );
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(bookingPageUrl);
      toast.success(t("toast.linkCopied"));
    } catch (error) {
      toast.error(t("toast.linkCopyFailed"));
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t("toast.shareTitle"),
          text: t("toast.shareText"),
          url: bookingPageUrl,
        });
      } catch (error) {
        console.log("Share canceled");
      }
    } else {
      toast.error(t("toast.shareNotSupported"));
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.date);
    const barberMatch =
      selectedBarber === "all" || booking.barberId === selectedBarber;
    const dateMatch =
      !selectedDate ||
      format(bookingDate, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
    return barberMatch && dateMatch;
  });

  useEffect(() => {
    setBarbers(data?.barbers || []);
    setServices(data?.services || []);
    setbookings(data?.bookings || []);
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (data) {
      setBarbers(data.barbers || []);
      setServices(data.services || []);
      setbookings(data.bookings || []);
    }
  }, [data]);

  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  const renderBarberDialog = (isEdit: boolean, barber?: BarberNewData) => {
    const currentBarber = isEdit ? editingBarber : newBarber;
    const setCurrentBarber = isEdit ? setEditingBarber : setNewBarber;

    return (
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t("form.editBarber") : t("dashboard.barbers.add")}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Photo Upload */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={currentBarber?.photo} />
              <AvatarFallback>
                {currentBarber?.name
                  ? currentBarber.name.slice(0, 2).toUpperCase()
                  : "BB"}
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
                onClick={() => {
                  fileInputRef.current?.click();
                }}>
                <Upload className="h-4 w-4 mr-2" />
                {t("form.uploadPhoto")}
              </Button>
              {currentBarber?.photo && (
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentBarber({ ...currentBarber, photo: "" })
                  }>
                  {t("form.removePhoto")}
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">{t("form.name")}</Label>
              <Input
                id="name"
                value={currentBarber?.name || ""}
                onChange={(e) =>
                  setCurrentBarber({ ...currentBarber, name: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            <Label>{t("form.workingHours")}</Label>
            <div className="space-y-3 mt-2">
              {days.map((day) => (
                <div key={day} className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-24 capitalize">{t(`days.${day}`)}</div>
                    <Switch
                      dir="ltr"
                      checked={
                        currentBarber?.workingHours?.[day]?.available ?? true
                      }
                      disabled={false}
                      onCheckedChange={(checked) => {
                        setCurrentBarber({
                          ...currentBarber,
                          workingHours: {
                            ...currentBarber?.workingHours,
                            [day]: {
                              ...currentBarber?.workingHours?.[day],
                              available: checked,
                              start:
                                currentBarber?.workingHours?.[day]?.start ||
                                "09:00",
                              end:
                                currentBarber?.workingHours?.[day]?.end ||
                                "17:00",
                            },
                          },
                        });
                      }}
                    />
                    {currentBarber?.workingHours?.[day]?.available && (
                      <>
                        <Input
                          type="time"
                          className="w-30"
                          value={
                            currentBarber?.workingHours?.[day]?.start || "09:00"
                          }
                          min="00:00"
                          max="11:59"
                          onChange={(e) => {
                            const newValue = e.target.value;
                            if (newValue >= "12:00") return;
                            setCurrentBarber((prev) => ({
                              ...prev,
                              workingHours: {
                                ...prev?.workingHours,
                                [day]: {
                                  ...prev?.workingHours?.[day],
                                  start: newValue,
                                  available:
                                    prev?.workingHours?.[day]?.available ??
                                    true,
                                  end:
                                    prev?.workingHours?.[day]?.end || "17:00",
                                },
                              },
                            }));
                          }}
                        />
                        <span>{t("form.to")}</span>
                        <Input
                          type="time"
                          className="w-30"
                          value={
                            currentBarber?.workingHours?.[day]?.end || "17:00"
                          }
                          min="12:00"
                          max="23:59"
                          onChange={(e) => {
                            const newValue = e.target.value;
                            if (newValue < "12:00") return;
                            setCurrentBarber((prev) => ({
                              ...prev,
                              workingHours: {
                                ...prev?.workingHours,
                                [day]: {
                                  ...prev?.workingHours?.[day],
                                  end: newValue,
                                  available:
                                    prev?.workingHours?.[day]?.available ??
                                    true,
                                  start:
                                    prev?.workingHours?.[day]?.start || "09:00",
                                },
                              },
                            }));
                          }}
                        />
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() =>
                isEdit ? setIsEditBarberOpen(false) : setIsAddBarberOpen(false)
              }>
              {t("form.cancel")}
            </Button>
            <Button onClick={isEdit ? handleUpdateBarber : handleAddBarber}>
              {isEdit ? t("form.save") : t("form.add")}
            </Button>
          </div>
        </div>
      </DialogContent>
    );
  };

  const renderServiceDialog = (isEdit: boolean) => {
    const currentService = isEdit ? editingService : newService;
    const setCurrentService = isEdit ? setEditingService : setNewService;

    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t("form.serviceEdit") : t("form.serviceAdd")}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="service-name">{t("form.name")}</Label>
            <Input
              id="service-name"
              value={currentService?.name || ""}
              onChange={(e) =>
                setCurrentService({ ...currentService, name: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">{t("form.duration")}</Label>
              <Input
                id="duration"
                type="number"
                value={currentService?.duration || ""}
                onChange={(e) =>
                  setCurrentService({
                    ...currentService,
                    duration: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="price">{t("form.price")}</Label>
              <Input
                id="price"
                type="number"
                value={currentService?.price || ""}
                onChange={(e) =>
                  setCurrentService({
                    ...currentService,
                    price: parseFloat(e.target.value),
                  })
                }
              />
            </div>
          </div>
          <div>
            <Label htmlFor="description">{t("form.description")}</Label>
            <Textarea
              id="description"
              value={currentService?.description || ""}
              onChange={(e) =>
                setCurrentService({
                  ...currentService,
                  description: e.target.value,
                })
              }
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() =>
                isEdit
                  ? setIsEditServiceOpen(false)
                  : setIsAddServiceOpen(false)
              }>
              {t("form.cancel")}
            </Button>
            <Button onClick={isEdit ? handleUpdateService : handleAddService}>
              {isEdit ? t("form.save") : t("form.add")}
            </Button>
          </div>
        </div>
      </DialogContent>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>{t("dashboard.header.title")}</h1>
        <p className="text-muted-foreground">
          {t("dashboard.header.subtitle")}
        </p>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t("dashboard.barbers.title")}</CardTitle>
          <Dialog open={isAddBarberOpen} onOpenChange={setIsAddBarberOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {t("dashboard.barbers.add")}
              </Button>
            </DialogTrigger>
            {renderBarberDialog(false)}
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {barbers.map((barber) => (
              <div
                key={barber.id}
                className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={barber.photo} />
                    <AvatarFallback>
                      {barber.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4>{barber.name}</h4>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditBarber(barber)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteBarber(barber.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t("dashboard.services.title")}</CardTitle>
          <Dialog open={isAddServiceOpen} onOpenChange={setIsAddServiceOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {t("dashboard.services.add")}
              </Button>
            </DialogTrigger>
            {renderServiceDialog(false)}
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4>{service.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {service.description}
                  </p>
                  <div className="flex gap-4 mt-2">
                    <span className="text-sm">
                      {t("services.duration", { duration: service.duration })}
                    </span>
                    <span className="text-sm">
                      {t("services.price", { price: service.price })}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditService(service)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteService(service.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.bookings.title")}</CardTitle>
          <div className="flex gap-4 mt-4 flex-wrap">
            <Select value={selectedBarber} onValueChange={setSelectedBarber}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t("dashboard.bookings.filter.all")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("dashboard.bookings.filter.all")}
                </SelectItem>
                {barbers.map((barber) => (
                  <SelectItem key={barber.id} value={barber.id}>
                    {barber.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate
                    ? format(selectedDate, "PPP")
                    : t("dashboard.bookings.filter.date")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
        <CardContent dir={locale === "ar" ? "rtl" : "ltr"}>
          <Table className={locale === "ar" ? "text-right" : "text-left"}>
            <TableHeader>
              <TableRow>
                <TableHead
                  className={locale === "ar" ? "text-right" : "text-left"}>
                  {t("table.customer")}
                </TableHead>
                <TableHead
                  className={locale === "ar" ? "text-right" : "text-left"}>
                  {t("table.barber")}
                </TableHead>
                <TableHead
                  className={locale === "ar" ? "text-right" : "text-left"}>
                  {t("table.service")}
                </TableHead>
                <TableHead
                  className={locale === "ar" ? "text-right" : "text-left"}>
                  {t("table.datetime")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking, index) => {
                const barber = barbers.find((b) => b.id === booking.barberId);
                return (
                  <TableRow key={index}>
                    <TableCell
                      className={locale === "ar" ? "text-right" : "text-left"}>
                      <div className="flex flex-col">
                        <div>{booking.customerName}</div>
                        <div className="text-sm text-muted-foreground">
                          {booking.customerPhoneNumber}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell
                      className={locale === "ar" ? "text-right" : "text-left"}>
                      {barber?.name}
                    </TableCell>
                    <TableCell
                      className={locale === "ar" ? "text-right" : "text-left"}>
                      {booking.service
                        .map(
                          (serviceId) =>
                            data?.services.find((s) => s.id === serviceId)?.name
                        )
                        .filter(Boolean)
                        .join(", ")}
                    </TableCell>
                    <TableCell
                      className={locale === "ar" ? "text-right" : "text-left"}>
                      {booking.date} {t("at")} {booking.time}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.sharing.title")}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {t("dashboard.sharing.subtitle")}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input value={bookingPageUrl} readOnly className="flex-1" />
            <Button onClick={handleCopyLink}>
              <Copy className="h-4 w-4 mr-2" />
              {t("dashboard.sharing.copy")}
            </Button>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              {t("dashboard.sharing.share")}
            </Button>
            <Button variant="outline" onClick={() => setShowQRCode(true)}>
              <QrCode className="h-4 w-4 mr-2" />
              {t("dashboard.sharing.qrcode")}
            </Button>
          </div>
        </CardContent>
      </Card>
      <Dialog open={isEditBarberOpen} onOpenChange={setIsEditBarberOpen}>
        {renderBarberDialog(true)}
      </Dialog>
      <Dialog open={isEditServiceOpen} onOpenChange={setIsEditServiceOpen}>
        {renderServiceDialog(true)}
      </Dialog>
      <QRCodeGenerator
        url={bookingPageUrl}
        isOpen={showQRCode}
        onClose={() => setShowQRCode(false)}
      />
    </div>
  );
}
