const { app, BrowserWindow, screen } = require('electron');
const path = require('path');

let mainWindow;
let videoWindow;

function createWindow(file, displayIndex, isKiosk = false) {
  const display = screen.getAllDisplays()[displayIndex];
  const win = new BrowserWindow({
    x: display.bounds.x,
    y: display.bounds.y,
    width: display.bounds.width,
    height: display.bounds.height,
    webPreferences: {
      nodeIntegration: true
    },
    kiosk: isKiosk, // Define o modo kiosk
    icon: path.join(__dirname, 'assets', 'img', 'icon.ico') // Define o caminho para o ícone
  });

  win.loadFile(file);
  win.setMenu(null);
  return win;
}

app.whenReady().then(() => {
  const displays = screen.getAllDisplays();

  // Abre 'control.html' na tela principal
  mainWindow = createWindow('control.html', 0, true);

  // Abre 'video.html' em modo kiosk na segunda tela (se disponível)
  if (displays.length > 1) {
    videoWindow = createWindow('video.html', 1, true);
  }

  // Fechar a segunda janela quando a primeira janela for fechada
  mainWindow.on('closed', () => {
    if (videoWindow && !videoWindow.isDestroyed()) {
      videoWindow.close();
    }
  });

  // Fechar a primeira janela quando a segunda janela for fechada
  if (videoWindow) {
    videoWindow.on('closed', () => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.close();
      }
    });
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});