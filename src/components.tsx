import React, { useMemo } from "react";
import { useI18nContext } from "./core";
import { Definitions, Lang } from "./types";

export interface LocalizedProps<D extends Definitions> {
  id: Lang<D>;
  args?: React.ReactNode[];
}

export const Localized =
  <D extends Definitions,>({ id, args }: LocalizedProps<D>) => {

    const i18n = useI18nContext();

    return useMemo(
      () => i18n.translate(id as any, args) as unknown as React.ReactElement,
      [id, args, i18n.currentLanguage]
    );
  };

export type Components<D extends Definitions> = {
  Localized: React.FC<LocalizedProps<D>>
};

export const createComponents = <D extends Definitions,>
  (): Components<D> => ({ Localized });
