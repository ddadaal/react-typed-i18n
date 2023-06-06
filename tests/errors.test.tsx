import { fireEvent, render } from "@testing-library/react";
import { Localized, useI18n } from "./i18n";
import React, { useState } from "react";
import { renderWithProvider } from "./utils";

jest.mock("../src/errors");

import * as errors from "../src/errors";


const actuals = jest.requireActual("../src/errors");

// cannot write as Object.keys
// restore all implementations
// eslint-disable-next-line max-len
(["noProviderError", "invalidIdError", "invalidLanguageIdError"] satisfies (keyof typeof errors)[])
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

    const [error, setError] = useState<Error | undefined>(undefined);

    return (
      <div>
        <button data-testid="change"
          onClick={async () => {
            try {
              await setLanguageById("bad");
            } catch (e) {
              setError(e);
            }
          }}
        >
          Update
        </button>

        {
          error ? (
            <p data-testid="error">
              {error.message}
            </p>
          ) : undefined
        }
      </div>
    );
  };

  const wrapper = renderWithProvider(<App />);

  fireEvent.click(wrapper.getByTestId("change"));

  await wrapper.findByTestId("error");

  expect(wrapper.getByTestId("error").innerHTML)
    .toBe(errors.invalidLanguageIdError("bad").message);
});

it("throws invalidId if id is not found", () => {
  const bad = "notvalid.a";

  expect(() => renderWithProvider(<Localized id={bad as any} />))
    .toThrowError(errors.invalidIdError(bad));

});

it("throws invalidId if the id doesn't point to a string", () => {

  const id = "button";

  expect(() => renderWithProvider(<Localized id={id as any} />))
    .toThrowError(errors.invalidIdError(id));
});
