const { codeInspectorPlugin } = require('code-inspector-plugin'); // 具体包名看你安装的

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },

  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.plugins.push(
        codeInspectorPlugin({
          bundler: 'webpack',
          toggleKey: 'alt-shift', // 按下 Alt+Shift 触发元素检查
          editor: 'vscode',       // 点击后用 VS Code 打开
        })
      );
    }
    return config;
  },
};

module.exports = nextConfig;
