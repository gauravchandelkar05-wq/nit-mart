import prisma from "@/lib/prisma";
import { getAuth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const user = await currentUser();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { items, totalAmount, phoneNumber } = body;

    try {
      await prisma.user.upsert({
        where: { id: userId },
        update: {
          phone: phoneNumber,
        },
        create: {
          id: userId,
          email: user?.emailAddresses[0]?.emailAddress || "no-email@campus.com",
          name: user?.firstName || "Student",
          image: user?.imageUrl || "",
          phone: phoneNumber,
        },
      });
    } catch (dbError) {
      console.error("USER_SYNC_ERROR:", dbError.message);
      return NextResponse.json(
        { error: "Could not sync user profile. Check terminal." },
        { status: 500 },
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: items[0].id || items[0].productId },
      });

      if (!product) throw new Error("Product no longer exists.");

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
      message: "Order placed!",
      orderId: result.id,
    });
  } catch (error) {
    console.error("ORDER_POST_ERROR:", error.message);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: userId },
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

export async function PATCH(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await request.json();

    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId, userId: userId },
        include: { orderItems: true },
      });

      if (!order) throw new Error("Order not found.");

      if (order.status !== "ORDER_PLACED") {
        throw new Error("Cannot cancel order once it is in progress.");
      }

      const cancelledOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: "CANCELLED" },
      });

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
      message: "Order cancelled and items returned to stock!",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
