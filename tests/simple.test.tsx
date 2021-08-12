import React from "react";
import { act, fireEvent, waitFor } from "@testing-library/react";
import { Localized } from "./i18n";
import en from "./i18n/en";
import { useI18n } from "./i18n";
import cn from "./i18n/cn";
import { renderWithProvider } from "./utils";
import fr from "./i18n/fr";

const App: React.FC = () => {
  const i18n = useI18n();

  const translatedString: string = i18n.translateToString("button.active");

  return (
    <div>
      <span data-testid="text">
        <Localized id="button.active" />
      </span>
      <span data-testid="translate">
        {i18n.translate("button.active")}
      </span>
      <span data-testid="translateToString">
        {translatedString}
      </span>
      <button data-testid="changeToCn"
        onClick={() => i18n.setLanguageById("cn")}
      >
          Update
      </button>
      <button data-testid="changeToFr"
        onClick={() => i18n.setLanguageById("fr")}
      >
          Update
      </button>
    </div>
  );
};

it("renders text in current language", async () => {
  const wrapper = renderWithProvider(<App />);
  expect(wrapper.getByTestId("text").textContent).toBe(en.button.active);
  expect(wrapper.getByTestId("translate").textContent).toBe(en.button.active);
  expect(wrapper.getByTestId("translateToString").textContent).toBe(en.button.active);
});

it("changes text if language is changed", async () => {
  const wrapper = renderWithProvider(<App />);

  const getTextContent = () => wrapper.getByTestId("text").textContent;

  expect(getTextContent()).toBe(en.button.active);

  act(() => {
    fireEvent.click(wrapper.getByTestId("changeToCn"));
  });

  await waitFor(() => expect(getTextContent()).toBe(cn.button.active));

  act(() => {
    fireEvent.click(wrapper.getByTestId("changeToFr"));
  });

  await waitFor(() => expect(getTextContent()).toBe(fr.button.active));
});

