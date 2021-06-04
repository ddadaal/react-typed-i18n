import { createI18n } from "react-typed-i18n";

const cn = () => import("./cn").then((x) => x.default);
const en = () => import("./en").then((x) => x.default);

export const { Localized, Provider, getLanguage, i, p, useI18n } = createI18n([cn, en]);

