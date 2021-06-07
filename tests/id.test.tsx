import { id, prefix } from "./i18n";

it("generates id", () => {
  expect(id("button.active")).toBe("button.active");
});

it("generates prefix and id", () => {
  const p = prefix("button.");
  expect(p("active")).toBe("button.active");
});

it("expects error", () => {
  // @ts-expect-error
  id("button.bad");

  // @ts-expect-error
  prefix("title.");
});
