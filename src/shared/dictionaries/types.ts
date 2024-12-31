export interface Dictionary {
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
	};
	// ... rest of the types ...
}
