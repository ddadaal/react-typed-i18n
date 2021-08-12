import React, { useCallback, useContext, useState } from "react";
import { invalidLanguageIdError, noProviderError } from "./errors";
import {
  Definitions as Def,
  Lang, PartialLang, RestLang, LoadedDefinitions,
  LanguageDictionary, LazyDefinitions, Language,
} from "./types";
import { getDefinition, replacePlaceholders } from "./utils";

export interface ProviderValue<D extends Def> {
  currentLanguage: Language<Def>;
  setLanguageById: (id: string) => Promise<void>;
  setLanguage: (language: Language<D>) => Promise<void>;
  translate: (id: Lang<D>, args?: React.ReactNode[]) => string | React.ReactNode;
  translateToString: (id: Lang<D>, args?: React.ReactNode[]) => string;
}

export interface I18n<D extends Def> {
  Provider: React.FC<{
    initialLanguage: {
      id: string;
      definitions: LoadedDefinitions<D>;
    }
  }>;

  id<TRoot extends Lang<D>>(root: TRoot): TRoot;
  prefix: <TPartial extends PartialLang<D>, TRest extends RestLang<D, Lang<D>, TPartial>>
  (t: TPartial) => (rest: TRest) => `${TPartial}${TRest}`

  useI18n: () => ProviderValue<D>;
}



export function useI18nContext() {
  const i18n = useContext(I18nContext);
  if (!i18n) { throw noProviderError();}

  return i18n;
}

const i: I18n<any>["id"] = (root) => root;
const p: I18n<any>["prefix"] = (t) => (s) => (t+s) as any;

export const I18nContext =
  React.createContext<ProviderValue<any> | undefined>(undefined);

export const languageDictionary =
<D extends Def, Dict extends LanguageDictionary<D>>
  (t: Dict) => t as Dict;

export const loadDefinitions = async <D extends Def>
(lang: LazyDefinitions<D> | LoadedDefinitions<D>) => {
  if (typeof lang === "function") {
    return await (lang as () => Promise<D>)();
  } else {
    return lang;
  }
};

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
