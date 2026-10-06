import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";
import cloudinary from "@/lib/cloudinary";

// PUT /api/category/[id]
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const body = await request.json();
    const { name, slug, image } = body;

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { success: false, message: "Catégorie non trouvée" },
        { status: 404 }
      );
    }

    let imageUrl = category.image;

    // Upload new image if base64 provided
    if (image && image.startsWith("data:image")) {
      const uploadResult = await cloudinary.uploader.upload(image, {
        folder: "elboutiqa/categories",
      });
      imageUrl = uploadResult.secure_url;
    } else if (image !== undefined && image !== "") {
      imageUrl = image;
    }

    if (name) category.name = name.trim();
    if (slug) category.slug = slug.trim();

    if (imageUrl !== undefined) category.image = imageUrl;

    await category.save();

    return NextResponse.json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("UPDATE CATEGORY ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE /api/category/[id]
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return NextResponse.json(
        { success: false, message: "Catégorie introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Catégorie supprimée avec succès",
    });
  } catch (error) {
    console.error("DELETE CATEGORY ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete category" },
      { status: 500 }
    );
  }
}
