import React, { useCallback, useContext, useState } from "react";
import {
  Definitions as Def,
  Lang, PartialLang, RestLang, LoadedDefinitions,
  LanguageDictionary, LazyDefinitions, LanguageSpec,
} from "./types";
import { getDefinition, replacePlaceholders } from "./utils";

export interface ProviderValue<D extends Def, I> {
  currentLanguage: {
    info: I;
    definitions: LoadedDefinitions<Def>;
  };
  changeLanguage: (spec: LanguageSpec<D, I>) => Promise<void>;
  translate: (id: Lang<D>, args?: React.ReactNode[]) => string | React.ReactNode;
}

export interface I18n<D extends Def, I> {
  Provider: React.FC<{
    initial: {
      info: I;
      definitions: D
    };
  }>;

  i<TRoot extends Lang<D>>(root: TRoot): TRoot;
  p: <TPartial extends PartialLang<D>, TRest extends RestLang<D, Lang<D>, TPartial>>
  (t: TPartial) => (rest: TRest) => `${TPartial}${TRest}`

  useI18n: () => ProviderValue<D, I>;
}

export function useI18nContext() {
  const i18n = useContext(I18nContext);
  if (!i18n) { throw new Error("Wrap the component with I18nProvider.");}

  return i18n;
}

const i: I18n<any, any>["i"] = (root) => root;
const p: I18n<any, any>["p"] = (t) => (s) => (t+s) as any;

export const I18nContext =
  React.createContext<ProviderValue<any, any> | undefined>(undefined);

export const languageDictionary =
<D extends Def, I, Dict extends LanguageDictionary<D, I>>
  (t: Dict) => t as Dict;

export const loadDefinitions = async <D extends Def>
(lang: LazyDefinitions<D> | LoadedDefinitions<D>) => {
  if (typeof lang === "function") {
    return await (lang as () => Promise<D>)();
  } else {
    return lang;
  }
};

export function createI18nHooks<D extends Def, I>(
  dict: LanguageDictionary<D, I>,
): I18n<D, I> {

  return {
    i,
    Provider: ({ initial, children }) => {
      const [current, setCurrent] = useState(initial);

      const changeLanguage = useCallback(async (spec: LanguageSpec<D, I>) => {
        console.log(spec);
        setCurrent({
          info: spec[0],
          definitions: await loadDefinitions(spec[1]),
        });
      }, [dict]);

      const translate = useCallback((id: string, args: React.ReactNode[]) => {
        return replacePlaceholders(getDefinition(current.definitions, id), args);
      }, [dict, current]);

      return (
        <I18nContext.Provider value={{
          currentLanguage: current,
          changeLanguage,
          translate,
        }}
        >
          {children}
        </I18nContext.Provider>
      );
    },
    useI18n: useI18nContext,
    p,
  };
}
