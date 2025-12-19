type ValueOf<T> = T[keyof T];

type StringOnly<T> = string & T;

type Concat<T, U> = `${string & T}.${string & U}`;

type RemoveTrailingDot<T extends string> = T extends `${infer U}.` ? U : T;

export type Definitions = {};

type LangRec<D extends string | Definitions> = D extends string
  ? ""
  : `${ValueOf<{ [k in keyof D]: Concat<k, LangRec<D[k]>> }>}`

export type Lang<D extends Definitions> = RemoveTrailingDot<LangRec<D>>;

type FullLang<D extends string | Definitions> = D extends string
  ? ""
  : `${ValueOf<{ [k in keyof D]: `${(StringOnly<k>)}.` | Concat<k, FullLang<D[k]>> }>}`

type PartialLangFromFull
  <D extends Definitions, FL extends FullLang<D>, L extends Lang<D>> =
  FL extends `${L}.` ? never : FL;

export type PartialLang<D extends Definitions> =
  PartialLangFromFull<D, FullLang<D>, Lang<D>>;

export type RestLang
  <D extends Definitions, L extends Lang<D>, Partial extends PartialLang<D>> =
  L extends `${Partial}${infer Rest}` ? Rest : never;

export type LazyDefinitions<D extends Definitions> = () => Promise<D>;

export type LoadedDefinitions<D extends Definitions> = D;

export type PartialDefinitions<D extends Definitions> = {
  [P in keyof D]?: D[P] extends object ? PartialDefinitions<D[P]> : D[P];
};

export type Language<D extends Definitions> = {
  id: string;
  definitions: LazyDefinitions<D> | LoadedDefinitions<D>;
}

/**
 * A map from language id to definition object or () => Promise<definition object>.
 */
export type LanguageDictionary<D extends Definitions> =
  Record<string, D | (() => Promise<D>)>;

/**
 * Get an union string type of all text ids of the languages in a language dictionary.
 */
export type TextIdFromLangDict<Dict extends LanguageDictionary<any>> =
  Dict extends LanguageDictionary<infer D> ? Lang<D> : never;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};