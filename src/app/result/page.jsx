"use client";

import { useState, useEffect } from "react";
import { Button } from "@components/ui/button";
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
  const [allLoading, setAllLoading] = useState(false);
  const [history, setHistory] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    fetchDraws();
  }, []);
  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const data = await prizeBondAPI.getWinningHistory();
      if (data.success) setHistory(data.data);
    } catch (e) {}
    setHistoryLoading(false);
  };
  const handleCheckAllDraws = async () => {
    setAllLoading(true);
    setSelectedDraw("");
    setResults([]);
    try {
      const matchResults = await prizeBondAPI.matchResult();
      if (!matchResults.success || matchResults.error) {
        return Notification({
          message: matchResults?.message || "Failed to fetch results",
        });
      }
      setResults(matchResults.data);
      setSelectedDraw("all");
    } catch (error) {
      Notification({
        message: "Failed to fetch results due to technical issue.",
      });
    } finally {
      setAllLoading(false);
    }
  };
  const handleClaim = async (bond_number) => {
    try {
      const data = await prizeBondAPI.claimBond(bond_number);
      if (data.success) {
        Notification({ message: "Claimed successfully!", type: "success" });
        setResults((prev) =>
          prev.map((r) =>
            r.bond_number === bond_number ? { ...r, is_claimed: 1 } : r
          )
        );
        fetchHistory();
      } else {
        Notification({ message: data.message || "Failed to claim." });
      }
    } catch (e) {
      Notification({ message: "Failed to claim due to technical issue." });
    }
  };

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

        {/* ------- Draw Selection Section ------- */}
        <Card className="mb-8 gap-2">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                <span>{t("select_draw")}</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="text-xs px-3 py-1 border-blue-500 text-blue-700 hover:bg-blue-50 cursor-pointer mb-4 sm:mb-0"
                onClick={handleCheckAllDraws}
                disabled={allLoading}
              >
                {allLoading ? t("loading_results") : t("check_all_draws")}
              </Button>
            </div>
            <CardDescription>{t("choose_draw")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedDraw} onValueChange={handleDrawSelect}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("select_draw_number")} />
              </SelectTrigger>
              <SelectContent>
                {drawNo.map((drawNum) => (
                  <SelectItem
                    key={drawNum}
                    value={drawNum.toString()}
                    className="cursor-pointer"
                  >
                    {addOrdinalSuffix(drawNum)} {t("draw")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* ------- Result Section ------- */}
        {loading || allLoading ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-gray-500">
                {t("loading_results")}...
              </p>
            </CardContent>
          </Card>
        ) : results.length ? (
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
                    className="bg-green-50 border border-green-200 rounded-lg p-4 flex justify-between items-center gap-2"
                  >
                    <div>
                      <p className="font-medium text-green-800">
                        {result.bond_number}{" "}
                        <span className="text-sm text-green-600">
                          ({result.prize_name})
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        {t("draw")}: {result.draw_id},{" "}
                        Date: {new Date(result.draw_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <p className="text-lg font-bold text-green-800">
                        {t("tk")} {result.prize_amount.toLocaleString()}
                      </p>
                      {result.is_claimed ? (
                        <span className="text-xs px-2 py-1 bg-green-200 text-green-600 rounded">
                          {t("claimed")}
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          className="text-xs px-3 py-1 bg-green-300 hover:bg-green-500 text-green-700"
                          onClick={() => handleClaim(result.bond_number)}
                        >
                          {t("claim")}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : selectedDraw && !results.length ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-gray-500">{t("no_win")}</p>
            </CardContent>
          </Card>
        ) : null}

        {/* ------- Winning History Section ------- */}
        <Card className="mb-8 mt-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-0 shadow-md">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-transparent">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-purple-500" />
              <h2 className="text-xl font-bold text-gray-800">
                {t("winning_history")}
              </h2>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="text-xs px-3 py-1 border-purple-400 text-purple-700 hover:bg-purple-50"
              onClick={fetchHistory}
              disabled={historyLoading || history}
            >
              {historyLoading ? t("loading_results") : t("see_history")}
            </Button>
          </CardHeader>
          <CardContent>
            {historyLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="bg-purple-100/60 rounded-lg p-4 animate-pulse h-24"
                  />
                ))}
              </div>
            ) : history === null ? (
              <></>
            ) : !history.length ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Trophy className="h-10 w-10 text-purple-300 mb-2" />
                <p className="text-purple-700 text-center font-medium text-lg">
                  {t("no_history")}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {t("no_history_hint")}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {history.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white/80 border border-purple-100 rounded-lg p-4 flex flex-col gap-1 shadow-sm"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-purple-900">
                        {item.bond_number}
                      </span>
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                        {t("claimed")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">{item.prize_name}</span>
                      <span className="text-purple-700 font-bold">
                        {t("tk")} {item.prize_amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                      <span>
                        {t("draw")}: {item.draw_id}
                      </span>
                      <span>
                        {new Date(item.draw_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ------- official result link ------- */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t("official_results")}</CardTitle>
            <CardDescription>
              {t("official_results_desc")} -{" "}
              <Link
                className="text-blue-800 underline"
                target="_blank"
                href="https://nationalsavings.gov.bd/site/page/2be4013b-857c-4e88-81ca-5a53b39dcacd/প্রাইজ-বন্ড-ফলাফল"
              >
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
