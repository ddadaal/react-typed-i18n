import React from "react";
import { Localized, id } from "./i18n";
import { renderWithProvider } from "./utils";

const assert = (
  textId: ReturnType<typeof id>,
  args: React.ReactNode[] | Record<string, React.ReactNode>,
  expected: string
) => {

  const testId = "test" + Math.random();

  const wrapper = renderWithProvider(
    <span data-testid={testId}>
      <Localized id={textId} args={args} />
    </span>
  );

  expect(wrapper.getByTestId(testId).innerHTML).toBe(expected);

};

it("interpolates single text arg", async () => {
  assert("interpolation1", ["args1"], "inter args1 polation");
});

it("interpolates multiple text args", async () => {
  assert("interpolation2", ["arg1", "arg2"], "inter arg1 po arg2 lation");
});

it("interpolates single ReactNode arg", async () => {

  assert("interpolation1",
    [<strong key="1">arg1</strong>], "inter <strong>arg1</strong> polation");
});

it("interpolates ReactNode and text args", async () => {

  assert("interpolation2", [
    <strong key="1">arg1</strong>,
    "arg2",
  ], "inter <strong>arg1</strong> po arg2 lation");

});

it("interpolates undefined as empty string", async () => {
  assert("interpolation1", [], "inter  polation");
});

it("escapes correctly", async () => {
  assert("testEscape", ["1"], "\\{0} \\1 \\\\{0}");
});

it("interpolates with index", async () => {

  assert("withIndex", ["arg1", "arg2"], "arg2 arg1");
});

it("tests mixed", async () => {
  assert("testCase1", ["1", "2"], "1  2 2");
  assert("testCase1", { key1: "value1", key2: "value2" }, "value1 value2  value2");
});

it("tests incomplete {", async () => {
  assert("incompleteQuote", ["123"], "test {");
  assert("incompleteQuote2", ["123"], "test {key");
});

it("interpolates with indexed placeholders", async () => {

  assert("mixedIndexed", ["arg1", "arg2"], "arg1 arg2 arg2 arg1");
});

it("interpolates with object args", async () => {
  assert("objectArgs", { "arg1": "value1", "arg2": "value2" }, "value2 testvalue1 test");
});

it("interpolates with object args and indexed interpolations", async () => {

  const args = { "arg1": "value1", "arg2": "value2" };

  const valueArgs = Object.values(args);

  assert("objectAndIndexedArgs", args,
    `${valueArgs[0]} value2 testvalue1 test ${valueArgs[1]}`);

});
