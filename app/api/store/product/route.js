import imagekit from "@/configs/imageKit";
import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// --- 1. ADD NEW PRODUCT ---
export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const storeId = await authSeller(userId);

    if (!storeId) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const mrp = Number(formData.get("mrp"));
    const price = Number(formData.get("price"));
    const category = formData.get("category");
    const stock = Number(formData.get("stock") || 1);
    const images = formData.getAll("images");

    if (
      !name ||
      !description ||
      !mrp ||
      !price ||
      !category ||
      images.length < 1
    ) {
      return NextResponse.json(
        { error: "missing product details" },
        { status: 400 },
      );
    }

    const imagesUrl = await Promise.all(
      images.map(async (image) => {
        const buffer = Buffer.from(await image.arrayBuffer());
        const response = await imagekit.upload({
          file: buffer,
          fileName: image.name,
          folder: "products",
        });
        return imagekit.url({
          path: response.filePath,
          transformation: [
            { quality: "auto" },
            { format: "webp" },
            { width: "1024" },
          ],
        });
      }),
    );

    await prisma.product.create({
      data: {
        name,
        description,
        mrp,
        price,
        stock,
        category,
        images: imagesUrl,
        storeId,
      },
    });

    return NextResponse.json({ message: "Product added successfully" });
  } catch (error) {
    console.error("POST ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// --- 2. GET SELLER PRODUCTS ---
export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const storeId = await authSeller(userId);

    if (!storeId) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }

    const products = await prisma.product.findMany({
      where: { storeId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("GET ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// --- 3. UPDATE PRODUCT (Multi-Image & Category Support) ---
export async function PUT(request) {
  try {
    const { userId } = getAuth(request);
    const storeId = await authSeller(userId);

    if (!storeId) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }

    // 🔥 SWITCHED: From request.json() to request.formData()
    const formData = await request.formData();
    const id = formData.get("id");
    const name = formData.get("name");
    const description = formData.get("description");
    const mrp = Number(formData.get("mrp"));
    const price = Number(formData.get("price"));
    const category = formData.get("category");
    const stock = Number(formData.get("stock"));
    const newImages = formData.getAll("images"); // Array of new files

    if (
      !id ||
      !name ||
      !description ||
      isNaN(price) ||
      isNaN(mrp) ||
      isNaN(stock) ||
      !category
    ) {
      return NextResponse.json(
        { error: "Missing required product details" },
        { status: 400 },
      );
    }

    // Verify ownership
    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct || existingProduct.storeId !== storeId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Prepare data for update
    let updateData = {
      name,
      description,
      price,
      mrp,
      stock,
      category,
    };

    // 🔥 NEW: Handle new image uploads if provided
    // Check if the first item is a file (Blob) and not just a string/empty
    if (newImages.length > 0 && typeof newImages[0] !== "string") {
      const imagesUrl = await Promise.all(
        newImages.map(async (image) => {
          const buffer = Buffer.from(await image.arrayBuffer());
          const response = await imagekit.upload({
            file: buffer,
            fileName: `update_${id}_${Date.now()}.webp`,
            folder: "products",
          });
          return imagekit.url({
            path: response.filePath,
            transformation: [
              { quality: "auto" },
              { format: "webp" },
              { width: "1024" },
            ],
          });
        }),
      );
      // Replace old images with new ones
      updateData.images = imagesUrl;
    }

    await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("PUT ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// --- 4. FORCE DELETE PRODUCT ---
export async function DELETE(request) {
  try {
    const { userId } = getAuth(request);
    const storeId = await authSeller(userId);

    if (!storeId) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing product ID" },
        { status: 400 },
      );
    }

    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct || existingProduct.storeId !== storeId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    await prisma.$transaction([
      prisma.orderItem.deleteMany({ where: { productId: id } }),
      prisma.rating.deleteMany({ where: { productId: id } }),
      prisma.product.delete({ where: { id: id } }),
    ]);

    return NextResponse.json({ message: "Product deleted permanently" });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
