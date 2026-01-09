import { NextResponse } from "next/server";
import { getAllTransactions } from "@/lib/firebase/firestore";
import { getTotalAllocated } from "@/lib/firebase/firestore";

// GET money data with calculated values from transactions
export async function GET() {
  try {
    // Get all transactions
    const transactions = await getAllTransactions();

    // Calculate totals from transactions
    let totalLiquid = 0;
    let totalNonLiquid = 0;

    transactions.forEach((transaction) => {
      if (transaction.moneyType === "liquid") {
        totalLiquid += transaction.amount;
      } else if (transaction.moneyType === "non-liquid") {
        totalNonLiquid += transaction.amount;
      }
    });

    // Get total allocated from wishlist items
    const totalAllocated = await getTotalAllocated();

    const totalMoney = totalLiquid + totalNonLiquid;
    const unallocated = totalMoney - totalAllocated;

    return NextResponse.json({
      success: true,
      data: {
        totalLiquid,
        totalNonLiquid,
        totalMoney,
        totalAllocated,
        unallocated,
      },
    });
  } catch (error) {
    console.error("GET /api/money error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
