import { cast, Instance, types } from "mobx-state-tree";

export const TerminalModel = types
  .model("Terminal", {
    log: types.array(types.string),
    path: types.string,
    input: types.string,
  })
  .actions((self) => {
    const getLog = (): Array<string> => {
      return self.log;
    };

    const getPath = (): string => {
      return self.path;
    };

    const getInput = (): string => {
      return self.input;
    };

    const setLog = (log: Array<string>): void => {
      self.log = cast(log);
    };

    const setPath = (path: string): void => {
      self.path = path;
    };

    const setInput = (input: string): void => {
      self.input = input;
    };

    return {
      getLog,
      getPath,
      getInput,
      setLog,
      setPath,
      setInput,
    };
  })
  .actions((self) => {
    const appendLog = (log: Array<string>): void => {
      self.log.concat(log);
    };

    return {
      appendLog,
    };
  });

export type TerminalInstance = Instance<typeof TerminalModel>;

export const Terminal: TerminalInstance = TerminalModel.create({
  log: [],
  path: "",
  input: "",
});
