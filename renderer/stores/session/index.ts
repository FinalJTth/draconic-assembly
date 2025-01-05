import { types } from "mobx-state-tree";
import { TerminalModel } from "../terminal";

const SessionModel = types.model("Session", {
  terminals: types.array(TerminalModel),
});
