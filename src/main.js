const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      // If you need a preload script, create a preload.js file and uncomment below:
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true, // Note: Enabling nodeIntegration may have security implications.
      contextIsolation: false,
    }
  });

  // In production, load the built index.html. During development you might load http://localhost:3000
  win.loadURL(`file://${path.join(__dirname, 'build', 'index.html')}`);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window when the dock icon is clicked and no other windows are open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit the app when all windows are closed (except on macOS).
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
