"use client";

import { useState } from "react";
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
import { Plus, Wallet, TrendingUp } from "lucide-react";
import { MONEY_TYPES } from "@/lib/constants";
import { addTransaction } from "@/lib/firebase/firestore";
import { PinVerification } from "@/components/shared/PinVerification";

export function AddTransactionDialog({ onTransactionAdded, trigger }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showTransactionDialog, setShowTransactionDialog] = useState(false);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [moneyType, setMoneyType] = useState(MONEY_TYPES.LIQUID);
  const [transactionType, setTransactionType] = useState("addition");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setIsSubmitting(true);

    try {
      const transaction = {
        amount: transactionType === "addition" ? numAmount : -numAmount,
        description:
          description.trim() ||
          (transactionType === "addition" ? "Money Added" : "Money Deducted"),
        moneyType: moneyType,
      };

      await addTransaction(transaction);

      // Reset form
      setAmount("");
      setDescription("");
      setMoneyType(MONEY_TYPES.LIQUID);
      setTransactionType("addition");
      setShowTransactionDialog(false);
      setIsOpen(false);

      if (onTransactionAdded) {
        onTransactionAdded();
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert("Failed to add transaction. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setAmount("");
    setDescription("");
    setMoneyType(MONEY_TYPES.LIQUID);
    setTransactionType("addition");
    setShowTransactionDialog(false);
    setIsOpen(false);
  };

  const handleTriggerClick = () => {
    setIsOpen(true);
  };

  return (
    <>
      {/* Trigger Button */}
      <div onClick={handleTriggerClick}>
        {trigger || (
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Transaction
          </Button>
        )}
      </div>

      {/* PIN Verification First */}
      <PinVerification
        isOpen={isOpen && !showTransactionDialog}
        onClose={() => setIsOpen(false)}
        onSuccess={() => setShowTransactionDialog(true)}
        title="Verify Identity"
        description="Enter your PIN to add a transaction"
      />

      {/* Add Transaction Dialog */}
      <Dialog open={showTransactionDialog} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
            <DialogDescription>
              Add or deduct money from your savings
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Transaction Type */}
            <div className="space-y-2">
              <Label>Transaction Type</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={
                    transactionType === "addition" ? "default" : "outline"
                  }
                  onClick={() => setTransactionType("addition")}
                  className={`h-auto py-3 flex-col items-start ${
                    transactionType === "addition"
                      ? "bg-green-600 hover:bg-green-700 border-green-600"
                      : "hover:border-green-300"
                  }`}
                >
                  <div className="font-medium text-sm">Addition</div>
                  <div className="text-xs opacity-80">Add money</div>
                </Button>

                <Button
                  type="button"
                  variant={
                    transactionType === "deduction" ? "default" : "outline"
                  }
                  onClick={() => setTransactionType("deduction")}
                  className={`h-auto py-3 flex-col items-start ${
                    transactionType === "deduction"
                      ? "bg-red-600 hover:bg-red-700 border-red-600"
                      : "hover:border-red-300"
                  }`}
                >
                  <div className="font-medium text-sm">Deduction</div>
                  <div className="text-xs opacity-80">Remove money</div>
                </Button>
              </div>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
                className="text-lg"
              />
            </div>

            {/* Money Type */}
            <div className="space-y-2">
              <Label>Money Type</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={
                    moneyType === MONEY_TYPES.LIQUID ? "default" : "outline"
                  }
                  onClick={() => setMoneyType(MONEY_TYPES.LIQUID)}
                  className="h-auto py-3 justify-start"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  <div className="text-left flex-1">
                    <div className="font-medium text-sm">Liquid</div>
                    <div className="text-xs opacity-80">Cash/Bank</div>
                  </div>
                </Button>

                <Button
                  type="button"
                  variant={
                    moneyType === MONEY_TYPES.NON_LIQUID ? "default" : "outline"
                  }
                  onClick={() => setMoneyType(MONEY_TYPES.NON_LIQUID)}
                  className="h-auto py-3 justify-start"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  <div className="text-left flex-1">
                    <div className="font-medium text-sm">Non-Liquid</div>
                    <div className="text-xs opacity-80">Stocks/Assets</div>
                  </div>
                </Button>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Monthly savings, Sold stocks, etc."
              />
            </div>
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
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Transaction"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
