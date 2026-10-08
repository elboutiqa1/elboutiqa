import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import cloudinary from "@/lib/cloudinary";

// GET /api/products
export async function GET() {
  try {
    await connectDB();

    const products = await Product.find()
      .populate({
        path: "category",
        select: "name slug",
        model: Category,
      })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch products",
      },
      { status: 500 }
    );
  }
}

// POST /api/products
export async function POST(request) {
  try {
    await connectDB();

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

    if (!name || !description || price == null || !category) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Name, description, price and category are required",
        },
        { status: 400 }
      );
    }

    let imgUrl = img || "";

    if (img && img.startsWith("data:image")) {
      const result = await cloudinary.uploader.upload(img, {
        folder: "elboutiqa/products",
      });

      imgUrl = result.secure_url;
    }

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

    const product = await Product.create({
      name: name.trim(),
      slug: slug?.trim() || undefined,
      description: description.trim(),
      price: Number(price),
      oldPrice: Number(oldPrice) || 0,
      img: imgUrl,
      images: imagesUrls,
      category,
      inStock: inStock !== false,
      isFeatured: isFeatured === true,
      options: options || [],
      features: features || [],
      isActive: true,
    });

    const populated = await product.populate({
      path: "category",
      select: "name slug",
      model: Category,
    });

    return NextResponse.json(
      {
        success: true,
        product: populated,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create product",
      },
      { status: 500 }
    );
  }
}