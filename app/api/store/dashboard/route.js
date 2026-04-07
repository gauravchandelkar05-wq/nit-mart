import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Get Dashboard Data for Seller
export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const storeId = await authSeller(userId);

    if (!storeId) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }

    // 1. Fetch all data needed
    const orders = await prisma.order.findMany({
      where: { storeId },
      include: { user: true }, // Added to show who bought what
    });

    const products = await prisma.product.findMany({
      where: { storeId },
    });

    const ratings = await prisma.rating.findMany({
      where: { productId: { in: products.map((p) => p.id) } },
      include: { user: true, product: true },
      orderBy: { createdAt: "desc" },
      take: 5, // Only take the 5 most recent ratings to keep dashboard clean
    });

    // 2. 🔥 NEW LOGIC: Advanced Analytics

    // Calculate earnings ONLY from Paid or Delivered orders
    const totalEarnings = orders
      .filter((order) => order.status === "DELIVERED" || order.isPaid)
      .reduce((acc, order) => acc + order.total, 0);

    // Stock Insights
    const outOfStock = products.filter((p) => p.stock === 0).length;
    const lowStock = products.filter((p) => p.stock > 0 && p.stock < 3).length;

    // Recent Activity (Top 5 most recent orders)
    const recentOrders = orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    const dashboardData = {
      ratings,
      recentOrders,
      totalOrders: orders.length,
      totalEarnings: Math.round(totalEarnings),
      totalProducts: products.length,
      outOfStock, // 🔥 Add this to your frontend card
      lowStock, // 🔥 Add this to your frontend card
    };

    return NextResponse.json({ dashboardData });
  } catch (error) {
    console.error("DASHBOARD_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
