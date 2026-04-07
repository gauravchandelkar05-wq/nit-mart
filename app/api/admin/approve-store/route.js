import prisma from "@/lib/prisma";
import authAdmin from "@/middlewares/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json(
        { error: "CLERK_ERROR: You are not logged in." },
        { status: 401 },
      );
    }

    const isAdmin = await authAdmin(userId);
    if (!isAdmin) {
      return NextResponse.json(
        {
          error:
            "AUTH_ERROR: You are not recognized as an Admin. Check your .env file.",
        },
        { status: 401 },
      );
    }

    const stores = await prisma.store.findMany({
      where: {
        status: { in: ["pending", "rejected"] },
      },
      include: { user: true },
    });

    return NextResponse.json({ stores: stores || [] });
  } catch (error) {
    // 🔥 THE FIX: We return the EXACT error message so the frontend can read it
    console.error("CRITICAL GET ERROR:", error);
    return NextResponse.json(
      { error: `PRISMA/BACKEND ERROR: ${error.message}` },
      { status: 400 },
    );
  }
}

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const isAdmin = await authAdmin(userId);

    if (!isAdmin) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, action } = body;

    if (!id || !action) {
      return NextResponse.json(
        { error: `Missing Data. Received ID: ${id}, Action: ${action}` },
        { status: 400 },
      );
    }

    const updatedStore = await prisma.store.update({
      where: { id: id },
      data: {
        status: action === "approved" ? "approved" : "rejected",
        isActive: action === "approved",
      },
    });

    return NextResponse.json({
      success: true,
      message: `Store ${action} successfully`,
    });
  } catch (error) {
    console.error("CRITICAL POST ERROR:", error);
    return NextResponse.json(
      { error: `UPDATE ERROR: ${error.message}` },
      { status: 400 },
    );
  }
}
