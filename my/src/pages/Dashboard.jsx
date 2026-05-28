import StatCard from "../components/KPICard";
import { TIPI, STATI } from "../data";

export default function Dashboard({ spazi, prenotazioni, onCambiaPagina }) {
  const totaleIncassi = prenotazioni.reduce((s, p) => s + p.totale, 0);

  const spaziPerStato = STATI.reduce((acc, st) => {
    acc[st] = spazi.filter(s => s.stato === st).length;
    return acc;
  }, {});

  const prenotazioniRecenti = [...prenotazioni]
    .sort((a, b) => b.data.localeCompare(a.data))
    .slice(0, 5);

  const coloreStato = {
    "Disponibile": "ok",
    "Occupato": "busy",
    "In manutenzione": "maint",
  };

  const badgeTipo = {
    "Scrivania": "badge-scrivania",
    "Sala riunioni": "badge-sala",
    "Ufficio privato": "badge-ufficio",
  };

  return (
    <div>
      <div className="sezione-header">
        <div>
          <h2 className="titolo-pagina">Panoramica</h2>
          <p className="sottotitolo">Stato attuale dello spazio di coworking</p>
        </div>
        <button className="btn-primario" onClick={() => onCambiaPagina("prenotazioni")}>
          + Nuova prenotazione
        </button>
      </div>

      <div className="kpi-grid">
        <StatCard label="Spazi totali" valore={spazi.length} />
        <StatCard label="Disponibili ora" valore={spaziPerStato["Disponibile"]} />
        <StatCard label="Prenotazioni" valore={prenotazioni.length} />
        <StatCard label="Incassi totali" valore={`€${totaleIncassi.toLocaleString("it-IT")}`} />
      </div>

      <div className="dashboard-griglia">
        <div className="card">
          <h3 className="card-titolo">Stato spazi</h3>
          <div className="stato-spazi-lista">
            {STATI.map(st => (
              <div key={st} className="stato-riga">
                <span className={`badge-stato ${coloreStato[st]}`}>{st}</span>
                <span className="stato-numero">{spaziPerStato[st]}</span>
                <div className="stato-barra-sfondo">
                  <div
                    className="stato-barra-fill"
                    style={{ width: `${spazi.length > 0 ? (spaziPerStato[st] / spazi.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="tipi-riepilogo">
            {TIPI.map(t => (
              <div key={t} className="tipo-riga">
                <span className="tipo-nome">{t}</span>
                <span className="tipo-count">{spazi.filter(s => s.tipo === t).length} spazi</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="card-titolo">Ultime prenotazioni</h3>
          {prenotazioniRecenti.length === 0 ? (
            <p className="testo-vuoto">Nessuna prenotazione ancora.</p>
          ) : (
            <div className="prenotazioni-recenti">
              {prenotazioniRecenti.map(p => (
                <div key={p.id} className="pren-riga">
                  <div className="pren-info">
                    <span className="pren-cliente">{p.cliente}</span>
                    <span className="pren-spazio">{p.spazioNome}</span>
                  </div>
                  <div className="pren-destra">
                    <span className={`badge-tipo-mini ${badgeTipo[p.tipo]}`}>{p.tipo}</span>
                    <span className="pren-totale">€{p.totale}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button className="link-vedi-tutto" onClick={() => onCambiaPagina("report")}>
            Vedi tutto →
          </button>
        </div>
      </div>
    </div>
  );
}