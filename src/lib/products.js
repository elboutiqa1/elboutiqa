import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

/**
 * جلب جميع المنتجات من قاعدة البيانات
 * @param {{ category?: string, search?: string, limit?: number }} opts
 */
export async function getProducts({ category, search, limit } = {}) {
  await connectDB();

  const filter = { isActive: { $ne: false } };

  if (search?.trim()) {
    filter.name = { $regex: search.trim(), $options: "i" };
  }

  if (category?.trim()) {
    const Category = (await import("@/models/Category")).default;
    const cat = await Category.findOne({
      $or: [
        { name: { $regex: category.trim(), $options: "i" } },
        { slug: { $regex: category.trim(), $options: "i" } },
        { _id: category.trim().match(/^[0-9a-fA-F]{24}$/) ? category.trim() : null },
      ],
    }).lean();

    if (cat) {
      filter.category = cat._id;
    }
  }

  let query = Product.find(filter)
    .populate("category", "name slug")
    .sort({ createdAt: -1 });

  if (limit) query = query.limit(limit);

  const products = await query.lean();

  return products.map(serialize);
}

/**
 * جلب منتج واحد بالـ _id
 * @param {string} id
 */
export async function getProductById(id) {
  await connectDB();
  if (!id) return null;

  try {
    const product = await Product.findById(id)
      .populate("category", "name slug")
      .lean();

    return product ? serialize(product) : null;
  } catch {
    return null;
  }
}

/**
 * جلب منتج واحد بالـ slug (مع دعم الحروف العربية والـ fallback)
 * @param {string} slug
 */
export async function getProductBySlug(slug) {
  await connectDB();
  if (!slug) return null;

  try {
    const rawSlug = String(slug).trim();
    let decodedSlug = rawSlug;
    try {
      decodedSlug = decodeURIComponent(rawSlug);
    } catch {
      // keep rawSlug
    }

    let product = await Product.findOne({
      $or: [
        { slug: rawSlug },
        { slug: decodedSlug },
        { slug: rawSlug.toLowerCase() },
        { slug: decodedSlug.toLowerCase() },
      ],
    })
      .populate("category", "name slug")
      .lean();

    // Fallback: إذا لم نجد بالـ slug وكان المعرف ObjectId صالحاً (24 hex characters)
    if (!product && rawSlug.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(rawSlug)
        .populate("category", "name slug")
        .lean();
    }

    return product ? serialize(product) : null;
  } catch {
    return null;
  }
}

/**
 * جلب المنتجات المميزة (isFeatured)
 * @param {number} limit
 */
export async function getFeaturedProducts(limit = 8) {
  await connectDB();
  const products = await Product.find({ isFeatured: true, isActive: { $ne: false } })
    .populate("category", "name slug")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return products.map(serialize);
}

/* ── helper: يحول كل ObjectId و Date إلى string ── */
function serialize(product) {
  return {
    ...product,
    _id: String(product._id),
    id: String(product._id),        // alias للتوافق مع الكود القديم
    slug: product.slug || String(product._id), // fallback للمنتجات القديمة بدون slug
    category: product.category
      ? {
          ...product.category,
          _id: String(product.category._id),
        }
      : product.category,
    createdAt: product.createdAt ? String(product.createdAt) : undefined,
    updatedAt: product.updatedAt ? String(product.updatedAt) : undefined,
  };
}
