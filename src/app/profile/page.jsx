"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle } from "@components/ui/card";
import { prizeBondAPI } from "@apiManager/prizeBondAPI";
import Notification from "@components/notification";
import BondList from "@components/profile/BondList";
import AddBonds from "@components/profile/AddBonds";
import UserProfile from "@components/profile/UserProfile";
import { useTranslation } from "@lib/translation/useTranslation";
import { Button } from "@components/ui/button";
import Papa from "papaparse";

export default function ProfilePage() {
  const [bonds, setBonds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bondLoading, setBondLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState("id");
  const [order, setOrder] = useState("desc");
  const [downloading, setDownloading] = useState(false);

  // For single bond addition
  const [singleBonds, setSingleBonds] = useState([""]);
  // For range bond addition
  const [rangeForm, setRangeForm] = useState({
    start: "",
    end: "",
  });

  const { t } = useTranslation();

  useEffect(() => {
    fetchBonds();
  }, [page, pageSize, sortBy, order]);

  const fetchBonds = async () => {
    try {
      setBondLoading(true);
      const offset = (page - 1) * pageSize;
      const response = await prizeBondAPI.getUserBonds({
        limit: pageSize,
        offset,
        sortBy,
        order,
      });
      if (response.error) {
        return Notification({
          message: response?.error || "Failed to get bonds.",
        });
      }
      setBonds(response.data);
      setTotal(response.total);
    } catch (error) {
      Notification({
        message: "Failed to fetch bonds due to technical issue.",
      });
    } finally {
      setBondLoading(false);
    }
  };
  // Download all bonds as CSV (Excel compatible)
  const handleDownloadExcel = async () => {
    setDownloading(true);
    try {
      const response = await prizeBondAPI.getUserBonds({
        limit: total || 100000,
        offset: 0,
        sortBy,
        order,
      });
      const allBonds = response && response.data ? response.data : [];
      if (!allBonds.length) {
        Notification({ message: "No bonds to export." });
        return;
      }
      const data = allBonds.map((bond, idx) => ({
        [t("serial_no")]: idx + 1,
        [t("bond_number")]: bond.bond_number,
        [t("date")]: new Date(bond.created_at).toLocaleDateString(),
      }));
      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "prizebonds.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      Notification({ message: "Failed to download CSV due to technical issue." });
    } finally {
      setDownloading(false);
    }
  };

  const handleAddSingleBonds = async (_, arr) => {
    const allBonds = arr ? arr : singleBonds;
    const validBonds = allBonds.filter((bond) => bond.trim() !== "");
    if (!validBonds.length) {
      return Notification({
        message: "No valid bonds to add.",
        type: "warning",
        color: "black",
      });
    }

    // Check for duplicates
    const duplicateBonds = validBonds.filter(
      (bond, index) => validBonds.indexOf(bond) !== index
    );

    if (duplicateBonds.length) {
      return Notification({
        message: "Duplicate bonds found.",
        type: "warning",
        color: "black",
      });
    }
    // Check for existing bonds
    const existingBonds = bonds.filter((bond) =>
      validBonds.includes(bond.bond_number)
    );
    if (existingBonds.length) {
      return Notification({
        message: "Same bond already exist.",
        type: "warning",
        color: "black",
      });
    }
    try {
      setLoading(true);
      const response = await prizeBondAPI.addBond(validBonds);
      if (response.error || !response.success) {
        return Notification({
          message: response?.message || "Failed to add bonds.",
        });
      }
      setSingleBonds([""]);
      setRangeForm({ start: "", end: "" });
      Notification({
        message: "Bonds added successfully.",
        type: "success",
      });
      closeDialog();
      await fetchBonds();
    } catch (error) {
      Notification({ message: "Failed to add bonds due to technical issue." });
    } finally {
      setLoading(false);
    }
  };

  const handleAddRangeBonds = async () => {
    if (!rangeForm.start || !rangeForm.end) {
      return Notification({
        message: "Fill in both start and end numbers.",
        type: "warning",
        color: "black",
      });
    }
    const start = rangeForm.start;
    const end = rangeForm.end;

    if (isNaN(start) || isNaN(end) || start > end) {
      return Notification({
        message: "Invalid range.",
        type: "warning",
        color: "black",
      });
    }
    const rangeBonds = [];
    for (let i = parseInt(start); i <= parseInt(end); i++) {
      // Pad the bond number with leading zeros to match the length of the start value
      const paddedBond = i.toString().padStart(start.length, "0");
      rangeBonds.push(paddedBond);
    }
    await handleAddSingleBonds(null, rangeBonds);
  };

  const handleDeleteBond = async (bondId) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this bond?"
      );
      if (!confirmDelete) return;
      const response = await prizeBondAPI.deleteBond(bondId);
      if (response.error) {
        return Notification({
          message: response?.message || "Failed to delete bond.",
        });
      }
      Notification({
        message: "Bond deleted successfully.",
        type: "success",
      });
      fetchBonds();
    } catch (error) {
      Notification({
        message: "Failed to delete bond due to technical issue.",
      });
    }
  };

  const addBondField = () => {
    setSingleBonds([...singleBonds, ""]);
  };

  const removeBondField = (index) => {
    const newBonds = singleBonds.filter((_, i) => i !== index);
    setSingleBonds(newBonds);
  };

  const handleBondField = (index, value) => {
    const newBonds = [...singleBonds];
    newBonds[index] = value;
    setSingleBonds(newBonds);
  };

  const closeBtnRef = useRef(null);

  const closeDialog = () => {
    closeBtnRef.current?.click(); // closes the dialog
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-center mb-2">
                {t("prize_bonds")}{" "}
              </CardTitle>
              <div className="flex justify-between items-center flex-wrap gap-y-2">
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded shadow h-9 text-xs sm:px-4 sm:text-sm "
                  onClick={handleDownloadExcel}
                  disabled={downloading}
                >
                  {downloading ? t("loading_results") : t("download_excel")}
                </Button>
                <AddBonds
                  singleBonds={singleBonds}
                  handleBondField={handleBondField}
                  removeBondField={removeBondField}
                  addBondField={addBondField}
                  handleAddSingleBonds={handleAddSingleBonds}
                  loading={loading}
                  rangeForm={rangeForm}
                  setRangeForm={setRangeForm}
                  handleAddRangeBonds={handleAddRangeBonds}
                  closeBtnRef={closeBtnRef}
                />
              </div>
            </CardHeader>
            <BondList
              bonds={bonds}
              bondLoading={bondLoading}
              handleDeleteBond={handleDeleteBond}
              page={page}
              pageSize={pageSize}
              total={total}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(1);
              }}
              sortBy={sortBy}
              order={order}
              onSortChange={(field, ord) => {
                setSortBy(field);
                setOrder(ord);
                setPage(1);
              }}
            />
          </Card>

          <UserProfile loading={loading} setLoading={setLoading} />
        </div>
      </div>
    </div>
  );
}
