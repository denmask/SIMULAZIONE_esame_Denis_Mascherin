export default function KPICard({ label, valore, piccolo = false }) {
  return (
    <div className="kpi-card">
      <span className="kpi-label">{label}</span>
      <span className={piccolo ? "kpi-valore kpi-valore-sm" : "kpi-valore"}>{valore}</span>
    </div>
  );
}