import prisma from "@/lib/prisma";
import authAdmin from "@/middlewares/authAdmin";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * @description GET all approved and blocked stores for Admin Panel
 * @endpoint /api/admin/stores
 */
export async function GET(request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = await authAdmin(userId);
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 },
      );
    }

    const stores = await prisma.store.findMany({
      where: {
        status: {
          in: ["approved", "blocked"],
        },
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ stores: stores || [] });
  } catch (error) {
    console.error("ADMIN_STORES_GET_ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error: " + error.message },
      { status: 500 },
    );
  }
}

/**
 * @description DELETE a store permanently (Admin Only)
 * @endpoint /api/admin/stores?id=STORE_ID
 */
export async function DELETE(request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Verify Admin
    const isAdmin = await authAdmin(userId);
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Forbidden: Only Admins can delete stores" },
        { status: 403 },
      );
    }

    // 2. Extract Store ID
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get("id");

    if (!storeId) {
      return NextResponse.json(
        { error: "Store ID is missing from the request" },
        { status: 400 },
      );
    }

    // Step A: Find all products for this store
    const storeProducts = await prisma.product.findMany({
      where: { storeId: storeId },
      select: { id: true },
    });
    const productIds = storeProducts.map((p) => p.id);

    // Step B: Wipe OrderItems and Ratings attached to these products
    if (productIds.length > 0) {
      await prisma.orderItem.deleteMany({
        where: { productId: { in: productIds } },
      });

      await prisma.rating.deleteMany({
        where: { productId: { in: productIds } },
      });
    }

    // Step C: Wipe the Orders attached to this store
    await prisma.order.deleteMany({
      where: { storeId: storeId },
    });

    // Step D: Wipe the Products
    await prisma.product.deleteMany({
      where: { storeId: storeId },
    });

    // Step E: NUKE THE STORE
    await prisma.store.delete({
      where: { id: storeId },
    });

    return NextResponse.json({ message: "Store has been permanently erased." });
  } catch (error) {
    console.error("ADMIN_STORES_DELETE_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to delete: " + error.message },
      { status: 500 },
    );
  }
}
