"use client";

import React from "react";
import { Button } from "@components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { ArrowRight, Ticket, Search, UserCircle } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@lib/translation/useTranslation";

const home = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t("title")}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t("subtitle")}
        </p>
      </div>

      <div className="bg-white rounded-lg p-8 shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">{t("how_it_works")}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">{t("step_1")}</h3>
            <p className="text-gray-600">
              {t('step_1_desc')}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2"> {t('step_2')} </h3>
            <p className="text-gray-600">
              {t('step_2_desc')}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">{t('step_3')}</h3>
            <p className="text-gray-600">
              { t('step_3_desc') }
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5" />
              {t('add_prize_bonds')}
            </CardTitle>
            <CardDescription>
              {t('add_bonds_desc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/profile">
              <Button className="w-full hover:shadow-sm cursor-pointer">
                {t('manage_bonds')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              {t('match_results')}
            </CardTitle>
            <CardDescription>
              {t('check_results_desc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/result">
              <Button className="w-full hover:shadow-sm cursor-pointer" variant="secondary">
                {t('check_results')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle className="h-5 w-5" />
              {t('profile')}
            </CardTitle>
            <CardDescription>
              {t('view_manage_account')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/profile">
              <Button className="w-full hover:shadow-sm cursor-pointer" variant="outline">
                {t('view_profile')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default home;
