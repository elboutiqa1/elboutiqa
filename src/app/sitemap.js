import { getProducts } from "@/lib/products";

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://elboutiqa.com";

  // Product pages from DB
  let productUrls = [];
  try {
    const products = await getProducts();
    productUrls = products.map((product) => ({
      url: `${baseUrl}/product/${product.slug || product._id}`,
      lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch (e) {
    console.error("Sitemap: failed to fetch products", e);
  }

  // Categories
  const categories = ["Hub", "Refroidisseur", "Electronique", "Accessoires"];
  const categoryUrls = categories.map((cat) => ({
    url: `${baseUrl}/category/${cat}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/category`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...categoryUrls,
    ...productUrls,
  ];
}
