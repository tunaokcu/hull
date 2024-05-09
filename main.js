import { app, BrowserWindow } from 'electron';

function createWindow () {
  const win = new BrowserWindow({
    width: 1700,
    height: 900,
    webPreferences: {
      nodeIntegration: true 
    }
  });

  win.loadFile('Pages/index.html');
}

app.whenReady().then(createWindow);