const voci = [
  { id: "spazi", etichetta: "Spazi"},
  { id: "prenotazioni", etichetta: "Prenota"},
  { id: "report", etichetta: "Report"},
];

export default function Sidebar({ paginaAttiva, onCambiaPagina }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-punto">co</span>
        <span className="logo-testo">work</span>
      </div>

      <nav className="sidebar-nav">
        {voci.map(v => (
          <button
            key={v.id}
            className={`nav-voce ${paginaAttiva === v.id ? "attiva" : ""}`}
            onClick={() => onCambiaPagina(v.id)}
          >
            <span className="nav-icona">{v.icona}</span>
            <span className="nav-label">{v.etichetta}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span className="versione">v1.0</span>
      </div>
    </aside>
  );
}