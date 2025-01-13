import { CommandResult } from "../ssh";

export interface IpcResponsePayload<T> {
  success: boolean;
  message: string;
  result?: T;
}

export interface IpcResponseExecutionPayload {
  success: boolean;
  message: string;
  result?: CommandResult;
}
