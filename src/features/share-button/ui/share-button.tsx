"use client";

import type { Alert } from "@prisma/client";
import { toBlob, toPng } from "html-to-image";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ScreenshotContent } from "./screenshot-content";

interface ShareButtonProps {
	contentRef: React.RefObject<HTMLDivElement | null>;
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
}

export function ShareButton({
	alerts,
	selectedItems,
	type,
	lang,
	dict,
}: ShareButtonProps) {
	const [origin, setOrigin] = useState("");
	const [host, setHost] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const componentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setOrigin(window.location.origin);
		setHost(window.location.host);
	}, []);

	const handleShare = async () => {
		if (!componentRef.current) return;
		setIsLoading(true);

		try {
			// Даем время на рендеринг всех элементов
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Сначала пробуем создать blob
			const blob = await toBlob(componentRef.current, {
				backgroundColor: "#111827",
				width: 1250,
				height: 900,
				style: {
					visibility: "visible",
					display: "block",
					position: "static",
					transform: "none",
				},
				cacheBust: true, // Отключаем кэширование
				pixelRatio: 2, // Увеличиваем качество
			});

			if (!blob) {
				throw new Error("Failed to create blob");
			}

			// Создаем URL из blob
			const url = URL.createObjectURL(blob);

			// Создаем ссылку для скачивания
			const link = document.createElement("a");
			link.download = "my-2024-in-israel.png";
			link.href = url;
			document.body.appendChild(link);
			link.click();

			// Очищаем
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		} catch (error) {
			console.error("Failed to generate image with blob, trying PNG...");

			try {
				// Пробуем альтернативный метод с toPng
				const dataUrl = await toPng(componentRef.current, {
					backgroundColor: "#111827",
					width: 1250,
					height: 900,
					style: {
						visibility: "visible",
						display: "block",
						position: "static",
						transform: "none",
					},
					cacheBust: true,
					pixelRatio: 2,
				});

				const link = document.createElement("a");
				link.download = "my-2024-in-israel.png";
				link.href = dataUrl;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			} catch (pngError) {
				console.error("Both methods failed:", { error, pngError });
				alert("Failed to generate screenshot. Please try again.");
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex flex-col items-center gap-4 mt-8 mb-4">
			<div className="absolute opacity-0 pointer-events-none">
				<ScreenshotContent
					ref={componentRef}
					alerts={alerts}
					selectedItems={selectedItems}
					type={type}
					lang={lang}
					dict={dict}
					host={host}
				/>
			</div>

			<button
				type="button"
				onClick={handleShare}
				disabled={isLoading}
				className="flex items-center gap-2 px-2 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm mb-2"
			>
				{isLoading ? (
					<>
						<Loader2 className="h-5 w-5 animate-spin" />
					</>
				) : (
					<>
						<span className="text-xl">📤</span>
					</>
				)}
			</button>
		</div>
	);
}
