export interface Dictionary {
	common: {
		cities: string;
		areas: string;
		wholeIsrael: string;
	};
	cities: {
		search: string;
		aria: {
			combobox: string;
			selected: string;
		};
		notFound: string;
	};
	alerts: {
		empty: string;
	};
	heatmap: {
		less: string;
		more: string;
		title: string;
		alertsCount: string;
	};
	stats: {
		title: string;
		subtitle: string;
		selectedItems: {
			cities: {
				one: string;
				many: string;
			};
			areas: {
				one: string;
				many: string;
			};
		};
		metrics: {
			totalAlerts: string;
			rocketAlerts: string;
			droneAlerts: string;
			firstAlert: string;
			lastAlert: string;
			longestStreak: string;
			days: string;
			maxAlertsPerDay: string;
			alerts: string;
			eliminated: string;
			otherLeaders: string;
			hostages: {
				description: string;
				action: string;
			};
			shelterTime: {
				title: string;
				hours: string;
				minutes: string;
			};
			leaders: {
				yahya: string;
				hassan: string;
				ismail: string;
				mohammed: string;
			};
		};
		heatmap: {
			less: string;
			more: string;
			title: string;
			alertsCount: string;
		};
		share: {
			share: string;
			download: string;
			madeWith: string;
			loading: string;
		};
	};
}
