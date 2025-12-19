import { createI18nHooks, I18n } from "./core";
import { DeepPartial, Definitions, LanguageDictionary } from "./types";
import { Components, createComponents } from "./components";

export * from "./core";
export * from "./types";
export * from "./components";
export * from "./errors";
export * from "./utils";

/**
 * Create hooks and components using specified language dictionary.
 *
 * @param dict the language dictionary.
 * @param partialLanguageOptions options for partial languages
 * @param partialLanguageOptions.fallbackLanguageId
 *   the fallback language id for partial languages.
 * @param partialLanguageOptions.languages the partial language dictionary.
 * @returns i18n hooks and components.
 */
export function createI18n<D extends Definitions>(
  dict: LanguageDictionary<D>,
  partialLanguageOptions?: {
    fallbackLanguageId: string,
    languages: LanguageDictionary<DeepPartial<D>>;
  },
): I18n<D> & Components<D> {
  return {
    ...createI18nHooks<D>(dict, partialLanguageOptions),
    ...createComponents<D>(),
  };
}
