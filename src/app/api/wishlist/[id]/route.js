import { NextResponse } from "next/server";
import {
  getWishlistItem,
  updateWishlistItem,
  deleteWishlistItem,
} from "@/lib/firebase/firestore";

// GET single wishlist item
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const item = await getWishlistItem(id);

    if (!item) {
      return NextResponse.json(
        { success: false, error: "Item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error(`GET /api/wishlist/${params.id} error:`, error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT update wishlist item
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const updatedItem = await updateWishlistItem(id, body);
    return NextResponse.json({ success: true, data: updatedItem });
  } catch (error) {
    console.error(`PUT /api/wishlist/${params.id} error:`, error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE wishlist item
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await deleteWishlistItem(id);
    return NextResponse.json({ success: true, message: "Item deleted" });
  } catch (error) {
    console.error(`DELETE /api/wishlist/${params.id} error:`, error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
