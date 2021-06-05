import { fireEvent, render } from "@testing-library/react";
import { Localized, useI18n } from "./i18n";
import React from "react";
import { renderWithProvider } from "./utils";
import * as errors from "../src/errors";

jest.mock("../src/errors");

const actuals = jest.requireActual("../src/errors");

// restore implementations except invalidLanguageIdError
(["noProviderError", "invalidIdError"] as (keyof typeof errors)[])
  .forEach((k) => {
    (errors[k] as jest.Mock).mockImplementation(actuals[k]);
  });

it("throws NoProviderError if not wrapped in Provider", async () => {

  expect(() => render(<Localized id="title" />))
    .toThrowError(errors.noProviderError().message);
});

it("throws InvalidLanguageIdError if language id is not valid", async () => {
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
  expect(errors.invalidLanguageIdError).toHaveBeenCalled();
});

it("throws invalidId if id is not found", () => {
  const bad = "button.d";

  expect(() => renderWithProvider(<Localized id={bad as any} />))
    .toThrowError(errors.invalidIdError(bad));

});

it("throws invalidId if the id doesn't point to a string", () => {

  const id = "button";

  expect(() => renderWithProvider(<Localized id={id as any} />))
    .toThrowError(errors.invalidIdError(id));
});
