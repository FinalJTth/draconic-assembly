import { Instance, types } from "mobx-state-tree";
import { TerminalInstance, TerminalModel } from "../terminal";
import { customTypes } from "../custom-types";
import { generateUuidV1 } from "@/utils/uuid";
import { SshConfig } from "#/types/ssh";
import { Uuid } from "#/types/uuid";

export const SessionModel = types
  .model("Session", {
    id: customTypes.uuid,
    host: types.string,
    port: types.integer,
    username: types.string,
    keyPath: types.optional(types.string, ""),
    secret: types.optional(types.string, ""),
    terminals: types.array(TerminalModel),
    currentTerminalId: types.optional(customTypes.uuid, "00000000-0000-0000-0000-000000000000"),
  })
  .actions((self) => {
    const getId = (): Uuid => {
      return self.id;
    };

    const getSshConfig = (): SshConfig => {
      return {
        host: self.host,
        port: self.port,
        username: self.username,
        keyPath: self.keyPath,
        secret: self.secret,
      };
    };

    const getCurrentTerminal = (): TerminalInstance => {
      const terminal = self.terminals.find((terminal) => terminal.id === self.currentTerminalId);
      if (terminal) {
        return terminal;
      } else {
        throw new Error("Current terminal ID doesn't exist inside terminal array data.");
      }
    };

    const setCurrentTerminal = (id: Uuid): void => {
      self.currentTerminalId = id;
    };

    const getTerminalById = (id: string): TerminalInstance => {
      const terminal = self.terminals.find((terminal) => terminal.id === id);
      if (terminal) {
        return terminal;
      } else {
        throw new Error("Terminal ID doesn't exist inside terminal array data.");
      }
    };

    return {
      getId,
      getSshConfig,
      getCurrentTerminal,
      setCurrentTerminal,
      getTerminalById,
    };
  })
  .actions((self) => {
    const newTerminal = (): Uuid => {
      /*
      const response = yield window.ssh.startSsh({
        host: self.host,
        port: self.port,
        username: self.username,
        keyPath: self.keyPath,
        secret: self.secret,
      });

      if (response.success) {
        console.log("Connected successfully");
        self.terminals.push({ id: crypto.randomUUID() });
        self.currentTerminal = self.terminals.length - 1;
      } else {
        throw new Error("Connection failed : " + response.message);
      }
        */
      const id = generateUuidV1();
      self.terminals.push({ id });

      return id;
    };

    return {
      newTerminal,
    };
  });

export type SessionInstance = Instance<typeof SessionModel>;
