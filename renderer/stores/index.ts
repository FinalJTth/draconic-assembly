import { createContext, use } from "react";
import { Main, MainInstance } from "./main";

export interface Models {
  Main: MainInstance;
}

export const models: Models = {
  Main,
};

export const modelsContext = createContext(models);

export const useModels = (): Models => use(modelsContext);
