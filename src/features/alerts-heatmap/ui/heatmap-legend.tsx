import { cn } from "@/shared/lib/utils";
import { ALERT_LEVEL_CLASSES } from "../model/constants";

export function HeatmapLegend({
	dict,
}: {
	dict: { less: string; more: string };
}) {
	return (
		<div className="flex justify-end gap-2 text-sm text-[#6B7280]">
			<span>{dict.less}</span>
			<div className="flex gap-0.5">
				{[0, 1, 2, 3, 4, 5].map((level) => (
					<div
						key={level}
						className={cn(
							"aspect-square w-4 rounded",
							ALERT_LEVEL_CLASSES[level as keyof typeof ALERT_LEVEL_CLASSES],
						)}
					/>
				))}
			</div>
			<span>{dict.more}</span>
		</div>
	);
}
