/* eslint-disable max-len */
import { expectType } from "tsd";
import { i, p } from "./i18n";

const a: Parameters<typeof p>[0] = "button." as any;
expectType<"button.">(a);

const b: Parameters<typeof i>[0] = "button.active" as any;
expectType<"title" | "interpolation1" | "interpolation2" | "button.active" | "button.inactive">(b);

