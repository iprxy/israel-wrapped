import type { Config } from "tailwindcss";

const config: Config = {
	content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				gray: {
					50: "rgb(var(--color-gray-50) / <alpha-value>)",
					100: "rgb(var(--color-gray-100) / <alpha-value>)",
					// ... остальные оттенки
					900: "rgb(var(--color-gray-900) / <alpha-value>)",
				},
				red: {
					50: "rgb(var(--color-red-50) / <alpha-value>)",
					100: "rgb(var(--color-red-100) / <alpha-value>)",
					// ... остальные оттенки
					900: "rgb(var(--color-red-900) / <alpha-value>)",
				},
			},
		},
	},
	plugins: [],
};

export default config;
