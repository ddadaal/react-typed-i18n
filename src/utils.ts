import { Definitions } from "./types";

const splitter = /(\{\})/;

export function replacePlaceholders(
  definition: string,
  args: React.ReactNode[]): React.ReactNode | string {
  const array = definition.split(splitter) as React.ReactNode[];
  let ri = 0;

  let containsNonPrimitive = false;

  for (let i = 1; i < array.length; i += 2) {
    if (typeof args[ri] === "object") {
      containsNonPrimitive = true;
    }
    array[i] = args[ri++];
  }

  if (!containsNonPrimitive) {
    return array.join("");
  }

  return array;
}


export const getDefinition = (definitions: Definitions, id: string): string => {
  let content = definitions;
  for (const key of id.split(".")) {
    if (typeof content === "undefined") {
      throw new RangeError(`unidentified id ${id}`);
    }
    // I know what I am doing. Trust me :)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    content = content[key] as any;
  }
  if (typeof content !== "string") {
    throw new RangeError(`id ${id} does not refer to a string. actual value: ${content}`);
  }
  return content;
};
