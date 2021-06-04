import React, { useCallback, useContext, useState } from "react";
import {
  AsyncLanguage, Definitions as Def,
  Lang, Language, PartialLang, RestLang,
} from "./types";
import { getDefinition, replacePlaceholders } from "./utils";

export interface ProviderValue<D extends Def> {
  current: Language<D> | undefined;
  changeLanguage: (name: Lang<D>) => Promise<void>;
  translate: (id: Lang<D>, args?: React.ReactNode[]) => string | React.ReactNode;
}

export interface I18n<D extends Def> {
  getLanguage: (name: string) => Promise<Language<D> | undefined>;
  Provider: React.FC;

  r<TRoot extends Lang<D>>(root: TRoot): TRoot;
  r<TPartial extends PartialLang<D>,
  TRest extends RestLang<D, Lang<D>, TPartial>>
  (root: TPartial, rest: TRest): `${TPartial}${TRest}`;

  p<TPartial extends PartialLang<D>>(t: TPartial): TPartial;

  useI18n: () => ProviderValue<D>;
}

export function useI18nContext() {
  const i18n = useContext(I18nContext);
  if (!i18n) { throw new Error("Wrap the component with I18nProvider.");}

  return i18n;
}

export const I18nContext = React.createContext<ProviderValue<any> | undefined>(undefined);

export function createI18nHooks<D extends Def>
(languages: (Language<D> | AsyncLanguage<D>)[]): I18n<D> {

  async function getLanguage(name: string) {
    const l = languages.find((l) => l.name === name);
    if (l) {
      return typeof l === "function" ? await l() : l;
    } else {
      return undefined;
    }
  }

  return {
    getLanguage,
    r: (root, rest = "") => root + rest as Lang<Def>,
    Provider: ({ children }) => {
      const [current, setCurrent] = useState<Language<D> | undefined>(undefined);

      const changeLanguage = useCallback(async (name: string) => {
        const l = await getLanguage(name);
        if (l) {
          setCurrent(l);
        }
      }, [languages]);

      const translate = useCallback(async (id: string, args: React.ReactNode[]) => {
        if (!current) { throw new Error("Load language first.");}
        return replacePlaceholders(getDefinition(current, id), args);
      }, [languages]);

      return (
        <I18nContext.Provider value={{
          current,
          changeLanguage,
          translate,
        }}
        >
          {children}
        </I18nContext.Provider>
      );
    },
    useI18n: useI18nContext,
    p: (t) => t,
  };
}
