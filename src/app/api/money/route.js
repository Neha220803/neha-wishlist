import { NextResponse } from "next/server";
import { getMoneyData, getTotalAllocated } from "@/lib/firebase/firestore";

// GET money data with calculated values
export async function GET() {
  try {
    const moneyData = await getMoneyData();
    const totalAllocated = await getTotalAllocated();

    const totalMoney =
      (moneyData.totalLiquid || 0) + (moneyData.totalNonLiquid || 0);
    const unallocated = totalMoney - totalAllocated;

    return NextResponse.json({
      success: true,
      data: {
        totalLiquid: moneyData.totalLiquid || 0,
        totalNonLiquid: moneyData.totalNonLiquid || 0,
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
