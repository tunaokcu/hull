import { app, BrowserWindow } from 'electron';

function createWindow () {
  const win = new BrowserWindow({
    width: 1700,
    height: 900,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      sandbox: false
    }
  });

  win.loadFile('Pages/index.html');
}

app.whenReady().then(createWindow);