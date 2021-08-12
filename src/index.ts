import { createI18nHooks, I18n } from "./core";
import { Definitions, LanguageDictionary } from "./types";
import { Components, createComponents } from "./components";

export * from "./core";
export * from "./types";
export * from "./components";
export * from "./errors";

/**
 * Create hooks and components using specified language dictionary.
 *
 * @param init the language dictionary.
 * @returns i18n hooks and components.
 */
export function createI18n<D extends Definitions>
(dict: LanguageDictionary<D>): I18n<D> & Components<D> {
  return {
    ...createI18nHooks<D>(dict),
    ...createComponents<D>(),
  };
}
