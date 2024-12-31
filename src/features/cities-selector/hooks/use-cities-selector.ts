"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { LocalizedItem, SelectorMode } from "../model/types";

const ITEMS_PER_PAGE = 30;

export function useCitiesSelector(
	items: LocalizedItem[] = [],
	type: SelectorMode = "cities",
	lang = "en",
) {
	const [query, setQuery] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const [selectedItems, setSelectedItems] = useState<LocalizedItem[]>([]);
	const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
	const router = useRouter();
	const searchParams = useSearchParams();

	// Инициализация выбранных элементов из URL
	useEffect(() => {
		const paramKey = type === "areas" ? "areas" : "cities";
		const selectedIds =
			searchParams.get(paramKey)?.split(",").map(Number) || [];
		if (selectedIds.length > 0) {
			const selectedFromUrl = items.filter((item) =>
				selectedIds.includes(item.id),
			);
			setSelectedItems(selectedFromUrl);
		} else {
			setSelectedItems([]);
		}
	}, [items, searchParams, type]);

	const filteredItems =
		type === "wholeIsrael"
			? []
			: query === ""
				? items
				: items.filter((item) => {
						const itemName = item[lang];
						return (
							typeof itemName === "string" &&
							itemName.toLowerCase().includes(query.toLowerCase())
						);
					});

	const visibleItems = filteredItems.slice(0, visibleCount);

	const handleLoadMore = () => {
		setVisibleCount((prev) =>
			Math.min(prev + ITEMS_PER_PAGE, filteredItems.length),
		);
	};

	const handleItemSelect = (item: LocalizedItem) => {
		const newSelectedItems = selectedItems.some((i) => i.id === item.id)
			? selectedItems.filter((i) => i.id !== item.id)
			: [...selectedItems, item];

		setSelectedItems(newSelectedItems);

		// Обновляем URL с новыми параметрами
		const params = new URLSearchParams(searchParams.toString());
		const paramKey = type === "areas" ? "areas" : "cities";
		const ids = newSelectedItems.map((i) => i.id).join(",");

		if (ids) {
			params.set(paramKey, ids);
		} else {
			params.delete(paramKey);
		}

		params.set("type", type);
		router.push(`?${params.toString()}`);
	};

	return {
		query,
		setQuery,
		isOpen,
		setIsOpen,
		selectedItems,
		visibleItems,
		handleItemSelect,
		handleLoadMore,
		hasMore: visibleCount < filteredItems.length,
	};
}
