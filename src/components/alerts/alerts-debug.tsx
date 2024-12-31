import type { Alert, City } from "@prisma/client";

type AlertWithCities = Alert & {
	cities: City[];
};

export function AlertsDebug({ alerts }: { alerts: AlertWithCities[] }) {
	return (
		<div className="bg-[#161b22] rounded-lg p-4 font-mono text-sm overflow-auto">
			<div className="space-y-4">
				<div className="text-gray-400">Всего тревог: {alerts.length}</div>
				{alerts.map((alert) => (
					<div key={alert.id} className="border-t border-gray-700 pt-4">
						<div className="grid grid-cols-[100px_1fr] gap-2">
							<div className="text-gray-400">ID:</div>
							<div className="break-all">{alert.id}</div>
							<div className="text-gray-400">Тип:</div>
							<div className="break-all">{alert.type}</div>
							<div className="text-gray-400">Дата:</div>
							<div className="break-all">
								{new Date(alert.date).toLocaleString("ru-RU")}
							</div>
							<div className="text-gray-400">Города:</div>
							<div className="break-all">
								{alert.cities.map((city) => city.ru).join(", ")}
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
