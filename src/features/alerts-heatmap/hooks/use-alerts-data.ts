"use client";

import type { Alert } from "@prisma/client";
import { useMemo } from "react";
import type { AlertsData } from "../model/types";

const WEEKDAYS = {
	en: ["Su", "", "Tu", "", "Th", "", "Sa"],
	ru: ["Вс", "", "Вт", "", "Чт", "", "Сб"],
	he: ["א", "", "ג", "", "ה", "", "ש"],
};

const MONTHS = {
	en: [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	],
	ru: [
		"Янв",
		"Фев",
		"Мар",
		"Апр",
		"Май",
		"Июн",
		"Июл",
		"Авг",
		"Сен",
		"Окт",
		"Ноя",
		"Дек",
	],
	he: [
		"ינו",
		"פבר",
		"מרץ",
		"אפר",
		"מאי",
		"יונ",
		"יול",
		"אוג",
		"ספט",
		"אוק",
		"נוב",
		"דצמ",
	],
};

export function useAlertsData(
	alerts: Alert[],
	lang: string,
): AlertsData & { dateMap: Record<string, Alert[]> } {
	return useMemo(() => {
		if (!alerts?.length)
			return { value: [], dateMap: {}, months: [], weekDays: [] };

		const dateMap: Record<string, Alert[]> = {};
		const value: { date: string; count: number }[] = [];

		for (const alert of alerts) {
			const date = new Date(alert.date);
			const dateKey = date.toISOString().split("T")[0];

			if (!dateMap[dateKey]) {
				dateMap[dateKey] = [];
			}
			dateMap[dateKey].push(alert);
		}

		for (const [date, alerts] of Object.entries(dateMap)) {
			value.push({
				date,
				count: alerts.length,
			});
		}

		return {
			value,
			dateMap,
			months: MONTHS[lang as keyof typeof MONTHS],
			weekDays: WEEKDAYS[lang as keyof typeof WEEKDAYS],
		};
	}, [alerts, lang]);
}
