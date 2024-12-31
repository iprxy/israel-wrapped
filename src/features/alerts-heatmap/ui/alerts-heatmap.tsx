"use client";

import { cn } from "@/shared/lib/utils";
import { formatTime } from "@/shared/lib/utils/date";
import { Tooltip } from "@/shared/ui/tooltip";
import type { Alert } from "@prisma/client";
import moment from "moment";
import { useAlertsData } from "../hooks/use-alerts-data";
import { ALERT_LEVEL_CLASSES, getAlertLevel } from "../model/constants";
import { HeatmapLegend } from "./heatmap-legend";

interface AlertsHeatmapProps {
	alerts?: Alert[];
	lang: string;
	isScreenshot?: boolean;
	dict: {
		less: string;
		more: string;
		title: string;
		alertsCount: string;
	};
	selectedItems?: Array<{
		id: number;
		[key: string]: string | number;
	}>;
	isWholeIsrael?: boolean;
	type: "cities" | "areas";
}

function AlertTooltip({
	alerts,
	date,
	lang,
}: {
	alerts: Alert[];
	date: Date;
	lang: string;
}) {
	return (
		<div className="space-y-1 bg-[#1F2937] text-white p-2 rounded-md">
			<div>
				{date.toLocaleDateString(
					lang === "he" ? "he-IL" : lang === "ru" ? "ru-RU" : "en-US",
					{ day: "numeric", month: "long", year: "numeric" },
				)}
			</div>
			{alerts.length > 0 && (
				<div className="space-y-0.5">
					{alerts
						.sort(
							(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
						)
						.map((alert, index) => {
							const date = new Date(alert.date);
							const localDate = new Date(
								date.getTime() - date.getTimezoneOffset() * 60000,
							);
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							return <div key={index}>{formatTime(localDate, lang)}</div>;
						})}
				</div>
			)}
		</div>
	);
}

export function AlertsHeatmap({
	alerts = [],
	lang,
	dict,
	isScreenshot = false,
	selectedItems = [],
	isWholeIsrael = false,
	type,
}: AlertsHeatmapProps) {
	const { value, months, weekDays, dateMap } = useAlertsData(alerts, lang);
	const year = new Date().getFullYear();

	// Получаем все недели года
	const getWeeks = () => {
		const weeks: Date[][] = [];
		const firstDay = moment([year, 0, 1]);
		const lastDay = moment([year, 11, 31]);

		// Начинаем с первой недели года
		const currentDate = moment(firstDay).startOf("week");

		while (
			currentDate.isBefore(lastDay) ||
			currentDate.isSame(lastDay, "day")
		) {
			const week = [];
			for (let i = 0; i < 7; i++) {
				week.push(currentDate.clone().toDate());
				currentDate.add(1, "day");
			}
			weeks.push(week);
		}

		return weeks;
	};

	const weeks = getWeeks();

	// Группируем недели по месяцам
	const monthGrids = Array.from({ length: 12 }, (_, monthIndex) => {
		const monthStart = moment([year, monthIndex, 1]);
		const monthEnd = moment(monthStart).endOf("month");

		// Находим все недели, где есть дни текущего месяца
		const relevantWeeks = weeks.filter((week) => {
			const weekStart = moment(week[0]);
			const weekEnd = moment(week[6]);

			// Специальная обработка для января и декабря
			if (monthIndex === 0) {
				// Январь - берем последнюю неделю предыдущего года и недели до 27 января
				return (
					(weekStart.year() < year && weekEnd.month() === 0) || // Последняя неделя декабря
					(weekStart.month() === 0 && weekStart.date() <= 27) // До 27 января
				);
			}

			if (monthIndex === 11) {
				// Декабрь - включаем только недели декабря текущего года
				return weekStart.month() === 11 && weekStart.year() === year;
			}

			// Для остальных месяцев оставляем обычную логику
			if (
				week.some(
					(date) =>
						moment(date).date() === 1 && moment(date).month() === monthIndex,
				)
			) {
				return true;
			}

			return weekStart.month() === monthIndex && weekEnd.month() === monthIndex;
		});

		return {
			name: months[monthIndex],
			weeks: relevantWeeks,
		};
	});

	return (
		<div className="space-y-4">
			<div data-heatmap className="rounded-lg bg-[#1F2937] p-4">
				<div className="relative">
					<div
						className={`${isScreenshot ? "overflow-hidden" : "overflow-x-auto"} max-w-full`}
						style={{ scrollbarWidth: "thin" }}
					>
						<div className="w-[1200px]">
							<div className="flex">
								{/* Дни недели (один раз в начале) */}
								<div className="flex flex-col mt-6 sticky left-0 bg-[#1F2937] z-10">
									{weekDays.map((day, i) => (
										<div
											// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
											key={i}
											className="h-[20px] w-[20px] text-[10px] text-[#6B7280] flex items-center justify-center"
										>
											{day}
										</div>
									))}
								</div>

								{/* Гриды месяцев */}
								<div className="flex">
									{monthGrids.map((month, monthIndex) => (
										// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
										<div key={monthIndex} className="flex flex-col">
											{/* Название месяца */}
											<div className="text-sm text-[#6B7280] font-medium mb-1 whitespace-nowrap">
												{month.name}
											</div>

											{/* Сетка недель */}
											<div className="flex m-[2px]">
												{month.weeks.map((week, weekIndex) => (
													// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
													<div key={weekIndex} className="flex flex-col">
														{week.map((date, dayIndex) => {
															const dateKey = moment(date).format("YYYY-MM-DD");
															const dataPoint = value.find(
																(v) => v.date === dateKey,
															);
															const dayAlerts = dateMap[dateKey] || [];

															return (
																<Tooltip
																	// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
																	key={dayIndex}
																	content={
																		<AlertTooltip
																			alerts={dayAlerts}
																			date={date}
																			lang={lang}
																		/>
																	}
																>
																	<div className="relative group">
																		<div
																			className={cn(
																				"h-[16px] w-[16px] rounded-[3px] cursor-pointer m-[2px]",
																				"flex items-center justify-center text-[9px] font-medium",
																				"transition-all duration-100",
																				"group-hover:scale-[1.2] group-hover:z-10",
																				"group-hover:ring-2 ring-[#3B82F6]",
																				moment(date).year() === year
																					? ALERT_LEVEL_CLASSES[
																							getAlertLevel(
																								dataPoint?.count || 0,
																							)
																						]
																					: "bg-transparent",
																			)}
																		>
																			<span className="opacity-0 group-hover:opacity-100 text-[#374151]">
																				{date.getDate()}
																			</span>
																		</div>
																	</div>
																</Tooltip>
															);
														})}
													</div>
												))}
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="mt-4 flex items-center justify-between">
					<div className="text-sm text-gray-200 flex-1 truncate">
						{isWholeIsrael ? (
							<>
								{dict.alertsCount} {dict.title}
							</>
						) : type === "cities" ? (
							<span className="truncate">
								{dict.alertsCount}{" "}
								{selectedItems.map((item) => item[lang]).join(", ")}
							</span>
						) : (
							<span className="truncate">
								{dict.alertsCount}{" "}
								{selectedItems.map((item) => item[lang]).join(", ")}
							</span>
						)}
					</div>
					{value.length > 0 && <HeatmapLegend dict={dict} />}
				</div>
			</div>
		</div>
	);
}
