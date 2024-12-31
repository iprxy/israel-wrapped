"use client";

import { ChevronDown, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { useCitiesSelector } from "../hooks/use-cities-selector";
import { useKeyboardNavigation } from "../hooks/use-keyboard-navigation";
import type { CitiesSelectorProps, SelectorMode } from "../model/types";
import { CityList } from "./city-list";

export function CitiesSelector({
	items,
	lang,
	dict,
	type,
	onModeChange,
}: CitiesSelectorProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const listRef = useRef<HTMLDivElement>(null);
	const {
		query,
		setQuery,
		isOpen,
		setIsOpen,
		selectedItems,
		visibleItems,
		handleItemSelect,
		handleLoadMore,
		hasMore,
	} = useCitiesSelector(items, type, lang);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [setIsOpen]);

	const { activeIndex, handleKeyDown } = useKeyboardNavigation(
		isOpen,
		setIsOpen,
		visibleItems,
		handleItemSelect,
		listRef,
	);

	const handleModeChange = (mode: SelectorMode) => {
		onModeChange?.(mode);
		setQuery("");
		setIsOpen(false);
	};

	if (!dict?.common) {
		return null;
	}

	return (
		<div className="flex flex-col items-center gap-2 w-full max-w-2xl mx-auto">
			<div className="flex justify-center gap-2 p-1 bg-[#1F2937] rounded-lg w-full">
				<button
					type="button"
					className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
						type === "cities"
							? "bg-[#3B82F6] text-white"
							: "text-gray-400 hover:text-white"
					}`}
					onClick={() => handleModeChange("cities")}
				>
					{dict.common.cities}
				</button>
				<button
					type="button"
					className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
						type === "areas"
							? "bg-[#3B82F6] text-white"
							: "text-gray-400 hover:text-white"
					}`}
					onClick={() => handleModeChange("areas")}
				>
					{dict.common.areas}
				</button>
				<button
					type="button"
					className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
						type === "wholeIsrael"
							? "bg-[#3B82F6] text-white"
							: "text-gray-400 hover:text-white"
					}`}
					onClick={() => handleModeChange("wholeIsrael")}
				>
					{dict.common.wholeIsrael}
				</button>
			</div>

			<div ref={containerRef} className="relative w-full">
				<div className="relative">
					<input
						type="text"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						onFocus={() => setIsOpen(true)}
						onKeyDown={handleKeyDown}
						placeholder={dict.search}
						aria-label={dict.aria.combobox}
						disabled={type === "wholeIsrael"}
						className={`w-full h-10 px-4 py-2 text-sm text-white bg-[#1F2937] border border-[#374151] rounded-lg focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] placeholder-gray-400 transition-colors ${
							type === "wholeIsrael" ? "opacity-50 cursor-not-allowed" : ""
						}`}
					/>
					<button
						type="button"
						onClick={() => setIsOpen(!isOpen)}
						disabled={type === "wholeIsrael"}
						className={`absolute right-3 top-1/2 -translate-y-1/2 ${
							type === "wholeIsrael" ? "opacity-50 cursor-not-allowed" : ""
						}`}
					>
						<ChevronDown
							className={`h-4 w-4 text-gray-400 transition-transform ${
								isOpen ? "rotate-180" : ""
							}`}
						/>
					</button>

					{isOpen && type !== "wholeIsrael" && (
						<CityList
							items={visibleItems}
							selectedItems={selectedItems}
							onSelect={handleItemSelect}
							activeIndex={activeIndex}
							listRef={listRef}
							lang={lang}
							ariaSelected={dict.aria.selected}
							dict={dict}
							onLoadMore={handleLoadMore}
							hasMore={hasMore}
						/>
					)}
				</div>

				{selectedItems.length > 0 && type !== "wholeIsrael" && (
					<div className="mt-2 flex overflow-x-auto pb-2">
						<div className="flex gap-1.5 flex-nowrap">
							{selectedItems.map((item) => (
								<span
									key={item.id}
									className="inline-flex items-center whitespace-nowrap rounded-full bg-[#374151] px-3 py-1 text-sm font-medium text-white"
								>
									{item[lang]}
									<button
										type="button"
										onClick={() => handleItemSelect(item)}
										className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-[#4B5563] transition-colors"
										aria-label={dict.aria.selected}
									>
										<X className="h-3 w-3" />
									</button>
								</span>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
