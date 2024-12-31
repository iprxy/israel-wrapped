import type { Alert, City } from '@prisma/client';

type AlertWithCities = Alert & {
  cities: City[];
};

export function AlertsList({ alerts }: { alerts: AlertWithCities[] }) {
  if (alerts.length === 0) {
    return (
      <div className="text-center text-gray-500">
        Выберите города для просмотра статистики
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div key={alert.id} className="p-4 bg-white rounded-lg shadow-sm">
          {alert.cities[0].ru}
        </div>
      ))}
    </div>
  );
}
