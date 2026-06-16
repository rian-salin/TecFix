export default function SummaryCard({ label, value, icon: Icon, accentClass = 'text-primary' }) {
  return (
    <div className="relative rounded-xl border border-border bg-white p-6 shadow-sm">
      {Icon && (
        <span className={`absolute right-5 top-5 ${accentClass}`}>
          <Icon size={22} strokeWidth={1.8} />
        </span>
      )}
      <p className="text-sm font-medium text-text-muted">{label}</p>
      <p className="mt-2 text-3xl font-bold text-primary-dark">{value}</p>
    </div>
  );
}
