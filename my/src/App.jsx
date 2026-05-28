import { useState, useRef, useEffect } from "react";
import { useDati, TIPI, STATI, calcolaOre } from "./data";
import "./index.css";

export default function App() {
  const [pagina, setPagina] = useState("spazi");
  const [sidebarAperta, setSidebarAperta] = useState(true);
  const dati = useDati();

  const voci = [
    { id: "spazi", etichetta: "Spazi" },
    { id: "prenotazioni", etichetta: "Prenota"},
    { id: "report", etichetta: "Report"},
  ];

  return (
    <div className={`app ${sidebarAperta ? "sidebar-aperta" : "sidebar-chiusa"}`}>
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-punto">co</span>
          <span className="logo-testo">work</span>
        </div>
        <nav className="sidebar-nav">
          {voci.map(v => (
            <button
              key={v.id}
              className={`nav-voce ${pagina === v.id ? "attiva" : ""}`}
              onClick={() => setPagina(v.id)}
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

      <div className="contenuto">
        <header className="navbar">
          <button className="toggle-sidebar" onClick={() => setSidebarAperta(s => !s)}>
            {sidebarAperta ? "←" : "→"}
          </button>
          <h1 className="navbar-titolo">Gestione Spazio di Coworking</h1>
          <div className="navbar-destra">
            <span className="badge-oggi">{new Date().toLocaleDateString("it-IT", { weekday: "short", day: "numeric", month: "long" })}</span>
          </div>
        </header>

        <main className="pagina">
          {pagina === "spazi" && <PaginaSpazi {...dati} />}
          {pagina === "prenotazioni" && <PaginaPrenotazioni {...dati} />}
          {pagina === "report" && <PaginaReport {...dati} />}
        </main>
      </div>
    </div>
  );
}

function PaginaSpazi({ spazi, aggiungiSpazio, aggiornaStatoSpazio }) {
  const [filtroTipo, setFiltroTipo] = useState("Tutti");
  const [filtroStato, setFiltroStato] = useState("Tutti");
  const [mostraForm, setMostraForm] = useState(false);
  const [errori, setErrori] = useState({});
  const [form, setForm] = useState({ nome: "", tipo: TIPI[0], capienza: "", tariffa: "", stato: STATI[0] });

  const spaziVisibili = spazi.filter(s => {
    if (filtroTipo !== "Tutti" && s.tipo !== filtroTipo) return false;
    if (filtroStato !== "Tutti" && s.stato !== filtroStato) return false;
    return true;
  });

  function valida() {
    const e = {};
    if (!form.nome.trim()) e.nome = "Il nome è obbligatorio";
    if (!form.capienza || form.capienza < 1) e.capienza = "Inserisci una capienza valida";
    if (!form.tariffa || form.tariffa <= 0) e.tariffa = "Inserisci una tariffa valida";
    return e;
  }

  function salvaSpazio(ev) {
    ev.preventDefault();
    const e = valida();
    if (Object.keys(e).length > 0) { setErrori(e); return; }
    aggiungiSpazio({ ...form, capienza: Number(form.capienza), tariffa: Number(form.tariffa) });
    setForm({ nome: "", tipo: TIPI[0], capienza: "", tariffa: "", stato: STATI[0] });
    setErrori({});
    setMostraForm(false);
  }

  const coloreTipo = { "Scrivania": "tipo-scrivania", "Sala riunioni": "tipo-sala", "Ufficio privato": "tipo-ufficio" };
  const coloreStato = { "Disponibile": "stato-ok", "Occupato": "stato-busy", "In manutenzione": "stato-maint" };

  return (
    <div>
      <div className="sezione-header">
        <div>
          <h2 className="titolo-pagina">Spazi disponibili</h2>
          <p className="sottotitolo">{spaziVisibili.length} spazi trovati</p>
        </div>
        <button className="btn-primario" onClick={() => setMostraForm(m => !m)}>
          {mostraForm ? "Chiudi" : "+ Nuovo spazio"}
        </button>
      </div>

      {mostraForm && (
        <div className="card form-card">
          <h3 className="card-titolo">Aggiungi uno spazio</h3>
          <form onSubmit={salvaSpazio} className="griglia-form">
            <CampoForm label="Nome" errore={errori.nome}>
              <input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} placeholder="es. Scrivania D4" />
            </CampoForm>
            <CampoForm label="Tipologia">
              <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}>
                {TIPI.map(t => <option key={t}>{t}</option>)}
              </select>
            </CampoForm>
            <CampoForm label="Capienza (persone)" errore={errori.capienza}>
              <input type="number" min="1" value={form.capienza} onChange={e => setForm({ ...form, capienza: e.target.value })} placeholder="es. 4" />
            </CampoForm>
            <CampoForm label="Tariffa oraria (€)" errore={errori.tariffa}>
              <input type="number" min="1" value={form.tariffa} onChange={e => setForm({ ...form, tariffa: e.target.value })} placeholder="es. 25" />
            </CampoForm>
            <CampoForm label="Stato iniziale">
              <select value={form.stato} onChange={e => setForm({ ...form, stato: e.target.value })}>
                {STATI.map(s => <option key={s}>{s}</option>)}
              </select>
            </CampoForm>
            <div className="form-azioni">
              <button type="submit" className="btn-primario">Salva spazio</button>
              <button type="button" className="btn-secondario" onClick={() => setMostraForm(false)}>Annulla</button>
            </div>
          </form>
        </div>
      )}

      <div className="filtri-barra">
        <span className="filtri-label">Filtra per:</span>
        <div className="filtri-gruppo">
          <span className="filtri-sublabel">Tipo</span>
          {["Tutti", ...TIPI].map(t => (
            <button key={t} className={`chip ${filtroTipo === t ? "chip-attivo" : ""}`} onClick={() => setFiltroTipo(t)}>{t}</button>
          ))}
        </div>
        <div className="filtri-gruppo">
          <span className="filtri-sublabel">Stato</span>
          {["Tutti", ...STATI].map(s => (
            <button key={s} className={`chip ${filtroStato === s ? "chip-attivo" : ""}`} onClick={() => setFiltroStato(s)}>{s}</button>
          ))}
        </div>
      </div>

      <div className="griglia-spazi">
        {spaziVisibili.map(s => (
          <div key={s.id} className="card card-spazio">
            <div className="card-spazio-header">
              <span className={`badge-tipo ${coloreTipo[s.tipo]}`}>{s.tipo}</span>
              <span className={`badge-stato ${coloreStato[s.stato]}`}>{s.stato}</span>
            </div>
            <h3 className="nome-spazio">{s.nome}</h3>
            <div className="info-spazio">
              <span>👥 {s.capienza} {s.capienza === 1 ? "persona" : "persone"}</span>
              <span>€{s.tariffa}/ora</span>
            </div>
            <div className="card-spazio-footer">
              <label className="label-cambio">Cambia stato:</label>
              <select
                value={s.stato}
                onChange={e => aggiornaStatoSpazio(s.id, e.target.value)}
                className="select-stato"
              >
                {STATI.map(st => <option key={st}>{st}</option>)}
              </select>
            </div>
          </div>
        ))}
      </div>

      {spaziVisibili.length === 0 && (
        <div className="stato-vuoto">Nessuno spazio corrisponde ai filtri selezionati.</div>
      )}
    </div>
  );
}

function PaginaPrenotazioni({ spazi, prenotazioni, aggiungiPrenotazione }) {
  const spaziDisponibili = spazi.filter(s => s.stato === "Disponibile");
  const [step, setStep] = useState(1);
  const [spazioSelezionato, setSpazioSelezionato] = useState(null);
  const [form, setForm] = useState({ cliente: "", data: "", inizio: "09:00", fine: "17:00" });
  const [errori, setErrori] = useState({});
  const [confermata, setConfermata] = useState(null);

  const ore = spazioSelezionato ? calcolaOre(form.inizio, form.fine) : 0;
  const totale = spazioSelezionato ? ore * spazioSelezionato.tariffa : 0;

  function valida() {
    const e = {};
    if (!form.cliente.trim()) e.cliente = "Inserisci il nome del cliente";
    if (!form.data) e.data = "Seleziona una data";
    if (ore <= 0) e.orario = "L'orario di fine deve essere dopo quello di inizio";
    return e;
  }

  function conferma(ev) {
    ev.preventDefault();
    const e = valida();
    if (Object.keys(e).length > 0) { setErrori(e); return; }
    const nuova = {
      cliente: form.cliente,
      spazioId: spazioSelezionato.id,
      spazioNome: spazioSelezionato.nome,
      tipo: spazioSelezionato.tipo,
      data: form.data,
      inizio: form.inizio,
      fine: form.fine,
      ore,
      totale,
    };
    aggiungiPrenotazione(nuova);
    setConfermata(nuova);
    setStep(3);
  }

  function nuovaPrenotazione() {
    setStep(1);
    setSpazioSelezionato(null);
    setForm({ cliente: "", data: "", inizio: "09:00", fine: "17:00" });
    setErrori({});
    setConfermata(null);
  }

  const coloreTipo = { "Scrivania": "tipo-scrivania", "Sala riunioni": "tipo-sala", "Ufficio privato": "tipo-ufficio" };

  return (
    <div>
      <div className="sezione-header">
        <div>
          <h2 className="titolo-pagina">Nuova prenotazione</h2>
          <p className="sottotitolo">Scegli uno spazio e completa i dettagli</p>
        </div>
      </div>

      <div className="step-indicatori">
        {["Scegli spazio", "Dettagli", "Conferma"].map((s, i) => (
          <div key={i} className={`step-item ${step === i + 1 ? "step-attivo" : step > i + 1 ? "step-fatto" : ""}`}>
            <span className="step-numero">{step > i + 1 ? "✓" : i + 1}</span>
            <span className="step-testo">{s}</span>
          </div>
        ))}
      </div>

      {step === 1 && (
        <div>
          <p className="istruzione">Seleziona lo spazio da prenotare tra quelli disponibili:</p>
          <div className="griglia-spazi">
            {spaziDisponibili.map(s => (
              <div
                key={s.id}
                className={`card card-spazio card-selezionabile ${spazioSelezionato?.id === s.id ? "card-selezionata" : ""}`}
                onClick={() => setSpazioSelezionato(s)}
              >
                <div className="card-spazio-header">
                  <span className={`badge-tipo ${coloreTipo[s.tipo]}`}>{s.tipo}</span>
                </div>
                <h3 className="nome-spazio">{s.nome}</h3>
                <div className="info-spazio">
                  <span>👥 {s.capienza} {s.capienza === 1 ? "persona" : "persone"}</span>
                  <span>€{s.tariffa}/ora</span>
                </div>
              </div>
            ))}
          </div>
          {spaziDisponibili.length === 0 && <div className="stato-vuoto">Nessuno spazio disponibile al momento.</div>}
          {spazioSelezionato && (
            <div className="azioni-step">
              <button className="btn-primario" onClick={() => setStep(2)}>Continua →</button>
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div>
          <div className="riepilogo-spazio">
            <span className={`badge-tipo ${coloreTipo[spazioSelezionato.tipo]}`}>{spazioSelezionato.tipo}</span>
            <strong>{spazioSelezionato.nome}</strong>
            <span>€{spazioSelezionato.tariffa}/ora</span>
            <button className="link-cambio" onClick={() => setStep(1)}>Cambia</button>
          </div>

          <form onSubmit={conferma} className="form-prenotazione">
            <CampoForm label="Nome cliente" errore={errori.cliente}>
              <input value={form.cliente} onChange={e => setForm({ ...form, cliente: e.target.value })} placeholder="es. Mario Rossi" />
            </CampoForm>
            <CampoForm label="Data" errore={errori.data}>
              <input type="date" value={form.data} onChange={e => setForm({ ...form, data: e.target.value })} min={new Date().toISOString().split("T")[0]} />
            </CampoForm>
            <div className="griglia-orari">
              <CampoForm label="Orario inizio" errore={errori.orario}>
                <input type="time" value={form.inizio} onChange={e => setForm({ ...form, inizio: e.target.value })} />
              </CampoForm>
              <CampoForm label="Orario fine">
                <input type="time" value={form.fine} onChange={e => setForm({ ...form, fine: e.target.value })} />
              </CampoForm>
            </div>

            {ore > 0 && (
              <div className="anteprima-costo">
                <span className="costo-dettaglio">{ore} {ore === 1 ? "ora" : "ore"} × €{spazioSelezionato.tariffa}</span>
                <span className="costo-totale">€{totale.toFixed(2)}</span>
              </div>
            )}

            <div className="form-azioni">
              <button type="button" className="btn-secondario" onClick={() => setStep(1)}>← Indietro</button>
              <button type="submit" className="btn-primario">Conferma prenotazione</button>
            </div>
          </form>
        </div>
      )}

      {step === 3 && confermata && (
        <div className="card conferma-card">
          <div className="conferma-icona">✓</div>
          <h3 className="conferma-titolo">Prenotazione confermata!</h3>
          <div className="riepilogo-grid">
            <span className="riep-label">Cliente</span><span className="riep-valore">{confermata.cliente}</span>
            <span className="riep-label">Spazio</span><span className="riep-valore">{confermata.spazioNome}</span>
            <span className="riep-label">Data</span><span className="riep-valore">{new Date(confermata.data).toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>
            <span className="riep-label">Orario</span><span className="riep-valore">{confermata.inizio} – {confermata.fine}</span>
            <span className="riep-label">Durata</span><span className="riep-valore">{confermata.ore} {confermata.ore === 1 ? "ora" : "ore"}</span>
            <span className="riep-label totale-label">Totale</span><span className="riep-valore totale-valore">€{confermata.totale.toFixed(2)}</span>
          </div>
          <button className="btn-primario" onClick={nuovaPrenotazione} style={{ marginTop: "1.5rem" }}>Nuova prenotazione</button>
        </div>
      )}
    </div>
  );
}

function PaginaReport({ prenotazioni, spazi }) {
  const chartTortaRef = useRef(null);
  const chartBarreRef = useRef(null);
  const chartLineeRef = useRef(null);
  const chartsCreati = useRef({});

  const totaleIncassi = prenotazioni.reduce((s, p) => s + p.totale, 0);
  const totaleOre = prenotazioni.reduce((s, p) => s + p.ore, 0);

  const conteggioTipi = TIPI.reduce((acc, t) => {
    acc[t] = prenotazioni.filter(p => p.tipo === t).length;
    return acc;
  }, {});

  const tassoOccupazione = TIPI.map(t => {
    const spaziTipo = spazi.filter(s => s.tipo === t).length;
    const prenTipo = prenotazioni.filter(p => p.tipo === t).length;
    return { tipo: t, tasso: spaziTipo > 0 ? Math.round((prenTipo / (spaziTipo * 10)) * 100) : 0 };
  });

  const guadagniPerGiorno = {};
  prenotazioni.forEach(p => {
    guadagniPerGiorno[p.data] = (guadagniPerGiorno[p.data] || 0) + p.totale;
  });
  const giorniOrdinati = Object.keys(guadagniPerGiorno).sort();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
    script.onload = () => {
      const Chart = window.Chart;

      const colori = ["#3a3a3a", "#888", "#c0b9a8"];
      const palette = ["#3a3a3a", "#888", "#c0b9a8"];

      if (chartTortaRef.current && !chartsCreati.current.torta) {
        chartsCreati.current.torta = new Chart(chartTortaRef.current, {
          type: "doughnut",
          data: {
            labels: TIPI,
            datasets: [{
              data: TIPI.map(t => conteggioTipi[t]),
              backgroundColor: palette,
              borderWidth: 0,
            }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            cutout: "60%",
          }
        });
      }

      if (chartBarreRef.current && !chartsCreati.current.barre) {
        chartsCreati.current.barre = new Chart(chartBarreRef.current, {
          type: "bar",
          data: {
            labels: tassoOccupazione.map(t => t.tipo),
            datasets: [{
              label: "Tasso occupazione %",
              data: tassoOccupazione.map(t => t.tasso),
              backgroundColor: palette,
              borderRadius: 4,
              borderSkipped: false,
            }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { beginAtZero: true, max: 100, ticks: { callback: v => v + "%" }, grid: { color: "#f0ede8" } },
              x: { grid: { display: false } }
            }
          }
        });
      }

      if (chartLineeRef.current && !chartsCreati.current.linee) {
        chartsCreati.current.linee = new Chart(chartLineeRef.current, {
          type: "line",
          data: {
            labels: giorniOrdinati.map(d => new Date(d).toLocaleDateString("it-IT", { day: "numeric", month: "short" })),
            datasets: [{
              label: "Incassi (€)",
              data: giorniOrdinati.map(d => guadagniPerGiorno[d]),
              borderColor: "#3a3a3a",
              backgroundColor: "rgba(58,58,58,0.07)",
              borderWidth: 2,
              pointRadius: 4,
              pointBackgroundColor: "#3a3a3a",
              fill: true,
              tension: 0.3,
            }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { beginAtZero: true, ticks: { callback: v => "€" + v }, grid: { color: "#f0ede8" } },
              x: { grid: { display: false }, ticks: { autoSkip: false, maxRotation: 30 } }
            }
          }
        });
      }
    };
    document.head.appendChild(script);
    return () => {
      Object.values(chartsCreati.current).forEach(c => c.destroy());
      chartsCreati.current = {};
    };
  }, []);

  const prenotazioniOrdinate = [...prenotazioni].sort((a, b) => b.data.localeCompare(a.data));

  return (
    <div>
      <div className="sezione-header">
        <div>
          <h2 className="titolo-pagina">Reportistica</h2>
          <p className="sottotitolo">Analisi delle prenotazioni e dei guadagni</p>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-label">Prenotazioni totali</span>
          <span className="kpi-valore">{prenotazioni.length}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Incassi totali</span>
          <span className="kpi-valore">€{totaleIncassi.toLocaleString("it-IT")}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Ore prenotate</span>
          <span className="kpi-valore">{totaleOre}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Media per prenotazione</span>
          <span className="kpi-valore">€{prenotazioni.length > 0 ? (totaleIncassi / prenotazioni.length).toFixed(0) : 0}</span>
        </div>
      </div>

      <div className="grafici-griglia">
        <div className="grafico-card">
          <h3 className="grafico-titolo">Tipologie più prenotate</h3>
          <div className="legenda-torta">
            {TIPI.map((t, i) => (
              <span key={t} className="legenda-voce">
                <span className="legenda-quadrato" style={{ background: ["#3a3a3a", "#888", "#c0b9a8"][i] }}></span>
                {t} ({conteggioTipi[t]})
              </span>
            ))}
          </div>
          <div style={{ position: "relative", height: "200px" }}>
            <canvas ref={chartTortaRef} role="img" aria-label="Grafico a ciambella delle tipologie di spazi prenotati"></canvas>
          </div>
        </div>

        <div className="grafico-card">
          <h3 className="grafico-titolo">Tasso di occupazione medio</h3>
          <div style={{ position: "relative", height: "240px" }}>
            <canvas ref={chartBarreRef} role="img" aria-label="Grafico a barre del tasso di occupazione per tipologia"></canvas>
          </div>
        </div>
      </div>

      <div className="grafico-card grafico-largo">
        <h3 className="grafico-titolo">Andamento degli incassi</h3>
        <div style={{ position: "relative", height: "240px" }}>
          <canvas ref={chartLineeRef} role="img" aria-label="Grafico a linee degli incassi nel tempo"></canvas>
        </div>
      </div>

      <div className="card">
        <h3 className="card-titolo">Cronologia prenotazioni</h3>
        <div className="tabella-wrapper">
          <table className="tabella">
            <thead>
              <tr>
                <th>Data</th>
                <th>Cliente</th>
                <th>Spazio</th>
                <th>Tipo</th>
                <th>Orario</th>
                <th>Ore</th>
                <th>Totale</th>
              </tr>
            </thead>
            <tbody>
              {prenotazioniOrdinate.map(p => (
                <tr key={p.id}>
                  <td>{new Date(p.data).toLocaleDateString("it-IT")}</td>
                  <td>{p.cliente}</td>
                  <td>{p.spazioNome}</td>
                  <td><span className={`badge-tipo-mini badge-${p.tipo.split(" ")[0].toLowerCase()}`}>{p.tipo}</span></td>
                  <td>{p.inizio}–{p.fine}</td>
                  <td>{p.ore}h</td>
                  <td className="cella-totale">€{p.totale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CampoForm({ label, errore, children }) {
  return (
    <div className="campo">
      <label className="campo-label">{label}</label>
      {children}
      {errore && <span className="campo-errore">{errore}</span>}
    </div>
  );
}