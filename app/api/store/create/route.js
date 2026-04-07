import imagekit from "@/configs/imageKit";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// 🔥 POST: Create the store
export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the data from the form
    const formData = await request.formData();

    const name = formData.get("name");
    const username = formData.get("username")?.trim();
    const description = formData.get("description");
    const email = formData.get("email");
    const contact = formData.get("contact");
    const image = formData.get("image");

    // 🔥 REMOVED 'address' from this validation check so it doesn't crash!
    if (!name || !username || !description || !email || !contact || !image) {
      return NextResponse.json(
        { error: "Missing store info" },
        { status: 400 },
      );
    }

    // Check if user has already registered a store
    const store = await prisma.store.findFirst({
      where: { userId: userId },
    });

    // If store is already registered, send status
    if (store) {
      return NextResponse.json({ status: store.status });
    }

    // Check if username is already taken
    const isUsernameTaken = await prisma.store.findFirst({
      where: { username: username.toLowerCase() },
    });

    if (isUsernameTaken) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 400 },
      );
    }

    // Image upload to ImageKit
    const buffer = Buffer.from(await image.arrayBuffer());
    const response = await imagekit.upload({
      file: buffer,
      fileName: image.name,
      folder: "logos",
    });

    const optimizedImage = imagekit.url({
      path: response.filePath,
      transformation: [
        { quality: "auto" },
        { format: "webp" },
        { width: "512" },
      ],
    });

    // 🔥 REMOVED 'address' from the database creation payload
    const newStore = await prisma.store.create({
      data: {
        userId,
        name,
        description,
        username: username.toLowerCase(),
        email,
        contact,
        logo: optimizedImage,
        address: "Campus",
      },
    });

    // Link store to user
    await prisma.user.update({
      where: { id: userId },
      data: { store: { connect: { id: newStore.id } } },
    });

    return NextResponse.json({ message: "Applied, waiting for approval" });
  } catch (error) {
    console.error("CREATE_STORE_POST_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 🔥 GET: Check if user has already registered a store
export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has already registered a store
    const store = await prisma.store.findFirst({
      where: { userId: userId },
    });

    // If store is already registered, send status
    if (store) {
      return NextResponse.json({ status: store.status });
    }

    return NextResponse.json({ status: "not registered" });
  } catch (error) {
    console.error("CREATE_STORE_GET_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
