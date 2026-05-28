import { useState } from "react";

export const TIPI = ["Scrivania", "Sala riunioni", "Ufficio privato"];
export const STATI = ["Disponibile", "Occupato", "In manutenzione"];

const spazi_iniziali = [
  { id: 1, nome: "Scrivania A1", tipo: "Scrivania", capienza: 1, tariffa: 8, stato: "Disponibile" },
  { id: 2, nome: "Scrivania B2", tipo: "Scrivania", capienza: 1, tariffa: 8, stato: "Disponibile" },
  { id: 3, nome: "Stanza delle idee", tipo: "Sala riunioni", capienza: 8, tariffa: 25, stato: "Disponibile" },
  { id: 4, nome: "Sala Orientamento", tipo: "Sala riunioni", capienza: 4, tariffa: 18, stato: "Occupato" },
  { id: 5, nome: "Ufficio Rosso", tipo: "Ufficio privato", capienza: 3, tariffa: 35, stato: "Disponibile" },
  { id: 6, nome: "Ufficio Blu", tipo: "Ufficio privato", capienza: 5, tariffa: 45, stato: "In manutenzione" },
  { id: 7, nome: "Scrivania C3", tipo: "Scrivania", capienza: 1, tariffa: 8, stato: "Disponibile" },
  { id: 8, nome: "Sala B", tipo: "Sala riunioni", capienza: 12, tariffa: 40, stato: "Disponibile" },
];

const prenotazioni_iniziali = [
  { id: 1, cliente: "Marco Bianchi", spazioId: 3, spazioNome: "Stanza delle idee", tipo: "Sala riunioni", data: "2025-05-10", inizio: "09:00", fine: "12:00", ore: 3, totale: 75 },
  { id: 2, cliente: "Sofia Gialli", spazioId: 1, spazioNome: "Scrivania A1", tipo: "Scrivania", data: "2025-05-12", inizio: "08:00", fine: "18:00", ore: 10, totale: 80 },
  { id: 3, cliente: "Luca Rossi", spazioId: 5, spazioNome: "Ufficio Rosso", tipo: "Ufficio privato", data: "2025-05-14", inizio: "10:00", fine: "16:00", ore: 6, totale: 210 },
  { id: 4, cliente: "Elena Verdi", spazioId: 4, spazioNome: "Sala Orientamento", tipo: "Sala riunioni", data: "2025-05-15", inizio: "14:00", fine: "17:00", ore: 3, totale: 54 },
  { id: 5, cliente: "Andrea Mori", spazioId: 2, spazioNome: "Scrivania B2", tipo: "Scrivania", data: "2025-05-16", inizio: "09:00", fine: "13:00", ore: 4, totale: 32 },
  { id: 6, cliente: "Chiara Neri", spazioId: 8, spazioNome: "Sala B", tipo: "Sala riunioni", data: "2025-05-17", inizio: "09:00", fine: "18:00", ore: 9, totale: 360 },
  { id: 7, cliente: "Matteo Gallo", spazioId: 6, spazioNome: "Ufficio Blu", tipo: "Ufficio privato", data: "2025-05-19", inizio: "08:00", fine: "20:00", ore: 12, totale: 540 },
  { id: 8, cliente: "Valeria Viola", spazioId: 3, spazioNome: "Stanza delle idee", tipo: "Sala riunioni", data: "2025-05-20", inizio: "13:00", fine: "16:00", ore: 3, totale: 75 },
  { id: 9, cliente: "Giovanni Blu", spazioId: 7, spazioNome: "Scrivania C3", tipo: "Scrivania", data: "2025-05-21", inizio: "09:00", fine: "18:00", ore: 9, totale: 72 },
  { id: 10, cliente: "Federica Marroni", spazioId: 5, spazioNome: "Ufficio Rosso", tipo: "Ufficio privato", data: "2025-05-22", inizio: "10:00", fine: "19:00", ore: 9, totale: 315 },
];

let nextSpazioId = 9;
let nextPrenotazioneId = 11;

export function useDati() {
  const [spazi, setSpazi] = useState(spazi_iniziali);
  const [prenotazioni, setPrenotazioni] = useState(prenotazioni_iniziali);

  function aggiungiSpazio(spazio) {
    setSpazi(prev => [...prev, { ...spazio, id: nextSpazioId++ }]);
  }

  function aggiornaStatoSpazio(id, nuovoStato) {
    setSpazi(prev => prev.map(s => s.id === id ? { ...s, stato: nuovoStato } : s));
  }

  function aggiungiPrenotazione(pren) {
    setPrenotazioni(prev => [...prev, { ...pren, id: nextPrenotazioneId++ }]);
  }

  return { spazi, prenotazioni, aggiungiSpazio, aggiornaStatoSpazio, aggiungiPrenotazione };
}

export function calcolaOre(inizio, fine) {
  const [h1, m1] = inizio.split(":").map(Number);
  const [h2, m2] = fine.split(":").map(Number);
  return Math.max(0, (h2 * 60 + m2 - h1 * 60 - m1) / 60);
}