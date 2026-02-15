// ----------------------------
// Home-Seite: index.js
// - Navigation aktiv setzen
// - Footer-Jahr setzen
// - Aktuelles Wetter laden (Default: Luzern)
// ----------------------------

// UI-Helfer (Anzeige / Text / Schutz gegen kaputte Zeichen)
import { setActiveNav, weatherCodeToText, escapeHtml, formatDateTime } from "../ui.js";
// Open-Meteo Funktionen (API-Aufruf) und Default-Stadt
import { DEFAULT_CITY, getCurrentWeather } from "../meteo.js";
// Aus LocalStorage: ausgewählte Stadt laden (wenn eine gewählt wurde)
import { loadSelectedCity } from "../storage.js";

// 1) Navigation: "Home" optisch als aktiv markieren
setActiveNav("home");

// 2) Footer-Jahr automatisch setzen (damit es nicht jedes Jahr manuell geändert werden muss)
document.querySelectorAll("#year").forEach(y => y.textContent = new Date().getFullYear());

// 3) Elemente auf der Seite holen, in die wir Daten schreiben
const statusEl = document.querySelector("#homeStatus");
const weatherEl = document.querySelector("#homeWeather");

// 4) Wetter laden (asynchron), damit die Seite nicht blockiert wird
(async () => {
  try {
     // a) Stadt bestimmen:
     //    - Falls User eine Stadt gewählt hat => diese verwenden
     //    - Sonst => Default-Stadt Luzern wird angezeigt
    const city = loadSelectedCity() ?? DEFAULT_CITY;
    
     // b) Status anzeigen (Man sieht, etwas passiert)
    statusEl.textContent = "Lade…";
     const data = await getCurrentWeather(city.latitude, city.longitude);
    const cw = data.current_weather;

     // d) Kurzer Status-Text oben (Stadt + Temperatur)
    statusEl.textContent = `${escapeHtml(city.name)} • ${cw.temperature}°C`;
        
    // e) Detailinfos in die Card schreiben
    //    (innerHTML ist ok, weil wir Strings selbst bauen; user-Text wird zusätzlich escaped)
    weatherEl.innerHTML = `
      <div class="muted">${escapeHtml(weatherCodeToText(cw.weathercode))}</div>
      <div class="muted">Wind: ${cw.windspeed} km/h</div>
      <div class="muted">Zeit:${formatDateTime(cw.time)} Uhr</div>
    `;
  } catch (e) {
    // f) Falls etwas schief geht (zum Beispiel keine Verbindung / API-Problem), wird ein Fehler angezeigt
    statusEl.textContent = "Fehler";
    weatherEl.innerHTML = `<div class="alert">${escapeHtml(e.message)}</div>`;
  }
})();
