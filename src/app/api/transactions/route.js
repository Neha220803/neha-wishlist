import { NextResponse } from "next/server";
import {
  getAllTransactions,
  addTransaction,
  getMoneyData,
  updateMoneyData,
} from "@/lib/firebase/firestore";

// GET all transactions
export async function GET() {
  try {
    const transactions = await getAllTransactions();
    return NextResponse.json({ success: true, data: transactions });
  } catch (error) {
    console.error("GET /api/transactions error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST new transaction (and update money data)
export async function POST(request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.amount || !body.moneyType) {
      return NextResponse.json(
        { success: false, error: "Amount and money type are required" },
        { status: 400 }
      );
    }

    // Add transaction to database
    const newTransaction = await addTransaction(body);

    // Update money data based on transaction type
    const moneyData = await getMoneyData();

    if (body.moneyType === "liquid") {
      moneyData.totalLiquid = (moneyData.totalLiquid || 0) + body.amount;
    } else if (body.moneyType === "non-liquid") {
      moneyData.totalNonLiquid = (moneyData.totalNonLiquid || 0) + body.amount;
    }

    await updateMoneyData(moneyData);

    return NextResponse.json(
      { success: true, data: newTransaction },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/transactions error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
