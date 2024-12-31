import type { Alert } from "@prisma/client";
import { useMemo } from "react";

export const useAlertsData = (alerts: Alert[] = []) => {
	return useMemo(() => {
		// Базовый случай - пустой массив
		if (!Array.isArray(alerts) || alerts.length === 0) {
			return [];
		}

		try {
			// Группируем тревоги по датам
			const alertsByDate = alerts.reduce<Record<string, number>>(
				(acc, alert) => {
					if (!alert?.date) return acc;

					const dateKey = new Date(alert.date)
						.toISOString()
						.split("T")[0]
						.replace(/-/g, "/");

					return {
						// biome-ignore lint/performance/noAccumulatingSpread: <explanation>
						...acc,
						[dateKey]: (acc[dateKey] || 0) + 1,
					};
				},
				{},
			);

			const values = Object.values(alertsByDate);
			if (values.length === 0) return [];

			// Находим максимальное количество тревог за день
			const maxCount = Math.max(...values, 1);

			// Масштабируем значения к нашей шкале (0-8)
			return Object.entries(alertsByDate).map(([date, count]) => ({
				date,
				count: Math.min(8, Math.round((count / maxCount) * 8)),
			}));
		} catch (error) {
			console.error("Error processing alerts data:", error);
			return [];
		}
	}, [alerts]);
};
