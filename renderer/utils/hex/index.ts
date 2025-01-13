import { HexCharacter, HexString } from "#/types/hex";

/**
 * A set of hexadecimal characters.
 */
const VALID_HEX_CHARACTERS = new Set<HexCharacter>([
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
]);

/**
 * Asserts that a string consists only of HexCharacter and has the correct length.
 * @param str The input character.
 * @returns Boolean.
 */
const isHexCharacter = (str: string): str is HexCharacter => {
  return VALID_HEX_CHARACTERS.has(str as HexCharacter);
};

/**
 * Asserts that a string consists only of HexCharacter and has the correct length.
 * @param str The input string.
 * @returns Boolean.
 */
export const isValidHexString = <T extends number>(str: string, length: T): str is HexString<T> => {
  return str.length === length && [...str].every((char) => isHexCharacter(char));
};

/**
 * Parses a string into a HexString<T> if valid.
 * @param str The input string.
 * @param length The expected length of the HexString.
 * @returns The parsed HexString<T>.
 * @throws If the string is not a valid hexadecimal string of the specified length.
 */
export const parseHexString = <T extends number>(str: string, length: T): HexString<T> => {
  if (!isValidHexString(str, length)) {
    throw new Error(`Invalid HexString: Expected a ${length}-character hexadecimal string.`);
  }
  return str.toLowerCase() as HexString<T>;
};
