const icon = document.getElementById('themeIcon');
const toggle = document.getElementById('themeToggle');

let current = 'light';

window.api.getTheme().then(theme => {
  current = theme;
  icon.src = `icons/${theme}-mode-toggle-icon.svg`;
  document.getElementById("theme").href = `css/${theme}.css`;
});

window.api.onThemeUpdated(theme => {
  document.getElementById("theme").href = `css/${theme}.css`;
  icon.src = `icons/${theme}-mode-toggle-icon.svg`;
  current = theme;
});

toggle.addEventListener('click', () => {
  const newTheme = current === 'light' ? 'dark' : 'light';
  window.api.setTheme(newTheme);
});

window.api.getTheme().then(theme => {
  document.getElementById("theme").href = `css/${theme}.css`;
});

window.api.onThemeUpdated(theme => {
  document.getElementById("theme").href = `css/${theme}.css`;
});
