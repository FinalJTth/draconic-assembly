import { IpcResponsePayload } from "#/types/ipc";
import { SshConfig } from "#/types/ssh";
import { Uuid } from "#/types/uuid";
import { contextBridge, ipcRenderer } from "electron";
import { ApiType, ContextBridgeBuilder } from "../classes/ipc";

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args));
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args;
    return ipcRenderer.off(channel, ...omit);
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    return ipcRenderer.send(channel, ...omit);
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    return ipcRenderer.invoke(channel, ...omit);
  },

  // You can expose other APTs you need here.
  // ...
});

// --------- Preload scripts loading ---------
function domReady(condition: DocumentReadyState[] = ["complete", "interactive"]): Promise<boolean> {
  return new Promise((resolve) => {
    if (condition.includes(document.readyState)) {
      resolve(true);
    } else {
      document.addEventListener("readystatechange", () => {
        if (condition.includes(document.readyState)) {
          resolve(true);
        }
      });
    }
  });
}

const safeDOM = {
  append(parent: HTMLElement, child: HTMLElement): HTMLElement | undefined {
    if (!Array.from(parent.children).find((e) => e === child)) {
      return parent.appendChild(child);
    }
  },
  remove(parent: HTMLElement, child: HTMLElement): HTMLElement | undefined {
    if (Array.from(parent.children).find((e) => e === child)) {
      return parent.removeChild(child);
    }
  },
};

/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */
function useLoading(): Record<string, () => void> {
  const className = `loaders-css__square-spin`;
  const styleContent = `
@keyframes square-spin {
  25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
  50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
  75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
  100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
.${className} > div {
  animation-fill-mode: both;
  width: 50px;
  height: 50px;
  background: #fff;
  animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282c34;
  z-index: 9;
}
    `;
  const oStyle = document.createElement("style");
  const oDiv = document.createElement("div");

  oStyle.id = "app-loading-style";
  oStyle.innerHTML = styleContent;
  oDiv.className = "app-loading-wrap";
  oDiv.innerHTML = `<div class="${className}"><div></div></div>`;

  return {
    appendLoading(): void {
      safeDOM.append(document.head, oStyle);
      safeDOM.append(document.body, oDiv);
    },
    removeLoading(): void {
      safeDOM.remove(document.head, oStyle);
      safeDOM.remove(document.body, oDiv);
    },
  };
}

// ----------------------------------------------------------------------

const { appendLoading, removeLoading } = useLoading();
domReady().then(() => ipcRenderer.send("startup:dom-ready"));

window.onmessage = (ev): void => {
  if (ev.data.payload === "removeLoading") {
    removeLoading();
  }
};
/*
contextBridge.exposeInMainWorld("renderer", {
  minimize: () => ipcRenderer.send("window:minimize"),
  maximize: () => ipcRenderer.send("window:maximize"),
  close: () => ipcRenderer.send("window:close"),
});
*/

/*
contextBridge.exposeInMainWorld("ssh", {
  startSsh: (config: SshConfig) => ipcRenderer.invoke("ssh:start-ssh", config),
  validateConfig: (config: SshConfig) => ipcRenderer.invoke("ssh:validate-config", config),
  execute: (command: string) => ipcRenderer.invoke("ssh:execute", command),
  sendData: (data: string) => ipcRenderer.send("ssh:send-data", data),
  resizeTerminal: (dimension: { rows: number; cols: number }) => ipcRenderer.send("ssh:resize-terminal", dimension),
  onData: (callback: (data: string) => void) => ipcRenderer.on("ssh:on-data", (_, data) => callback(data)),
  onError: (callback: (error: string) => void) => ipcRenderer.on("ssh:on-error", (_, error) => callback(error)),
  onStatus: (callback: (status: string) => void) => ipcRenderer.on("ssh:on-status", (_, status) => callback(status)),
});
*/

/*
contextBridge.exposeInMainWorld("utils", {
  selectFile: () => ipcRenderer.invoke("utils:select-file"),
  getPlatform: () => ipcRenderer.invoke("utils:get-platform"),
});
*/

ContextBridgeBuilder.add("startup", "react-ready", ApiType.Send);

ContextBridgeBuilder.add("renderer", "minimize", ApiType.Send);
ContextBridgeBuilder.add("renderer", "maximize", ApiType.Send);
ContextBridgeBuilder.add("renderer", "close", ApiType.Send);

ContextBridgeBuilder.add<[Uuid, SshConfig], Promise<IpcResponsePayload<unknown>>>(
  "ssh",
  "start-terminal",
  ApiType.Invoke,
);
ContextBridgeBuilder.add<[SshConfig], Promise<IpcResponsePayload<unknown>>>("ssh", "validate-config", ApiType.Invoke);
ContextBridgeBuilder.add<[Uuid, string]>("ssh", "send-data", ApiType.Send);
ContextBridgeBuilder.add<[Uuid, { rows: number; cols: number }]>("ssh", "resize-terminal", ApiType.Send);
ContextBridgeBuilder.add<[Uuid, string]>("ssh", "on-data", ApiType.Callback);
ContextBridgeBuilder.add<[Uuid, string]>("ssh", "on-error", ApiType.Callback);
ContextBridgeBuilder.add<[Uuid, string]>("ssh", "on-status", ApiType.Callback);
ContextBridgeBuilder.add<[Uuid, string]>("ssh", "execute", ApiType.Invoke);

ContextBridgeBuilder.add("utils", "select-file", ApiType.Invoke);
ContextBridgeBuilder.add("utils", "get-platform", ApiType.Invoke);
ContextBridgeBuilder.addCustom<[string]>("utils", "remove-renderer-listeners", (channel) => {
  ipcRenderer.removeAllListeners(channel);
});

ContextBridgeBuilder.exposeAll();

ipcRenderer.send(
  "startup:preload-finished",
  Object.entries(ContextBridgeBuilder.ApiHolder).reduce(
    (record, kvp) => {
      record[kvp[0] as string] = Object.keys(kvp[1]) as string[];
      return record;
    },
    {} as Record<string, string[]>,
  ),
);

setTimeout(removeLoading, 4999);
