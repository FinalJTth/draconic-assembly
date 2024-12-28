import { CommandResult } from "./ssh";

export interface IpcResponsePayload {
  success: boolean;
  message: string;
  result?: string;
}

export interface IpcResponseExecutionPayload {
  success: boolean;
  message: string;
  result?: CommandResult;
}

export class IpcResponse {
  public static OnSuccess(message: string, result?: string): IpcResponsePayload {
    return {
      success: true,
      message,
      result,
    };
  }
  public static OnExecSuccess(message: string, result?: CommandResult): IpcResponseExecutionPayload {
    return {
      success: true,
      message,
      result,
    };
  }
  public static OnFailure(message: string): IpcResponsePayload {
    return {
      success: false,
      message,
    };
  }
}
