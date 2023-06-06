import { render } from "@testing-library/react";
import { Provider } from "./i18n";
import { PropsWithChildren } from "react";
import React from "react";
import en from "./i18n/en";

export const Root = ({ children }: PropsWithChildren<{}>) => {
  return (
    <Provider initialLanguage={{ id: "en", definitions: en }}>
      {children}
    </Provider>
  );
};

export const renderWithProvider = (children: JSX.Element) =>
  render(<Root>{children}</Root>);

