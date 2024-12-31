"use client";

import { usePathname, useRouter } from "next/navigation";

const languages = {
	en: "English",
	ru: "Русский",
	he: "עברית",
} as const;

interface LangSwitcherProps {
	lang: keyof typeof languages;
}

export function LangSwitcher({ lang }: LangSwitcherProps) {
	const router = useRouter();
	const pathname = usePathname();

	const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const newLang = event.target.value;
		const segments = pathname.split("/");
		segments[1] = newLang;
		router.push(segments.join("/"));
	};

	return (
		<select
			value={lang}
			onChange={handleChange}
			className="w-32 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
		>
			{Object.entries(languages).map(([value, label]) => (
				<option key={value} value={value}>
					{label}
				</option>
			))}
		</select>
	);
}
