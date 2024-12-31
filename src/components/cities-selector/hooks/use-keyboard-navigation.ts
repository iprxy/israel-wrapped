import type { City } from "@prisma/client";
import { type RefObject, useCallback, useState } from "react";

export const useKeyboardNavigation = (
	isOpen: boolean,
	setIsOpen: (value: boolean) => void,
	visibleCities: City[],
	handleCitySelect: (city: City) => void,
	listRef: RefObject<HTMLDivElement | null>,
) => {
	const [activeIndex, setActiveIndex] = useState(-1);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (!isOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
				setIsOpen(true);
				return;
			}

			const keyHandlers: Record<string, () => void> = {
				ArrowDown: () => {
					e.preventDefault();
					setActiveIndex((prev) =>
						prev < visibleCities.length - 1 ? prev + 1 : prev,
					);
					scrollToActive(activeIndex + 1);
				},
				ArrowUp: () => {
					e.preventDefault();
					setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
					scrollToActive(activeIndex - 1);
				},
				Enter: () => {
					e.preventDefault();
					if (activeIndex >= 0 && visibleCities[activeIndex]) {
						handleCitySelect(visibleCities[activeIndex]);
					}
				},
				Escape: () => {
					setIsOpen(false);
					setActiveIndex(-1);
				},
			};

			keyHandlers[e.key]?.();
		},
		[isOpen, visibleCities, handleCitySelect, setIsOpen],
	);

	const scrollToActive = useCallback(
		(index: number) => {
			if (index >= 0 && listRef.current) {
				const activeElement = listRef.current.children[index];
				if (activeElement) {
					activeElement.scrollIntoView({ block: "nearest" });
				}
			}
		},
		[listRef],
	);

	return {
		activeIndex,
		setActiveIndex,
		handleKeyDown,
	};
};
