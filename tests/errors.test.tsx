import { fireEvent, render } from "@testing-library/react";
import { Localized, useI18n } from "./i18n";
import React from "react";
import { renderWithProvider } from "./utils";
import { invalidLanguageIdError, noProviderError } from "../src";

jest.mock("../src/errors");

const actuals = jest.requireActual("../src/errors");

it("throws NoProviderError if not wrapped in Provider", async () => {

  (noProviderError as jest.Mock).mockImplementation(actuals.noProviderError);

  expect(() => render(<Localized id="title" />))
    .toThrowError(noProviderError().message);
});

it("throws InvalidLanguageIdError if language id is not valid", async () => {
  jest.mock("../src/errors");
  const App: React.FC = () => {
    const { setLanguageById } = useI18n();

    return (
      <button data-testid="change"
        onClick={() => setLanguageById("bad")}
      >
            Update
      </button>
    );
  };

  const wrapper = renderWithProvider(<App />);

  fireEvent.click(wrapper.getByTestId("change"));

  // the only way to test the error has been generated,
  // since the error occurred in a callback
  expect(invalidLanguageIdError).toHaveBeenCalled();
});
