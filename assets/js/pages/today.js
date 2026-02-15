// ----------------------------
//   Heute-Seite: today.js
// - Navigation aktiv setzen
// - Footer-Jahr setzen
// - Aktuelles Wetter für die ausgewählte Stadt anzeigen
// ----------------------------

// UI-Helfer (Navigation, Textanzeige und Zeitformatierung)
import { setActiveNav, escapeHtml, weatherCodeToText,formatDateTime} from "../ui.js";
// Open-Meteo Funktionen (aktuelles Wetter) und Default-Stadt
import { DEFAULT_CITY, getCurrentWeather } from "../meteo.js";
// Aus LocalStorage: ausgewählte Stadt laden (falls vorhanden)
import { loadSelectedCity } from "../storage.js";


// 1) Navigation: 'Heute' als aktiv markieren
setActiveNav("today");

// 2) Footer-Jahr automatisch setzen (damit es nicht jedes Jahr manuell geändert werden muss)
document.querySelectorAll("#year").forEach(y => y.textContent = new Date().getFullYear());

// 3) Elemente holen, in die wir Inhalte schreiben
const cityEl = document.querySelector("#todayCity");
const statusEl = document.querySelector("#todayStatus");
const contentEl = document.querySelector("#todayContent");

// 4) Wetterdaten laden (asynchron)
(async () => {
  try {
    // a) Stadt bestimmen (gewählte Stadt oder Default)
    const city = loadSelectedCity() ?? DEFAULT_CITY;
    
    // b) Stadt oben anzeigen
    cityEl.textContent = `${city.name} (${city.country})`;

    // c) Lade-Status anzeigen
    statusEl.textContent = "Lade…";
      
    // d) Aktuelles Wetter über die API holen
    const data = await getCurrentWeather(city.latitude, city.longitude);
    const cw = data.current_weather;

    // e) Status wieder leeren, weil Daten da sind
    statusEl.textContent = "";
    
    
    // f) HTML-Inhalt für die 3 Cards erstellen
    //    Hinweis: Wir nutzen escapeHtml bei Texten (z.B. timezone), damit kein kaputter Text die Seite zerstört
    contentEl.innerHTML = `
      <div class="grid">

        <div class="card">
          <h3>Temperatur</h3>
          <div style="font-size:2rem; font-weight:800;">${cw.temperature}°C</div>
          <div class="muted">${escapeHtml(weatherCodeToText(cw.weathercode))}</div>
        </div>

        <div class="card">
          <h3>Wind</h3>
          <div style="font-size:2rem; font-weight:800;">${cw.windspeed} km/h</div>
          <div class="muted">Richtung: ${cw.winddirection}°</div>
        </div>

        <div class="card">
          <h3>Update</h3>
          <div class="muted">${formatDateTime(cw.time)}</div>
          <div class="muted">Timezone: ${escapeHtml(data.timezone)}</div>
        </div>
      </div>
    `;
  } catch (e) {
     // g) Fehler auffangen falls etwas schief geht
    statusEl.innerHTML = `<div class="alert">${escapeHtml(e.message)}</div>`;
  }
})();
