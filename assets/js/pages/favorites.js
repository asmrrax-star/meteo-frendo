// ----------------------------
// Favoriten-Seite: favorites.js
// - Navigation aktiv setzen
// - Favoriten aus dem Browser laden
// - Stadt auswählen oder aus Favoriten löschen
// ----------------------------

// UI-Helfer (Navigation aktivieren und Text sicher anzeigen)
import { setActiveNav, escapeHtml } from "../ui.js";
// LocalStorage-Funktionen: Favoriten laden, löschen und als Auswahl setzen
import { loadFavorites, removeFavorite, saveSelectedCity } from "../storage.js";

// 1) Navigation: Favoriten als aktiv markieren
setActiveNav("favorites");

// 2) Footer-Jahr automatisch setzen
document.querySelectorAll("#year").forEach(y => y.textContent = new Date().getFullYear());

// 3) Elemente holen, die wir auf der Seite brauchen
const emptyEl = document.querySelector("#favEmpty");
const gridEl = document.querySelector("#favGrid");

// 4) Favoriten laden und anzeigen oder Meldung, falls keine vorhanden sind
function render() {
  const favs = loadFavorites();

  // a) Falls keine Favoriten vorhanden sind => Hinweis anzeigen
  if (favs.length === 0) {
    emptyEl.style.display = "block";
    gridEl.innerHTML = "";
    return;
  }

  // b) Favoriten vorhanden => Hinweis ausblenden
  emptyEl.style.display = "none";
  
  // c) Favoriten als Cards in das Grid schreiben
  gridEl.innerHTML = favs.map(c => `
    <div class="card">
      <h3>${escapeHtml(c.name)}</h3>
      <div class="muted">${escapeHtml([c.admin1, c.country].filter(Boolean).join(", "))}</div>
      <div class="controls" style="margin-top:10px;">
        <button type="button" data-select="1" data-lat="${c.latitude}" data-lon="${c.longitude}">Auswählen</button>
        <button type="button" data-del="1" data-lat="${c.latitude}" data-lon="${c.longitude}">Löschen</button>
      </div>
    </div>
  `).join("");
}

// 5) Klicks auf die Buttons in den Favoriten abfangen (Event Delegation)
gridEl.addEventListener("click", (ev) => {
  const btn = ev.target.closest("button");
  if (!btn) return;

  // a) Koordinaten aus dem geklickten Button lesen
  const lat = Number(btn.dataset.lat);
  const lon = Number(btn.dataset.lon);

  // b) Passende Stadt in den Favoriten suchen
  const favs = loadFavorites();
  const city = favs.find(f => f.latitude === lat && f.longitude === lon);

  // c) Je nach Button: Stadt als Auswahl speichern oder Favorit löschen
  if (btn.dataset.select && city) {
    saveSelectedCity(city);
    window.location.href = "./today.html";
  }

  // d) Favorit löschen und Liste neu rendern
  if (btn.dataset.del) {
    removeFavorite(lat, lon);
    render();
  }
});

// 6) Seite initial aufbauen
render();
