import { CommandResult, SshConfig } from "#/types/ssh";
import { Uuid } from "#/types/uuid";
import { ipcMain } from "electron";
import fs from "fs";
import { Client, ClientChannel } from "ssh2";

export class Session {
  id: Uuid = "00000000-0000-0000-0000-000000000000" as Uuid;
  terminals: Array<SshTerminal> = [];
}

interface ITerminal {
  id: Uuid;

  sendData: (data: string) => void;
  resizeTerminal: (dimension: { rows: number; cols: number }) => void;
}

class IdentifiableObject {
  id: Uuid;

  constructor(id: Uuid) {
    this.id = id;
  }
}

export class SshTerminal extends IdentifiableObject implements ITerminal {
  // public static instance: SshTerminal = new SshTerminal("00000000-0000-0000-0000-000000000000" as Uuid);

  client: Client | null = null;
  shellStream: ClientChannel | null = null;

  constructor(event: Electron.IpcMainInvokeEvent, id: Uuid, { host, port, username, keyPath, secret }: SshConfig) {
    super(id);
    this.connect(event, { host, port, username, keyPath, secret });
  }

  public connect(
    event: Electron.IpcMainInvokeEvent,
    { host, port, username, keyPath, secret }: SshConfig,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.client) {
        ipcMain.removeAllListeners(`ssh:send-data:${this.id}`);
        ipcMain.removeAllListeners(`ssh:resize-terminal:${this.id}`);
      }

      let privateKey: Buffer | undefined;
      if (keyPath && keyPath?.length > 0) {
        try {
          privateKey = fs.readFileSync(keyPath);
        } catch (error) {
          reject(error);
        }
      }

      this.client = new Client();
      this.client
        .on("ready", async () => {
          /*
          const shellType = process.platform === "win32" ? "cmd.exe" : "bash";
          const shell = spawn(shellType, [], {
            name: "xterm-color",
            cols: 80,
            rows: 24,
            cwd: process.env.HOME,
            env: process.env,
          });
          */

          // event.sender.send("ssh:on-status", "Connected to server");
          /*
          const shell = pty.spawn("powershell.exe", [], {
            name: "xterm-256color",
            cwd: process.env.HOME,
            env: process.env,
          });

          shell.onData((data) => event.sender.send("ssh:on-data", data.toString()));

          ipcMain.on("ssh:send-data", (_, command: string) => {
            shell.write(`${command}`);
            // stream.write(`echo "__USER_HOST_PWD__$USER@$(hostname) $(pwd)"\n`);
          });

          ipcMain.on("ssh:resize-terminal", (_, { rows, cols }: { rows: number; cols: number }) => {
            shell.resize(cols, rows); // Update terminal size
          });
          */

          const createShell: Promise<void> = new Promise((resolveShell, _) => {
            this.client?.shell({ term: "xterm-256color" }, (err, stream) => {
              if (err) {
                return event.sender.send("ssh:error", err.message);
              }

              this.shellStream = stream;

              stream
                .on("close", () => {
                  event.sender.send(`ssh:on-status`, this.id, "Connection closed");
                  this.client?.end();
                })
                .on("data", (data: Buffer) => {
                  event.sender.send(`ssh:on-data`, this.id, data.toString());
                })
                .stderr.on("data", (data: Buffer) => {
                  event.sender.send(`ssh:on-error`, this.id, data.toString());
                });

              resolveShell();
            });
          });

          await createShell;

          resolve();
        })
        .on("error", (error) => {
          console.error("Client :: error", error);
          reject(error);
        })
        .connect(
          privateKey
            ? {
                host,
                port,
                username,
                privateKey,
                passphrase: secret,
              }
            : {
                host,
                port,
                username,
                password: secret,
              },
        );
    });
  }

  public sendData(data: string): void {
    this.shellStream?.write(`${data}`);
  }

  public resizeTerminal({ rows, cols }: { rows: number; cols: number }): void {
    this.shellStream?.setWindow(rows, cols, rows * 8, cols * 8);
  }

  public execute(command: string): Promise<CommandResult> {
    return new Promise((resolve, reject) => {
      this.client?.exec(command, (err, stream) => {
        if (err) return reject(err);
        let output = "";
        stream
          .on("close", (code: number, signal: unknown) => {
            console.log("Client :: close");
            resolve({ output, code, signal });
          })
          .on("data", (data: Buffer) => {
            console.log("Client :: data");
            output += data.toString();
          })
          .stderr.on("data", (data) => {
            console.error(`STDERR: ${data}`);
          });
      });
    });
  }
}

export type ConfigValidation = { isSuccessful: true } | { isSuccessful: false; error: Error };

export const validateConfig = ({ host, port, username, keyPath, secret }: SshConfig): Promise<ConfigValidation> => {
  const client = new Client();
  return new Promise((resolve, _) => {
    let privateKey: Buffer | undefined;
    if (keyPath && keyPath?.length > 0) {
      if (!fs.existsSync(keyPath)) {
        resolve({
          isSuccessful: false,
          error: new Error("Key doesn't exist."),
        });
      }

      try {
        privateKey = fs.readFileSync(keyPath);
      } catch (error: unknown) {
        if (error instanceof Error) {
          resolve({
            isSuccessful: false,
            error,
          });
        }
      }
    }

    const connectionConfig = privateKey
      ? {
          host,
          port,
          username,
          privateKey,
          passphrase: secret,
        }
      : {
          host,
          port,
          username,
          password: secret,
        };

    try {
      client
        .on("ready", () => {
          resolve({
            isSuccessful: true,
          });
        })
        .on("error", (error) => {
          resolve({
            isSuccessful: false,
            error,
          });
        })
        .connect(connectionConfig);
    } catch (error: any) {
      resolve({
        isSuccessful: false,
        error,
      });
    }
  });
};
