import React from "react";
import { useI18nContext } from "./core";
import { Definitions, Lang } from "./types";

export interface LocalizedProps<Lang> {
  id: Lang;
  args?: React.ReactNode[];
}

export const Localized = React.memo(
  <L extends Lang<any>,>({ id, args }: LocalizedProps<L>) => {

    const i18n = useI18nContext();

    return i18n.translate(id, args) as unknown as React.ReactElement;

  });

export const createComponents = <D extends Definitions,>
  () => ({ Localized: Localized as React.FC<LocalizedProps<Lang<D>>> });
