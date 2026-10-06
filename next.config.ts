import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Permite subir varias fotos a la vez desde el panel (cada una máx. 8 MB).
    serverActions: { bodySizeLimit: "40mb" },
  },
};

export default nextConfig;
