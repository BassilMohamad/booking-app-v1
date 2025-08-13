"use client";

import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Separator } from "@/app/components/ui/separator";

import { Calendar, Clock, User, Phone, Scissors } from "lucide-react";
import { type BookingData } from "./BookingWizard";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/app/components/ui/avatar";

interface BookingConfirmationProps {
  bookingData: BookingData;
}

export function BookingConfirmation({ bookingData }: BookingConfirmationProps) {
  const { t } = useTranslation();
  const { barber, services, date, time, customerName, customerPhone } =
    bookingData;

  const totalDuration = services.reduce(
    (sum, service) => sum + service.duration,
    0
  );
  const totalPrice = services.reduce((sum, service) => sum + service.price, 0);
  console.log(totalPrice);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(true ? "ar-SA" : "en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string, duration: number) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const startTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;

    const endTime = new Date();
    endTime.setHours(hours, minutes + duration);
    const endTimeString = endTime.toTimeString().slice(0, 5);

    return `${startTime} - ${endTimeString}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>{t("confirmYourBooking")}</h2>
        <p className="text-muted-foreground">{t("confirmSubtitle")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {t("appointmentSummary")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{date && formatDate(date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">
                {time && formatTime(time, totalDuration)}
              </span>
            </div>
          </div>

          <Separator />

          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
              <Avatar className="w-16 h-16 flex-shrink-0">
                {barber?.photo ? (
                  <AvatarImage src={barber.photo} alt={barber.name} />
                ) : (
                  <AvatarFallback className="flex items-center justify-center w-full h-full">
                    {barber?.name
                      ? barber.name.slice(0, 2).toUpperCase()
                      : "BB"}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>

            <div>
              <p className="font-medium">{barber?.name}</p>
              <p className="text-sm text-muted-foreground">
                {barber?.specialty}
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Scissors className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{t("selectedServices")}</span>
            </div>
            {services.map((service) => (
              <div
                key={service.id}
                className="flex justify-between items-center py-2 px-3 bg-accent/30 rounded-md">
                <div>
                  <p className="font-medium">{service.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {service.description}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <Badge variant="outline" className="text-xs">
                    {service.price}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    <Clock className="w-3 h-3" />
                    {service.duration} {t("minutes")}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          <div className="flex justify-between items-center py-3 px-4 bg-primary/10 rounded-md">
            <span className="font-medium">{t("total")}</span>
            <div className="flex items-center space-x-3">
              <Badge className="text-sm">
                <Clock className="w-3 h-3" />
                {totalDuration} {t("minutes")}
              </Badge>
              <Badge className="text-sm">{totalPrice}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {t("yourInformation")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span>{t("name")}</span>
            </div>
            <span className="font-medium">{customerName}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span>{t("phone")}</span>
            </div>
            <span className="font-medium" dir="ltr">
              {customerPhone}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-accent/30">
        <CardHeader>
          <CardTitle className="text-lg">{t("importantNotes")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">{t("notes.arrive")}</p>
          <p className="text-sm text-muted-foreground">
            {t("notes.cancellation")}
          </p>
          <p className="text-sm text-muted-foreground">{t("notes.payment")}</p>
        </CardContent>
      </Card>
    </div>
  );
}
