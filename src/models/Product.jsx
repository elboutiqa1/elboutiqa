import mongoose from "mongoose";

/* ── helper: توليد slug من النص يدعم العربية والفرنسية والإنجليزية ── */
export function generateSlug(text) {
  if (!text) return "";
  const cleaned = text
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // إزالة علامات التشكيل واللهجات الفرنسية
    .replace(/[^\p{L}\p{N}\s-]/gu, "") // دعم كل الحروف (العربية، اللاتينية، الأرقام)
    .replace(/[\s_]+/g, "-") // تحويل المسافات والشرطات السفلية إلى -
    .replace(/-+/g, "-") // إزالة التكرار
    .replace(/^-+|-+$/g, ""); // مسح البداية والنهاية

  return cleaned || `product-${Date.now()}`;
}

const optionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    oldPrice: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    description: { type: String, required: true, trim: true },

    price: { type: Number, required: true, min: 0 },

    oldPrice: { type: Number, default: 0, min: 0 },

    img: { type: String, required: true },

    images: { type: [String], default: [] },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    inStock: { type: Boolean, default: true },

    options: { type: [optionSchema], default: [] },

    features: { type: [String], default: [] },

    isFeatured: { type: Boolean, default: false },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

/* ── Pre-save: توليد slug تلقائياً ── */
productSchema.pre("save", async function () {
  if (
    !this.isModified("name") &&
    !this.isModified("slug") &&
    this.slug
  ) {
    return;
  }

  const ProductModel = mongoose.models.Product;

  let baseSlug = generateSlug(this.slug || this.name);
  let slug = baseSlug;
  let counter = 1;

  while (
    await ProductModel?.findOne({
      slug,
      _id: { $ne: this._id },
    })
  ) {
    slug = `${baseSlug}-${counter++}`;
  }

  this.slug = slug;
});


/* ── Pre-findOneAndUpdate: تحديث slug عند تغيير الاسم أو الـ slug ── */
productSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();

  const name = update?.name ?? update?.$set?.name;
  const providedSlug = update?.slug ?? update?.$set?.slug;

  if (!name && !providedSlug) {
    return;
  }

  const ProductModel = mongoose.models.Product;

  let baseSlug = generateSlug(providedSlug || name);
  let slug = baseSlug;
  let counter = 1;

  const docId = this.getQuery()._id;

  while (
    await ProductModel?.findOne({
      slug,
      _id: { $ne: docId },
    })
  ) {
    slug = `${baseSlug}-${counter++}`;
  }

  if (update?.$set) {
    update.$set.slug = slug;
  } else {
    update.slug = slug;
  }

  this.setUpdate(update);
});

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;