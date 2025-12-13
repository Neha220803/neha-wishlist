"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Split, AlertCircle } from "lucide-react";
import {
  getWishlistItems,
  allocateMoneyToItem,
  getUnallocatedMoney,
  getMoneyData,
} from "@/lib/data-manager";
import { PinVerification } from "@/components/shared/PinVerification";

export function AllocateMoneyDialog({ onAllocated, trigger }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAllocateDialog, setShowAllocateDialog] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [allocations, setAllocations] = useState({});
  const [unallocatedMoney, setUnallocatedMoney] = useState(0);
  const [totalMoney, setTotalMoney] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (showAllocateDialog) {
      loadData();
    }
  }, [showAllocateDialog]);

  const loadData = () => {
    const items = getWishlistItems();
    setWishlistItems(items);

    const unallocated = getUnallocatedMoney();
    setUnallocatedMoney(unallocated);

    const { totalLiquid, totalNonLiquid } = getMoneyData();
    setTotalMoney(totalLiquid + totalNonLiquid);

    // Initialize allocations
    const initialAllocations = {};
    items.forEach((item) => {
      initialAllocations[item.id] = 0;
    });
    setAllocations(initialAllocations);
  };

  const handleAllocationChange = (itemId, value) => {
    const numValue = parseFloat(value) || 0;
    setAllocations((prev) => ({
      ...prev,
      [itemId]: numValue,
    }));
  };

  const getTotalAllocating = () => {
    return Object.values(allocations).reduce((sum, val) => sum + val, 0);
  };

  const getRemainingMoney = () => {
    return unallocatedMoney - getTotalAllocating();
  };

  const handleAutoSplit = () => {
    if (wishlistItems.length === 0) return;

    const perItem =
      Math.floor((unallocatedMoney / wishlistItems.length) * 100) / 100;
    const newAllocations = {};

    wishlistItems.forEach((item) => {
      newAllocations[item.id] = perItem;
    });

    setAllocations(newAllocations);
  };

  const handleSubmit = () => {
    const totalAllocating = getTotalAllocating();

    if (totalAllocating > unallocatedMoney) {
      alert("Total allocation exceeds unallocated money!");
      return;
    }

    if (totalAllocating === 0) {
      alert("Please allocate at least some money");
      return;
    }

    setIsSubmitting(true);

    // Apply allocations
    Object.entries(allocations).forEach(([itemId, amount]) => {
      if (amount > 0) {
        allocateMoneyToItem(itemId, amount);
      }
    });

    setIsSubmitting(false);
    setShowAllocateDialog(false);
    setIsOpen(false);

    if (onAllocated) {
      onAllocated();
    }
  };

  const handleClose = () => {
    setAllocations({});
    setShowAllocateDialog(false);
    setIsOpen(false);
  };

  const handleTriggerClick = () => {
    setIsOpen(true);
  };

  const remaining = getRemainingMoney();
  const isOverAllocated = remaining < 0;

  return (
    <>
      {/* Trigger Button */}
      <div onClick={handleTriggerClick}>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <Split className="w-4 h-4" />
            Allocate Money
          </Button>
        )}
      </div>

      {/* PIN Verification First */}
      <PinVerification
        isOpen={isOpen && !showAllocateDialog}
        onClose={() => setIsOpen(false)}
        onSuccess={() => setShowAllocateDialog(true)}
        title="Verify Identity"
        description="Enter your PIN to allocate money"
      />

      {/* Allocate Money Dialog */}
      <Dialog open={showAllocateDialog} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Allocate Money to Wishlist Items</DialogTitle>
            <DialogDescription>
              Split your unallocated money across wishlist items
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Money Summary */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-muted rounded-lg">
              <div>
                <div className="text-xs text-muted-foreground">Total Money</div>
                <div className="text-lg font-bold">
                  ₹{totalMoney.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Unallocated</div>
                <div className="text-lg font-bold text-primary">
                  ₹{unallocatedMoney.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Remaining</div>
                <div
                  className={`text-lg font-bold ${
                    isOverAllocated
                      ? "text-destructive"
                      : "text-green-600 dark:text-green-400"
                  }`}
                >
                  ₹{remaining.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Auto Split Button */}
            {wishlistItems.length > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleAutoSplit}
                className="w-full gap-2"
              >
                <Split className="w-4 h-4" />
                Auto-Split Equally
              </Button>
            )}

            {/* Allocation List */}
            {wishlistItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No wishlist items to allocate money to.</p>
                <p className="text-sm">Add items to your wishlist first.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {wishlistItems.map((item) => {
                  const remaining =
                    item.targetPrice - (item.allocatedAmount || 0);
                  const currentAllocation = allocations[item.id] || 0;

                  return (
                    <div
                      key={item.id}
                      className="p-4 border rounded-lg hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl">{item.icon}</span>
                            <h4 className="font-medium">{item.name}</h4>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Target: ₹{item.targetPrice.toFixed(2)} • Current: ₹
                            {(item.allocatedAmount || 0).toFixed(2)} • Need: ₹
                            {remaining.toFixed(2)}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Label className="text-sm text-muted-foreground">
                            ₹
                          </Label>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={currentAllocation || ""}
                            onChange={(e) =>
                              handleAllocationChange(item.id, e.target.value)
                            }
                            placeholder="0.00"
                            className="w-24 text-right"
                          />
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="relative">
                        <Progress
                          value={Math.min(
                            ((item.allocatedAmount || 0) / item.targetPrice) *
                              100,
                            100
                          )}
                          className="h-2"
                        />
                        {currentAllocation > 0 && (
                          <div
                            className="absolute top-0 h-2 bg-green-500/50 rounded-full transition-all"
                            style={{
                              left: `${Math.min(
                                ((item.allocatedAmount || 0) /
                                  item.targetPrice) *
                                  100,
                                100
                              )}%`,
                              width: `${Math.min(
                                (currentAllocation / item.targetPrice) * 100,
                                100 -
                                  ((item.allocatedAmount || 0) /
                                    item.targetPrice) *
                                    100
                              )}%`,
                            }}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Warning if over-allocated */}
            {isOverAllocated && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Total allocation exceeds available money!</span>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={
                isSubmitting || isOverAllocated || getTotalAllocating() === 0
              }
            >
              {isSubmitting ? "Allocating..." : "Allocate Money"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
