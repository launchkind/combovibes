import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://combovibes.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "", "/shop", "/search",
    "/category/flowers", "/category/cakes", "/category/combos",
    "/category/chocolates", "/category/plants", "/category/personalised",
    "/occasion/birthday", "/occasion/anniversary", "/occasion/wedding",
    "/occasion/valentines", "/occasion/mothers-day", "/occasion/diwali",
    "/auth/login", "/auth/register",
    "/vendor/register", "/about", "/contact", "/faq",
  ];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : route.startsWith("/shop") || route.startsWith("/occasion") ? 0.8 : 0.5,
  }));
}
