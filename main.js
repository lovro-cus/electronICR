const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow, settingsWindow;
let currentTheme = 'light';

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
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
    width: 500,
    height: 400,
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

  // Tema
  ipcMain.handle('get-theme', () => currentTheme);

  ipcMain.on('set-theme', (event, theme) => {
    currentTheme = theme;
    if (mainWindow) mainWindow.webContents.send('theme-updated', theme);
    if (settingsWindow) settingsWindow.webContents.send('theme-updated', theme);
  });

  // Nastavitve
  ipcMain.on('open-settings', () => {
    createSettingsWindow();
  });

  // Odpri JSON datoteko
  ipcMain.on('open-file', async (event) => {
    const result = await dialog.showOpenDialog(mainWindow, {
      filters: [{ name: 'JSON files', extensions: ['json'] }],
      properties: ['openFile']
    });

    if (!result.canceled && result.filePaths.length > 0) {
      const filePath = result.filePaths[0];
      const rawData = fs.readFileSync(filePath);
      const data = JSON.parse(rawData);

      // Shrani pot zadnje uporabljene datoteke
      fs.writeFileSync('lastOpened.txt', filePath);

      event.sender.send('file-loaded', data);
    }
  });

  // Ob zagonu poskusi naložiti zadnjo uporabljeno datoteko
  const lastFilePath = path.join(__dirname, 'lastOpened.txt');
  if (fs.existsSync(lastFilePath)) {
    const savedPath = fs.readFileSync(lastFilePath, 'utf-8');
    if (fs.existsSync(savedPath)) {
      const rawData = fs.readFileSync(savedPath);
      const data = JSON.parse(rawData);
      setTimeout(() => {
        mainWindow.webContents.send('file-loaded', data);
      }, 500); // malo počakamo, da se UI naloži
    }
  }
});
