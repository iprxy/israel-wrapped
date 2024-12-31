export interface HeatMapValue {
	date: string;
	count: number;
}

export interface AlertsData {
	value: HeatMapValue[];
	months: string[];
	weekDays: string[];
}
