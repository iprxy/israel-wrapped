"use client";

import { AlertsHeatmap } from "@/features/alerts-heatmap/ui/alerts-heatmap";
import { ShareButton } from "@/features/share-button/ui/share-button";
import type { Alert } from "@prisma/client";
import { Bell, Calendar, Clock, Target, Zap } from "lucide-react";
import { useRef } from "react";

interface AlertsStatsProps {
	alerts: Alert[];
	selectedItems: Array<{
		id: number;
		[key: string]: string | number;
	}>;
	type: "cities" | "areas";
	lang: string;
	dict: {
		title: string;
		subtitle: string;
		selectedItems: {
			cities: {
				one: string;
				many: string;
			};
			areas: {
				one: string;
				many: string;
			};
		};
		metrics: {
			totalAlerts: string;
			rocketAlerts: string;
			droneAlerts: string;
			firstAlert: string;
			lastAlert: string;
			longestStreak: string;
			days: string;
			maxAlertsPerDay: string;
			alerts: string;
			eliminated: string;
			otherLeaders: string;
			hostages: {
				description: string;
				action: string;
			};
			shelterTime: {
				title: string;
				hours: string;
				minutes: string;
			};
			leaders: {
				yahya: string;
				hassan: string;
				ismail: string;
				mohammed: string;
			};
		};
		heatmap: {
			less: string;
			more: string;
			title: string;
			alertsCount: string;
		};
		share: {
			share: string;
			download: string;
			madeWith: string;
			loading: string;
		};
	};
	isWholeIsrael?: boolean;
}

