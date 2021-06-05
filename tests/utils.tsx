import { render } from "@testing-library/react";
import React from "react";
import { Provider } from "./i18n";
import en from "./i18n/en";

const Root: React.FC = ({ children }) => {
  return (
    <Provider initialLanguage={{ id: "en", definitions: en }}>
      {children}
    </Provider>
  );
};

export const renderWithProvider = (children) =>
  render(<Root>{children}</Root>);

