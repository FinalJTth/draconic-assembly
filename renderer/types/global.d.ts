import { SshConfig } from "../../electron/classes/ssh";
import { IpcResponsePayload } from "../../electron/classes/ipc";
export {};

declare global {
  interface Window {
    electron: {
      windowControls: {
        minimize: () => void;
        maximize: () => void;
        close: () => void;
      };
    };
    ssh: {
      connect: (sshConfigs: SshConfig) => Promise<IpcResponsePayload>;
      execute: (command) => Promise<IpcResponseExecutionPayload>;
    };
    utils: {
      selectFile: () => Promise<IpcResponsePayload>;
      getPlatform: () => Promise<IpcResponsePayload>;
    };
  }
}
