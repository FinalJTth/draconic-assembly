import { IpcResponsePayload } from "#/types/ipc";
import { SshConfig } from "#/types/ssh";
import { ConfigValidation } from "../../electron/classes/ssh";
export {};

declare global {
  interface Window {
    startup: {
      reactReady: () => void;
    };
    renderer: {
      minimize: () => void;
      maximize: () => void;
      close: () => void;
    };
    ssh: {
      startTerminal: (id: Uuid, sshConfigs: SshConfig) => Promise<IpcResponsePayload>;
      validateConfig: (sshConfigs: SshConfig) => Promise<IpcResponsePayload<ConfigValidation>>;
      execute: (command: string) => Promise<IpcResponseExecutionPayload>;
      sendData: (id: Uuid, data: string) => void;
      resizeTerminal: (id: Uuid, dimension: { rows: number; cols: number }) => void;
      onData: (callback: (id: Uuid, data: string) => void) => void;
      onError: (callback: (id: Uuid, error: string) => void) => void;
      onStatus: (callback: (id: Uuid, status: string) => void) => void;
    };
    utils: {
      selectFile: () => Promise<IpcResponsePayload>;
      getPlatform: () => Promise<IpcResponsePayload>;
      removeRendererListeners: (channel: string) => void;
    };
  }
}
