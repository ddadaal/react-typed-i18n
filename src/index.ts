import { createI18nHooks } from "./core";
import { AsyncLanguage, Definitions, Language } from "./types";
import { createComponents } from "./components";

export * from "./core";
export * from "./types";
export * from "./components";

export function createI18n<D extends Definitions>
(languages: (Language<D> | AsyncLanguage<D>)[]) {
  return {
    ...createI18nHooks(languages),
    ...createComponents<D>(),
  };
}
