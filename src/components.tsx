import React, { useMemo } from "react";
import { useI18nContext } from "./core";
import { Definitions, Lang } from "./types";

export interface LocalizedProps<Lang> {
  id: Lang;
  args?: React.ReactNode[];
}

export const Localized =
  <L extends Lang<any>,>({ id, args }: LocalizedProps<L>) => {

    const i18n = useI18nContext();

    return useMemo(
      () => i18n.translate(id, args) as unknown as React.ReactElement,
      [id, args, i18n.currentLanguage]
    );
  };

export const createComponents = <D extends Definitions,>
  () => ({ Localized: Localized as React.FC<LocalizedProps<Lang<D>>> });
