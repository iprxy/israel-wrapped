import moment from "moment-timezone";
import "moment/locale/he";
import "moment/locale/ru";

export const JERUSALEM_TIMEZONE = "Asia/Jerusalem";

export function toJerusalemTime(date: Date | string): moment.Moment {
	return moment(date).tz(JERUSALEM_TIMEZONE);
}

export function formatDate(date: Date, lang: string): string {
	return date.toLocaleDateString(
		lang === "he" ? "he-IL" : lang === "ru" ? "ru-RU" : "en-US",
		{
			year: "numeric",
			month: "long",
			day: "numeric",
		},
	);
}

export function formatTime(date: Date, lang: string): string {
	moment.locale(lang);
	return moment(date).tz(JERUSALEM_TIMEZONE).format("HH:mm");
}
