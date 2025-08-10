"use client";
import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
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
import { Calendar } from "@/app/components/ui/calendar";
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

type ServiceForm = Partial<Service>;

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
}

interface Booking {
  id: string;
  barberId: string;
  customerName: string;
  customerPhone: string;
  service: string;
  date: Date;
  time: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
}
type BarberForm = Partial<BarberNewData>;

export default function OwnerDashboard() {
  const { t } = useTranslation();
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

  const [services, setServices] = useState<Service[]>([
    // {
    //   id: "haircut",
    //   name: "Haircut",
    //   duration: 30,
    //   price: 25,
    //   description: "Classic haircut and styling",
    // },
    // {
    //   id: "beard-trim",
    //   name: "Beard Trim",
    //   duration: 15,
    //   price: 15,
    //   description: "Professional beard trimming",
    // },
    // {
    //   id: "hair-wash",
    //   name: "Hair Wash",
    //   duration: 20,
    //   price: 10,
    //   description: "Shampoo and conditioning",
    // },
  ]);

  const [bookings] = useState<Booking[]>([]);

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
  const [newBarber, setNewBarber] = useState<BarberForm>({});

  const bookingPageUrl = `https://booking.yoursalon.com/${generateSalonId()}`;

  function generateSalonId() {
    return Math.random().toString(36).substring(2, 15);
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (editingBarber) {
          setEditingBarber({ ...editingBarber, photo: result });
        } else {
          setNewBarber({ ...newBarber, photo: result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddBarber = () => {
    if (newBarber.name) {
      const barber: BarberNewData = {
        id: generateBarberId,
        name: newBarber.name,
        photo: newBarber.photo || "",
        workingHours: newBarber.workingHours || {},
      };

      setIsAddBarberOpen(false);
      toast.success("Barber added successfully");
      addNewBarberData(
        { shopSlug, barber: barber },
        {
          onError: (e) => {
            console.log(e);
          },
          onSuccess: () => {
            setNewBarber({});
            refetch();
          },
        }
      );
    }
  };

  const handleEditBarber = (barber: BarberNewData) => {
    setEditingBarber({ ...barber });
    setIsEditBarberOpen(true);
  };

  const handleUpdateBarber = () => {
    if (editingBarber) {
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
            toast.success("Barber updated successfully");
          },
          onError: (error) => {
            toast.error(error.message || "Failed to update barber");
          },
        }
      );
    }
  };

  const handleDeleteBarber = (barberId: string) => {
    deleteBarber({ shopSlug, barberId });
    refetch();
    setBarbers(barbers.filter((b) => b.id !== barberId));
    toast.success("Barber deleted successfully");
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
            toast.success("Service added successfully");
          },
          onError: (e) => {
            console.log(e);
          },
        }
      );
    }
  };

  const handleEditService = (service: Service) => {
    setEditingService({ ...service });
    setIsEditServiceOpen(true);
  };

  const handleUpdateService = () => {
    if (editingService) {
      setServices(
        services.map((s) =>
          s.id === editingService.id ? (editingService as Service) : s
        )
      );

      updateSer(
        { shopSlug, service: editingService as Service },
        {
          onSuccess: () => {
            toast.success("Service updated successfully");
            refetch();
          },
          onError: (err) => toast.error(err.message),
        }
      );

      setIsEditServiceOpen(false);
    }
  };

  const handleDeleteService = (serviceId: string) => {
    deleteService(
      { shopSlug, serviceId },
      {
        onSuccess: () => {
          toast.success("Service deleted successfully");
          refetch();
        },
        onError: (error) => {
          toast.error(error.message || "Failed to delete service");
        },
      }
    );
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(bookingPageUrl);
      toast.success("Link copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Book an appointment",
          text: "Book your appointment with our salon",
          url: bookingPageUrl,
        });
      } catch (error) {
        console.log("Share canceled");
      }
    } else {
      toast.error("Share not supported on this device");
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const barberMatch =
      selectedBarber === "all" || booking.barberId === selectedBarber;
    const dateMatch =
      !selectedDate ||
      format(booking.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
    return barberMatch && dateMatch;
  });

  useEffect(() => {
    setBarbers(data?.barbers || []);
    setServices(data?.services || []);
    refetch();
  }, [data, refetch]);

  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const renderBarberDialog = (isEdit: boolean, barber?: BarberNewData) => {
    const currentBarber = isEdit ? editingBarber : newBarber;
    const setCurrentBarber = isEdit ? setEditingBarber : setNewBarber;

    return (
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Barber" : t("dashboard.barbers.add")}
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
                onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Photo
              </Button>
              {currentBarber?.photo && (
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentBarber({ ...currentBarber, photo: undefined })
                  }>
                  Remove
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
            <Label>Working Hours</Label>
            <div className="space-y-3 mt-2">
              {days.map((day) => (
                <div key={day} className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-24 capitalize">{t(`days.${day}`)}</div>
                    <Switch
                      dir="ltr"
                      checked={
                        currentBarber?.workingHours?.[day]?.available || false
                      }
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
                          onChange={(e) => {
                            setCurrentBarber({
                              ...currentBarber,
                            });
                          }}
                        />
                        <span>to</span>
                        <Input
                          type="time"
                          className="w-30"
                          value={
                            currentBarber?.workingHours?.[day]?.end || "17:00"
                          }
                          onChange={(e) => {
                            setCurrentBarber({
                              ...currentBarber,
                            });
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
            {isEdit ? "Edit Service" : "Add New Service"}
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
      {/* Header */}
      <div>
        <h1>{t("dashboard.header.title")}</h1>
        <p className="text-muted-foreground">
          {t("dashboard.header.subtitle")}
        </p>
      </div>

      {/* Barbers Section */}
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
                    {/* <p className="text-sm text-muted-foreground">
                      {barber.email}
                    </p> */}
                    {/* <div className="flex gap-1 mt-2">
                      {barber.services.map((service) => (
                        <Badge key={service} variant="secondary">
                          {service}
                        </Badge>
                      ))}
                    </div> */}
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

      {/* Services Section */}
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
                      Duration: {service.duration}min
                    </span>
                    <span className="text-sm">Price: ${service.price}</span>
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

      {/* Bookings Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.bookings.title")}</CardTitle>
          <div className="flex gap-4 mt-4">
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
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("table.customer")}</TableHead>
                <TableHead>{t("table.barber")}</TableHead>
                <TableHead>{t("table.service")}</TableHead>
                <TableHead>{t("table.datetime")}</TableHead>
                <TableHead>{t("table.status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => {
                const barber = barbers.find((b) => b.id === booking.barberId);
                return (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div>
                        <div>{booking.customerName}</div>
                        <div className="text-sm text-muted-foreground">
                          {booking.customerPhone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{barber?.name}</TableCell>
                    <TableCell>{booking.service}</TableCell>
                    <TableCell>
                      {format(booking.date, "MMM dd, yyyy")} at {booking.time}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          booking.status === "confirmed"
                            ? "default"
                            : "secondary"
                        }>
                        {t(`status.${booking.status}`)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Sharing Section */}
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

      {/* Edit Barber Dialog */}
      <Dialog open={isEditBarberOpen} onOpenChange={setIsEditBarberOpen}>
        {renderBarberDialog(true)}
      </Dialog>

      {/* Edit Service Dialog */}
      <Dialog open={isEditServiceOpen} onOpenChange={setIsEditServiceOpen}>
        {renderServiceDialog(true)}
      </Dialog>

      {/* QR Code Generator */}
      <QRCodeGenerator
        url={bookingPageUrl}
        isOpen={showQRCode}
        onClose={() => setShowQRCode(false)}
      />
    </div>
  );
}
