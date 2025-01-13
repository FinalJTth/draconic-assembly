/**
 * Represents a single hexadecimal character.
 */
export type HexCharacter =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f";

export type HexString<T extends number> = string & { __length: T };