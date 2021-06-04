import React, { useContext } from "react";
import { I18nContext } from "src/core";
import { Lang } from "./types";

export interface LocalizedProps<Lang> {
  id: Lang;
  args?: React.ReactNode[];
}

export function useI18nContext() {
  const i18n = useContext(I18nContext);
  if (!i18n) { throw new Error("Wrap the component with I18nProvider.");}

  return i18n;
}

export const Localized = React.memo(
  <L extends Lang<any>,>({ id, args }: LocalizedProps<L>) => {

    const i18n = useI18nContext();

    return i18n.translate(id, args) as unknown as React.ReactElement;

  });

