"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Edit, ExternalLink, Target, TrendingUp } from "lucide-react";
import { EditItemDialog } from "./EditItemDialog";
import { calculateProgress } from "@/lib/api/wishlist";
import Link from "next/link";

export function WishlistCard({ item, onUpdate }) {
  const [showEditDialog, setShowEditDialog] = useState(false);

  const allocatedAmount = item.allocatedAmount || 0;
  const progress = calculateProgress(allocatedAmount, item.targetPrice);
  const remaining = item.targetPrice - allocatedAmount;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "medium":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "low":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getProgressColor = () => {
    if (progress >= 100) return "bg-green-500";
    if (progress >= 75) return "bg-blue-500";
    if (progress >= 50) return "bg-yellow-500";
    if (progress >= 25) return "bg-orange-500";
    return "bg-primary";
  };

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
        <CardContent>
          {/* Header with Icon and Edit Button */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-4xl">{item.icon}</div>
              <div>
                <h3 className="font-semibold text-lg leading-tight">
                  {item.name}
                </h3>
                {item.category && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.category}
                  </p>
                )}
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setShowEditDialog(true)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Edit className="w-4 h-4" />
            </Button>
          </div>

          {/* Priority Badge */}
          {item.priority && (
            <div className="mb-3">
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                  item.priority
                )}`}
              >
                {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}{" "}
                Priority
              </span>
            </div>
          )}

          {/* Price Info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <Target className="w-3.5 h-3.5" />
                Target
              </span>
              <span className="font-semibold">
                {formatCurrency(item.targetPrice)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Saved</span>
              <span className="font-semibold text-primary">
                {formatCurrency(allocatedAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                Remaining
              </span>
              <span
                className={`font-semibold ${
                  remaining <= 0 ? "text-green-600 dark:text-green-400" : ""
                }`}
              >
                {formatCurrency(Math.max(0, remaining))}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-bold text-primary">
                {progress.toFixed(1)}%
              </span>
            </div>
            <div className="relative">
              <Progress value={Math.min(progress, 100)} className="h-3" />
              {/* Shimmer Effect Overlay */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </div>
            </div>
          </div>

          {/* Achievement Badge */}
          {progress >= 100 && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-center">
              <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                🎉 Goal Achieved!
              </p>
            </div>
          )}

          {/* Notes */}
          {item.notes && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-muted-foreground line-clamp-2">
                {item.notes}
              </p>
            </div>
          )}

          {/* Link */}
          {item.link && (
            <div className="mt-4 pt-4 border-t">
              <Link
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                View Product
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <EditItemDialog
        item={item}
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        onUpdate={onUpdate}
      />
    </>
  );
}
