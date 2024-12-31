"use client";

import { useRouter } from "next/navigation";
import type { CitiesSelectorProps } from "../model/types";
import { CitiesSelector } from "./cities-selector";

export function CitiesSelectorWrapper(props: CitiesSelectorProps) {
	const router = useRouter();

	return (
		<CitiesSelector
			{...props}
			onModeChange={(mode) => {
				const url = new URL(window.location.href);
				url.searchParams.set("type", mode);
				router.push(url.search);
			}}
		/>
	);
}