export function AlertsStats({
	alerts,
	selectedItems,
	type,
	lang,
	dict,
	isWholeIsrael,
}: AlertsStatsProps) {
	const contentRef = useRef<HTMLDivElement>(null);

	// Вычисляем количество ракетных тревог
	const rocketAlerts = alerts.filter((alert) => alert.type === "🚀").length;

	// Вычисляем количество тревог БПЛА
	const droneAlerts = alerts.filter((alert) => alert.type === "🛩️").length;

	// Находим первую и последнюю тревогу
	const firstAlert =
		alerts.length > 0 ? new Date(alerts[alerts.length - 1].date) : null;
	const lastAlert = alerts.length > 0 ? new Date(alerts[0].date) : null;

	// Находим максимальное количество дней подряд с тревогами
	const getMaxConsecutiveDays = () => {
		if (alerts.length === 0) return 0;

		const dates = [
			...new Set(
				alerts.map((alert) => new Date(alert.date).toISOString().split("T")[0]),
			),
		].sort();

		let maxStreak = 1;
		let currentStreak = 1;

		for (let i = 1; i < dates.length; i++) {
			const prevDate = new Date(dates[i - 1]);
			const currDate = new Date(dates[i]);
			const diffDays =
				(currDate.getTime() - prevDate.getTime()) / (1000 * 3600 * 24);

			if (diffDays === 1) {
				currentStreak++;
				maxStreak = Math.max(maxStreak, currentStreak);
			} else {
				currentStreak = 1;
			}
		}

		return maxStreak;
	};

	// Находим дату с максимальным количеством тревог
	const getMaxAlertsDay = () => {
		if (alerts.length === 0) return null;

		const alertsByDate = alerts.reduce(
			(acc, alert) => {
				const date = new Date(alert.date).toISOString().split("T")[0];
				acc[date] = (acc[date] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);

		const maxDate = Object.entries(alertsByDate).reduce(
			(max, [date, count]) =>
				count > (max.count || 0) ? { date, count } : max,
			{ date: "", count: 0 },
		);

		return {
			date: new Date(maxDate.date),
			count: maxDate.count,
		};
	};

	const maxConsecutiveDays = getMaxConsecutiveDays();
	const maxAlertsDay = getMaxAlertsDay();

	// Вычисляем общее время в укрытии (10 минут на каждую тревогу)
	const totalMinutes = alerts.length * 10;
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;

	function formatDateTime(date: Date) {
		return {
			time: date.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
				hour12: false,
			}),
			date: date.toLocaleDateString(
				lang === "he" ? "he-IL" : lang === "ru" ? "ru-RU" : "en-US",
				{
					day: "numeric",
					month: "long",
					year: "numeric",
				},
			),
		};
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between leading-normal">
				<h1 className="text-4xl font-bold text-white flex items-center justify-between leading-normal w-full -mb-6">
					Israel 2024 Wrapped 🇮🇱
					<ShareButton
						alerts={alerts}
						selectedItems={selectedItems}
						type={type}
						lang={lang}
						dict={dict}
						contentRef={contentRef}
					/>
				</h1>
			</div>

			<div className="grid grid-cols-3 gap-4">
				<div className="p-4 rounded-lg bg-[#1F2937]">
					<div className="flex items-center gap-2 mb-2">
						<Bell className="h-5 w-5 text-gray-400" />
						<span className="font-medium text-gray-200">
							{dict.metrics.totalAlerts}
						</span>
					</div>
					<div className="text-3xl font-bold text-white">{alerts.length}</div>
					<div className="text-sm text-gray-400">
						{rocketAlerts} 🚀 • {droneAlerts} 🛩️
					</div>
				</div>

				<div className="p-4 rounded-lg bg-[#1F2937]">
					<div className="flex items-center gap-2 mb-2">
						<Calendar className="h-5 w-5 text-gray-400" />
						<span className="font-medium text-gray-200">
							{dict.metrics.firstAlert}
						</span>
					</div>
					{firstAlert && (
						<div className="flex flex-col">
							<div className="text-2xl font-bold text-white">
								{formatDateTime(firstAlert).time}
							</div>
							<div className="text-sm text-gray-400">
								{formatDateTime(firstAlert).date}
							</div>
						</div>
					)}
				</div>

				<div className="p-4 rounded-lg bg-[#1F2937]">
					<div className="flex items-center gap-2 mb-2">
						<Calendar className="h-5 w-5 text-gray-400" />
						<span className="font-medium text-gray-200">
							{dict.metrics.lastAlert}
						</span>
					</div>
					{lastAlert && (
						<div className="flex flex-col">
							<div className="text-2xl font-bold text-white">
								{formatDateTime(lastAlert).time}
							</div>
							<div className="text-sm text-gray-400">
								{formatDateTime(lastAlert).date}
							</div>
						</div>
					)}
				</div>

				<div className="p-4 rounded-lg bg-[#1F2937]">
					<div className="flex items-center gap-2 mb-2">
						<Zap className="h-5 w-5 text-gray-400" />
						<span className="font-medium text-gray-200">
							{dict.metrics.longestStreak}
						</span>
					</div>
					<div className="text-2xl font-bold text-white">
						{maxConsecutiveDays} {dict.metrics.days}
					</div>
				</div>

				<div className="p-4 rounded-lg bg-[#1F2937]">
					<div className="flex items-center gap-2 mb-2">
						<Bell className="h-5 w-5 text-gray-400" />
						<span className="font-medium text-gray-200">
							{dict.metrics.maxAlertsPerDay}
						</span>
					</div>
					{maxAlertsDay && (
						<div className="flex flex-col">
							<div className="text-2xl font-bold text-white">
								{maxAlertsDay.count} {dict.metrics.alerts}
							</div>
							<div className="text-sm text-gray-400">
								{maxAlertsDay.date.toLocaleDateString(
									lang === "he" ? "he-IL" : lang === "ru" ? "ru-RU" : "en-US",
									{ day: "numeric", month: "long" },
								)}
							</div>
						</div>
					)}
				</div>

				<div className="p-4 rounded-lg bg-[#1F2937]">
					<div className="flex items-center gap-2 mb-2">
						<Clock className="h-5 w-5 text-gray-400" />
						<span className="font-medium text-gray-200">
							{dict.metrics.shelterTime.title}
						</span>
					</div>
					<div className="text-2xl font-bold text-white">
						{hours}
						{dict.metrics.shelterTime.hours} {minutes}
						{dict.metrics.shelterTime.minutes}
					</div>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div className="p-4 rounded-lg bg-[#1F2937]">
					<div className="flex items-center gap-2 mb-2">
						<Target className="h-5 w-5 text-gray-400" />
						<span className="font-medium text-gray-200">
							{dict.metrics.eliminated}
						</span>
					</div>
					<div className="flex flex-col">
						<div className="text-lg font-medium text-white">
							{dict.metrics.leaders.yahya}, {dict.metrics.leaders.hassan},{" "}
							{dict.metrics.leaders.ismail}, {dict.metrics.leaders.mohammed}
						</div>
						<div className="text-sm text-gray-400 mt-1">
							{dict.metrics.otherLeaders}
						</div>
					</div>
				</div>

				<div className="p-4 rounded-lg bg-[#1F2937]">
					<div className="flex items-center gap-2 mb-2">
						<span className="text-xl">🎗</span>
						<span className="text-2xl font-bold text-white">100</span>
					</div>
					<div className="flex flex-col gap-2">
						<div className="text-sm text-gray-200">
							{dict.metrics.hostages.description}
						</div>
						<div className="text-lg font-bold text-yellow-400">
							{dict.metrics.hostages.action}
						</div>
					</div>
				</div>
			</div>

			<div ref={contentRef}>
				<AlertsHeatmap
					alerts={alerts}
					lang={lang}
					dict={dict.heatmap}
					selectedItems={selectedItems}
					isWholeIsrael={isWholeIsrael}
					type={type}
				/>
			</div>
		</div>
	);
}
