// app/sitemap.ts

import { MetadataRoute } from "next";

const SITE_URL = "https://newmarkprimemeat.com";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.newmarkprimemeat.com/api/v1";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let products: any[] = [];

  try {
    const res = await fetch(`${API_URL}/products?limit=1000`, {
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      products = data.docs || [];
    }
  } catch {
    products = [];
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/contact",
    "/faqs",
    "/privacy-policy",
    "/profile",
    "/shop",
    "/terms-of-service",
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));

  const productRoutes: MetadataRoute.Sitemap = products
    .filter((product) => product.slug)
    .map((product) => ({
      url: `${SITE_URL}/shop/${product.slug}`,
      lastModified: product.updatedAt
        ? new Date(product.updatedAt)
        : new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    }));

  return [...staticRoutes, ...productRoutes];
}
