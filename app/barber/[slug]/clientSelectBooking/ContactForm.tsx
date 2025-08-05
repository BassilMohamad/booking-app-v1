import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Phone } from "lucide-react";

interface ContactFormProps {
  customerName?: string;
  customerPhone?: string;
  onContactChange: (name: string, phone: string) => void;
}

export function ContactForm({
  customerName = "",
  customerPhone = "",
  onContactChange,
}: ContactFormProps) {
  const { t } = useTranslation();
  const [name, setName] = useState(customerName);
  const [phone, setPhone] = useState(customerPhone);
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const validateName = (value: string) => {
    if (!value.trim()) {
      setNameError(t("nameRequired"));
      return false;
    }
    if (value.trim().length < 2) {
      setNameError(t("nameMinLength"));
      return false;
    }
    setNameError("");
    return true;
  };

  const validatePhone = (value: string) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!value.trim()) {
      setPhoneError(t("phoneRequired"));
      return false;
    }
    if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ""))) {
      setPhoneError(t("phoneInvalid"));
      return false;
    }
    setPhoneError("");
    return true;
  };

  const handleNameChange = (value: string) => {
    setName(value);
    validateName(value);
    if (validateName(value) && validatePhone(phone)) {
      onContactChange(value, phone);
    }
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    validatePhone(value);
    if (validateName(name) && validatePhone(value)) {
      onContactChange(name, value);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>{t("contactInformation")}</h2>
        <p className="text-muted-foreground">{t("contactSubtitle")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("contactDetails")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="customer-name" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {t("fullName")}
            </Label>
            <Input
              id="customer-name"
              type="text"
              placeholder={t("enterFullName")}
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className={nameError ? "border-destructive" : ""}
            />
            {nameError && (
              <p className="text-sm text-destructive">{nameError}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer-phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              {t("phoneNumber")}
            </Label>
            <Input
              id="customer-phone"
              type="tel"
              placeholder={t("enterPhoneNumber")}
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className={phoneError ? "border-destructive" : ""}
              dir="ltr"
            />
            {phoneError && (
              <p className="text-sm text-destructive">{phoneError}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {t("smsConfirmation")}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-accent/30">
        <CardHeader>
          <CardTitle className="text-lg">{t("privacyNotice")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t("privacyText")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
