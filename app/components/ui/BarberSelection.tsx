import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

import { type Barber } from "@/app/barber/[slug]/clientSelectBooking/BarberSelection";

interface BarberSelectionProps {
  selectedBarber?: Barber;
  onBarberSelect: (barber: Barber) => void;
}

export function BarberSelection({
  selectedBarber,
  onBarberSelect,
}: BarberSelectionProps) {
  const mockBarbers: Barber[] = [
    {
      id: "1",
      name: "Marcus Johnson",
      specialty: `t.barberDefinitions.marcus.specialty`,
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      workingHours: { start: "09:00", end: "17:00" },
      bookedSlots: ["10:00", "11:30", "14:00", "15:30"],
    },
    {
      id: "2",
      name: "David Rodriguez",
      specialty: `t.barberDefinitions.david.specialty`,
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      workingHours: { start: "10:00", end: "18:00" },
      bookedSlots: ["10:30", "12:00", "13:30", "16:00"],
    },
    {
      id: "3",
      name: "Alex Thompson",
      specialty: `t.barberDefinitions.alex.specialty`,
      image:
        "https://images.unsplash.com/photo-1463453091185-61582044d556?w=300&h=300&fit=crop&crop=face",
      workingHours: { start: "08:00", end: "16:00" },
      bookedSlots: ["09:00", "11:00", "13:00", "15:00"],
    },
    {
      id: "4",
      name: "Jake Wilson",
      specialty: `t.barberDefinitions.jake.specialty`,
      image:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=face",
      workingHours: { start: "11:00", end: "19:00" },
      bookedSlots: ["12:00", "14:30", "16:00", "17:30"],
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2>chooseBarber</h2>
        <p className="text-muted-foreground">barberSubtitle</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockBarbers.map((barber) => (
          <Card
            key={barber.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedBarber?.id === barber.id
                ? "ring-2 ring-primary bg-accent/50"
                : "hover:bg-accent/30"
            }`}
            onClick={() => onBarberSelect(barber)}>
            <CardContent className="p-4">
              <div className={`flex items-start space-x-4 $`}>
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
                      {barber.workingHours.start} - {barber.workingHours.end}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      availableToday
                    </Badge>
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
