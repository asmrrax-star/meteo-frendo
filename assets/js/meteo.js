// ----------------------------
//  Meteo-Service: meteo.js
// - Zentrale Datei für alle API-Aufrufe (Open-Meteo)
// - Enthält Default-Stadt und Funktionen für Wetterdaten
// ----------------------------

// Default-Stadt Luzern wird verwendet, wenn keine Stadt ausgewählt ist
export const DEFAULT_CITY = {
  name: "Luzern",
  country: "Schweiz",
  admin1: "Luzern",
  latitude: 47.0502,
  longitude: 8.3093,
  timezone: "Europe/Zurich"
};


// ----------------------------
//  Stadt suchen (Geocoding)
// - Wandelt einen Stadtnamen in Koordinaten um
// - Liefert mehrere mögliche Treffer zurück
// ----------------------------

export async function geocodeCity(name) {
  const url =
    "https://geocoding-api.open-meteo.com/v1/search?" +
    new URLSearchParams({ name, count: "8", language: "de", format: "json" });

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geocoding fehlgeschlagen (${res.status})`);
  const data = await res.json();

  // Falls keine Treffer, leeres Array zurückgeben
  if (!data.results?.length) return [];
  
  // Nur die benötigten Felder zurückgeben 
  return data.results.map(r => ({
    name: r.name,
    country: r.country,
    admin1: r.admin1,
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone
  }));
}

// ----------------------------
//   Aktuelles Wetter holen
// - Benötigt Koordinaten (Latitude / Longitude)
// ----------------------------

export async function getCurrentWeather(lat, lon) {
  const url =
    "https://api.open-meteo.com/v1/forecast?" +
    new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      current_weather: "true",
      timezone: "auto"
    });

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Wetterdaten fehlgeschlagen (${res.status})`);
  return res.json();
}

// ----------------------------
//   7-Tage-Vorhersage holen
// - Min/Max-Temperatur + Niederschlag
// ----------------------------

export async function getDailyForecast(lat, lon) {
  const url =
    "https://api.open-meteo.com/v1/forecast?" +
    new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      daily: "temperature_2m_max,temperature_2m_min,precipitation_sum",
      timezone: "auto"
    });

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Forecast fehlgeschlagen (${res.status})`);
  return res.json();
}
