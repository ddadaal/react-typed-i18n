import React from "react";
import { render } from "@testing-library/react";
import { Localized, Provider } from "./i18n";
import en from "./i18n/en";

const Root: React.FC = ({ children }) => {
  return (
    <Provider initialLanguage={{ id: "en", definitions: en }}>
      {children}
    </Provider>
  );
};

const renderWithProvider = (children) =>
  render(<Root>{children}</Root>);

it("renders text", async () => {
  const wrapper = renderWithProvider(
    <span data-testid="text">
      <Localized id="button.active" />
    </span>);

  expect(wrapper.getByTestId("text").textContent).toBe(en.button.active);
});
