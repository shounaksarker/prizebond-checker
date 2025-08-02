'use client'

import React, { useEffect, useRef } from "react";
import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Plus, Trash2 } from "lucide-react";
import { useTranslation } from "@lib/translation/useTranslation";

const AddBonds = ({
  singleBonds,
  handleBondField,
  removeBondField,
  addBondField,
  handleAddSingleBonds,
  loading,
  rangeForm,
  setRangeForm,
  handleAddRangeBonds,
  closeBtnRef
}) => {
  const { t } = useTranslation();
  const lastInputRef = useRef(null);

useEffect(() => {
  if (lastInputRef.current) {
    lastInputRef.current.scrollIntoView({ behavior: 'smooth'});
  }
}, [singleBonds.length]);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='text-xs !px-2 !py-1 sm:!px-8 sm:!text-sm'>
          <Plus className="size-3 sm:size-4" />
          {t("add_prize_bonds")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("add_prize_bonds")}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="single">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single"> {t('single_entry')} </TabsTrigger>
            <TabsTrigger value="range"> {t('range_entry')} </TabsTrigger>
          </TabsList>

          <TabsContent value="single">
            <div className="max-h-80 overflow-y-scroll space-y-4 p-1 mb-3">
            {singleBonds.map((bond, index) => (
              <div key={index} className="flex gap-2" ref={index === singleBonds.length - 1 ? lastInputRef : null}>
                <Input
                  placeholder={t("enter_bond_number")}
                  value={bond}
                  onChange={(e) => handleBondField(index, e.target.value)}
                />
                {index === singleBonds.length - 1 && (bond || !index) && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addBondField}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
                {singleBonds.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeBondField(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            </div>
            <Button
              onClick={handleAddSingleBonds}
              disabled={loading}
              className="w-full"
            >
              {loading ? t('adding') : t('add_bonds')}
            </Button>
          </TabsContent>

          <TabsContent value="range" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="startRange">{t('start_number')}</Label>
              <Input
                id="startRange"
                placeholder="e.g., 07812"
                value={rangeForm.start}
                onChange={(e) =>
                  setRangeForm({
                    ...rangeForm,
                    start: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endRange"> {t('end_number')} </Label>
              <Input
                id="endRange"
                placeholder="e.g., 07815"
                value={rangeForm.end}
                onChange={(e) =>
                  setRangeForm({
                    ...rangeForm,
                    end: e.target.value,
                  })
                }
              />
            </div>
            <Button
              onClick={handleAddRangeBonds}
              disabled={loading}
              className="w-full"
            >
              {loading ? t('adding') : t('add_range')}
            </Button>
          </TabsContent>
        </Tabs>
        {/* Hidden close button */}
        <DialogClose ref={closeBtnRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
};

export default AddBonds;
