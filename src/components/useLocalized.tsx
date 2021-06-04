import React, { useContext } from "react";
import { I18nContext } from "src";

export const useLocalized = (id: string, args?: React.ReactNode[]) => {

  const i18n = useContext(I18nContext);

  if (!i18n) { throw new Error("Wrap the component with I18nProvider.");}

  return i18n.translate(id, args);
};
