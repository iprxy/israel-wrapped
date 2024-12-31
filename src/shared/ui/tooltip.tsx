"use client";

import { useCallback, useState } from "react";

interface TooltipProps {
	content: React.ReactNode;
	children: React.ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
	const [isVisible, setIsVisible] = useState(false);

	const show = useCallback(() => setIsVisible(true), []);
	const hide = useCallback(() => setIsVisible(false), []);

	return (
		<div className="relative" onMouseEnter={show} onMouseLeave={hide}>
			{children}
			{isVisible && (
				<div className="absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2">
					{content}
				</div>
			)}
		</div>
	);
}
