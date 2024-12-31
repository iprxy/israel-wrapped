export const ALERT_LEVEL_CLASSES = {
	1: "bg-[#374151]",
	2: "bg-[#FCA5A5]",
	3: "bg-[#F87171]",
	4: "bg-[#EF4444]",
	5: "bg-[#DC2626]",
} as const;

export function getAlertLevel(count: number): keyof typeof ALERT_LEVEL_CLASSES {
	if (count === 0) return 1;
	if (count > 0 && count <= 2) return 2;
	if (count > 2 && count <= 4) return 3;
	if (count > 4 && count <= 6) return 4;
	return 5;
}
