"use client";

import { useRouter } from "next/navigation";
import { useSignIn } from "@/app/api/auth/sign-in";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
import { toast } from "sonner";

import { useTranslation } from "react-i18next";
import { useState } from "react";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();

  const { mutate: signInMutate } = useSignIn();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormInputs) => {
    setIsLoading(true);
    signInMutate(
      { email: data.email, password: data.password },
      {
        onSuccess: (loggedInUser) => {
          const uid = loggedInUser.user.uid;

          const shopsRef = collection(db, "shops");
          const q = query(shopsRef, where("ownerId", "==", uid));

          getDocs(q)
            .then((querySnapshot) => {
              if (!querySnapshot.empty) {
                const shopData = querySnapshot.docs[0].data();
                router.push(`/barber/${shopData.slug}/dashboard`);
              } else {
                toast.error(t("login.noShopFound"));
              }
            })
            .catch(() => {
              toast.error(t("login.loginFailed"));
            })
            .finally(() => {
              setIsLoading(false);
            });
        },
        onError: () => {
          toast.error(t("login.loginFailed"));
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl md:text-3xl">
            {t("login.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Label>{t("login.emailLabel")}</Label>
              <Input
                type="email"
                placeholder={t("login.emailPlaceholder")}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {t("login.invalidEmail")}
                </p>
              )}
            </div>

            <div>
              <Label>{t("login.passwordLabel")}</Label>
              <Input
                type="password"
                placeholder={t("login.passwordPlaceholder")}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {t("login.invalidPassword")}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t("login.loggingIn") : t("login.loginButton")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
