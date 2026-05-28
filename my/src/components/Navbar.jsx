export default function Navbar({ onToggleSidebar, sidebarAperta }) {
  const oggi = new Date().toLocaleDateString("it-IT", {
    weekday: "short",
    day: "numeric",
    month: "long",
  });

  return (
    <header className="navbar">
      <button className="toggle-sidebar" onClick={onToggleSidebar}>
        {sidebarAperta ? "←" : "→"}
      </button>
      <h1 className="navbar-titolo">Gestione Spazio di Coworking</h1>
      <span className="badge-oggi">{oggi}</span>
    </header>
  );
}