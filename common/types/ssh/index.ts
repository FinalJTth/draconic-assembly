export interface SshConfig {
  host: string;
  port: number;
  username: string;
  keyPath?: string;
  secret?: string;
}

export interface CommandResult {
  output: string;
  code: number;
  signal: any;
}
