import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Badge } from "@/app/components/ui/badge";
import { Clock, DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";

import { type Service } from "./BookingWizard";

interface ServiceSelectionProps {
  selectedServices: Service[];
  onServicesChange: (services: Service[]) => void;
  services: Service[];
}

export function ServiceSelection({
  selectedServices,
  onServicesChange,
  services,
}: ServiceSelectionProps) {
  const { t } = useTranslation();

  const handleServiceToggle = (service: Service) => {
    const isSelected = selectedServices.some((s) => s.id === service.id);
    if (isSelected) {
      onServicesChange(selectedServices.filter((s) => s.id !== service.id));
    } else {
      onServicesChange([...selectedServices, service]);
    }
  };

  const totalDuration = selectedServices.reduce(
    (sum, service) => sum + service.duration,
    0
  );
  const totalPrice = selectedServices.reduce(
    (sum, service) => sum + service.price,
    0
  );

  return (
    <div className="space-y-6">
      <div>
        <h2>{t("chooseServices")}</h2>
        <p className="text-muted-foreground">{t("servicesSubtitle")}</p>
      </div>

      {selectedServices.length > 0 && (
        <Card className="bg-accent/30">
          <CardHeader>
            <CardTitle className="text-lg">
              {t("selectedServicesSummary")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedServices.map((service) => (
                <div
                  key={service.id}
                  className="flex justify-between items-center text-sm">
                  <span>{service.name}</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      <Clock className="w-3 h-3" />
                      {service.duration} {t("minutes")}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <DollarSign className="w-3 h-3" />${service.price}
                    </Badge>
                  </div>
                </div>
              ))}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between items-center font-medium">
                  <span>{t("total")}</span>
                  <div className="flex items-center space-x-2">
                    <Badge className="text-xs">
                      <Clock className="w-3 h-3" />
                      {totalDuration} {t("minutes")}
                    </Badge>
                    <Badge className="text-xs">
                      <DollarSign className="w-3 h-3" />${totalPrice}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => {
          const isSelected = selectedServices.some((s) => s.id === service.id);

          return (
            <Card
              key={service.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected
                  ? "ring-2 ring-primary bg-accent/50"
                  : "hover:bg-accent/30"
              }`}
              onClick={() => handleServiceToggle(service)}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    checked={isSelected}
                    onChange={() => handleServiceToggle(service)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="truncate">{service.name}</h3>
                      <div className="flex flex-col items-end space-y-1">
                        <Badge variant="outline" className="text-xs">
                          <DollarSign className="w-3 h-3" />${service.price}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          <Clock className="w-3 h-3" />
                          {service.duration} {t("minutes")}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
