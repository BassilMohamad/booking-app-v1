import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Clock, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Barber, type Service } from "./BookingWizard";
import { useBookedSlots } from "@/app/api/useBookedSlots";
import { Calendar } from "@/components/ui/calendar";

interface DateTimeSelectionProps {
  barber: Barber;
  selectedServices: Service[];
  selectedDate?: string;
  selectedTime?: string;
  onDateSelect: (date: string) => void;
  onTimeSelect: (time: string | undefined) => void;
  shopSlug: string;
}

type Day = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

function getDayKey(date: Date): Day {
  return date
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase() as Day;
}

function formatDateToISO(date: Date) {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function DateTimeSelection({
  barber,
  selectedServices,
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
  shopSlug,
}: DateTimeSelectionProps) {
  const { t } = useTranslation();
  const { data: bookedSlots = [], isLoading } = useBookedSlots(
    shopSlug,
    barber.id,
    selectedDate
  );

  // Start with no date selected to force user selection
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(undefined);

  const totalDuration = selectedServices.reduce(
    (sum, service) => sum + service.duration,
    0
  );

  // Clear selectedTime when selectedDate changes
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setCalendarDate(date);
    onDateSelect(formatDateToISO(date));
    onTimeSelect(undefined);
  };

  const generateTimeSlots = () => {
    if (!calendarDate) return [];

    const dayKey = getDayKey(calendarDate);
    const dayWorkingHours = barber.workingHours[dayKey];

    if (!dayWorkingHours || !dayWorkingHours.available) {
      return [];
    }

    const [startHour, startMinute] = dayWorkingHours.start
      .split(":")
      .map(Number);
    const [endHour, endMinute] = dayWorkingHours.end.split(":").map(Number);

    let currentTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;

    const now = new Date();
    const isToday = calendarDate.toDateString() === now.toDateString();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const slots = [];

    while (currentTime < endTime) {
      if (isToday && currentTime < currentMinutes) {
        currentTime += 30;
        continue;
      }

      const hours = Math.floor(currentTime / 60);
      const minutes = currentTime % 60;
      const timeString = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;

      // Just check if the time is booked (ignore totalDuration)
      const isBooked = bookedSlots.includes(timeString);

      slots.push({
        time: timeString,
        available: !isBooked,
      });

      currentTime += 30;
    }

    return slots;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-SA", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const timeSlots = generateTimeSlots();

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading available times...
      </div>
    );
  }

  return (
    <div className={cn("space-y-6")}>
      <div>
        <h2>{t("chooseDateAndTime")}</h2>
        <p className={cn("text-muted-foreground")}>
          {t("dateTimeSubtitle", { name: barber.name })}
        </p>
      </div>

      <Card className={cn("bg-accent/30")}>
        <CardHeader>
          <CardTitle className={cn("text-lg")}>
            {t("appointmentDetails")}
          </CardTitle>
        </CardHeader>
        <CardContent className={cn("space-y-3")}>
          <div className={cn("flex justify-between items-center")}>
            <span>{t("barber")}</span>
            <span className={cn("font-medium")}>{barber.name}</span>
          </div>
          <div className={cn("flex justify-between items-center")}>
            <span>{t("servicesLabel")}</span>
            <span className={cn("font-medium")}>
              {selectedServices.length} {t("selected")}
            </span>
          </div>
          <div className={cn("flex justify-between items-center")}>
            <span>{t("totalDuration")}</span>
            <Badge className={cn("text-xs")}>
              <Clock className={cn("w-3 h-3")} />
              {totalDuration} {t("minutes")}
            </Badge>
          </div>
          <div className={cn("flex justify-between items-center")}>
            <span>{t("workingHours")}</span>
            <Badge variant="outline" className={cn("text-xs")}>
              {calendarDate
                ? barber.workingHours[getDayKey(calendarDate)].start +
                  " - " +
                  barber.workingHours[getDayKey(calendarDate)].end
                : "-"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-6")}>
        <Card>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 `}>
              <CalendarIcon className="w-5 h-5" />
              {t("selectDate")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={calendarDate}
              onSelect={handleDateSelect}
              disabled={(date) => {
                const todayMidnight = new Date();
                todayMidnight.setHours(0, 0, 0, 0);
                if (date < todayMidnight) return true;

                const dayKey = getDayKey(date);
                const dayInfo = barber.workingHours?.[dayKey];

                if (!dayInfo || dayInfo.available === false) {
                  return true;
                }

                return false;
              }}
            />
            {selectedDate && (
              <div className="mt-4 p-3 bg-accent/50 rounded-md">
                <p className="text-sm font-medium">{t(selectedDate)}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(selectedDate)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className={cn("flex items-center gap-2")}>
              <Clock className={cn("w-5 h-5")} />
              {t("availableTimes")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!calendarDate ? (
              <div className={cn("text-center py-8 text-muted-foreground")}>
                <CalendarIcon
                  className={cn("w-12 h-12 mx-auto mb-4 opacity-50")}
                />
                <p>{t("selectDateFirst")}</p>
              </div>
            ) : (
              <div
                className={cn(
                  "grid grid-cols-2 gap-2 max-h-80 overflow-y-auto"
                )}>
                {timeSlots.map((slot) => (
                  <Button
                    key={slot.time}
                    variant={selectedTime === slot.time ? "default" : "outline"}
                    size="sm"
                    disabled={!slot.available}
                    onClick={() => onTimeSelect(slot.time)}
                    className={cn("justify-center")}>
                    {slot.time}
                    {!slot.available && (
                      <span className={cn("text-xs opacity-60")}>
                        {t("booked")}
                      </span>
                    )}
                  </Button>
                ))}
              </div>
            )}

            {selectedTime && (
              <div className={cn("mt-4 p-3 bg-accent/50 rounded-md")}>
                <p className={cn("text-sm font-medium")}>{t("selectedTime")}</p>
                <p className={cn("text-sm text-muted-foreground")}>
                  {selectedTime} -{" "}
                  {(() => {
                    const [hours, minutes] = selectedTime
                      .split(":")
                      .map(Number);
                    const endTime = new Date();
                    endTime.setHours(hours, minutes + totalDuration);
                    return endTime.toTimeString().slice(0, 5);
                  })()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
