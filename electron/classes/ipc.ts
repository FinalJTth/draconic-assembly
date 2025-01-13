import { IpcResponsePayload } from "#/types/ipc";
import { Uuid } from "#/types/uuid";
import { contextBridge, ipcMain, ipcRenderer } from "electron";

export enum IpcEventType {
  On = "On",
  Handle = "Handle",
}

export enum ApiType {
  Callback = "Callback",
  Invoke = "Invoke",
  Send = "Send",
}

export class IpcResponse {
  public static OnSuccess<T>(message: string, result?: T): IpcResponsePayload<T> {
    return {
      success: true,
      message,
      result,
    };
  }
  public static OnFailure(message: string): IpcResponsePayload<undefined> {
    return {
      success: false,
      message,
    };
  }
}

export class ContextBridgeBuilder {
  public static ContextBridgeHolder: Record<string, Record<string, (...args: never[]) => unknown>> = {};

  private static toCamelCase(input: string): string {
    return input
      .toLowerCase()
      .split("-")
      .map((word, index) => (index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
      .join("");
  }

  public static add<P extends unknown[], R = void>(key: string, channel: string, apiType: ApiType): void {
    if (!ContextBridgeBuilder.ContextBridgeHolder[key]) {
      ContextBridgeBuilder.ContextBridgeHolder[key] = {};
    }

    const camelCaseChannel = this.toCamelCase(channel);

    if (apiType == ApiType.Callback) {
      ContextBridgeBuilder.ContextBridgeHolder[key][camelCaseChannel] = (
        callback: (...args: P) => void,
      ): Electron.IpcRenderer => ipcRenderer.on(`${key}:${channel}`, (e, ...args: P) => callback(...args));
    } else if (apiType == ApiType.Invoke) {
      ContextBridgeBuilder.ContextBridgeHolder[key][camelCaseChannel] = (...args: P): Promise<R> =>
        ipcRenderer.invoke(`${key}:${channel}`, ...args);
    } else if (apiType == ApiType.Send) {
      ContextBridgeBuilder.ContextBridgeHolder[key][camelCaseChannel] = (...args: P): void =>
        ipcRenderer.send(`${key}:${channel}`, ...args);
    }
  }

  public static exposeAll(): void {
    Object.entries(this.ContextBridgeHolder).forEach((kvp) => {
      contextBridge.exposeInMainWorld(kvp[0], kvp[1]);
    });
  }
}

export class IpcBuilder {
  public static exposedApiNames: Record<string, string[]>;

  public static createEvent(
    key: string,
    channel: string,
    eventType: IpcEventType,
    listener: (...args: unknown[]) => unknown,
    id?: Uuid,
  ): void {
    if (!IpcBuilder.exposedApiNames[key]) {
      throw new Error("Api key isn't exposed in context bridge.");
    }
    if (!IpcBuilder.exposedApiNames[key].includes(channel)) {
      throw new Error("Api channel isn't exposed in context bridge.");
    }

    if (eventType === IpcEventType.Handle) {
      ipcMain.handle(`${key}:${channel}${id ? `:${id}` : ""}`, listener);
    } else if (eventType === IpcEventType.On) {
      ipcMain.on(`${key}:${channel}${id ? `:${id}` : ""}`, listener);
    }
  }
}
