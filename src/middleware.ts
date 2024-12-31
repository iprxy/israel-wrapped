import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const locales = ["en", "ru", "he"];
const defaultLocale = "ru";

function getLocale(request: NextRequest): string {
	const negotiatorHeaders: Record<string, string> = {};
	for (const [key, value] of request.headers.entries()) {
		negotiatorHeaders[key] = value;
	}

	const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
	const locale = match(languages, locales, defaultLocale);

	return locale;
}

export function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname;
	const pathnameIsMissingLocale = locales.every(
		(locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
	);

	if (pathnameIsMissingLocale) {
		const locale = getLocale(request);
		return NextResponse.redirect(
			new URL(
				`/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
				request.url,
			),
		);
	}
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
