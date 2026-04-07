import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// 🔥 Force dynamic to prevent Next.js from caching an old cart state
export const dynamic = "force-dynamic";

// Update user cart
export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    // 1. Auth Guard
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cart } = await request.json();

    // 2. Validate Cart Data
    if (!cart) {
      return NextResponse.json(
        { error: "Cart data is missing" },
        { status: 400 },
      );
    }

    // 3. Save the cart to the user object
    await prisma.user.update({
      where: { id: userId },
      data: { cart: cart },
    });

    return NextResponse.json({ success: true, message: "Cart updated" });
  } catch (error) {
    console.error("CART_POST_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Get user cart
export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    // 1. Auth Guard
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Find user and handle case where user might not be in DB yet
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { cart: true }, // Optimization: Only fetch the cart field
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3. Fallback to empty object if cart is null in DB
    return NextResponse.json({ cart: user.cart || {} });
  } catch (error) {
    console.error("CART_GET_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
