import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "./providers";

import { Suspense } from "react";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Alerts Heatmap",
	description: "View alerts statistics",
};

export async function generateStaticParams() {
	return [{ lang: "en" }, { lang: "ru" }, { lang: "he" }];
}

export default async function RootLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{ lang: string }>;
}>) {
	const awaitedParams = await params;
	const { lang } = awaitedParams;

	return (
		<html
			lang={lang}
			dir={lang === "he" ? "rtl" : "ltr"}
			suppressHydrationWarning
		>
			<body
				suppressHydrationWarning
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<Providers>
					<Suspense>{children}</Suspense>
				</Providers>
			</body>
		</html>
	);
}
