// ----------------------------
//   Kontakt-Seite: kontakt.js
// - Navigation aktiv setzen
// - Footer-Jahr setzen
// - Formular prüfen (MUSS-Felder) und Bestätigung anzeigen
// - Ohne Backend: Daten werden lokal im Browser gespeichert
// ----------------------------

// UI-Helfer (Navigation aktivieren und Text sicher anzeigen)
import { setActiveNav, escapeHtml } from "../ui.js";

// 1) Navigation: Kontakt als aktiv markieren
setActiveNav("kontakt");

// 2) Footer-Jahr automatisch setzen
document.querySelectorAll("#year").forEach(y => y.textContent = new Date().getFullYear());

// 3) Elemente holen, die wir auf der Seite brauchen
const form = document.querySelector("#contactForm");
const hint = document.querySelector("#formHint");
const result = document.querySelector("#formResult");

// 4) Hilfsfunktion: Fehlermeldung anzeigen
function showError(msg) {
  result.innerHTML = `<div class="alert">${escapeHtml(msg)}</div>`;
}

// 5) Formular-Absendung abfangen, MUSS-Felder prüfen und Nachricht lokal speichern
form.addEventListener("submit", (ev) => {
  ev.preventDefault();

  // a) Eingabewerte holen und trimmen (Leerzeichen vorne und hinten entfernen)
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  // b) MUSS-Felder prüfen und ggf. Fehlermeldung anzeigen
  if (name.length < 4) return showError("Name: mindestens 4 Zeichen.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showError("Bitte eine gültige E-Mail eingeben.");
  if (message.length < 10) return showError("Nachricht: mindestens 10 Zeichen.");

  // c) Fehlermeldung entfernen
  // Wir speichern die Nachricht lokal im Browser (localStorage) statt eine echte Mail zu verschicken
  const payload = { name, email, message, time: new Date().toISOString() };
  localStorage.setItem("meteobuddy:lastContact", JSON.stringify(payload));

  // d) Bestätigung anzeigen und Formular zurücksetzen
  result.innerHTML = `<div class="card">
    <h3>Nachricht gespeichert</h3>
    <p class="muted">Danke, ${escapeHtml(name)}! (Schulprojekt: keine echte Mail wird verschickt.)</p>
  </div>`;
  
  // e) Hinweis aktualisieren und Formular zurücksetzen
  hint.textContent = "Gespeichert (localStorage)";
  form.reset();
});
