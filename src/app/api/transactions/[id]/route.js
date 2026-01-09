import { NextResponse } from "next/server";
import { deleteTransaction } from "@/lib/firebase/firestore";

// DELETE transaction (no money reversal needed - we calculate on-the-fly)
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    // Simply delete the transaction - totals will be recalculated automatically
    await deleteTransaction(id);

    return NextResponse.json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.error(`DELETE /api/transactions/${params.id} error:`, error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
