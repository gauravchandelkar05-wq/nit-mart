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

    const { cart } = await request.json();

    if (!cart) {
      return NextResponse.json(
        { error: "Cart data is missing" },
        { status: 400 },
      );
    }

    await prisma.user.upsert({
      where: { id: userId },
      update: { cart: cart },
      create: {
        id: userId,
        email: user?.emailAddresses[0]?.emailAddress || "no-email@campus.com",
        name: user?.firstName || "Student",
        image: user?.imageUrl || "",
        cart: cart,
      },
    });

    return NextResponse.json({ success: true, message: "Cart updated" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { cart: true },
    });

    if (!user) {
      return NextResponse.json({ cart: {} });
    }

    return NextResponse.json({ cart: user.cart || {} });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
