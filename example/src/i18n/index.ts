import { createI18n, TextIdFromLangDict, languageDictionary } from "react-typed-i18n";

const cn = () => import("./cn").then((x) => x.default);
const en = () => import("./en").then((x) => x.default);

export const languages = languageDictionary({
  cn,
  en,
});

export const languageInfo = {
  cn: { name: "简体中文" },
  en: { name: "English" },
};

export const { Localized, Provider, id, prefix, useI18n } = createI18n(languages);

export type TextId = TextIdFromLangDict<typeof languages>;
