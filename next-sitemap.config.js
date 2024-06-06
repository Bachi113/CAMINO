/** @type {import('next-sitemap').IConfig} */
module.exports = {
  // Required: your domain name
  siteUrl: process.env.APP_URL,
  generateRobotsTxt: true, // (optional)
  generateIndexSitemap: false, // (optional)
  exclude: ['/logo.*', '/opengraph-image.*'],
};
