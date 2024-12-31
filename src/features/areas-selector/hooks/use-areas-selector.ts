"use client";

import { useState } from "react";
import type { LocalizedArea } from "../model/types";

export function useAreasSelector(areas: LocalizedArea[]) {
	const [query, setQuery] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const [selectedAreas, setSelectedAreas] = useState<LocalizedArea[]>([]);

	const visibleAreas = query
		? areas.filter((area) =>
				Object.values(area)
					.filter((value): value is string => typeof value === "string")
					.some((value) =>
						value.toLowerCase().includes(query.toLowerCase()),
					),
		  )
		: areas;

	const handleAreaSelect = (area: LocalizedArea) => {
		setSelectedAreas((prev) =>
			prev.some((a) => a.id === area.id)
				? prev.filter((a) => a.id !== area.id)
				: [...prev, area],
		);
	};

	return {
		query,
		setQuery,
		isOpen,
		setIsOpen,
		selectedAreas,
		visibleAreas,
		handleAreaSelect,
	};
}
