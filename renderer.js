function updateIcons(theme) {
  const settingsIcon = document.getElementById("btnSettings");
  const uploadIcon = document.getElementById("loadDataBtn");

  if (theme === "dark") {
    settingsIcon.src = "icons/settingsDarkMode.svg";
    uploadIcon.src = "icons/uploadDarkMode.svg";
  } else {
    settingsIcon.src = "icons/settingsLightMode.svg";
    uploadIcon.src = "icons/uploadLightMode.svg";
  }
}

// Naloži trenutno temo ob zagonu
window.api.getTheme().then(theme => {
  document.getElementById("theme").href = `css/${theme}.css`;
  updateIcons(theme);
});

// Poslušaj spremembo teme iz nastavitev
window.api.onThemeUpdated(theme => {
  document.getElementById("theme").href = `css/${theme}.css`;
  updateIcons(theme);
});

// Odpri okno z nastavitvami
document.getElementById("btnSettings").addEventListener("click", () => {
  window.api.openSettings();
});

document.getElementById('loadDataBtn').addEventListener('click', () => {
  window.api.openFile();
});

window.api.onFileLoaded(data => {
  const content = `
    <div class="film">
      <img src="${data.slikaPot}" alt="${data.ime}" />
      <h2>${data.ime}</h2>
      <p><strong>Opis:</strong> ${data.opis}</p>
      <p><strong>Žanri:</strong> ${data.zanri.join(', ')}</p>
      <p><strong>Igralci:</strong> ${data.igralci.join(', ')}</p>
      <p><strong>Priljubljen:</strong> ${data.priljubljen ? 'Da' : 'Ne'}</p>
      <p><strong>Ocena:</strong> ${'⭐'.repeat(data.ocena)}</p>
    </div>
  `;
  document.getElementById('filmContainer').insertAdjacentHTML('beforeend', content);
});
