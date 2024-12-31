"use client";

import { useCallback, useState } from "react";
import type { LocalizedItem } from "../model/types";

export function useKeyboardNavigation(
	isOpen: boolean,
	setIsOpen: (value: boolean) => void,
	visibleItems: LocalizedItem[],
	handleItemSelect: (item: LocalizedItem) => void,
	listRef: React.MutableRefObject<HTMLDivElement | null>,
) {
	const [activeIndex, setActiveIndex] = useState(-1);

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent) => {
			if (!isOpen) {
				if (event.key === "ArrowDown") {
					event.preventDefault();
					setIsOpen(true);
					setActiveIndex(0);
					return;
				}
				return;
			}

			switch (event.key) {
				case "ArrowDown":
					event.preventDefault();
					setActiveIndex((prev) => (prev + 1) % visibleItems.length);
					break;
				case "ArrowUp":
					event.preventDefault();
					setActiveIndex((prev) =>
						prev <= 0 ? visibleItems.length - 1 : prev - 1,
					);
					break;
				case "Enter":
					event.preventDefault();
					if (activeIndex >= 0) {
						handleItemSelect(visibleItems[activeIndex]);
					}
					break;
				case "Escape":
					event.preventDefault();
					setIsOpen(false);
					setActiveIndex(-1);
					break;
				case "Tab":
					setIsOpen(false);
					setActiveIndex(-1);
					break;
			}

			// Прокрутка к активному элементу
			if (activeIndex >= 0 && listRef.current) {
				const activeElement = listRef.current.children[
					activeIndex
				] as HTMLElement;
				if (activeElement) {
					activeElement.scrollIntoView({
						block: "nearest",
					});
				}
			}
		},
		[activeIndex, isOpen, visibleItems, handleItemSelect, setIsOpen, listRef],
	);

	return {
		activeIndex,
		handleKeyDown,
	};
}
