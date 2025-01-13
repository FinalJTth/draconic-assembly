import { Uuid } from "#/types/uuid";
import { isValidHexString, parseHexString } from "../hex";

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
