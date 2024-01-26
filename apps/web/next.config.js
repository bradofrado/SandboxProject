const { PrismaPlugin } = require("@prisma/nextjs-monorepo-workaround-plugin");
const path = require('path');

module.exports = {
  reactStrictMode: true,
  transpilePackages: ["ui"],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }
		config.module.rules.push({
	    test: /\.node/,
	    use: 'raw-loader',
	  });
    return config;
  },
  experimental: {
		// Only run the plugin in development mode
		swcPlugins: [
			['harmony-ai-plugin', {rootDir: path.join(__dirname, '../..')}]
		]
	},
};