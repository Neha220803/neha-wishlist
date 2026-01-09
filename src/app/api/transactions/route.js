import { NextResponse } from "next/server";
import { getAllTransactions, addTransaction } from "@/lib/firebase/firestore";

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

// POST new transaction (no money-data update needed)
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

    // Simply add the transaction - totals will be calculated on-the-fly
    const newTransaction = await addTransaction(body);

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
