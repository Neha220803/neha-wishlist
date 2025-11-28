"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Wallet, TrendingUp, PiggyBank, IndianRupeeIcon } from "lucide-react";

export function MoneyDisplay({ moneyData, allocatedAmount = 0 }) {
  const { totalLiquid = 0, totalNonLiquid = 0 } = moneyData || {};

  const totalMoney = totalLiquid + totalNonLiquid;
  const unallocatedMoney = totalMoney - allocatedAmount;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const moneyCards = [
    {
      title: "Total Savings",
      amount: totalMoney,
      icon: IndianRupeeIcon,
      gradient: "from-primary/20 to-primary/5",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      title: "Liquid Money",
      amount: totalLiquid,
      icon: Wallet,
      gradient: "from-blue-500/20 to-blue-500/5",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600 dark:text-blue-400",
      description: "Cash/Bank",
    },
    {
      title: "Non-Liquid",
      amount: totalNonLiquid,
      icon: TrendingUp,
      gradient: "from-purple-500/20 to-purple-500/5",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-600 dark:text-purple-400",
      description: "Stocks/Assets",
    },
    {
      title: "Unallocated",
      amount: unallocatedMoney,
      icon: PiggyBank,
      gradient: "from-green-500/20 to-green-500/5",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-600 dark:text-green-400",
      description: "Ready to allocate",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {moneyCards.map((card) => {
        const Icon = card.icon;

        return (
          <Card
            key={card.title}
            className={`relative overflow-hidden bg-gradient-to-br ${card.gradient} border-none shadow-sm hover:shadow-md transition-all`}
          >
            <CardContent>
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-lg ${card.iconBg}`}>
                  <Icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {card.title}
                </p>
                <p className="text-2xl font-bold tracking-tight">
                  {formatCurrency(card.amount)}
                </p>
                {card.description && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {card.description}
                  </p>
                )}
              </div>

              {/* Decorative Element */}
              <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-gradient-to-br from-background/40 to-transparent blur-2xl" />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
