import type { NextConfig } from "next";
import path from "node:path";

const projectRoot =
  typeof __dirname !== "undefined" ? __dirname : process.cwd();

const nextConfig: NextConfig = {
  serverExternalPackages: ["@cmsgov/hpt-validator"],
  turbopack: {
    root: path.resolve(projectRoot),
  },
};

export default nextConfig;
