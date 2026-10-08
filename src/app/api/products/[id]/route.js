import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import cloudinary from "@/lib/cloudinary";

// PUT /api/products/[id]
export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();

    const {
      name,
      slug,
      description,
      price,
      oldPrice,
      category,
      inStock,
      isFeatured,
      options,
      features,
      img,
      images,
    } = body;

    const existing = await Product.findById(id);

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    // Upload main image if new base64
    let imgUrl = img || existing.img;

    if (img && img.startsWith("data:image")) {
      const result = await cloudinary.uploader.upload(img, {
        folder: "elboutiqa/products",
      });

      imgUrl = result.secure_url;
    }

    // Process additional images
    const imagesUrls = [];

    for (const image of images || []) {
      if (image && image.startsWith("data:image")) {
        const result = await cloudinary.uploader.upload(image, {
          folder: "elboutiqa/products",
        });

        imagesUrls.push(result.secure_url);
      } else if (image && image.startsWith("http")) {
        imagesUrls.push(image);
      }
    }

    const updateData = {
      name: name?.trim(),
      description: description?.trim(),
      price: Number(price),
      oldPrice: Number(oldPrice) || 0,
      img: imgUrl,
      images:
        imagesUrls.length > 0
          ? imagesUrls
          : existing.images,
      category,
      inStock: inStock !== false,
      isFeatured: isFeatured === true,
      options: options || [],
      features: features || [],
    };

    if (slug !== undefined) {
      updateData.slug = slug.trim();
    }

    // جلب الـ slug القديم قبل التحديث
    const oldProduct = await Product.findById(id)
      .select("slug")
      .lean();

    const oldSlug = oldProduct?.slug;

    const updated = await Product.findByIdAndUpdate(
      id,
      updateData,
      {
        returnDocument: "after",
        runValidators: true,
      }
    ).populate({
      path: "category",
      select: "name slug",
      model: Category,
    });

    if (!updated) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found after update",
        },
        { status: 404 }
      );
    }

    // تحديث كاش صفحة المنتج
    revalidatePath(
      `/product/${encodeURIComponent(updated.slug)}`
    );

    // إذا تغير الـ slug
    if (oldSlug && oldSlug !== updated.slug) {
      revalidatePath(
        `/product/${encodeURIComponent(oldSlug)}`
      );
    }

    // تحديث الصفحة الرئيسية
    revalidatePath("/");

    return NextResponse.json({
      success: true,
      product: updated,
    });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error.message || "Failed to update product",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id]
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    // تحديث كاش صفحة المنتج
    if (product.slug) {
      revalidatePath(
        `/product/${encodeURIComponent(product.slug)}`
      );
    }

    // تحديث الصفحة الرئيسية
    revalidatePath("/");

    return NextResponse.json({
      success: true,
      message: "Product deleted",
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error.message || "Failed to delete product",
      },
      { status: 500 }
    );
  }
}

