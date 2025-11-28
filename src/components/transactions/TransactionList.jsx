"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Trash2,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { PinVerification } from "@/components/shared/PinVerification";
import { deleteTransaction } from "@/lib/data-manager";

export function TransactionList({ transactions, onUpdate }) {
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const handleDeleteClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowPinDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedTransaction) {
      deleteTransaction(selectedTransaction.id);
      onUpdate();
      setSelectedTransaction(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Math.abs(amount));
  };

  const getMoneyTypeIcon = (type) => {
    if (type === "liquid") {
      return <Wallet className="w-4 h-4" />;
    }
    return <TrendingUp className="w-4 h-4" />;
  };

  const getMoneyTypeLabel = (type) => {
    return type === "liquid" ? "Liquid" : "Non-Liquid";
  };

  if (!transactions || transactions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <Wallet className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No transactions yet</p>
            <p className="text-sm">Add your first transaction to get started</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {transactions.map((transaction) => {
          const isAddition = transaction.amount > 0;

          return (
            <Card
              key={transaction.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  {/* Icon and Details */}
                  <div className="flex items-center gap-4 flex-1">
                    {/* Transaction Type Icon */}
                    <div
                      className={`p-2 rounded-lg ${
                        isAddition
                          ? "bg-green-100 dark:bg-green-900/20"
                          : "bg-red-100 dark:bg-red-900/20"
                      }`}
                    >
                      {isAddition ? (
                        <ArrowUpCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <ArrowDownCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      )}
                    </div>

                    {/* Transaction Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium truncate">
                          {transaction.description ||
                            (isAddition ? "Money Added" : "Money Deducted")}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{formatDate(transaction.createdAt)}</span>
                        <span className="flex items-center gap-1">
                          {getMoneyTypeIcon(transaction.moneyType)}
                          {getMoneyTypeLabel(transaction.moneyType)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Amount and Actions */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p
                        className={`text-lg font-bold ${
                          isAddition
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {isAddition ? "+" : "-"}
                        {formatAmount(transaction.amount)}
                      </p>
                    </div>

                    {/* Delete Button */}
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDeleteClick(transaction)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* PIN Verification Dialog */}
      <PinVerification
        isOpen={showPinDialog}
        onClose={() => {
          setShowPinDialog(false);
          setSelectedTransaction(null);
        }}
        onSuccess={handleDeleteConfirm}
        title="Delete Transaction"
        description="Enter your PIN to confirm deletion"
      />
    </>
  );
}
