/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://arcraiderskits.com",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: "weekly",
  priority: 0.7,
  exclude: [],
  robotsTxtOptions: {
    additionalSitemaps: [],
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
  },
  transform: async (config, path) => {
    // Custom priority for different page types
    let priority = config.priority;
    let changefreq = config.changefreq;

    if (path === "/") {
      priority = 1.0;
      changefreq = "daily";
    } else if (path === "/items") {
      priority = 0.9;
      changefreq = "daily";
    } else if (path.startsWith("/items/")) {
      priority = 0.8;
      changefreq = "weekly";
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    };
  },
};
