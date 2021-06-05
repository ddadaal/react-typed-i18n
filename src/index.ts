import { createI18nHooks } from "./core";
import { Definitions, LanguageDictionary } from "./types";
import { createComponents } from "./components";

export * from "./core";
export * from "./types";
export * from "./components";
export * from "./errors";

export function createI18n<D extends Definitions>
(init: LanguageDictionary<D>) {
  return {
    ...createI18nHooks<D>(init),
    ...createComponents<D>(),
  };
}
