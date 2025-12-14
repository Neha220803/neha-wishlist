import { NextResponse } from "next/server";
import { allocateMoneyToItem } from "@/lib/firebase/firestore";

// POST allocate money to wishlist items
export async function POST(request) {
  try {
    const body = await request.json();

    // Validate allocations format
    if (!body.allocations || typeof body.allocations !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid allocations format" },
        { status: 400 }
      );
    }

    // Process each allocation
    const results = [];
    for (const [itemId, amount] of Object.entries(body.allocations)) {
      if (amount > 0) {
        const result = await allocateMoneyToItem(itemId, amount);
        results.push({ itemId, ...result });
      }
    }

    return NextResponse.json({
      success: true,
      data: results,
      message: `Allocated money to ${results.length} item(s)`,
    });
  } catch (error) {
    console.error("POST /api/allocate error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
