export default function robots() {
  const baseUrl = "https://el-boutiqa.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/checkout", "/dashboard/", "/login"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
