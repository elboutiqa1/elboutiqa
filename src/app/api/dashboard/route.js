import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Dashboard from "@/models/Dashboard";
import Product from "@/models/Product";
import Category from "@/models/Category";

// GET /api/dashboard - جلب إحصائيات لوحة التحكم
export async function GET() {
  try {
    await connectDB();

    const [prodsCount, catsCount] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
    ]);

    const dashboard = await Dashboard.getDashboard();

    // مزامنة أعداد المنتجات والتصنيفات من قاعدة البيانات
    dashboard.totalProducts = prodsCount;
    dashboard.totalCategories = catsCount;
    dashboard.lastUpdated = new Date();
    await dashboard.save();

    return NextResponse.json({
      success: true,
      stats: {
        totalProducts: dashboard.totalProducts || 0,
        totalCategories: dashboard.totalCategories || 0,
        totalOrders: dashboard.totalOrders || 0,
        totalRevenue: dashboard.totalRevenue || 0,
        lastUpdated: dashboard.lastUpdated,
      },
    });
  } catch (error) {
    console.error("GET DASHBOARD ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch dashboard statistics",
      },
      { status: 500 }
    );
  }
}

// POST /api/dashboard - تحديث أو إنقاص مجموع الطلبات بالعدد وبالسعر
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json().catch(() => ({}));
    const { action = "add", grandTotal = 0, orderCount = 1 } = body;

    const [prodsCount, catsCount] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
    ]);

    const dashboard = await Dashboard.getDashboard();

    const count = Math.max(1, Number(orderCount) || 1);
    const amount = Math.max(0, Number(grandTotal) || 0);

    if (action === "decrease" || action === "deduct") {
      // إنقاص عدد الطلبات ومجموع السعر (مع الحفاظ على عدم النزول تحت الصفر)
      dashboard.totalOrders = Math.max(0, (dashboard.totalOrders || 0) - count);
      dashboard.totalRevenue = Math.max(0, (dashboard.totalRevenue || 0) - amount);
    } else if (action === "reset") {
      // إعادة التعيين
      dashboard.totalOrders = 0;
      dashboard.totalRevenue = 0;
    } else {
      // الإضافة الافتراضية
      dashboard.totalOrders = (dashboard.totalOrders || 0) + count;
      dashboard.totalRevenue = (dashboard.totalRevenue || 0) + amount;
    }

    // مزامنة المنتجات والتصنيفات
    dashboard.totalProducts = prodsCount;
    dashboard.totalCategories = catsCount;
    dashboard.lastUpdated = new Date();

    await dashboard.save();

    return NextResponse.json({
      success: true,
      stats: {
        totalProducts: dashboard.totalProducts,
        totalCategories: dashboard.totalCategories,
        totalOrders: dashboard.totalOrders,
        totalRevenue: dashboard.totalRevenue,
        lastUpdated: dashboard.lastUpdated,
      },
    });
  } catch (error) {
    console.error("POST DASHBOARD ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update dashboard" },
      { status: 500 }
    );
  }
}
