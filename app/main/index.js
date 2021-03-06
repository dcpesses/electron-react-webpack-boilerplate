import { app, BrowserWindow } from "electron";

let win;

function createWindow() {
  win = new BrowserWindow({
    show: false,
    width: 800,
    height: 600
  });

  if (process.env.NODE_ENV === "development") {
    require("electron-debug")();
    win.loadURL(`file://${__dirname}/../renderer/index.html`);
  } else {
    win.loadURL(`file://${__dirname}/../app/renderer/index.html`);
  }

  win.webContents.on("did-finish-load", () => {
    win.show();
    win.focus();
  });

  win.on("closed", () => {
    win = null;
  });
}

if (process.env.NODE_ENV === "development") {
  require("electron-debug")();
}

app.on("ready", async () => {
  if (process.env.NODE_ENV === "development") {
    const installer = require("electron-devtools-installer");
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = [
      "REACT_DEVELOPER_TOOLS",
      "REDUX_DEVTOOLS"
    ];
    await Promise.all(
      extensions.map(e => installer.default(installer[e], forceDownload))
    );
  }
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});
