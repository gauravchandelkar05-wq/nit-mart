import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { orderId, productId, rating, review } = body;

    // 1. Strict Validation (The "Pro" check)
    if (!orderId || !productId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Invalid data provided" },
        { status: 400 },
      );
    }

    // 2. Security Check: Only allow review if Order is DELIVERED
    // This prevents "fake" reviews before the product arrives
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: userId,
        status: "DELIVERED", // Ensure they actually got the item
      },
    });

    if (!order) {
      return NextResponse.json(
        {
          error: "You can only review items after they are delivered.",
        },
        { status: 403 },
      );
    }

    // 3. The Atomic Upsert
    const response = await prisma.rating.upsert({
      where: {
        userId_productId_orderId: { userId, productId, orderId },
      },
      update: {
        rating: Number(rating),
        review: String(review),
        updatedAt: new Date(), // Manually refreshing the timestamp
      },
      create: {
        userId,
        productId,
        orderId,
        rating: Number(rating),
        review: String(review),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Feedback received! ✨",
      rating: response,
    });
  } catch (error) {
    console.error("CRITICAL_RATING_ERROR:", error);
    return NextResponse.json(
      { error: "Database transaction failed" },
      { status: 500 },
    );
  }
}

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Fetching user ratings sorted by newest first
    const ratings = await prisma.rating.findMany({
      where: { userId },
      include: {
        product: {
          select: { name: true, images: true, price: true }, // Only get what we need
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ ratings });
  } catch (error) {
    return NextResponse.json(
      { error: "Could not fetch ratings" },
      { status: 500 },
    );
  }
}
