import { Uuid } from "#/types/uuid";
import { isValidHexString, parseHexString } from "../hex";

/**
 * Generates a Version 1 UUID as a string. This is a time-based UUID that requires
 * a clock with a resolution of 100 nanoseconds or higher. Because we don't have
 * access to a high-resolution clock, we simulate one by using the current time
 * in milliseconds and randomly generating a clock sequence and node identifier.
 *
 * The generated UUID will be a string in the following format:
 * <time_low>-<time_mid>-<time_high_and_version>-<clock_seq>-<node>
 *
 * @returns A Version 1 UUID as a string.
 */
export const generateUuidV1 = (): Uuid => {
  const getRandomHex = (length: number): string => {
    return Array.from({ length }, () => Math.floor(Math.random() * 16).toString(16)).join("");
  };

  const timestamp = BigInt(Date.now()) * BigInt(10000); // Convert to 100-nanosecond intervals
  const timeLow = (timestamp & BigInt(0xffffffff)).toString(16).padStart(8, "0");
  const timeMid = ((timestamp >> BigInt(32)) & BigInt(0xffff)).toString(16).padStart(4, "0");
  const timeHighAndVersion = (((timestamp >> BigInt(48)) & BigInt(0x0fff)) | BigInt(0x1000))
    .toString(16)
    .padStart(4, "0");

  const clockSeq = getRandomHex(4); // Simulate a clock sequence
  const node = getRandomHex(12); // Simulate a 48-bit node identifier (e.g., MAC address)

  return `${parseHexString(timeLow, 8)}-${parseHexString(timeMid, 4)}-${parseHexString(timeHighAndVersion, 4)}-${parseHexString(clockSeq, 4)}-${parseHexString(node, 12)}` as Uuid;
};

/**
 * Asserts that a string is a valid UUID (Version 1).
 * A valid UUID is a string that consists of five hexadecimal strings separated by hyphens.
 * The first string is eight characters long, the second string is four characters long,
 * the third string is four characters long, the fourth string is four characters long,
 * and the fifth string is twelve characters long.
 * @param str The input string.
 * @returns Boolean.
 */
export const isValidUuid = (str: string): str is Uuid => {
  const strSplit = str.split("-");
  return (
    strSplit.length === 5 &&
    isValidHexString(strSplit[0], 8) &&
    isValidHexString(strSplit[1], 4) &&
    isValidHexString(strSplit[2], 4) &&
    isValidHexString(strSplit[3], 4) &&
    isValidHexString(strSplit[4], 12)
  );
};

export const DEFAULT_UUID = "00000000-0000-0000-0000-000000000000" as Uuid;
