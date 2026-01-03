import { app, BrowserWindow } from "electron";
import * as path from "path";

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    show: false, // Don't show window until ready-to-show
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
    },
    // icon: path.join(__dirname, "assets/icon.png"), // Add app icon if available
  });

  // Load the index.html file
  mainWindow
    .loadFile(path.join(__dirname, "index.html"))
    .then(() => {
      // Show window when content is ready
      if (mainWindow) {
        mainWindow.show();
        mainWindow.center();
      }
    })
    .catch((error) => {
      console.error("Failed to load file:", error);
    });

  // Open the DevTools only in development mode
  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // Handle window state
  mainWindow.on("maximize", () => {
    if (mainWindow) {
      mainWindow.webContents.send("window-maximized");
    }
  });

  mainWindow.on("unmaximize", () => {
    if (mainWindow) {
      mainWindow.webContents.send("window-unmaximized");
    }
  });

  mainWindow.on("focus", () => {
    if (mainWindow) {
      mainWindow.webContents.send("window-focused");
    }
  });

  mainWindow.on("blur", () => {
    if (mainWindow) {
      mainWindow.webContents.send("window-blurred");
    }
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS the app and its menu bar stay active
  // until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Security: prevent new window creation
app.on("web-contents-created", (event, contents) => {
  contents.setWindowOpenHandler(({ url }) => {
    return { action: "deny" };
  });
});

// Handle certificate errors
app.on("certificate-error", (event, webContents, url, error, certificate, callback) => {
  // Prevent certificate errors in production
  if (process.env.NODE_ENV === "production") {
    event.preventDefault();
    callback(false);
  } else {
    callback(true);
  }
});
