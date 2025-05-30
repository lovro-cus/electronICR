const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow, settingsWindow;
let currentTheme = 'light';

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', () => {
    app.quit();
  });
}

function createSettingsWindow() {
  if (settingsWindow) {
    settingsWindow.focus();
    return;
  }

  settingsWindow = new BrowserWindow({
    width: 400,
    height: 300,
    parent: mainWindow,
    modal: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });

  settingsWindow.loadFile('settings.html');

  settingsWindow.on('closed', () => {
    settingsWindow = null;
  });
}

app.whenReady().then(() => {
  createMainWindow();

  ipcMain.handle('get-theme', () => currentTheme);

  ipcMain.on('set-theme', (event, theme) => {
    currentTheme = theme;
    if (mainWindow) mainWindow.webContents.send('theme-updated', theme);
    if (settingsWindow) settingsWindow.webContents.send('theme-updated', theme);
  });

  ipcMain.on('open-settings', () => {
    createSettingsWindow();
  });
});
