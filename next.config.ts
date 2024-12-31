import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	experimental: {
		dynamicIO: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
};

export default nextConfig;
