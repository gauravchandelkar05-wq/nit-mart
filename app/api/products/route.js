import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    let products = await prisma.product.findMany({
      // 🔥 CHANGE: Filter by stock quantity instead of the deleted inStock boolean
      where: {
        stock: {
          gt: 0, // "gt" means Greater Than. This hides "Sold Out" items.
        },
      },
      include: {
        rating: {
          select: {
            createdAt: true,
            rating: true,
            review: true,
            user: { select: { name: true, image: true } },
          },
        },
        store: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // remove products with store isActive false
    products = products.filter((product) => product.store.isActive);

    return NextResponse.json({ products });
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 },
    );
  }
}
