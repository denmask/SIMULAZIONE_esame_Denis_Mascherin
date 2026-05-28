import { useRef, useEffect } from "react";
import { TIPI } from "../data";
import StatCard from "../components/StatCard";

const PALETTE = ["#3a3a3a", "#888", "#c0b9a8"];

export default function Report({ prenotazioni, spazi }) {
  const refTorta = useRef(null);
  const refBarre = useRef(null);
  const refLinee = useRef(null);
  const istanze = useRef({});

  const totaleIncassi = prenotazioni.reduce((s, p) => s + p.totale, 0);
  const totaleOre = prenotazioni.reduce((s, p) => s + p.ore, 0);
  const mediaPrenotazione = prenotazioni.length > 0
    ? Math.round(totaleIncassi / prenotazioni.length)
    : 0;

  const conteggioTipi = TIPI.reduce((acc, t) => {
    acc[t] = prenotazioni.filter(p => p.tipo === t).length;
    return acc;
  }, {});

  const tassoPerTipo = TIPI.map(t => {
    const spaziTipo = spazi.filter(s => s.tipo === t).length;
    const prenTipo = prenotazioni.filter(p => p.tipo === t).length;
    return { tipo: t, tasso: spaziTipo > 0 ? Math.min(100, Math.round((prenTipo / (spaziTipo * 10)) * 100)) : 0 };
  });

  const incassiPerGiorno = {};
  prenotazioni.forEach(p => {
    incassiPerGiorno[p.data] = (incassiPerGiorno[p.data] || 0) + p.totale;
  });
  const giorni = Object.keys(incassiPerGiorno).sort();
  const etichetteDateGiorni = giorni.map(d =>
    new Date(d).toLocaleDateString("it-IT", { day: "numeric", month: "short" })
  );

  useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
    tag.onload = () => {
      const C = window.Chart;

      if (refTorta.current && !istanze.current.torta) {
        istanze.current.torta = new C(refTorta.current, {
          type: "doughnut",
          data: {
            labels: TIPI,
            datasets: [{ data: TIPI.map(t => conteggioTipi[t]), backgroundColor: PALETTE, borderWidth: 0 }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "60%",
            plugins: { legend: { display: false } },
          },
        });
      }

      if (refBarre.current && !istanze.current.barre) {
        istanze.current.barre = new C(refBarre.current, {
          type: "bar",
          data: {
            labels: tassoPerTipo.map(t => t.tipo),
            datasets: [{
              data: tassoPerTipo.map(t => t.tasso),
              backgroundColor: PALETTE,
              borderRadius: 4,
              borderSkipped: false,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { beginAtZero: true, max: 100, ticks: { callback: v => v + "%" }, grid: { color: "#f0ede8" } },
              x: { grid: { display: false } },
            },
          },
        });
      }

      if (refLinee.current && !istanze.current.linee) {
        istanze.current.linee = new C(refLinee.current, {
          type: "line",
          data: {
            labels: etichetteDateGiorni,
            datasets: [{
              label: "Incassi (€)",
              data: giorni.map(d => incassiPerGiorno[d]),
              borderColor: "#3a3a3a",
              backgroundColor: "rgba(58,58,58,0.06)",
              borderWidth: 2,
              pointRadius: 4,
              pointBackgroundColor: "#3a3a3a",
              fill: true,
              tension: 0.3,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { beginAtZero: true, ticks: { callback: v => "€" + v }, grid: { color: "#f0ede8" } },
              x: { grid: { display: false }, ticks: { autoSkip: false, maxRotation: 30 } },
            },
          },
        });
      }
    };
    document.head.appendChild(tag);

    return () => {
      Object.values(istanze.current).forEach(c => c.destroy());
      istanze.current = {};
    };
  }, []);

  const ordinate = [...prenotazioni].sort((a, b) => b.data.localeCompare(a.data));

  const badgeTipo = {
    "Scrivania": "badge-scrivania",
    "Sala riunioni": "badge-sala",
    "Ufficio privato": "badge-ufficio",
  };

  return (
    <div>
      <div className="sezione-header">
        <div>
          <h2 className="titolo-pagina">Reportistica</h2>
          <p className="sottotitolo">Analisi delle prenotazioni e dei guadagni</p>
        </div>
      </div>

      <div className="kpi-grid">
        <StatCard label="Prenotazioni totali" valore={prenotazioni.length} />
        <StatCard label="Incassi totali" valore={`€${totaleIncassi.toLocaleString("it-IT")}`} />
        <StatCard label="Ore prenotate" valore={totaleOre} />
        <StatCard label="Media per prenotazione" valore={`€${mediaPrenotazione}`} />
      </div>

      <div className="grafici-griglia">
        <div className="grafico-card">
          <h3 className="grafico-titolo">Tipologie più prenotate</h3>
          <div className="legenda-torta">
            {TIPI.map((t, i) => (
              <span key={t} className="legenda-voce">
                <span className="legenda-quadrato" style={{ background: PALETTE[i] }}></span>
                {t} ({conteggioTipi[t]})
              </span>
            ))}
          </div>
          <div style={{ position: "relative", height: "200px" }}>
            <canvas ref={refTorta} role="img" aria-label="Grafico a ciambella delle tipologie di spazi prenotati" />
          </div>
        </div>

        <div className="grafico-card">
          <h3 className="grafico-titolo">Tasso di occupazione</h3>
          <div style={{ position: "relative", height: "240px" }}>
            <canvas ref={refBarre} role="img" aria-label="Grafico a barre del tasso di occupazione per tipologia" />
          </div>
        </div>
      </div>

      <div className="grafico-card grafico-largo">
        <h3 className="grafico-titolo">Andamento degli incassi</h3>
        <div style={{ position: "relative", height: "240px" }}>
          <canvas ref={refLinee} role="img" aria-label="Grafico a linee degli incassi nel tempo" />
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
              {ordinate.map(p => (
                <tr key={p.id}>
                  <td>{new Date(p.data).toLocaleDateString("it-IT")}</td>
                  <td>{p.cliente}</td>
                  <td>{p.spazioNome}</td>
                  <td>
                    <span className={`badge-tipo-mini ${badgeTipo[p.tipo]}`}>{p.tipo}</span>
                  </td>
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