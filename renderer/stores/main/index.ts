import { Instance, types } from "mobx-state-tree";
import { SessionInstance, SessionModel } from "../session";
import { Uuid } from "#/types/uuid";
import { customTypes } from "../custom-types";
import { SshConfig } from "#/types/ssh";

export const MainModel = types
  .model("Main", {
    sessions: types.array(SessionModel),
    currentSessionId: types.optional(customTypes.uuid, "00000000-0000-0000-0000-000000000000"),
  })
  .actions((self) => {
    const newSession = (sessionData: SshConfig & { id: Uuid }): void => {
      self.sessions.push({ ...sessionData, terminals: [] });
    };

    const getCurrentSession = (): SessionInstance => {
      const session = self.sessions.find((session) => session.id === self.currentSessionId);
      if (session) {
        return session;
      } else {
        throw new Error("Current session ID doesn't exist inside session array data.");
      }
    };

    const setCurrentSession = (id: Uuid): void => {
      self.currentSessionId = id;
    };

    return {
      newSession,
      getCurrentSession,
      setCurrentSession,
    };
  });

export const Main = MainModel.create({
  sessions: [],
});

export type MainInstance = Instance<typeof MainModel>;
