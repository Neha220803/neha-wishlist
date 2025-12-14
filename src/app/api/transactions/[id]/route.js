import { NextResponse } from "next/server";
import {
  deleteTransaction,
  getAllTransactions,
  getMoneyData,
  updateMoneyData,
} from "@/lib/firebase/firestore";

// DELETE transaction (and reverse money update)
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // First, get the transaction to reverse the money update
    const transactions = await getAllTransactions();
    const transaction = transactions.find((t) => t.id === id);

    if (!transaction) {
      return NextResponse.json(
        { success: false, error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Delete the transaction
    await deleteTransaction(id);

    // Reverse the money update
    const moneyData = await getMoneyData();

    if (transaction.moneyType === "liquid") {
      moneyData.totalLiquid = (moneyData.totalLiquid || 0) - transaction.amount;
    } else if (transaction.moneyType === "non-liquid") {
      moneyData.totalNonLiquid =
        (moneyData.totalNonLiquid || 0) - transaction.amount;
    }

    await updateMoneyData(moneyData);

    return NextResponse.json({
      success: true,
      message: "Transaction deleted and money reversed",
    });
  } catch (error) {
    console.error(`DELETE /api/transactions/${params.id} error:`, error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
