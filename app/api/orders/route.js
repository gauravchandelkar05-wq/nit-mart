import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// 1. POST: Place Order and Decrement Stock
export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { items, totalAmount } = body;

    // Safety Check: Make sure user exists in your DB
    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database. Try logging out and back in." },
        { status: 404 },
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // 🔥 THE TRANSACTION
    const result = await prisma.$transaction(async (tx) => {
      // STEP A: Get the storeId from the first product
      const product = await tx.product.findUnique({
        where: { id: items[0].id || items[0].productId },
      });

      if (!product) throw new Error("Product no longer exists.");

      // STEP B: Create the Order
      const newOrder = await tx.order.create({
        data: {
          userId: userId,
          storeId: product.storeId,
          total: parseFloat(totalAmount),
          status: "ORDER_PLACED",
          paymentMethod: "COD",
          orderItems: {
            create: items.map((item) => ({
              productId: item.id || item.productId,
              quantity: item.quantity,
              price: parseFloat(item.price),
            })),
          },
        },
      });

      // STEP C: Subtract from Stock (Decrement)
      for (const item of items) {
        await tx.product.update({
          where: { id: item.id || item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return newOrder;
    });

    return NextResponse.json({
      success: true,
      message: "Order placed! 🚀",
      orderId: result.id,
    });
  } catch (error) {
    console.error("BACKEND_CRASH_LOG:", error.message);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}

// 2. GET: Fetch buyer's order history
export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const orders = await prisma.order.findMany({
      where: { userId: userId },
      // 🔥 FIXED: We must include the store so the frontend can get the seller's phone number!
      include: {
        orderItems: {
          include: {
            product: {
              include: { store: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 3. PATCH: Cancel Order & Restore Stock
export async function PATCH(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { orderId } = await request.json();

    // 🔥 CANCELLATION TRANSACTION
    const result = await prisma.$transaction(async (tx) => {
      // Find the order and verify ownership
      const order = await tx.order.findUnique({
        where: { id: orderId, userId: userId },
        include: { orderItems: true },
      });

      if (!order) throw new Error("Order not found.");

      if (order.status !== "ORDER_PLACED") {
        throw new Error("Cannot cancel order once it is in progress.");
      }

      // Update Order Status to CANCELLED
      const cancelledOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: "CANCELLED" },
      });

      // 🛡️ RESTORE STOCK (Increment)
      for (const item of order.orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }

      return cancelledOrder;
    });

    return NextResponse.json({
      success: true,
      message: "Order cancelled and items returned to stock! ♻️",
    });
  } catch (error) {
    console.error("Cancellation Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
