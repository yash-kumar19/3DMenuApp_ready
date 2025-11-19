export default async function sitemap() {
  const restaurants = await fetch(`${process.env.API_URL}/restaurant`).then(r => r.json());

  return [
    {
      url: "https://yourdomain.com",
      lastModified: new Date(),
    },
    ...restaurants.map((r: any) => ({
      url: `https://yourdomain.com/restaurant/${r.id}`,
      lastModified: new Date(),
    })),
  ];
}
