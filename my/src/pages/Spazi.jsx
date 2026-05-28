import { useState } from "react";
import { TIPI, STATI } from "../data";

const coloreTipo = {
  "Scrivania": "tipo-scrivania",
  "Sala riunioni": "tipo-sala",
  "Ufficio privato": "tipo-ufficio",
};

const coloreStato = {
  "Disponibile": "ok",
  "Occupato": "no ok",
  "In manutenzione": "in corso",
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

export default function Spazi({ spazi, aggiungiSpazio, aggiornaStatoSpazio }) {
  const [filtroTipo, setFiltroTipo] = useState("Tutti");
  const [filtroStato, setFiltroStato] = useState("Tutti");
  const [mostraForm, setMostraForm] = useState(false);
  const [errori, setErrori] = useState({});
  const [form, setForm] = useState({
    nome: "", tipo: TIPI[0], capienza: "", tariffa: "", stato: STATI[0],
  });

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

  function salva(ev) {
    ev.preventDefault();
    const e = valida();
    if (Object.keys(e).length > 0) { setErrori(e); return; }
    aggiungiSpazio({ ...form, capienza: Number(form.capienza), tariffa: Number(form.tariffa) });
    setForm({ nome: "", tipo: TIPI[0], capienza: "", tariffa: "", stato: STATI[0] });
    setErrori({});
    setMostraForm(false);
  }

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
          <form onSubmit={salva} className="griglia-form">
            <Campo label="Nome" errore={errori.nome}>
              <input
                value={form.nome}
                onChange={e => setForm({ ...form, nome: e.target.value })}
                placeholder="es. Scrivania D4"
              />
            </Campo>
            <Campo label="Tipologia">
              <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}>
                {TIPI.map(t => <option key={t}>{t}</option>)}
              </select>
            </Campo>
            <Campo label="Capienza (persone)" errore={errori.capienza}>
              <input
                type="number" min="1"
                value={form.capienza}
                onChange={e => setForm({ ...form, capienza: e.target.value })}
                placeholder="es. 4"
              />
            </Campo>
            <Campo label="Tariffa oraria (€)" errore={errori.tariffa}>
              <input
                type="number" min="1"
                value={form.tariffa}
                onChange={e => setForm({ ...form, tariffa: e.target.value })}
                placeholder="es. 25"
              />
            </Campo>
            <Campo label="Stato iniziale">
              <select value={form.stato} onChange={e => setForm({ ...form, stato: e.target.value })}>
                {STATI.map(s => <option key={s}>{s}</option>)}
              </select>
            </Campo>
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
            <button
              key={t}
              className={`chip ${filtroTipo === t ? "chip-attivo" : ""}`}
              onClick={() => setFiltroTipo(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="filtri-gruppo">
          <span className="filtri-sublabel">Stato</span>
          {["Tutti", ...STATI].map(s => (
            <button
              key={s}
              className={`chip ${filtroStato === s ? "chip-attivo" : ""}`}
              onClick={() => setFiltroStato(s)}
            >
              {s}
            </button>
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
              <label className="label-cambio">Stato:</label>
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