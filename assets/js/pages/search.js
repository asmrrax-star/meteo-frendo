// ----------------------------
// Suche-Seite: search.js
// - Navigation aktiv setzen
// - Stadt suchen (Geocoding) und Treffer anzeigen
// - Stadt als Auswahl speichern oder zu Favoriten hinzufügen
// ----------------------------

// UI-Helfer (Navigation aktivieren und den Text sicher anzeigen)
import { setActiveNav, escapeHtml } from "../ui.js";
// Open-Meteo / Geocoding: Stadt suchen und Default-Stadt
import { geocodeCity, DEFAULT_CITY } from "../meteo.js";
// Speicherung im Browser (LocalStorage): ausgewählte Stadt speichern oder Favoriten hinzufügen
import { saveSelectedCity, addFavorite } from "../storage.js";

// 1) Navigation: "Suche" als aktiv markieren
setActiveNav("search");


// 2) Footer-Jahr automatisch setzen
document.querySelectorAll("#year").forEach(y => y.textContent = new Date().getFullYear());

// 3) Elemente holen, die wir auf der Seite brauchen
const form = document.querySelector("#searchForm");
const input = document.querySelector("#cityInput");
const msg = document.querySelector("#searchMsg");
const results = document.querySelector("#results");

// 4) Treffer-Liste als Cards anzeigen (HTML wird dynamisch erstellt)
function render(list) {
  results.innerHTML = list.map(c => `
    <div class="card">
      <h3>${escapeHtml(c.name)}</h3>
      <div class="muted">${escapeHtml([c.admin1, c.country].filter(Boolean).join(", "))}</div>
      <div class="muted">Lat/Lon: ${c.latitude.toFixed(4)}, ${c.longitude.toFixed(4)}</div>
      <div class="controls" style="margin-top:10px;">
        <button type="button" data-select="1" data-lat="${c.latitude}" data-lon="${c.longitude}">Als Auswahl</button>
        <button type="button" data-fav="1" data-lat="${c.latitude}" data-lon="${c.longitude}">Favorit</button>
      </div>
    </div>
  `).join("");
}
// 5) Hilfsfunktion: Sucht in der letzten Trefferliste die Stadt anhand von Koordinaten
function findByCoords(list, lat, lon) {
  return list.find(c => c.latitude === lat && c.longitude === lon) ?? null;
}

// 6) Merken der letzten Suchtreffer (damit wir später die Stadt wiederfinden)
let lastList = [];

// 7) Formular-Absendung abfangen, Stadt suchen und Treffer anzeigen
form.addEventListener("submit", async (ev) => {
  ev.preventDefault();

  // a) MUSS-Feld: Mindestens 4 Zeichen eingeben
  const value = input.value.trim();
  if (value.length < 4) {
    msg.innerHTML = `<div class="alert">Bitte mindestens 4 Zeichen eingeben.</div>`;
    return;
  }

  
  // Status anzeigen und alte Treffer leeren
  msg.textContent = "Suche…";
  results.innerHTML = "";

  try {
    // a) Geocoding: Stadtname => Liste von passenden Orten
    const list = await geocodeCity(value);
    lastList = list;

    // b) Falls keine Treffer, Meldung anzeigen
    if (list.length === 0) {
      msg.innerHTML = `<div class="alert">Keine Treffer gefunden. Versuch z.B. „Luzern“.</div>`;
      return;
    }

    msg.textContent = `${list.length} Treffer`;
    render(list);
  } catch (e) {
      // c) Fehler auffangen, z.B bei Verbindungsproblemen
    msg.innerHTML = `<div class="alert">${escapeHtml(e.message)}</div>`;
  }
});

// 8) Klicks auf die Buttons in der Trefferliste abfangen (Event Delegation)
// Vorteil: Funktioniert auch für die Buttons, die wir später per render() hinzufügen
results.addEventListener("click", (ev) => {
  const btn = ev.target.closest("button");
  if (!btn) return;

   // a) Koordinaten aus dem geklickten Button lesen
  const lat = Number(btn.dataset.lat);
  const lon = Number(btn.dataset.lon);
  
  // b) Passende Stadt aus der letzten Trefferliste holen (Fallback: Default)
  const city = findByCoords(lastList, lat, lon) ?? DEFAULT_CITY;

  // c) Stadt speichern (als Auswahl oder Favorit) und Bestätigung anzeigen
  if (btn.dataset.select) {
    saveSelectedCity(city);
    msg.innerHTML = `<span class="badge">✅ Auswahl gesetzt: ${escapeHtml(city.name)}</span>`;
  }
  // d) Stadt zu Favoriten hinzufügen
  if (btn.dataset.fav) {
    addFavorite(city);
    msg.innerHTML = `<span class="badge">⭐ Favorit gespeichert: ${escapeHtml(city.name)}</span>`;
  }
});
