import { CategoryCarousel } from "@/components/ui/CategoryCarousel";
import connectDB from "@/lib/mongodb";
import CategoryModel from "@/models/Category";

async function getCategories() {
  try {
    await connectDB();
    const categories = await CategoryModel.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error("Error fetching categories in Category component:", error);
    return [];
  }
}


export default async function Category({ className }) {
  const categories = await getCategories();

  return (
    <div
      id="categories"
      className={`w-full flex flex-col gap-2 lg:gap-3 justify-center items-center mt-4 pt-4 sm:pt-15 md:pb-4 bg-background border-2 border-primary border-r-0 border-l-0 ${className || ""}`}
    >
      <h1 className="text-3xl lg:text-4xl font-extrabold font-alexandria text-primary ">
        التصنيفات
      </h1>
      <h2 className="font-bold text-text-muted text-sm lg:text-lg mb-3">
        إختصر البحث عن منتجك :
      </h2>
      <CategoryCarousel categories={categories} />
    </div>
  );
}