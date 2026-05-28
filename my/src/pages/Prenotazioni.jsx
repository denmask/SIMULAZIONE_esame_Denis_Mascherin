import { useState } from "react";
import { calcolaOre } from "../data";

const coloreTipo = {
  "Scrivania": "badge-scrivania",
  "Sala riunioni": "badge-sala",
  "Ufficio privato": "badge-ufficio",
};

function Campo({ label, errore, children }) {
  return (
    <div className="campo">
      <label className="campo-label">{label}</label>
      {children}
      {errore && <span className="campo-errore">{errore}</span>}
    </div>
  );
}

export default function Prenotazioni({ spazi, aggiungiPrenotazione }) {
  const spaziDisponibili = spazi.filter(s => s.stato === "Disponibile");
  const [step, setStep] = useState(1);
  const [spazioScelto, setSpazioScelto] = useState(null);
  const [form, setForm] = useState({ cliente: "", data: "", inizio: "08:00", fine: "17:00" });
  const [errori, setErrori] = useState({});
  const [confermata, setConfermata] = useState(null);

  const ore = spazioScelto ? calcolaOre(form.inizio, form.fine) : 0;
  const totale = spazioScelto ? ore * spazioScelto.tariffa : 0;

  function valida() {
    const e = {};
    if (!form.cliente.trim()) e.cliente = "Inserisci il nome del cliente";
    if (!form.data) e.data = "Seleziona una data";
    if (ore <= 0) e.orario = "L'orario di fine deve essere dopo l'orario d'inizio";
    return e;
  }

  function conferma(ev) {
    ev.preventDefault();
    const e = valida();
    if (Object.keys(e).length > 0) { setErrori(e); return; }
    const nuova = {
      cliente: form.cliente,
      spazioId: spazioScelto.id,
      spazioNome: spazioScelto.nome,
      tipo: spazioScelto.tipo,
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

  function ricomincia() {
    setStep(1);
    setSpazioScelto(null);
    setForm({ cliente: "", data: "", inizio: "08:00", fine: "17:00" });
    setErrori({});
    setConfermata(null);
  }

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
          <p className="istruzione">Seleziona uno spazio tra quelli disponibili:</p>
          <div className="griglia-spazi">
            {spaziDisponibili.map(s => (
              <div
                key={s.id}
                className={`card card-spazio card-selezionabile ${spazioScelto?.id === s.id ? "card-selezionata" : ""}`}
                onClick={() => setSpazioScelto(s)}
              >
                <div className="card-spazio-header">
                  <span className={`badge-tipo ${coloreTipo[s.tipo]}`}>{s.tipo}</span>
                </div>
                <h3 className="nome-spazio">{s.nome}</h3>
                <div className="info-spazio">
                  <span> {s.capienza} {s.capienza === 1 ? "persona" : "persone"}</span>
                  <span>€{s.tariffa}/ora</span>
                </div>
              </div>
            ))}
          </div>

          {spaziDisponibili.length === 0 && (
            <div className="stato-vuoto">Nessuno spazio disponibile al momento.</div>
          )}

          {spazioScelto && (
            <div className="azioni-step">
              <button className="btn-primario" onClick={() => setStep(2)}>Continua →</button>
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div>
          <div className="riepilogo-spazio">
            <span className={`badge-tipo ${coloreTipo[spazioScelto.tipo]}`}>{spazioScelto.tipo}</span>
            <strong>{spazioScelto.nome}</strong>
            <span>€{spazioScelto.tariffa}/ora</span>
            <button className="link-cambio" onClick={() => setStep(1)}>Cambia</button>
          </div>

          <form onSubmit={conferma} className="form-prenotazione">
            <Campo label="Nome cliente" errore={errori.cliente}>
              <input
                value={form.cliente}
                onChange={e => setForm({ ...form, cliente: e.target.value })}
                placeholder="es. Mario Rossi"
              />
            </Campo>

            <Campo label="Data" errore={errori.data}>
              <input
                type="date"
                value={form.data}
                onChange={e => setForm({ ...form, data: e.target.value })}
                min={new Date().toISOString().split("T")[0]}
              />
            </Campo>

            <div className="griglia-orari">
              <Campo label="Orario inizio" errore={errori.orario}>
                <input type="time" value={form.inizio} onChange={e => setForm({ ...form, inizio: e.target.value })} />
              </Campo>
              <Campo label="Orario fine">
                <input type="time" value={form.fine} onChange={e => setForm({ ...form, fine: e.target.value })} />
              </Campo>
            </div>

            {ore > 0 && (
              <div className="anteprima-costo">
                <span className="costo-dettaglio">{ore} {ore === 1 ? "ora" : "ore"} × €{spazioScelto.tariffa}</span>
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
            <span className="riep-label">Cliente</span>
            <span className="riep-valore">{confermata.cliente}</span>
            <span className="riep-label">Spazio</span>
            <span className="riep-valore">{confermata.spazioNome}</span>
            <span className="riep-label">Data</span>
            <span className="riep-valore">
              {new Date(confermata.data).toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </span>
            <span className="riep-label">Orario</span>
            <span className="riep-valore">{confermata.inizio} – {confermata.fine}</span>
            <span className="riep-label">Durata</span>
            <span className="riep-valore">{confermata.ore} {confermata.ore === 1 ? "ora" : "ore"}</span>
            <span className="riep-label totale-label">Totale</span>
            <span className="riep-valore totale-valore">€{confermata.totale.toFixed(2)}</span>
          </div>
          <button className="btn-primario" onClick={ricomincia} style={{ marginTop: "1.5rem" }}>
            Nuova prenotazione
          </button>
        </div>
      )}
    </div>
  );
}