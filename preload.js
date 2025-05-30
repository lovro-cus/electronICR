const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getTheme: () => ipcRenderer.invoke('get-theme'),
  setTheme: (theme) => ipcRenderer.send('set-theme', theme),
  openSettings: () => ipcRenderer.send('open-settings'),
  onThemeUpdated: (callback) => ipcRenderer.on('theme-updated', (_, theme) => callback(theme))
});
