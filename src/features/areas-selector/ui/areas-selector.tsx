"use client";

import { ChevronDown, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { useAreasSelector } from "../hooks/use-areas-selector";
import type { AreasSelectorProps } from "../model/types";

export function AreasSelector({ areas, lang, dict }: AreasSelectorProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const {
		query,
		setQuery,
		isOpen,
		setIsOpen,
		selectedAreas,
		visibleAreas,
		handleAreaSelect,
	} = useAreasSelector(areas);

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

	return (
		<div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
			<div className="relative">
				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					onFocus={() => setIsOpen(true)}
					placeholder={dict.search}
					aria-label={dict.aria.combobox}
					className="w-full rounded-lg border border-[#374151] bg-[#1F2937] px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
				/>
				<button
					type="button"
					onClick={() => setIsOpen(!isOpen)}
					className="absolute right-2 top-1/2 -translate-y-1/2"
				>
					<ChevronDown
						className={`h-5 w-5 text-[#9CA3AF] transition-transform ${isOpen ? "rotate-180" : ""}`}
					/>
				</button>
			</div>

			{selectedAreas.length > 0 && (
				<div className="mt-2 flex flex-wrap gap-2">
					{selectedAreas.map((area) => (
						<span
							key={area.id}
							className="inline-flex items-center rounded-full bg-[#374151] px-3 py-1.5 text-sm font-medium text-white"
						>
							{area[lang]}
							<button
								type="button"
								onClick={() => handleAreaSelect(area)}
								className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-[#4B5563]"
								aria-label={dict.aria.selected}
							>
								<X className="h-3 w-3" />
							</button>
						</span>
					))}
				</div>
			)}

			{isOpen && (
				<div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-[#1F2937] py-1 text-base shadow-lg ring-1 ring-[#374151] focus:outline-none sm:text-sm">
					{visibleAreas.map((area) => (
						<button
							key={area.id}
							onClick={() => handleAreaSelect(area)}
							className={`relative w-full cursor-default select-none py-2 pl-3 pr-9 text-left text-white hover:bg-[#374151] ${
								selectedAreas.some((a) => a.id === area.id)
									? "bg-[#374151]"
									: ""
							}`}
						>
							{area[lang]}
						</button>
					))}
				</div>
			)}
		</div>
	);
}
