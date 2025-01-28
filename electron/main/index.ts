import { app, BrowserWindow, dialog, ipcMain, shell } from "electron";
// import { createRequire } from "node:module";
import { CommandResult, SshConfig } from "#/types/ssh";
import { Uuid } from "#/types/uuid";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GridDimension } from "../../common/types/layout/index";
import { IpcBuilder, IpcEventType, IpcResponse } from "../classes/ipc";
import { Session, SshTerminal, validateConfig } from "../classes/ssh";
import { update } from "./update";

// const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.mjs   > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.APP_ROOT = path.join(__dirname, "../..");

export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;

// Disable GPU Acceleration for Windows 7
if (os.release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let win: BrowserWindow | null = null;
const session: Session = new Session();
const preload = path.join(__dirname, "../preload/index.mjs");
const indexHtml = path.join(RENDERER_DIST, "index.html");

async function createWindow(): Promise<void> {
  win = new BrowserWindow({
    title: "Main window",
    icon: path.join(process.env.VITE_PUBLIC, "favicon.ico"),
    width: 0,
    height: 0,
    minWidth: 720,
    minHeight: 540,
    backgroundColor: "#111111",
    autoHideMenuBar: true,
    frame: false,
    show: false,
    webPreferences: {
      preload,
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false,

      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // nodeIntegration: true,

      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      // contextIsolation: false,
    },
  });

  if (VITE_DEV_SERVER_URL) {
    // #298
    win.loadURL(VITE_DEV_SERVER_URL);
    // Open devTool if the app is not packaged
    // win.webContents.openDevTools();
    // Press F12 to open dev tool if the app is not packaged
    win.webContents.on("before-input-event", (_, input) => {
      if (input.type === "keyDown" && input.key === "F12") {
        win?.webContents.toggleDevTools();
      }
    });
  } else {
    win.loadFile(indexHtml);
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });

  win.on("closed", () => {
    win = null;
  });

  // Auto update
  update(win);
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("second-instance", () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

// New window example arg: new windows url
ipcMain.handle("open-win", (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});

/*
ipcMain.on("renderer:minimize", () => {
  const window = BrowserWindow.getFocusedWindow();
  if (window) window.minimize();
});

ipcMain.on("renderer:maximize", () => {
  const window = BrowserWindow.getFocusedWindow();
  if (window) {
    if (window.isMaximized()) {
      window.unmaximize();
    } else {
      window.maximize();
    }
  }
});

ipcMain.on("renderer:close", () => {
  const window = BrowserWindow.getFocusedWindow();
  if (window) window.close();
});
*/

app.whenReady().then(() => {
  /*
  if (VITE_DEV_SERVER_URL) {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((ext) => {
        console.log(`Added Extension:  ${ext.name}`);
        createWindow();
      })
      .catch((err) => console.log("An error occurred: ", err));
  } else {
    createWindow();
  }
  */
  createWindow();
});

app.on("ready", async () => {
  ipcMain.once("startup:dom-ready", () => {});

  ipcMain.once("startup:react-ready", () => {
    if (win) {
      win?.setSize(1600, 900);
      win.center();
      win.show();
    }
  });

  IpcBuilder.exposedApiNames = await new Promise((resolve) => {
    ipcMain.once("startup:preload-finished", (_, data: Record<string, string[]>) => {
      resolve(data);
    });
  });

  IpcBuilder.createEvent("renderer", "minimize", IpcEventType.On, () => {
    const window = BrowserWindow.getFocusedWindow();
    if (window) {
      window.minimize();
    }
  });

  IpcBuilder.createEvent("renderer", "maximize", IpcEventType.On, () => {
    const window = BrowserWindow.getFocusedWindow();
    if (window) {
      if (window.isMaximized()) {
        window.unmaximize();
      } else {
        window.maximize();
      }
    }
  });

  IpcBuilder.createEvent("renderer", "close", IpcEventType.On, () => {
    const window = BrowserWindow.getFocusedWindow();
    if (window) {
      window.close();
    }
  });

  IpcBuilder.createEvent("ssh", "start-terminal", IpcEventType.Handle, (event, id: Uuid, sshConfig: SshConfig) => {
    try {
      if (session.terminals.find((terminal) => terminal.id === id)) {
        return IpcResponse.OnSuccess("Connect to existing terminal.");
      }
      const terminal = new SshTerminal(event, id, sshConfig);
      session.terminals.push(terminal);
      return IpcResponse.OnSuccess("Connect successfully.");
    } catch (error: any) {
      return IpcResponse.OnFailure(error.message);
    }
  });

  IpcBuilder.createEvent("ssh", "send-data", IpcEventType.On, (_, id: Uuid, data: string) => {
    session.terminals.find((terminal) => terminal.id === id)?.sendData(data);
  });

  IpcBuilder.createEvent("ssh", "resize-terminal", IpcEventType.On, (_, id: Uuid, dimension: GridDimension) => {
    session.terminals.find((terminal) => terminal.id === id)?.resizeTerminal(dimension);
  });

  IpcBuilder.createEvent("ssh", "validate-config", IpcEventType.Handle, async (_, sshConfig: SshConfig) => {
    const validatePayload = await validateConfig(sshConfig);
    if (validatePayload.isSuccessful) {
      return IpcResponse.OnSuccess<{ isSuccessful: true }>("Valid.", { isSuccessful: true });
    } else {
      return IpcResponse.OnSuccess<{ isSuccessful: false; error: Error }>("Invalid.", {
        isSuccessful: false,
        error: validatePayload.error,
      });
    }
  });

  IpcBuilder.createEvent("ssh", "execute", IpcEventType.Handle, async (_, command: string) => {
    try {
      console.log(`Received command "${command}"`);
      const result = await session.terminals[0].execute(command);
      return IpcResponse.OnSuccess<CommandResult>("Execute command successfully.", result);
    } catch (error: any) {
      return IpcResponse.OnFailure(error.message);
    }
  });

  IpcBuilder.createEvent("utils", "select-file", IpcEventType.Handle, async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ["openFile"],
    });
    if (canceled) {
      return IpcResponse.OnSuccess("Selection canceled.");
    }

    return IpcResponse.OnSuccess("Private key selected successfully.", filePaths[0]);
  });

  IpcBuilder.createEvent("utils", "get-platform", IpcEventType.Handle, () => {
    return IpcResponse.OnSuccess("Success.", os.platform());
  });
});
