/** @type {import('next').NextConfig} */

const webpack = require("webpack");

const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["en", "vi"],
    defaultLocale: "en",
  },
  transpilePackages: ["@shopifize/ui"],
  experimental: {
    esmExternals: 'loose'
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    config.plugins.push(
      new webpack.IgnorePlugin({resourceRegExp: /^\.\/lib$/ ,contextRegExp: /^fs$/ })
    );
    // Important: return the modified config
    return config;
  },
};

module.exports = nextConfig;
