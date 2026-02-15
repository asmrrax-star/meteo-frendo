// ----------------------------
//   UI-Helfer: ui.js
// - Enthält allgemeine Funktionen für die Benutzeroberfläche
// - Wird von mehreren Seiten wiederverwendet
// ----------------------------


// ----------------------------
//   Kurzform für document.querySelector
// - Gibt ein Element zurück
// - Wirft einen Fehler, falls das Element nicht existiert
// ----------------------------

export function $(sel) {
  const el = document.querySelector(sel);
  if (!el) throw new Error(`Element nicht gefunden: ${sel}`);
  return el;
}

// ----------------------------
//   Schutzfunktion für Texte
// - Verhindert kaputtes HTML oder unerwünschte Zeichen
// - Wird vor allem bei Texten aus APIs oder Benutzereingaben verwendet
// ----------------------------

export function escapeHtml(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

// ----------------------------
//   Aktiven Menüpunkt markieren
// - Setzt aria-current="page" beim aktuellen Menüpunkt
// - Verbessert Navigation und Barrierefreiheit
// ----------------------------

export function setActiveNav(page) {
  document.querySelectorAll("[data-nav]").forEach(a => {
    if (a.getAttribute("data-nav") === page) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
}

// ----------------------------
// Wettercode (von der API) in lesbaren Text umwandeln
// ----------------------------

export function weatherCodeToText(code) {
  const map = new Map([
    [0, "Klarer Himmel"],
    [1, "Überwiegend klar"],
    [2, "Teilweise bewölkt"],
    [3, "Bewölkt"],
    [45, "Nebel"],
    [48, "Reifnebel"],
    [51, "Leichter Niesel"],
    [53, "Mässiger Niesel"],
    [55, "Starker Niesel"],
    [61, "Leichter Regen"],
    [63, "Mässiger Regen"],
    [65, "Starker Regen"],
    [71, "Leichter Schneefall"],
    [73, "Mässiger Schneefall"],
    [75, "Starker Schneefall"],
    [80, "Regenschauer (leicht)"],
    [81, "Regenschauer (mässig)"],
    [82, "Regenschauer (stark)"],
    [95, "Gewitter"]
  ]);

  // Rückgabe des passenden Textes oder Standardtext bei unbekanntem Code 
  return map.get(code) ?? `Wettercode ${code}`;
}

// ----------------------------
//   Datum/Zeit formatiert anzeigen
// - ISO-Zeitstring => Schweizer Format (de-CH)
// ----------------------------

export function formatDateTime(isoString) {
  const date = new Date(isoString);

  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}