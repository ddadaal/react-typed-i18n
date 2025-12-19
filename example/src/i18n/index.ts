import { createI18n, TextIdFromLangDict, languageDictionary } from "react-typed-i18n";

const cn = () => import("./cn").then((x) => x.default);
const en = () => import("./en").then((x) => x.default);
const partial = () => import("./partial").then((x) => x.default);

export const languages = languageDictionary({
  cn,
  en,
});

export const languageInfo = {
  cn: { name: "简体中文" },
  en: { name: "English" },
  partial: { name: "Partial" },
};

export const { Localized, Provider, id, prefix, useI18n } = createI18n(languages, {
  fallbackLanguageId: "en",
  languages: { partial },
});

export type TextId = TextIdFromLangDict<typeof languages>;
