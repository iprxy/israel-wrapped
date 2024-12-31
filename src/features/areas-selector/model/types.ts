export interface LocalizedArea {
	id: number;
	he: string;
	en: string;
	ru: string;
	[key: string]: string | number;
}

export interface AreasSelectorProps {
	areas: LocalizedArea[];
	lang: string;
	dict: {
		search: string;
		aria: {
			combobox: string;
			selected: string;
		};
	};
} 