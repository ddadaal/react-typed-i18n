import { createI18n, languageDictionary } from "../../src";
import cn from "./cn";

const en = () => import("./en").then((x) => x.default);
const fr = () => import("./fr").then((x) => x.default);

export const languages = languageDictionary({
  cn,
  en,
  fr,
});

export const languageInfo = {
  cn: { name: "简体中文" },
  en: { name: "English" },
  fr: { name: "Français" },
};

export const { Localized, Provider, i, p, useI18n } = createI18n(languages);
