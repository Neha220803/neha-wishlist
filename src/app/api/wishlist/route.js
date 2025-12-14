import { NextResponse } from "next/server";
import { getAllWishlistItems, addWishlistItem } from "@/lib/firebase/firestore";

// GET all wishlist items
export async function GET() {
  try {
    const items = await getAllWishlistItems();
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error("GET /api/wishlist error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST new wishlist item
export async function POST(request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.targetPrice) {
      return NextResponse.json(
        { success: false, error: "Name and target price are required" },
        { status: 400 }
      );
    }

    const newItem = await addWishlistItem(body);
    return NextResponse.json({ success: true, data: newItem }, { status: 201 });
  } catch (error) {
    console.error("POST /api/wishlist error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
