"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { BarberSelection } from "./BarberSelection";
import { ServiceSelection } from "./ServiceSelection";
import { DateTimeSelection } from "./DateTimeSelection";
import { ContactForm } from "./ContactForm";
import { BookingConfirmation } from "./BookingConfirmation";

export interface Barber {
  id: string;
  name: string;
  specialty: string;
  image: string;
  workingHours: {
    start: string;
    end: string;
  };
  bookedSlots: string[];
}

export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
}

export interface BookingData {
  barber?: Barber;
  services: Service[];
  date?: string;
  time?: string;
  customerName?: string;
  customerPhone?: string;
}

export function BookingWizard() {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    services: [],
  });

  const steps = [
    {
      id: 1,
      title: t("steps.selectBarber.title"),
      description: t("steps.selectBarber.description"),
    },
    {
      id: 2,
      title: t("steps.chooseServices.title"),
      description: t("steps.chooseServices.description"),
    },
    {
      id: 3,
      title: t("steps.pickDateTime.title"),
      description: t("steps.pickDateTime.description"),
    },
    {
      id: 4,
      title: t("steps.yourDetails.title"),
      description: t("steps.yourDetails.description"),
    },
    {
      id: 5,
      title: t("steps.confirmation.title"),
      description: t("steps.confirmation.description"),
    },
  ];

  const updateBookingData = (data: Partial<BookingData>) => {
    setBookingData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!bookingData.barber;
      case 2:
        return bookingData.services.length > 0;
      case 3:
        return !!bookingData.date && !!bookingData.time;
      case 4:
        return !!bookingData.customerName && !!bookingData.customerPhone;
      default:
        return true;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BarberSelection
            selectedBarber={bookingData.barber}
            onBarberSelect={(barber) => updateBookingData({ barber })}
          />
        );
      case 2:
        return (
          <ServiceSelection
            selectedServices={bookingData.services}
            onServicesChange={(services) => updateBookingData({ services })}
          />
        );
      case 3:
        return (
          <DateTimeSelection
            barber={bookingData.barber!}
            selectedServices={bookingData.services}
            selectedDate={bookingData.date}
            selectedTime={bookingData.time}
            onDateSelect={(date) => updateBookingData({ date })}
            onTimeSelect={(time) => updateBookingData({ time })}
          />
        );
      case 4:
        return (
          <ContactForm
            customerName={bookingData.customerName}
            customerPhone={bookingData.customerPhone}
            onContactChange={(name, phone) =>
              updateBookingData({ customerName: name, customerPhone: phone })
            }
          />
        );
      case 5:
        return <BookingConfirmation bookingData={bookingData} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-[85%] mx-auto p-4 space-y-6">
      {/* Progress Steps */}
      <Card>
        <CardHeader>
          <CardTitle>{t("salonName")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="flex items-center gap-2 w-full md:w-auto">
                <div
                  className={`
              w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold
              ${
                currentStep === step.id
                  ? "bg-primary text-primary-foreground ring-2 ring-primary"
                  : currentStep > step.id
                  ? "bg-muted text-muted-foreground ring-2 ring-muted"
                  : "bg-gray-200 text-gray-500"
              }
            `}>
                  {step.id}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm md:text-base whitespace-nowrap">
                    {step.title}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block h-px flex-1 bg-border mx-2" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Step Content */}
      <div className="min-h-[300px]">{renderStepContent()}</div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}>
          {t("previous")}
        </Button>

        {currentStep < steps.length ? (
          <Button onClick={nextStep} disabled={!canProceed()}>
            {t("next")}
          </Button>
        ) : (
          <Button onClick={() => alert(t("confirmBooking") + "!")}>
            {t("confirmBooking")}
          </Button>
        )}
      </div>
    </div>
  );
}
