const voci = [
  { id: "spazi", etichetta: "Spazi" },
  { id: "prenotazioni", etichetta: "Prenota" },
  { id: "report", etichetta: "Report" },
];

export default function Sidebar({ paginaAttiva, onCambiaPagina, sidebarAperta, onChiudiSidebar }) {
  const handleClick = (id) => {
    onCambiaPagina(id);
    if (window.innerWidth <= 768) {
      onChiudiSidebar();
    }
  };

  return (
    <aside className={`sidebar ${sidebarAperta ? "sidebar--aperta" : ""}`}>
      <div className="sidebar-logo">
        <span className="logo-punto">co</span>
        <span className="logo-testo">work</span>
      </div>

      <nav className="sidebar-nav">
        {voci.map((v) => (
          <button
            key={v.id}
            className={`nav-voce ${paginaAttiva === v.id ? "attiva" : ""}`}
            onClick={() => handleClick(v.id)}
          >
            <span className="nav-icona">{v.icona}</span>
            <span className="nav-label">{v.etichetta}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer" />
    </aside>
  );
}