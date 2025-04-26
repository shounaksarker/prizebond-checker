"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Label } from "@components/ui/label";
import { authAPI } from "@apiManager/authAPI";
import Link from "next/link";
import Notification from "@components/notification";
import GoogleAuthButton from "@components/googleAuthBtn";
import { useTranslation } from "@lib/translation/useTranslation";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authAPI.login(formData);
      if (response.error) {
        return Notification({ message: response.error || "Something Error" });
      } else {
        localStorage.setItem("token", response.data.token);
        Notification({ message: "Login Successful", type: "success" });
        window.location.href = "/"
      }
    } catch (error) {
      Notification({ message: "Login Failed for technical issue." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[92vh] flex items-center justify-center bg-gray-50 px-2">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>{t('welcome_back')}</CardTitle>
          <CardDescription>{t('login_prompt')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('enter_email')}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t('enter_password')}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>
            <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
              {loading ? t('logining') : t('login')}
            </Button>
          </form>
          <div className="flex flex-col gap-y-4 mt-4">
            <GoogleAuthButton />
            <p className="text-center text-sm text-gray-600">
              {t('no_account')}{" "}
              <Link
                href="/auth/signup"
                className="text-primary hover:underline font-semibold"
              >
                {t('sign_up')}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
