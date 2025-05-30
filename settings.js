function setTheme(theme) {
  window.api.setTheme(theme);
}

window.api.getTheme().then(theme => {
  document.getElementById("theme").href = `css/${theme}.css`;
});

window.api.onThemeUpdated(theme => {
  document.getElementById("theme").href = `css/${theme}.css`;
});
