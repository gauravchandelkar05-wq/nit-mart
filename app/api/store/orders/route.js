import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET: Fetch all orders for a seller
export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const storeId = await authSeller(userId);

    if (!storeId) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { storeId },
      include: {
        user: true, // Needed for the WhatsApp button!
        address: true,
        orderItems: { include: { product: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("GET_ORDERS_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// 🔥 FIXED: Changed to PATCH so it matches the frontend request!
export async function PATCH(request) {
  try {
    const { userId } = getAuth(request);
    const storeId = await authSeller(userId);

    if (!storeId) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }

    const { orderId, status: newStatus } = await request.json();
    const targetStatus = newStatus.toUpperCase();

    // 🔥 THE TRANSACTION: Manages Status AND Stock Together
    const result = await prisma.$transaction(async (tx) => {
      // 1. Fetch current order to see what its old status was
      const order = await tx.order.findUnique({
        where: { id: orderId, storeId }, // Ensure this seller owns the order
        include: { orderItems: true },
      });

      if (!order) throw new Error("Order not found or unauthorized");

      const currentStatus = order.status;

      // 🛡️ Situation A: Moving TO Cancelled -> Return stock to the shop
      if (currentStatus !== "CANCELLED" && targetStatus === "CANCELLED") {
        for (const item of order.orderItems) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }
      // 🛡️ Situation B: Moving FROM Cancelled back to Active -> Remove stock again
      else if (currentStatus === "CANCELLED" && targetStatus !== "CANCELLED") {
        for (const item of order.orderItems) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }

      // 2. Finally, update the status in the database
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: targetStatus },
      });

      return updatedOrder;
    });

    return NextResponse.json({
      success: true,
      message: "Order Status updated",
    });
  } catch (error) {
    console.error("ORDER_STATUS_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
