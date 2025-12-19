import React from "react";
import { invalidIdError } from "./errors";
import { DeepPartial, Definitions } from "./types";

export function replacePlaceholders(
  definition: string,
  args: React.ReactNode[] | Record<string, React.ReactNode>,
): React.ReactNode | string {

  let head = 0, index = 0;

  let valueArgs: React.ReactNode[] | undefined = undefined;

  const results = [] as React.ReactNode[];
  let escaped = false;

  let allString = true;

  const append = (text: string | React.ReactNode | undefined) => {

    if (typeof text !== "string") {
      results.push(text ?? "");
      allString = false;
      return;
    }

    if (results.length === 0) {
      results.push(text);
    } else {
      if (typeof results[results.length - 1] === "string") {
        results[results.length - 1] += text;
      } else {
        results.push(text);
      }
    }
  };

  while (head < definition.length) {
    if (definition[head] === "\\") {
      if (escaped) {
        append("\\");
        escaped = false;
      } else {
        escaped = true;
      }
      head++;
    } else if (definition[head] === "{") {
      if (escaped) {
        append("\\{");
        escaped = false;
        head++;
      } else {
        head++;
        if (head < definition.length) {
          let key = "";
          while (head < definition.length && definition[head] !== "}") {
            key += definition[head++];
          }
          if (head === definition.length) {
            append("{" + key);
            break;
          } else {
            head++;
            if (key === "") {
              if (!valueArgs) {
                valueArgs = Array.isArray(args) ? args : Object.values(args);
              }
              append(valueArgs[index++]);
            } else {
              append(args[key]);
            }
          }
        } else {
          append("{");
          break;
        }
      }
    } else {
      append(definition[head]);
      head++;
    }
  }

  return allString ? results.join("") : results;
}


export const getDefinition = (definitions: Definitions, id: string): string => {
  let content = definitions;
  for (const key of id.split(".")) {
    if (typeof content === "undefined") {
      throw invalidIdError(id);
    }
    // I know what I am doing. Trust me :)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    content = content[key] as any;
  }
  if (typeof content !== "string") {
    throw invalidIdError(id);
  }
  return content;
};

export const deepMerge = <D extends Definitions>(
  target: D,
  source: DeepPartial<D>,
): D => {
  if (typeof source !== "object" || source === null) {
    return target;
  }
  if (typeof target !== "object" || target === null) {
    return source as D;
  }
  const result = { ...target };
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const sourceValue = source[key];
      if (typeof sourceValue === "object" && sourceValue !== null) {
        (result as any)[key] = deepMerge((result as any)[key], sourceValue);
      } else {
        (result as any)[key] = sourceValue;
      }
    }
  }
  return result;
};