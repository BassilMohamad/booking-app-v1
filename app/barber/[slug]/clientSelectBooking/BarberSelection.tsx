import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

export interface WorkingDay {
  available: boolean;
  start: string;
  end: string;
}

export interface Barber {
  id: string;
  name: string;
  specialty: string;
  image: string;
  workingHours: {
    mon: WorkingDay;
    tue: WorkingDay;
    wed: WorkingDay;
    thu: WorkingDay;
    fri: WorkingDay;
    sat: WorkingDay;
    sun: WorkingDay;
  };
  bookedSlots: string[];
}

interface BarberSelectionProps {
  selectedBarber?: Barber;
  onBarberSelect: (barber: Barber) => void;
  barbers: Barber[];
}

type Day = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export function BarberSelection({
  selectedBarber,
  onBarberSelect,
  barbers,
}: BarberSelectionProps) {
  const { t } = useTranslation();

  const today = new Date();
  const dayName = today
    .toLocaleDateString("en-US", { weekday: "short" })
    .toLowerCase() as Day;

  return (
    <div className="space-y-4">
      <div>
        <h2>{t("chooseBarber")}</h2>
        <p className="text-muted-foreground">{t("barberSubtitle")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {barbers.map((barber) => (
          <Card
            key={barber.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedBarber?.id === barber.id
                ? "ring-2 ring-primary bg-accent/50"
                : "hover:bg-accent/30"
            }`}
            onClick={() => onBarberSelect(barber)}>
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                  <ImageWithFallback
                    src={barber.image}
                    alt={barber.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="truncate">{barber.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {barber.specialty}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-xs">
                      {/* {barber.workingHours[dayName].start} -{" "}
                      {barber.workingHours[dayName].end} */}
                    </Badge>
                    {/* {barber.workingHours[dayName].start ? (
                      <Badge variant="outline" className="text-xs">
                        {t("availableToday")}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        {t("notAvailableToday")}
                      </Badge>
                    )} */}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
