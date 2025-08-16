"use client";

import { useRouter } from "next/navigation";
import { useSignUpWithOwner } from "@/app/api/auth/sign-up";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { InfoIcon } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { mutate, isPending } = useSignUpWithOwner();

  const signUpSchema = z
    .object({
      shopName: z
        .string()
        .min(3, { message: t("signupScheme.errors.shopNameMin") })
        .regex(/^[a-z0-9 ]+$/i, {
          message: t("signupScheme.errors.shopNameEnglish"),
        }),
      salonName: z
        .string()
        .min(2, { message: t("signupScheme.errors.salonNameMin") }),
      phoneNumber: z
        .string()
        .min(8, { message: t("signupScheme.errors.phoneMin") })
        .max(15, { message: t("signupScheme.errors.phoneMax") })
        .regex(/^\+?[0-9]{8,15}$/, {
          message: t("signupScheme.errors.invalidPhone"),
        }),
      email: z
        .string()
        .email({ message: t("signupScheme.errors.invalidEmail") }),
      password: z
        .string()
        .min(8, { message: t("signupScheme.errors.passwordMin") })
        .regex(/[A-Z]/, { message: t("signupScheme.errors.passwordUppercase") })
        .regex(/[a-z]/, { message: t("signupScheme.errors.passwordLowercase") })
        .regex(/[0-9]/, { message: t("signupScheme.errors.passwordNumber") })
        .regex(/[^A-Za-z0-9]/, {
          message: t("signupScheme.errors.passwordSpecial"),
        }),
      confirmPassword: z
        .string()
        .min(8, { message: t("signupScheme.errors.confirmPasswordRequired") }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("signupScheme.errors.passwordsMismatch"),
      path: ["confirmPassword"],
    });

  type SignUpFormInputs = z.infer<typeof signUpSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormInputs>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = (data: SignUpFormInputs) => {
    const slug = data.shopName.trim().toLowerCase().replace(/\s+/g, "-");

    mutate(
      {
        email: data.email,
        password: data.password,
        shopName: data.shopName,
        salonName: data.salonName,
        phoneNumber: data.phoneNumber,
      },
      {
        onSuccess: () => router.push(`/barber/${slug}/dashboard`),
        onError: (error) =>
          toast.error(error.message || t("signup.signupFailed")),
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
      <div className="max-w-xl text-center mb-6">
        <h1 className="text-3xl font-bold mb-2">{t("signup.appTitle")}</h1>
        <p className="text-gray-600">{t("signup.appDescription")}</p>
      </div>

      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl md:text-3xl">
            {t("signup.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Salon Name */}
            <div>
              <Label>{t("signup.salonName")}</Label>
              <Input
                placeholder={t("signup.salonNamePlaceholder")}
                {...register("salonName")}
              />
              {errors.salonName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.salonName.message}
                </p>
              )}
            </div>
            {/* Shop Name */}
            <div>
              <Label>
                {t("signup.shopName")}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="ml-1 flex h-4 w-4 items-center justify-center text-blue-500 p-0"
                      aria-label="Info">
                      <InfoIcon className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    align="start"
                    className="max-w-xs">
                    {t("signup.shopNameTooltip")}
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Input
                placeholder={t("signup.shopNamePlaceholder")}
                {...register("shopName")}
              />
              {errors.shopName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.shopName.message}
                </p>
              )}
            </div>
            <div>
              <Label>{t("signup.phoneNumber")}</Label>
              <Input
                type="tel"
                placeholder={t("signup.phoneNumberPlaceholder")}
                {...register("phoneNumber")}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label>{t("signup.email")}</Label>
              <Input
                type="email"
                placeholder={t("signup.emailPlaceholder")}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label>{t("signup.password")}</Label>
              <Input
                type="password"
                placeholder={t("signup.passwordPlaceholder")}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <Label>{t("signup.confirmPassword")}</Label>
              <Input
                type="password"
                placeholder={t("signup.confirmPasswordPlaceholder")}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? t("signup.signingUp") : t("signup.signUpButton")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
