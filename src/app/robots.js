export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://elboutiqa.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/checkout"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
