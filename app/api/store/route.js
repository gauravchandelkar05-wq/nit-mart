import imagekit from "@/configs/imageKit";
import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// --- GET STORE DATA ---
export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const store = await prisma.store.findUnique({ where: { userId } });
    if (!store)
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    return NextResponse.json({ store });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// --- UPDATE STORE PROFILE ---
export async function PUT(request) {
  try {
    const { userId } = getAuth(request);
    const storeId = await authSeller(userId);

    const formData = await request.formData();
    const updateData = {
      name: formData.get("name"),
      username: formData.get("username"),
      description: formData.get("description"),
      email: formData.get("email"),
      contact: formData.get("contact"),
      address: formData.get("address"),
    };

    const newLogo = formData.get("logo");

    if (newLogo && typeof newLogo !== "string") {
      const buffer = Buffer.from(await newLogo.arrayBuffer());
      const response = await imagekit.upload({
        file: buffer,
        fileName: `logo_${storeId}_${Date.now()}.webp`,
        folder: "store_logos",
      });
      updateData.logo = imagekit.url({
        path: response.filePath,
        transformation: [{ quality: "auto" }, { width: "400" }],
      });
    }

    await prisma.store.update({ where: { id: storeId }, data: updateData });
    return NextResponse.json({ message: "Profile Updated!" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
