"use client";

import React, { PropsWithChildren, useCallback, useContext, useState } from "react";
import { invalidLanguageIdError, noProviderError } from "./errors";
import {
  Definitions as Def,
  Lang, PartialLang, RestLang, LoadedDefinitions,
  LanguageDictionary, LazyDefinitions, Language,
} from "./types";
import { getDefinition, replacePlaceholders } from "./utils";

export interface ProviderValue<D extends Def> {
  /**
   * Current language object.
   */
  currentLanguage: Language<Def>;

  /**
   * Set language by language id.
   * @throws Error if id does not corresponds to a language.
   */
  setLanguageById: (id: string) => Promise<void>;

  /**
   * Set language by language object.
   */
  setLanguage: (language: Language<D>) => Promise<void>;

  /**
   * Translate id into text or component of current language.
   * Replace the nth {} replaceholders with nth arg.
   *
   * @throws Error if id does not corresponds to a definition.
   */
  translate: (id: Lang<D>, args?: React.ReactNode[]) => string | React.ReactNode;

  /**
   * Translate id into text of current language.
   * Replace the nth {} replaceholders with nth args.
   *
   * This function is only a re-type of `translate` function.
   * This function doesn't check return type.
   *
   * @throws Error if id does not corresponds to a definition.
   */
  translateToString: (id: Lang<D>, args?: React.ReactNode[]) => string;
}

export interface I18n<D extends Def> {
  /**
   * The Provider component.
   * Wrap the Provider component at the root of your component tree.
   */
  Provider: React.FC<PropsWithChildren<{
    /**
     * The initial language id or object.
     */
    initialLanguage: {
      /**
       * The id of the initial language.
       */
      id: string;

      /**
       * The loaded definition of the language.
       */
      definitions: LoadedDefinitions<D>;
    }
  }>>;

  /**
   * Typechecked util function to get an id.
   * In runtime it's just an identity function ((a) => a)
   * @param root The id.
   */
  id<TRoot extends Lang<D>>(id: TRoot): TRoot;

  /**
   * Typechecked util function to generate a prefix function.
   * Prefix function concatenates the prefix and the parameter to get a full text id.
   * @param prefix The prefix.
   */
  // @ts-ignore
  prefix: <TPartial extends PartialLang<D>, TRest extends RestLang<D, Lang<D>, TPartial>>
  (prefix: TPartial) => (rest: TRest) => `${TPartial}${TRest}`

  /**
   * Hook to get an i18n instance.
   */
  useI18n: () => ProviderValue<D>;
}


/**
 * Hook to get current i18n context.
 * @returns I18n instance
 */
export function useI18nContext() {
  const i18n = useContext(I18nContext);
  if (!i18n) { throw noProviderError();}

  return i18n;
}

const i: I18n<any>["id"] = (root) => root;
const p: I18n<any>["prefix"] = (t) => (s) => (t+s) as any;

export const I18nContext =
  React.createContext<ProviderValue<any> | undefined>(undefined);

/**
 * Helper function to create a language dictionary.
 * All definitions in a dictionary must have identical structure.
 *
 * In runtime just a identity function (a) => a
 *
 * @param t Language Dictionary.
 * @returns Language Dictionary
 */
export const languageDictionary =
<D extends Def, Dict extends LanguageDictionary<D>>
  (t: Dict) => t as Dict;

/**
 * Load definitions.
 * @param lang the definition or () => Promise<definition>
 * @returns the definition object.
 */
export const loadDefinitions = async <D extends Def>
(lang: LazyDefinitions<D> | LoadedDefinitions<D>) => {
  if (typeof lang === "function") {
    return await (lang as () => Promise<D>)();
  } else {
    return lang;
  }
};

/**
 * Create I18n hooks and helper functions using language dictionary.
 *
 * @param dict the language dictionary.
 * @returns i18n hooks and helper functions.
 */
export function createI18nHooks<D extends Def>(
  dict: LanguageDictionary<D>,
): I18n<D> {

  return {
    id: i,
    Provider: ({ initialLanguage, children }) => {
      const [current, setCurrent] = useState(initialLanguage);

      const setLanguage = useCallback(async (language: Language<D>) => {
        setCurrent({
          id: language.id,
          definitions: await loadDefinitions(language.definitions),
        });
      }, [dict]);

      const setLanguageById = useCallback(async (id: string) => {
        const defs = dict[id];
        if (defs) {
          await setLanguage({ id, definitions: defs });
        } else {
          throw invalidLanguageIdError(id);
        }
      }, [dict]);

      const translate = useCallback((id: string, args: React.ReactNode[]) => {
        return replacePlaceholders(getDefinition(current.definitions, id), args);
      }, [dict, current]);

      const translateToString = translate as
        (...args: Parameters<typeof translate>) => string;

      return (
        <I18nContext.Provider value={{
          currentLanguage: current,
          setLanguageById,
          setLanguage,
          translate,
          translateToString,
        }}
        >
          {children}
        </I18nContext.Provider>
      );
    },
    useI18n: useI18nContext,
    prefix: p,
  };
}
