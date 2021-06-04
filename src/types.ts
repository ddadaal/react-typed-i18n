type ValueOf<T> = T[keyof T];

type StringOnly<T> = string & T;

type Concat<T, U> = `${string & T}${(StringOnly<U>) extends ""
  ? ""
  : `.${StringOnly<U>}`}`;

export type Definitions = {};

export type Lang<D extends Definitions> = D extends string
  ? ""
  : `${ValueOf<{[k in keyof D]: Concat<k, Lang<D[k]>>}>}`

export type FullLang<D extends Definitions> = D extends string
  ? ""
  : `${ValueOf<{[k in keyof D]: `${(StringOnly<k>)}.` | Concat<k, Lang<D[k]>>}>}`

export type PartialLangFromFull<LAPL extends FullLang<any>> =
  LAPL extends `${infer Start}.` ? `${Start}.` : never;

export type PartialLang<D extends Definitions> = PartialLangFromFull<FullLang<D>>;

export type RestLang<D extends Definitions, L extends Lang<D>, Partial extends PartialLang<D>> =
  L extends `${Partial}${infer Rest}` ? Rest : never;

export interface Language<D extends Definitions> {
  name: string;
  definitions: D;
}

export type AsyncLanguage<D extends Definitions> = () => Promise<Language<D>>;


