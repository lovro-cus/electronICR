// Naloži trenutno temo ob zagonu
window.api.getTheme().then(theme => {
  document.getElementById("theme").href = `css/${theme}.css`;
});

// Poslušaj spremembo teme iz nastavitev
window.api.onThemeUpdated(theme => {
  document.getElementById("theme").href = `css/${theme}.css`;
});

// Odpri okno z nastavitvami
document.getElementById("btnSettings").addEventListener("click", () => {
  window.api.openSettings();
});
