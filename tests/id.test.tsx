import { i, p } from "./i18n";

it("generates id", () => {
  expect(i("button.active")).toBe("button.active");
});

it("generates prefix and id", () => {
  const prefix = p("button.");
  expect(prefix("active")).toBe("button.active");
});

it("expects error", () => {
  // @ts-expect-error
  i("button.bad");

  // @ts-expect-error
  p("title.");
});
