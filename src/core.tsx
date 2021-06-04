import React, { useCallback, useState } from "react";
import {
  AsyncLanguage, Definitions as Def,
  Lang, Language, PartialLang, RestLang,
} from "./types";
import { getDefinition, replacePlaceholders } from "./utils";

export interface ProviderValue<D extends Def> {
  current: Language<D> | undefined;
  changeLanguage: (name: string) => Promise<void>;
  translate: (id: string, args?: React.ReactNode[]) => string | React.ReactNode;
}

export interface I18n<D extends Def> {
  getLanguage: (name: string) => Promise<Language<D> | undefined>;
  Provider: React.FC;

  r<D extends Def, TRoot extends Lang<D>>(root: TRoot): TRoot;
  r<D extends Def, TPartial extends PartialLang<D>,
  TRest extends RestLang<D, Lang<D>, TPartial>>
  (root: TPartial, rest: TRest): `${TPartial}${TRest}`;
}


export const I18nContext = React.createContext<ProviderValue<any> | undefined>(undefined);

export function createI18nHooks<D extends Def>(languages: (Language<D> | AsyncLanguage<D>)[]): I18n<D> {

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
    r: (root, rest = "") => root + rest as any,
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

  };
}
