import React from "react";
import { act, fireEvent, waitFor } from "@testing-library/react";
import { Localized } from "./i18n";
import en from "./i18n/en";
import { useI18n } from "./i18n";
import cn from "./i18n/cn";
import { renderWithProvider } from "./utils";

const App: React.FC = () => {
  const { setLanguageById } = useI18n();

  return (
    <div>
      <span data-testid="text">
        <Localized id="button.active" />
      </span>
      <button data-testid="change"
        onClick={() => setLanguageById("cn")}
      >
          Update
      </button>
    </div>
  );
};

it("renders text in current language", async () => {
  const wrapper = renderWithProvider(<App />);
  expect(wrapper.getByTestId("text").textContent).toBe(en.button.active);
});

it("changes text if language is changed", async () => {
  const wrapper = renderWithProvider(<App />);

  const getTextContent = () => wrapper.getByTestId("text").textContent;

  expect(getTextContent()).toBe(en.button.active);

  act(() => {
    fireEvent.click(wrapper.getByTestId("change"));
  });

  await waitFor(() => expect(getTextContent()).toBe(cn.button.active));
});
