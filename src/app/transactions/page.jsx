"use client";

import { useState, useEffect } from "react";
import { MoneyDisplay } from "@/components/shared/MoneyDisplay";
import { TransactionList } from "@/components/transactions/TransactionList";
import { AddTransactionDialog } from "@/components/transactions/AddTransactionDialog";
import { AllocateMoneyDialog } from "@/components/transactions/AllocateMoneyDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Wallet, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { getMoneyData } from "@/lib/api/money";
import { Navbar } from "@/components/custom/NavBar";
import { getAllTransactions } from "@/lib/firebase/firestore";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [moneyData, setMoneyData] = useState({
    totalLiquid: 0,
    totalNonLiquid: 0,
    totalAllocated: 0,
    unallocated: 0,
  });
  const [stats, setStats] = useState({
    totalAdditions: 0,
    totalDeductions: 0,
    transactionCount: 0,
    avgTransaction: 0,
    unallocated: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [txns, money] = await Promise.all([
        getAllTransactions(),
        getMoneyData(),
      ]);

      setTransactions(txns);
      setMoneyData({
        totalLiquid: money.totalLiquid || 0,
        totalNonLiquid: money.totalNonLiquid || 0,
        totalAllocated: money.totalAllocated || 0,
        unallocated: money.unallocated || 0,
      });

      // Calculate stats
      const additions = txns.filter((t) => t.amount > 0);
      const deductions = txns.filter((t) => t.amount < 0);

      const totalAdditions = additions.reduce((sum, t) => sum + t.amount, 0);
      const totalDeductions = Math.abs(
        deductions.reduce((sum, t) => sum + t.amount, 0)
      );
      const avgTransaction =
        txns.length > 0
          ? Math.abs(
              txns.reduce((sum, t) => sum + Math.abs(t.amount), 0) / txns.length
            )
          : 0;

      setStats({
        totalAdditions,
        totalDeductions,
        transactionCount: txns.length,
        avgTransaction,
        unallocated: money.unallocated || 0,
      });
    } catch (error) {
      console.error("Error loading data:", error);
      alert("Failed to load data. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = () => {
    loadData();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar onUpdate={handleUpdate} />
        <main className="container max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading transactions...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar onUpdate={handleUpdate} />

      <main className="container max-w-7xl mx-auto px-4 py-8">
        {/* Money Display Cards */}
        <div className="mb-8">
          <MoneyDisplay
            moneyData={moneyData}
            allocatedAmount={moneyData.totalAllocated}
          />
        </div>

        {/* Transaction Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <ArrowUpCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-sm text-muted-foreground">Total Added</p>
              </div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(stats.totalAdditions)}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <ArrowDownCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <p className="text-sm text-muted-foreground">Total Deducted</p>
              </div>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(stats.totalDeductions)}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-sm text-muted-foreground">Unallocated</p>
              </div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(stats.unallocated)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Transaction History</h2>
            <p className="text-sm text-muted-foreground mt-1">
              All your money additions and deductions
            </p>
          </div>

          {/* Action Buttons - Desktop */}
          <div className="hidden sm:flex items-center gap-2">
            <AddTransactionDialog
              onTransactionAdded={handleUpdate}
              trigger={
                <Button variant="default" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Transaction
                </Button>
              }
            />
            <AllocateMoneyDialog
              onAllocated={handleUpdate}
              trigger={
                <Button variant="outline" className="gap-2">
                  <Wallet className="w-4 h-4" />
                  Allocate Money
                </Button>
              }
            />
          </div>
        </div>

        {/* Transaction List */}
        <TransactionList transactions={transactions} onUpdate={handleUpdate} />

        {/* Mobile Action Buttons */}
        <div className="fixed bottom-6 right-6 sm:hidden flex flex-col gap-3">
          <AllocateMoneyDialog
            onAllocated={handleUpdate}
            trigger={
              <Button
                size="lg"
                variant="outline"
                className="rounded-full shadow-lg w-14 h-14 p-0 bg-background"
              >
                <Wallet className="w-6 h-6" />
              </Button>
            }
          />
          <AddTransactionDialog
            onTransactionAdded={handleUpdate}
            trigger={
              <Button
                size="lg"
                className="rounded-full shadow-lg w-14 h-14 p-0"
              >
                <Plus className="w-6 h-6" />
              </Button>
            }
          />
        </div>
      </main>
    </div>
  );
}
