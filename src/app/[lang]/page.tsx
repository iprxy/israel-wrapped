import prisma from "@/api/db";
import { AlertsStats } from "@/features/alerts-stats/ui/alerts-stats";
import { CitiesSelectorWrapper } from "@/features/cities-selector/ui/cities-selector-wrapper";
import { LangSwitcher } from "@/features/lang-switcher/ui/lang-switcher";
import { getDictionary } from "@/i18n/get-dictionary";
import { unstable_noStore as noStore } from "next/cache";

type SearchParams = {
	cities?: string;
	areas?: string;
	type?: "cities" | "areas" | "wholeIsrael";
};

type Props = {
	params: Promise<{ lang: string }>;
	searchParams: SearchParams;
};

const getAlertsData = async (
	ids: number[],
	isAreaView: boolean,
	isWholeIsrael = false,
) => {
	noStore();
	if (!ids.length && !isWholeIsrael) return [];

	if (isWholeIsrael) {
		return await prisma.alert.findMany({
			where: {
				date: { gte: new Date("2024-01-01") },
			},
			include: {
				cities: true,
			},
			orderBy: {
				date: "desc",
			},
		});
	}

	if (isAreaView) {
		// Сначала получаем все города из выбранных областей
		const citiesFromAreas = await prisma.city.findMany({
			where: { areaId: { in: ids } },
			select: { id: true },
		});

		const cityIds = citiesFromAreas.map((city) => city.id);

		// Затем получаем тревоги по этим городам
		return await prisma.alert.findMany({
			where: {
				cities: {
					some: {
						id: { in: cityIds },
					},
				},
				date: { gte: new Date("2024-01-01") },
			},
			include: {
				cities: true,
			},
			orderBy: {
				date: "desc",
			},
		});
	}

	// Для городов оставляем как есть
	return await prisma.alert.findMany({
		where: {
			cities: {
				some: {
					id: { in: ids },
				},
			},
			date: { gte: new Date("2024-01-01") },
		},
		include: {
			cities: true,
		},
		orderBy: {
			date: "desc",
		},
	});
};

const getCities = async () => {
	"use cache";
	return await prisma.city.findMany({
		orderBy: {
			id: "asc",
		},
	});
};

const getAreas = async () => {
	"use cache";
	return await prisma.area.findMany({
		orderBy: {
			id: "asc",
		},
	});
};

async function ItemsSelector({
	lang,
	searchParams,
}: {
	lang: string;
	searchParams: SearchParams;
}) {
	const cities = await getCities();
	const areas = await getAreas();
	const dict = await getDictionary(lang as "en" | "ru" | "he");
	const type = searchParams.type || "cities";

	if (!dict?.common?.cities || !dict?.common?.areas) {
		console.error("Missing required dictionary entries");
		return null;
	}

	return (
		<div className="space-y-4">
			<CitiesSelectorWrapper
				items={type === "areas" ? areas : cities}
				lang={lang}
				dict={{
					search: dict.cities?.search ?? "",
					aria: {
						combobox: dict.cities?.aria?.combobox ?? "",
						selected: dict.cities?.aria?.selected ?? "",
					},
					notFound: dict.cities?.notFound ?? "",
					common: {
						cities: dict.common?.cities ?? "",
						areas: dict.common?.areas ?? "",
						wholeIsrael: dict.common?.wholeIsrael ?? "",
					},
				}}
				type={type}
			/>
		</div>
	);
}

async function AlertsSection({
	searchParams,
	lang,
}: {
	searchParams: SearchParams;
	lang: string;
}) {
	const isAreaView = searchParams.type === "areas";
	const isWholeIsrael = searchParams.type === "wholeIsrael";
	const selectedIds =
		(isAreaView ? searchParams.areas : searchParams.cities)
			?.split(",")
			.map(Number) || [];
	const alerts = await getAlertsData(selectedIds, isAreaView, isWholeIsrael);
	const items = isAreaView ? await getAreas() : await getCities();
	const selectedItems = items.filter((item) => selectedIds.includes(item.id));
	const dict = await getDictionary(lang as "en" | "ru" | "he");

	if (!selectedIds.length && !isWholeIsrael) {
		return <div className="text-center text-gray-500">{dict.alerts.empty}</div>;
	}

	return (
		<div className="space-y-2">
			<AlertsStats
				alerts={alerts}
				selectedItems={selectedItems}
				type={isAreaView ? "areas" : "cities"}
				lang={lang}
				dict={dict.stats}
				isWholeIsrael={isWholeIsrael}
			/>
		</div>
	);
}

export default async function Home({ searchParams, params }: Props) {
	const awaitedParams = await params;
	const { lang } = awaitedParams;
	const awaitedSearchParams = await searchParams;
	const dict = await getDictionary(lang as "en" | "ru" | "he");

	return (
		<main className="container mx-auto px-4 py-8 relative">
			<div className="flex items-center justify-end mb-4">
				<div className="flex items-center gap-4">
					<LangSwitcher lang={lang as "en" | "ru" | "he"} />
				</div>
			</div>

			<ItemsSelector lang={lang} searchParams={awaitedSearchParams} />

			<div className="flex-1 overflow-y-auto pb-8">
				<AlertsSection searchParams={awaitedSearchParams} lang={lang} />
			</div>
			<div className="text-sm text-[#9CA3AF] flex justify-between absolute bottom-4 w-full pr-8">
				<div className="flex items-center gap-1">
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
				<span className="flex items-center gap-1">
					Made with ❤️ by
					<a
						href="https://iprxy.me"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-[#3B82F6] transition-colors"
					>
						Artem Kulikov
					</a>
				</span>
			</div>
		</main>
	);
}
