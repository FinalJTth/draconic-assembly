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
      connect: (sshConfigs: SshConfig) => IpcResponsePayload;
      execute: (command) => IpcResponseExecutionPayload;
      selectKey: () => IpcResponsePayload;
    };
    utils: {
      selectFile: () => IpcResponsePayload;
    };
  }
}
