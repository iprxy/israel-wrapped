"use client";

import { AlertsHeatmap } from "@/features/alerts-heatmap/ui/alerts-heatmap";
import type { Alert } from "@prisma/client";
import { Bell, Calendar, Clock, Target, Zap } from "lucide-react";
import { forwardRef } from "react";

interface ScreenshotContentProps {
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
	host: string;
	onShare?: () => void;
	isLoading?: boolean;
}

function formatDateTime(date: Date) {
	return {
		time: date.toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
			hour12: false,
		}),
		date: date.toLocaleDateString(undefined, {
			day: "numeric",
			month: "long",
			year: "numeric",
		}),
	};
}

export const ScreenshotContent = forwardRef<
	HTMLDivElement,
	ScreenshotContentProps
>(
	(
		{ alerts, selectedItems, type, lang, dict, host, onShare, isLoading },
		ref,
	) => {
		const totalAlerts = alerts.length;
		const rocketAlerts = alerts.filter((a) => a.type === "🚀").length;
		const droneAlerts = alerts.filter((a) => a.type === "🛩️").length;
		const firstAlert = alerts.length
			? new Date(Math.min(...alerts.map((a) => new Date(a.date).getTime())))
			: null;
		const lastAlert = alerts.length
			? new Date(Math.max(...alerts.map((a) => new Date(a.date).getTime())))
			: null;

		// Находим максимальное количество дней подряд с тревогами
		const getMaxConsecutiveDays = () => {
			if (alerts.length === 0) return 0;

			const dates = [
				...new Set(
					alerts.map(
						(alert) => new Date(alert.date).toISOString().split("T")[0],
					),
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

		return (
			<div
				ref={ref}
				className="w-[1250px] h-[900px] bg-[#111827] text-[#FFFFFF] p-12 rounded-3xl relative"
			>
				<div className="space-y-8">
					<div className="flex items-center justify-between">
						<h1 className="text-4xl font-bold">Israel 2024 Wrapped 🇮🇱</h1>
					</div>

					<div className="grid grid-cols-3 gap-4">
						<div className="p-4 rounded-lg bg-[#1F2937]">
							<div className="flex items-center gap-2 mb-2">
								<Bell className="h-5 w-5 text-gray-400" />
								<span className="font-medium text-gray-200 text-xl">
									{dict.metrics.totalAlerts}
								</span>
							</div>
							<div className="text-xl font-bold text-white">{totalAlerts}</div>
							<div className="text-sm text-gray-400">
								{rocketAlerts} 🚀 • {droneAlerts} 🛩️
							</div>
						</div>

						<div className="p-4 rounded-lg bg-[#1F2937]">
							<div className="flex items-center gap-2 mb-2">
								<Calendar className="h-5 w-5 text-gray-400" />
								<span className="font-medium text-gray-200 text-xl">
									{dict.metrics.firstAlert}
								</span>
							</div>
							{firstAlert && (
								<div className="flex flex-col">
									<div className=" font-bold text-white text-xl">
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
								<span className="font-medium text-gray-200 text-xl">
									{dict.metrics.lastAlert}
								</span>
							</div>
							{lastAlert && (
								<div className="flex flex-col">
									<div className="text-xl font-bold text-white">
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
								<span className="font-medium text-gray-200 text-xl">
									{dict.metrics.longestStreak}
								</span>
							</div>
							<div className="text-xl font-bold text-white">
								{maxConsecutiveDays} {dict.metrics.days}
							</div>
						</div>

						<div className="p-4 rounded-lg bg-[#1F2937]">
							<div className="flex items-center gap-2 mb-2">
								<Bell className="h-5 w-5 text-gray-400" />
								<span className="font-medium text-gray-200 text-xl">
									{dict.metrics.maxAlertsPerDay}
								</span>
							</div>
							{maxAlertsDay && (
								<div className="flex flex-col">
									<div className="text-xl font-bold text-white">
										{maxAlertsDay.count} {dict.metrics.alerts}
									</div>
									<div className="text-sm text-gray-400">
										{maxAlertsDay.date.toLocaleDateString(undefined, {
											month: "long",
											day: "numeric",
										})}
									</div>
								</div>
							)}
						</div>

						<div className="p-4 rounded-lg bg-[#1F2937]">
							<div className="flex items-center gap-2 mb-2">
								<Clock className="h-5 w-5 text-gray-400" />
								<span className="font-medium text-xl text-gray-200">
									{dict.metrics.shelterTime.title}
								</span>
							</div>
							<div className="text-xl font-bold text-white">
								{hours}h {minutes}m
							</div>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="p-4 rounded-lg bg-[#1F2937]">
							<div className="flex items-center gap-2 mb-2">
								<Target className="h-5 w-5 text-gray-400" />
								<span className="font-medium text-xl text-gray-200">
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
								<span className="text-2xl">🎗</span>
								<span className="text-2xl font-bold text-white">100</span>
							</div>
							<div className="flex flex-col gap-2">
								<div className="text-lg text-gray-200">
									{dict.metrics.hostages.description}
								</div>
								<div className="text-xl font-bold text-yellow-400">
									{dict.metrics.hostages.action}
								</div>
							</div>
						</div>
					</div>

					<div className="mt-8 overflow-hidden">
						<AlertsHeatmap
							alerts={alerts}
							lang={lang}
							dict={dict.heatmap}
							selectedItems={selectedItems}
							type={type}
							isScreenshot={true}
						/>
					</div>
				</div>

				<div className="absolute bottom-4 text-sm left-16 right-16 flex items-center justify-between text-[#9CA3AF]">
					<div className="flex items-center gap-2">
						<span>Data from</span>
						<a
							href="https://www.tzevaadom.co.il"
							target="_blank"
							rel="noopener noreferrer"
							className="text-[#EF4444] hover:text-[#DC2626] transition-colors flex items-center gap-2"
						>
							tzevaadom.co.il
						</a>
					</div>
					<div>{host}</div>
				</div>
			</div>
		);
	},
);

ScreenshotContent.displayName = "ScreenshotContent";
