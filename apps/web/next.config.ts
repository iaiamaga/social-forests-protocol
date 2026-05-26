import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dizemos apenas para transpilar o código da lib
  transpilePackages: ["../lib"],

  // Nenhuma configuração de Webpack complexa é necessária agora,
  // pois o NPM Workspace vai resolver os módulos automaticamente.
};

export default nextConfig;