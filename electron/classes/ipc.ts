import { IpcResponsePayload } from "#/types/ipc";
import { Uuid } from "#/types/uuid";
import { contextBridge, ipcMain, IpcMainInvokeEvent, ipcRenderer } from "electron";

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
  public static ApiHolder: Record<string, Record<string, (...args: never[]) => unknown>> = {};

  private static toCamelCase(input: string): string {
    return input
      .toLowerCase()
      .split("-")
      .map((word, index) => (index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
      .join("");
  }

  /*
  public static add<P extends unknown[], R = void>(key: string, channel: string, apiType: ApiType): void {
    if (!ContextBridgeBuilder.ContextBridgeHolder[key]) {
      ContextBridgeBuilder.ContextBridgeHolder[key] = {};
    }

    if (apiType == ApiType.Callback) {
      ContextBridgeBuilder.ContextBridgeHolder[key][channel] = (callback: (...args: P) => void): void => {
        ipcRenderer.on(`${key}:${channel}`, (e, ...args: P) => {
          callback(...args);
        });
      };
    } else if (apiType == ApiType.Invoke) {
      ContextBridgeBuilder.ContextBridgeHolder[key][channel] = (...args: P): Promise<R> =>
        ipcRenderer.invoke(`${key}:${channel}`, ...args);
    } else if (apiType == ApiType.Send) {
      ContextBridgeBuilder.ContextBridgeHolder[key][channel] = (...args: P): void =>
        ipcRenderer.send(`${key}:${channel}`, ...args);
    }
  }
  */

  public static add<P extends unknown[], R = void>(key: string, channel: string, apiType: ApiType): void {
    const channelHolder = this.ApiHolder[key] ?? (this.ApiHolder[key] = {});

    switch (apiType) {
      case ApiType.Callback:
        channelHolder[channel] = (callback: (...args: P) => void): Electron.IpcRenderer =>
          ipcRenderer.on(`${key}:${channel}`, (_, ...args: P) => {
            callback(...args);
          });
        break;
      case ApiType.Invoke:
        channelHolder[channel] = (...args: P): Promise<R> => ipcRenderer.invoke(`${key}:${channel}`, ...args);
        break;
      case ApiType.Send:
        channelHolder[channel] = (...args: P): void => ipcRenderer.send(`${key}:${channel}`, ...args);
        break;
    }
  }

  public static addCustom<P extends unknown[], R = void>(key: string, channel: string, api: (...args: P) => R): void {
    this.ApiHolder[key][channel] = api;
  }

  public static exposeAll(): void {
    Object.entries(this.ApiHolder).forEach((kvp1) => {
      const camelCaseChannels = Object.entries(kvp1[1]).reduce(
        (record, kvp2) => {
          record[this.toCamelCase(kvp2[0])] = kvp2[1];
          return record;
        },
        {} as Record<string, (...args: never[]) => unknown>,
      );
      contextBridge.exposeInMainWorld(kvp1[0], camelCaseChannels);
    });
  }
}
/*
export type ListenerWithEvent<P extends unknown[], R> = (event?: IpcMainInvokeEvent, ...args: P) => R,

export type Listener<T> = T ===
*/
export class IpcBuilder {
  public static exposedApiNames: Record<string, string[]>;

  public static createEvent<P extends unknown[], R>(
    key: string,
    channel: string,
    eventType: IpcEventType,
    listener: (event: IpcMainInvokeEvent, ...args: P) => R,
    id?: Uuid,
  ): void {
    if (!IpcBuilder.exposedApiNames[key]) {
      throw new Error(`Api key "${key}" isn't exposed in context bridge.`);
    }
    if (!IpcBuilder.exposedApiNames[key].includes(channel)) {
      throw new Error(`Api channel "${channel}" isn\'t exposed in context bridge.`);
    }

    if (eventType === IpcEventType.Handle) {
      ipcMain.handle(`${key}:${channel}${id ? `:${id}` : ""}`, listener);
    } else if (eventType === IpcEventType.On) {
      ipcMain.on(`${key}:${channel}${id ? `:${id}` : ""}`, listener);
    }
  }
}
