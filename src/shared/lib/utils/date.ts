export function formatDate(date: Date, locale: string) {
	return new Intl.DateTimeFormat(
		locale === "he" ? "he-IL" : locale === "ru" ? "ru-RU" : "en-US",
		{
			day: "numeric",
			month: "long",
			year: "numeric",
		},
	).format(date);
}

export function formatTime(date: Date, locale: string) {
	return new Date(date).toLocaleTimeString(
		locale === "he" ? "he-IL" : locale === "ru" ? "ru-RU" : "en-US",
	);
}
