import { IpcResponsePayload } from "#/types/ipc";
import { flow, Instance, types } from "mobx-state-tree";
import { customTypes } from "../custom-types";
import { Main } from "../main";

export const TerminalModel = types
  .model("Terminal", {
    id: customTypes.uuid,
  })
  .actions((self) => {
    const getId = (): string => {
      return self.id;
    };

    return {
      getId,
    };
  })
  .actions((self) => {
    const createNewShellByCurrentSession = flow(function* (): Generator<
      PromiseLike<unknown>,
      void,
      IpcResponsePayload<undefined>
    > {
      const currentSession = Main.getCurrentSession();

      const response = yield window.ssh.startTerminal(self.id, {
        host: currentSession.host,
        port: currentSession.port,
        username: currentSession.username,
        keyPath: currentSession.keyPath,
        secret: currentSession.secret,
      });

      if (response.success) {
        console.log(response.message);
      } else {
        throw new Error("Connection failed : " + response.message);
      }
    });

    return {
      createNewShellByCurrentSession,
    };
  });

export type TerminalInstance = Instance<typeof TerminalModel>;
