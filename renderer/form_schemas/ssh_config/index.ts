import { z, ZodNumber, ZodOptional } from "zod";

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

const ipv4Regex = `(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)`;
const domainNameRegex = `([a-zA-Z0-9-]{1,63}\.[a-zA-Z]{2,})`;

function IntegerString<schema extends ZodNumber | ZodOptional<ZodNumber>>(schema: schema) {
  return z.preprocess(
    (value) => (typeof value === "string" ? parseInt(value, 10) : typeof value === "number" ? value : undefined),
    schema,
  );
}

/*
export const sshConfigSchema = z.object({
  host: z
    .string()
    .min(1, "Host is required.")
    .regex(new RegExp(`^(${ipv4Regex}|${domainNameRegex})$`), "Host must be ip adress or domain name."),
  port: IntegerString(z.number().int().min(0).max(65535)), // 'port' is required and must be a number
  username: z.string().min(1, "Username is required."), // 'username' is required and must be a string
  secretType: z.nativeEnum(SecretType),
  secret: z.string().optional(), // 'password' is optional and must be a string if provided
  keyPath: z.string().optional(), // 'passphrase' is optional and must be a string if provided
});
  .superRefine(({ host, port, username, secretType, secret, keyPath }, context) => {
    if (secretType === SecretType.Password && secret && secret.length === 0) {
      return context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Secret is required.",
        path: ["secret"],
      });
    }
    if (secretType === SecretType.PrivateKey && secret && secret.length === 0) {
      return context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Key path is required.",
        path: ["keyPath"],
      });
    }
    if (
      (secretType === SecretType.PrivateKeyPassphrase && secret && secret.length === 0) ||
      (keyPath && keyPath?.length === 0)
    ) {
      return context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Key path and secret are both required.",
        path: ["keyPath"],
      });
    }
  });
  */

export const sshConfigSchema = z.discriminatedUnion("secretType", [
  z.object({
    secretType: z.literal(SecretType.PrivateKey),
    host: z
      .string()
      .min(1, "Host is required.")
      .regex(new RegExp(`^(${ipv4Regex}|${domainNameRegex})$`), "Host must be ip adress or domain name."),
    port: IntegerString(z.number().int().min(0).max(65535)),
    username: z.string().min(1, "Username is required."),
    keyPath: z.string().min(1, "Key path is required."),
  }),
  z.object({
    secretType: z.literal(SecretType.PrivateKeyPassphrase),
    host: z
      .string()
      .min(1, "Host is required.")
      .regex(new RegExp(`^(${ipv4Regex}|${domainNameRegex})$`), "Host must be ip adress or domain name."),
    port: IntegerString(z.number().int().min(0).max(65535)),
    username: z.string().min(1, "Username is required."),
    keyPath: z.string().min(1, "Key path is required."),
    secret: z.string().min(1, "Passphrase is required."),
  }),
  z.object({
    secretType: z.literal(SecretType.Password),
    host: z
      .string()
      .min(1, "Host is required.")
      .regex(new RegExp(`^(${ipv4Regex}|${domainNameRegex})$`), "Host must be ip adress or domain name."),
    port: IntegerString(z.number().int().min(0).max(65535)),
    username: z.string().min(1, "Username is required."),
    secret: z.string().min(1, "Password is required."),
  }),
]);

export type SshConfigSchemaType = z.infer<typeof sshConfigSchema>;
