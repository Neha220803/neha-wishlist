"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Wallet, TrendingUp } from "lucide-react";
import { addTransaction } from "@/lib/data-manager";
import { MONEY_TYPES } from "@/lib/constants";

export function AddTransactionDialog({ onTransactionAdded, trigger }) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [moneyType, setMoneyType] = useState(MONEY_TYPES.LIQUID);
  const [transactionType, setTransactionType] = useState("addition");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setIsSubmitting(true);

    const transaction = {
      amount: transactionType === "addition" ? numAmount : -numAmount,
      description:
        description.trim() ||
        (transactionType === "addition" ? "Money Added" : "Money Deducted"),
      moneyType: moneyType,
    };

    addTransaction(transaction);

    // Reset form
    setAmount("");
    setDescription("");
    setMoneyType(MONEY_TYPES.LIQUID);
    setTransactionType("addition");
    setIsSubmitting(false);
    setIsOpen(false);

    if (onTransactionAdded) {
      onTransactionAdded();
    }
  };

  const handleClose = () => {
    setAmount("");
    setDescription("");
    setMoneyType(MONEY_TYPES.LIQUID);
    setTransactionType("addition");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="w-4 h-4" />
            Add Transaction
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
            <DialogDescription>
              Add or deduct money from your savings
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Transaction Type */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Transaction Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTransactionType("addition")}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    transactionType === "addition"
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : "border-border hover:border-green-300"
                  }`}
                >
                  <div className="font-medium text-sm">Addition</div>
                  <div className="text-xs text-muted-foreground">Add money</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTransactionType("deduction")}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    transactionType === "deduction"
                      ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                      : "border-border hover:border-red-300"
                  }`}
                >
                  <div className="font-medium text-sm">Deduction</div>
                  <div className="text-xs text-muted-foreground">
                    Remove money
                  </div>
                </button>
              </div>
            </div>

            {/* Amount */}
            <div>
              <label
                htmlFor="amount"
                className="text-sm font-medium mb-2 block"
              >
                Amount ($)
              </label>
              <input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none text-lg"
              />
            </div>

            {/* Money Type */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Money Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMoneyType(MONEY_TYPES.LIQUID)}
                  className={`p-3 rounded-lg border-2 flex items-center gap-2 transition-all ${
                    moneyType === MONEY_TYPES.LIQUID
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <Wallet className="w-4 h-4" />
                  <div className="text-left flex-1">
                    <div className="font-medium text-sm">Liquid</div>
                    <div className="text-xs text-muted-foreground">
                      Cash/Bank
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMoneyType(MONEY_TYPES.NON_LIQUID)}
                  className={`p-3 rounded-lg border-2 flex items-center gap-2 transition-all ${
                    moneyType === MONEY_TYPES.NON_LIQUID
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <div className="text-left flex-1">
                    <div className="font-medium text-sm">Non-Liquid</div>
                    <div className="text-xs text-muted-foreground">
                      Stocks/Assets
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="text-sm font-medium mb-2 block"
              >
                Description (Optional)
              </label>
              <input
                id="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Monthly savings, Sold stocks, etc."
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none"
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
