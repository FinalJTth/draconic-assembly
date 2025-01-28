import { z } from "zod";

export enum SecretType {
  PrivateKey = "Private Key",
  PrivateKeyPassphrase = "Private Key with Passphrase",
  Password = "Password",
}

export interface SshConfigForm {
  host: string;
  port: number;
  username: string;
  secretType: SecretType;
  secret?: string;
  keyPath?: string;
}

const ipv4Regex: string = `(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)`;
const domainNameRegex: string = `(^((?!-))(xn--)?[a-z0-9][a-z0-9-_]{0,61}[a-z0-9]{0,1}\.(xn--)?([a-z0-9\-]{1,61}|[a-z0-9-]{1,30}\.[a-z]{2,})$)`;

export const sshConfigFormSchema = z.discriminatedUnion("secretType", [
  z.object({
    secretType: z.literal(SecretType.PrivateKey),
    host: z
      .string()
      .min(1, "Host is required.")
      .regex(new RegExp(`^(${ipv4Regex}|${domainNameRegex})$`), "Host must be a valid IP address or domain name."),
    port: z.preprocess((val) => {
      if (typeof val === "string" && val.length === 0) {
        return 22;
      }
      return val;
    }, z.number().int("Value must be an integer").min(0).max(65535)),

    username: z.string().min(1, "Username is required."),
    keyPath: z.string().min(1, "Key path is required."),
  }),
  z.object({
    secretType: z.literal(SecretType.PrivateKeyPassphrase),
    host: z
      .string()
      .min(1, "Host is required.")
      .regex(new RegExp(`^(${ipv4Regex}|${domainNameRegex})$`), "Host must be a valid IP address or domain name."),
    port: z.preprocess((val) => {
      if (typeof val === "string" && val.length === 0) {
        return 22;
      }
      return val;
    }, z.number().int("Value must be an integer").min(0).max(65535)),
    username: z.string().min(1, "Username is required."),
    keyPath: z.string().min(1, "Key path is required."),
    secret: z.string().min(1, "Passphrase is required."),
  }),
  z.object({
    secretType: z.literal(SecretType.Password),
    host: z
      .string()
      .min(1, "Host is required.")
      .regex(new RegExp(`^(${ipv4Regex}|${domainNameRegex})$`), "Host must be a valid IP address or domain name."),
    port: z.preprocess((val) => {
      if (typeof val === "string" && val.length === 0) {
        return 22;
      }
      return val;
    }, z.number().int("Value must be an integer").min(0).max(65535)),
    username: z.string().min(1, "Username is required."),
    secret: z.string().min(1, "Password is required."),
  }),
]);

export type SshConfigFormSchemaType = z.infer<typeof sshConfigFormSchema>;
