import { Button } from "@components/ui/button";
import { CardContent } from "@components/ui/card";
import { Skeleton } from "@components/ui/skeleton";
import { Trash2 } from "lucide-react";
import React from "react";

const BondList = ({ bonds, bondLoading, handleDeleteBond }) => {
  return (
    <CardContent>
      <div className="space-y-4">
        {bondLoading ? (
          <div className="flex flex-wrap justify-between items-center">
            {[1, 2, 3].map((_, index) => (
              <Skeleton key={index} className="w-1/4 h-12 rounded-sm" />
            ))}
          </div>
        ) : !bonds.length && !bondLoading ? (
          <p className="text-center text-gray-500">No prize bonds added yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bonds.map((bond) => (
              <div
                key={bond.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="font-medium">{bond.bond_number}</span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteBond(bond.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </CardContent>
  );
};

export default BondList;
