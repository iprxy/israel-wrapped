import type { Area, City } from "@prisma/client";

export interface LocalizedItem {
	id: number;
	en: string;
	ru: string;
	he: string;
	[key: string]: string | number;
}

export type SelectorMode = "cities" | "areas" | "wholeIsrael";

export interface CitiesSelectorProps {
	items: (City | Area)[];
	lang: string;
	dict: {
		search: string;
		aria: {
			combobox: string;
			selected: string;
		};
		notFound: string;
		common: {
			cities: string;
			areas: string;
			wholeIsrael: string;
		};
	};
	type: SelectorMode;
	onModeChange?: (mode: SelectorMode) => void;
}

export interface CityListProps {
	items: LocalizedItem[];
	selectedItems: LocalizedItem[];
	onSelect: (item: LocalizedItem) => void;
	activeIndex: number;
	listRef: React.MutableRefObject<HTMLDivElement | null>;
	lang: string;
	ariaSelected: string;
	dict: {
		notFound: string;
	};
	disabled?: boolean;
	onLoadMore?: () => void;
	hasMore?: boolean;
}
