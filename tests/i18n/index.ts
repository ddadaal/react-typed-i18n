import { createI18n, languageDictionary } from "../../src";

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

export const { Localized, Provider, i, p, useI18n } = createI18n(languages);
