import { MetadataRoute } from "next";

const API =
  process.env.NEXT_PUBLIC_API_URL || "https://api.newmarkprimemeat.com/api/v1";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let products = [];

  try {
    const res = await fetch(`${API}/products?limit=1000`, {
      cache: "no-store",
    });

    const data = await res.json();
    products = data.docs || [];
  } catch (error) {
    products = [];
  }

  const productUrls = products.map((product: any) => ({
    url: `https://newmarkprimemeat.com/products/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [
    {
      url: "https://newmarkprimemeat.com",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://newmarkprimemeat.com/shop",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...productUrls,
  ];
}
