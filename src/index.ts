import { createI18nHooks } from "./core";
import { Definitions, LanguageDictionary } from "./types";
import { createComponents } from "./components";

export * from "./core";
export * from "./types";
export * from "./components";

export function createI18n<D extends Definitions, I>
(init: LanguageDictionary<D, I>) {
  return {
    ...createI18nHooks<D, I>(init),
    ...createComponents<D>(),
  };
}
