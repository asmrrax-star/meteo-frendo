// ----------------------------
// Forecast-Seite: forecast.js
// - Navigation aktiv setzen
// - Footer-Jahr setzen
// - 7-Tage-Wettervorhersage anzeigen
// ----------------------------

// UI-Helfer (Navigation aktivieren, Text sicher anzeigen)
import { setActiveNav, escapeHtml } from "../ui.js";
// Open-Meteo Funktionen für die Tagesvorhersage und Default-Stadt
import { DEFAULT_CITY, getDailyForecast } from "../meteo.js";
// Funktion zum Laden der ausgewählten Stadt aus dem lokalen Speicher
import { loadSelectedCity } from "../storage.js";

// 1) Navigation: Forecast als aktiv markieren
setActiveNav("forecast");

// 2) Footer-Jahr automatisch setzen
document.querySelectorAll("#year").forEach(y => y.textContent = new Date().getFullYear());

// 3) Elemente holen, in die wir Inhalte schreiben wollen 
const cityEl = document.querySelector("#fcCity");
const statusEl = document.querySelector("#fcStatus");
const gridEl = document.querySelector("#fcGrid");


// 4) Vorhersagedaten laden (asynchron)
(async () => {
  try {
    // a) Stadt bestimmen:
    //    - Falls eine Stadt gespeichert ist => diese verwenden
    //    - Sonst => Default-Stadt (Luzern)
    const city = loadSelectedCity() ?? DEFAULT_CITY;

    // b) Stadtname oben anzeigen
    cityEl.textContent = `${city.name} (${city.country})`;

    // c) Lade-Status anzeigen
    statusEl.textContent = "Lade…";
    
    // d) 7-Tage-Vorhersage über die Open-Meteo API holen
    const data = await getDailyForecast(city.latitude, city.longitude);
    const d = data.daily;

    // e) Lade-Status wieder entfernen
    statusEl.textContent = "";

    // f) Für jeden Tag eine Card erstellen
    //    Die Daten kommen als Arrays (z.B. Temperatur)
    gridEl.innerHTML = d.time.map((day, i) => `
      <div class="card">
        <h3>${escapeHtml(day)}</h3>
        <div class="muted">Min: ${d.temperature_2m_min[i]}°C</div>
        <div class="muted">Max: ${d.temperature_2m_max[i]}°C</div>
        <div class="muted">Regen: ${d.precipitation_sum[i]} mm</div>
      </div>
    `).join("");
  } catch (e) {
    // g) Falls etwas schief geht (zum Beispiel keine Verbindung / API-Problem), wird ein Fehler angezeigt 
    statusEl.innerHTML = `<div class="alert">${escapeHtml(e.message)}</div>`;
  }
})();
