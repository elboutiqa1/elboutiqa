import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";
import cloudinary from "@/lib/cloudinary";

// GET /api/category
export async function GET() {
  try {
    await connectDB();

    const categories = await Category.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "category",
          as: "products",
        },
      },
      {
        $addFields: {
          productCount: { $size: "$products" },
        },
      },
      {
        $project: {
          products: 0,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("GET CATEGORIES ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch categories",
      },
      { status: 500 }
    );
  }
}

// POST /api/category
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, slug, image } = body;

    if (!name || !slug) {
      return NextResponse.json(
        {
          success: false,
          message: "Name and slug are required",
        },
        { status: 400 }
      );
    }

    // Check duplicate name or slug
    const existingCategory = await Category.findOne({
      $or: [{ name: name.trim() }, { slug: slug.trim() }],
    });

    if (existingCategory) {
      return NextResponse.json(
        {
          success: false,
          message: "Une catégorie avec ce nom ou slug existe déjà",
        },
        { status: 409 }
      );
    }

    let imageUrl = image || "";

    // Upload base64 image to Cloudinary
    if (image && image.startsWith("data:image")) {
      const uploadResult = await cloudinary.uploader.upload(image, {
        folder: "elboutiqa/category",
      });
      imageUrl = uploadResult.secure_url;
    }

    // Create category
    const category = await Category.create({
      name: name.trim(),
      slug: slug.trim(),
      image: imageUrl,
      isActive: true,
    });

    return NextResponse.json(
      {
        success: true,
        category,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE CATEGORY ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create category",
      },
      { status: 500 }
    );
  }
}
