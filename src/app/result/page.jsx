"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { prizeBondAPI } from "@apiManager/prizeBondAPI";
import { Search, Trophy } from "lucide-react";
import Notification from "@components/notification";
import { useTranslation } from "@lib/translation/useTranslation";
import Link from "next/link";

export default function ResultsPage() {
  const [drawNo, setDrawNo] = useState([]);
  const [selectedDraw, setSelectedDraw] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    fetchDraws();
  }, []);

  const fetchDraws = async () => {
    try {
      const response = await prizeBondAPI.getDrawRange();
      if (!response.success || response.error) {
        return Notification({
          message: response?.message || "Failed to fetch draws",
        });
      }
      if (!response.data) {
        return Notification({ message: "No draws available" });
      }
      // setDraws(response?.data);
      generateDrawOptions(response.data);
    } catch (error) {
      Notification({
        message: "Failed to fetch draws due to technical issue.",
      });
    }
  };

  const handleDrawSelect = async (drawId) => {
    setSelectedDraw(drawId);
    setLoading(true);
    try {
      const matchResults = await prizeBondAPI.matchResult(parseInt(drawId));
      if (!matchResults.success || matchResults.error) {
        return Notification({
          message: matchResults?.message || "Failed to fetch results",
        });
      }
      if (matchResults.data) {
        setResults(matchResults.data);
      }
    } catch (error) {
      Notification({
        message: "Failed to fetch results due to technical issue.",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateDrawOptions = (data) => {
    if (!data) setDrawNo([]);

    const options = [];
    const { first_draw, last_draw } = data;
    for (let i = first_draw; i <= last_draw; i++) {
      options.push(i);
    }
    options.sort((a, b) => b - a);
    setDrawNo(options);
  };

  const addOrdinalSuffix = (num) => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return num + "st";
    if (j === 2 && k !== 12) return num + "nd";
    if (j === 3 && k !== 13) return num + "rd";
    return num + "th";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t("prize_bond_results")}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("results_description")}
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              {t("select_draw")}
            </CardTitle>
            <CardDescription>{t("choose_draw")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedDraw} onValueChange={handleDrawSelect}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("select_draw_number")} />
              </SelectTrigger>
              <SelectContent>
                {drawNo.map((drawNum) => (
                  <SelectItem key={drawNum} value={drawNum.toString()}>
                    {addOrdinalSuffix(drawNum)} {t("draw")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {loading ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-gray-500">
                {t("loading_results")}...
              </p>
            </CardContent>
          </Card>
        ) : selectedDraw && results.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                {t("winning_results")}
              </CardTitle>
              <CardDescription>{t("congrats")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="bg-green-50 border border-green-200 rounded-lg p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-green-800">
                        {result.bond_number}
                      </p>
                      <p className="text-sm text-green-600">
                        {result.prize_name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-800">
                        {t("tk")} {result.prize_amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : selectedDraw ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-gray-500">{t("no_win")}</p>
            </CardContent>
          </Card>
        ) : null}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t("official_results")}</CardTitle>
            <CardDescription>
              {t("official_results_desc")} -{" "}
              <Link className="text-blue-800 underline" target="_blank" href="https://nationalsavings.gov.bd/site/page/2be4013b-857c-4e88-81ca-5a53b39dcacd/প্রাইজ-বন্ড-ফলাফল">
                {t("official_results_link")}
              </Link>{" "}
            </CardDescription>
          </CardHeader>
        </Card>
        {/* nationalsavings.gov.bd/site/page/2be4013b-857c-4e88-81ca-5a53b39dcacd/প্রাইজ-বন্ড-ফলাফল */}
      </div>
    </div>
  );
}
