import React from "react";
import { Localized } from "./i18n";
import { renderWithProvider } from "./utils";

it("interpolates single text arg", async () => {
  const wrapper = renderWithProvider(
    <span data-testid="test">
      <Localized id="interpolation1" args={["arg1"]} />
    </span>
  );

  expect(wrapper.getByTestId("test").textContent).toBe("inter arg1 polation");
});

it("interpolates multiple text args", async () => {
  const wrapper = renderWithProvider(
    <span data-testid="test">
      <Localized id="interpolation2" args={["arg1", "arg2"]} />
    </span>
  );

  expect(wrapper.getByTestId("test").textContent)
    .toBe("inter arg1 po arg2 lation");
});

