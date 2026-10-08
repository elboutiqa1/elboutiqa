import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";

/**
 * جلب جميع المنتجات من قاعدة البيانات
 * @param {{ category?: string, search?: string, limit?: number }} opts
 */
export async function getProducts({ category, search, limit } = {}) {
  await connectDB();

  const filter = {
    isActive: { $ne: false },
  };

  if (search?.trim()) {
    filter.name = {
      $regex: search.trim(),
      $options: "i",
    };
  }

  if (category?.trim()) {
    const categoryValue = category.trim();

    const orConditions = [
      {
        name: {
          $regex: categoryValue,
          $options: "i",
        },
      },
      {
        slug: {
          $regex: categoryValue,
          $options: "i",
        },
      },
    ];

    // البحث بالـ ObjectId فقط إذا كان صالحًا
    if (/^[0-9a-fA-F]{24}$/.test(categoryValue)) {
      orConditions.push({
        _id: categoryValue,
      });
    }

    const cat = await Category.findOne({
      $or: orConditions,
    }).lean();

    if (cat) {
      filter.category = cat._id;
    }
  }

  let query = Product.find(filter)
    .populate("category", "name slug")
    .sort({ createdAt: -1 });

  if (limit) {
    query = query.limit(limit);
  }

  const products = await query.lean();

  return products.map(serialize);
}

/**
 * جلب منتج واحد بالـ _id
 * @param {string} id
 */
export async function getProductById(id) {
  await connectDB();

  if (!id) {
    return null;
  }

  try {
    const product = await Product.findById(id)
      .populate("category", "name slug")
      .lean();

    return product ? serialize(product) : null;
  } catch (error) {
    console.error("GET PRODUCT BY ID ERROR:", error);
    throw error;
  }
}

/**
 * جلب منتج واحد بالـ slug
 *
 * يدعم:
 * - slug الحالي
 * - slug بعد decodeURIComponent
 * - lowercase
 * - MongoDB ObjectId كـ fallback
 * - previousSlugs للروابط القديمة
 *
 * @param {string} slug
 */
export async function getProductBySlug(slug) {
  await connectDB();

  if (!slug) {
    return null;
  }

  try {
    const rawSlug = String(slug).trim();

    let decodedSlug = rawSlug;

    try {
      decodedSlug = decodeURIComponent(rawSlug);
    } catch {
      // نستخدم rawSlug إذا كان الترميز غير صالح
    }

    const slugVariants = [
      rawSlug,
      decodedSlug,
      rawSlug.toLowerCase(),
      decodedSlug.toLowerCase(),
    ].filter(
      (value, index, array) =>
        value && array.indexOf(value) === index
    );

    // 1. البحث بالـ slug الحالي
    let product = await Product.findOne({
      $or: slugVariants.map((value) => ({
        slug: value,
      })),
    })
      .populate("category", "name slug")
      .lean();

    // 2. fallback: إذا كان الـ slug نفسه MongoDB ObjectId
    if (!product && /^[0-9a-fA-F]{24}$/.test(rawSlug)) {
      product = await Product.findById(rawSlug)
        .populate("category", "name slug")
        .lean();
    }

    // 3. البحث في الـ slugs القديمة
    if (!product) {
      product = await Product.findOne({
        previousSlugs: {
          $in: slugVariants,
        },
      })
        .populate("category", "name slug")
        .lean();

      // وُجد عبر slug قديم → إعادة التوجيه للرابط الجديد
      if (product) {
        return {
          ...serialize(product),
          _redirectSlug: product.slug,
        };
      }
    }

    // المنتج غير موجود فعلًا
    return product ? serialize(product) : null;
  } catch (error) {
    console.error("GET PRODUCT BY SLUG ERROR:", {
      slug,
      message: error?.message,
      name: error?.name,
      stack: error?.stack,
    });

    // مهم: لا نحول خطأ قاعدة البيانات إلى 404
    throw error;
  }
}

/**
 * جلب المنتجات المميزة
 * @param {number} limit
 */
export async function getFeaturedProducts(limit = 8) {
  await connectDB();

  const products = await Product.find({
    isFeatured: true,
    isActive: { $ne: false },
  })
    .populate("category", "name slug")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return products.map(serialize);
}

/**
 * تحويل ObjectId و Date إلى string
 */
function serialize(product) {
  return {
    ...product,

    _id: String(product._id),

    // للتوافق مع الكود القديم
    id: String(product._id),

    // fallback للمنتجات القديمة التي لا تحتوي على slug
    slug: product.slug || String(product._id),

    category: product.category
      ? {
          ...product.category,
          _id: String(product.category._id),
        }
      : product.category,

    createdAt: product.createdAt
      ? String(product.createdAt)
      : undefined,

    updatedAt: product.updatedAt
      ? String(product.updatedAt)
      : undefined,
  };
}

