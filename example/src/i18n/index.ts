import { createI18n, languageDictionary } from "react-typed-i18n";

const cn = () => import("./cn").then((x) => x.default);
const en = () => import("./en").then((x) => x.default);

export const languages = languageDictionary({
  cn: [{ name: "简体中文" }, cn],
  en: [{ name: "English" }, en],
});

export const { Localized, Provider, i, p, useI18n } = createI18n(languages);
