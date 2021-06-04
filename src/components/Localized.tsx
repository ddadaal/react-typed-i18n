import React, { useContext } from "react";
import { I18nContext } from "src/core";

interface Props {
  id: string;
  args?: React.ReactNode[];
}

export const Localized: React.FC<Props> = React.memo(({ id, args }) => {

  const i18n = useContext(I18nContext);

  if (!i18n) { throw new Error("Wrap the component with I18nProvider.");}

  return i18n.translate(id, args) as unknown as React.ReactElement;

});
