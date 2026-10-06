import mongoose from "mongoose";

/* ── Schema إحصائيات لوحة التحكم ── */
const dashboardSchema = new mongoose.Schema(
  {
    // مجموع المنتجات
    totalProducts: {
      type: Number,
      default: 0,
      min: 0,
    },

    // مجموع التصنيفات
    totalCategories: {
      type: Number,
      default: 0,
      min: 0,
    },

    // مجموع الطلبات بالعدد
    totalOrders: {
      type: Number,
      default: 0,
      min: 0,
    },

    // مجموع الطلبات بالسعر (قيمة كل الطلبات)
    totalRevenue: {
      type: Number,
      default: 0,
      min: 0,
    },

    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

/* ── جلب وثيقة الـ Dashboard أو إنشاؤها إن لم تكن موجودة ── */
dashboardSchema.statics.getDashboard = async function () {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({
      totalProducts: 0,
      totalCategories: 0,
      totalOrders: 0,
      totalRevenue: 0,
      lastUpdated: new Date(),
    });
  }
  return doc;
};

const Dashboard =
  mongoose.models.Dashboard || mongoose.model("Dashboard", dashboardSchema);

export default Dashboard;
