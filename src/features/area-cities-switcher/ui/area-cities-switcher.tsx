"use client";

import { useRouter } from "next/navigation";

interface AreaCitiesSwitcherProps {
	dict: {
		cities: string;
		areas: string;
	};
	isAreaView: boolean;
}

export function AreaCitiesSwitcher({
	dict,
	isAreaView,
}: AreaCitiesSwitcherProps) {
	const router = useRouter();

	const handleViewChange = (toAreas: boolean) => {
		if (toAreas === isAreaView) return;

		const type = toAreas ? "areas" : "cities";
		router.push(`?type=${type}`);
	};

	return (
		<div className="flex gap-4 justify-center">
			<label className="flex items-center gap-2">
				<input
					type="radio"
					name="view"
					value="cities"
					defaultChecked={!isAreaView}
					onChange={() => handleViewChange(false)}
					className="text-[#3B82F6] focus:ring-[#3B82F6]"
				/>
				<span className="text-white">{dict.cities}</span>
			</label>
			<label className="flex items-center gap-2">
				<input
					type="radio"
					name="view"
					value="areas"
					defaultChecked={isAreaView}
					onChange={() => handleViewChange(true)}
					className="text-[#3B82F6] focus:ring-[#3B82F6]"
				/>
				<span className="text-white">{dict.areas}</span>
			</label>
		</div>
	);
}
