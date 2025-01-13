import { Uuid, WeakUuid } from "#/types/uuid";
import { isValidUuid } from "@/utils/uuid";
import { types } from "mobx-state-tree";

const uuidFromSnapShot = (value: string | WeakUuid | Uuid): Uuid => {
  if (typeof value !== "string") {
    throw new Error("Invalid UUID : Value must be a string.");
  }
  if (isValidUuid(value)) {
    console.log("test pass");
    return value as Uuid;
  }
  console.log("test");
  throw new Error("Invalid UUID format.");
};

// Custom MST type for UUID
const uuid = types.custom<string | WeakUuid | Uuid, Uuid>({
  name: "UUID",
  fromSnapshot: uuidFromSnapShot,
  toSnapshot(value): Uuid {
    return value as Uuid;
  },
  isTargetType(value) {
    return typeof value === "string" && isValidUuid(value);
  },
  getValidationMessage(value) {
    try {
      uuidFromSnapShot(value);
      return "";
    } catch (e) {
      return (e as Error).message;
    }
  },
});

export const customTypes = {
  uuid,
};
