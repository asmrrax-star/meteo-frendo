// ----------------------------
//   Storage-Service: storage.js
// - Zentrale Datei für LocalStorage
// - Speichert ausgewählte Stadt und Favoriten im Browser
// ----------------------------

// Schlüssel für LocalStorage definieren damit es keine Konflikte gibt
const SELECTED_KEY = "meteobuddy:selectedCity";
const FAV_KEY = "meteobuddy:favorites";

// ----------------------------
//   Ausgewählte Stadt laden
// - Gibt die gespeicherte Stadt zurück
// - Falls nichts gespeichert ist oder ein Fehler auftritt → null
// ----------------------------

export function loadSelectedCity() {
  try {
    return JSON.parse(localStorage.getItem(SELECTED_KEY));
  } catch {
    return null;
  }
}

// ----------------------------
// Ausgewählte Stadt speichern
// ----------------------------

export function saveSelectedCity(city) {
  localStorage.setItem(SELECTED_KEY, JSON.stringify(city));
}

// ----------------------------
// Favoriten laden
// - Gibt eine Liste von Städten zurück
// - Falls nichts gespeichert ist → leere Liste
// ----------------------------

export function loadFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY)) ?? [];
  } catch {
    return [];
  }
}

// ----------------------------
// Favoriten speichern
// ----------------------------

export function saveFavorites(list) {
  localStorage.setItem(FAV_KEY, JSON.stringify(list));
}

// ----------------------------
//   Favorit hinzufügen
// - Prüft zuerst, ob die Stadt bereits existiert
// - Verhindert doppelte Favoriten
// ----------------------------

export function addFavorite(city) {
  const favs = loadFavorites();
  const exists = favs.some(f => f.latitude === city.latitude && f.longitude === city.longitude);
  if (!exists) {
    favs.push(city);
    saveFavorites(favs);
  }
  return favs;
}

// ----------------------------
// Favorit entfernen
// - Stadt wird anhand der Koordinaten gelöscht
// ----------------------------

export function removeFavorite(lat, lon) {
  const favs = loadFavorites().filter(f => !(f.latitude === lat && f.longitude === lon));
  saveFavorites(favs);
  return favs;
}
