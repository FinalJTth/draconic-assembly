import { HexString } from "../hex";

export type WeakUuid = `${string}-${string}-${string}-${string}-${string}`;
export type Uuid = `${HexString<8>}-${HexString<4>}-${HexString<4>}-${HexString<4>}-${HexString<12>}`;

export type Truncated<
  T extends string,
  N extends number,
  L extends any[] = [],
  A extends string = "",
> = N extends L["length"] ? A : T extends `${infer F}${infer R}` ? Truncated<R, N, [0, ...L], `${A}${F}`> : A;

export const truncateString = <T extends string, N extends number>(str: T, n: N, __ = [], ___ = ""): unknown =>
  str.substring(0, n);

export const atMostN = <T extends string, N extends number>(
  str: T extends Truncated<T, N> ? T : Truncated<T, N>,
  num: N,
): T extends Truncated<T, N> ? T : Truncated<T, N> => str;
