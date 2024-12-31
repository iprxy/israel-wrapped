import "server-only";
import type { Dictionary } from "./types";

type Locale = "en" | "ru" | "he";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
	en: async () =>
		(await import("./dictionaries/en.json")).default as Dictionary,
	ru: async () =>
		(await import("./dictionaries/ru.json")).default as Dictionary,
	he: async () =>
		(await import("./dictionaries/he.json")).default as Dictionary,
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
	try {
		return await dictionaries[locale]();
	} catch (error) {
		console.error(`Failed to load dictionary for locale: ${locale}`, error);
		throw error;
	}
}
