import { Client } from "ssh2";
import fs from "fs";

export interface SshConfig {
  host: string;
  port: number;
  username: string;
  keyPath?: string;
  password?: string;
  passphrase?: string;
}

export interface CommandResult {
  output: string;
  code: number;
  signal: any;
}

export class SshManager {
  public static instance: SshManager = new SshManager();

  client?: Client;

  public connect({ host, port, username, keyPath, password, passphrase }: SshConfig): Promise<void> {
    return new Promise((resolve, reject) => {
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
        .on("ready", () => {
          console.log("Client :: ready");
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
                passphrase,
              }
            : {
                host,
                port,
                username,
                password,
              },
        );
    });
  }

  public execute(command: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client?.exec(command, (err, stream) => {
        if (err) return reject(err);
        let output = "";
        stream
          .on("close", (code: number, signal: any) => {
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
