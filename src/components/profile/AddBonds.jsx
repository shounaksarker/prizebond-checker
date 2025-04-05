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
import React from "react";

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
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Prize Bonds
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Prize Bonds</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="single">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single">Single Entry</TabsTrigger>
            <TabsTrigger value="range">Range Entry</TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="space-y-4">
            {singleBonds.map((bond, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Enter bond number"
                  value={bond}
                  onChange={(e) => handleBondField(index, e.target.value)}
                />
                {index === singleBonds.length - 1 && (
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
            <Button
              onClick={handleAddSingleBonds}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Adding..." : "Add Bonds"}
            </Button>
          </TabsContent>

          <TabsContent value="range" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="startRange">Start Number</Label>
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
              <Label htmlFor="endRange">End Number</Label>
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
              {loading ? "Adding..." : "Add Range"}
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
