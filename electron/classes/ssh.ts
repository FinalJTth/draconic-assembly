import { CommandResult, SshConfig } from "#/types/ssh";
import { Uuid } from "#/types/uuid";
import fs from "fs";
import { Client, ClientChannel } from "ssh2";

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
  client: Client | null = null;
  shellStream: ClientChannel | null = null;

  constructor(event: Electron.IpcMainInvokeEvent, id: Uuid, sshConfig: SshConfig) {
    super(id);
    this.connect(event, sshConfig).then(
      (client) => (this.client = client),
      (error) => {
        throw new Error(`An unanticipated error occured while connecting to SSH server : ${error}`);
      },
    );
  }

  private connect(event: Electron.IpcMainInvokeEvent, config: SshConfig): Promise<Client> {
    return new Promise<Client>((resolve, reject) => {
      const { secret, keyPath, ...restConfig } = config;
      let privateKey: Buffer | undefined;
      if (keyPath && keyPath?.length > 0) {
        try {
          privateKey = fs.readFileSync(keyPath);
        } catch (error) {
          reject(error);
        }
      }

      const client = new Client();
      client
        .on("ready", async () => {
          const createShell: Promise<void> = new Promise((resolveShell, rejectShell) => {
            client?.shell({ term: "xterm-256color" }, (error, stream) => {
              if (error) {
                rejectShell(error);
                event.sender.send("ssh:error", error.message);
              }

              this.shellStream = stream;

              stream
                .on("close", () => {
                  event.sender.send(`ssh:on-status`, this.id, "Connection closed");
                  client.end();
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

          await createShell.then(
            () => resolve(client),
            (error) => reject(error),
          );
        })
        .on("error", (error) => {
          console.error("Client :: error", error);
          reject(error);
        })
        .connect(
          privateKey
            ? {
                ...restConfig,
                privateKey,
                passphrase: secret,
              }
            : {
                ...restConfig,
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

export const validateConfig = (config: SshConfig): Promise<ConfigValidation> => {
  const client = new Client();
  return new Promise((resolve, _) => {
    const { secret, keyPath, ...restConfig } = config;
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
          ...restConfig,
          privateKey,
          passphrase: secret,
        }
      : {
          ...restConfig,
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
