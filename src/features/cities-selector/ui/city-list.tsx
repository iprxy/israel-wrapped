import { useEffect, useRef } from "react";
import type { CityListProps } from "../model/types";

export function CityList({
	items,
	selectedItems,
	onSelect,
	activeIndex,
	listRef,
	lang,
	ariaSelected,
	dict,
	onLoadMore,
	hasMore,
}: CityListProps) {
	const observerRef = useRef<IntersectionObserver | null>(null);
	const loadMoreRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!onLoadMore || !hasMore) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					onLoadMore();
				}
			},
			{ threshold: 0.5 },
		);

		if (loadMoreRef.current) {
			observer.observe(loadMoreRef.current);
		}

		observerRef.current = observer;

		return () => {
			if (observerRef.current) {
				observerRef.current.disconnect();
			}
		};
	}, [onLoadMore, hasMore]);

	return (
		<div
			ref={listRef}
			className="absolute z-10 w-full mt-2 max-h-60 overflow-auto rounded-lg bg-[#1F2937] py-2 text-sm shadow-lg ring-1 ring-[#374151] focus:outline-none"
		>
			{items.length > 0 ? (
				<>
					{items.map((item, index) => (
						<button
							type="button"
							key={item.id}
							onClick={() => onSelect(item)}
							className={`relative w-full cursor-pointer select-none py-2 pl-4 pr-9 text-left text-white hover:bg-[#374151] ${
								selectedItems.some((i) => i.id === item.id)
									? "bg-[#374151]"
									: ""
							} ${index === activeIndex ? "bg-[#374151]" : ""}`}
							aria-selected={selectedItems.some((i) => i.id === item.id)}
							aria-label={ariaSelected}
						>
							{item[lang]}
						</button>
					))}
					{hasMore && <div ref={loadMoreRef} className="h-4" />}
				</>
			) : (
				<div className="py-2 px-4 text-gray-400 text-center">
					{dict.notFound}
				</div>
			)}
		</div>
	);
}
