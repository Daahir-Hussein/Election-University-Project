const accentStyles = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-green-100 text-success',
  danger: 'bg-red-100 text-danger',
  accent: 'bg-blue-100 text-accent',
  gray: 'bg-gray-100 text-gray-600',
};

function DashboardCard({
  title,
  value,
  icon: Icon,
  accent = 'primary',
  subtitle,
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-primary">{value ?? 0}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
          )}
        </div>

        {Icon && (
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${accentStyles[accent]}`}
          >
            <Icon size={22} />
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardCard;
