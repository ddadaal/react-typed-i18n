import { createI18nHooks, I18n } from "./core";
import { Definitions, LanguageDictionary } from "./types";
import { Components, createComponents } from "./components";

export * from "./core";
export * from "./types";
export * from "./components";
export * from "./errors";

export function createI18n<D extends Definitions>
(init: LanguageDictionary<D>): I18n<D> & Components<D> {
  return {
    ...createI18nHooks<D>(init),
    ...createComponents<D>(),
  };
}
