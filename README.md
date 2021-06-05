# react-typed-i18n

A strongly typed i18n library for react.

## Demo

![Demo](docs/demo.gif)

## Features

- **typechecked** text id using TypeScript's [Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)
- **interpolation** with `string` and `React.ReactNode`
- **async language loading** for code splitting
- **hot language reloading** without reloading page

This library is the successor of [`simstate-i18n`](https://github.com/ddadaal/simstate-i18n). Most concepts and functionalities remain unchanged, but this library

- removes the [`simstate`](https://github.com/ddadaal/simstate) dependency
- use Template Literal Types to typecheck the text id
- is way easier to setup

## Usage

1. Define your definitions (one file per language)
    - use `{}` as a placeholder for interpolation
    - object can be nested
    - all languages should have identical structures
    - this object is called `Language`

```tsx
// ./src/i18n/en
export default {
  hello: {
    world: "Hello {} World {}",
  }
}

// ./src/i18n/cn
export default {
  hello: {
    world: "你好 {} 世界 {}",
  }
}
```

2. Define all your languages and create elements from `createI18n`
    - The key of `languages` is the **id** of the language;
    - The value of `languages` is `Language` or `() => Promise<Language>`
    - Use `languageDictionary` helper to create the initialization arg
```tsx
// ./src/i18n/index.ts
import { createI18n, languageDictionary } from "react-typed-i18n";

const cn = () => import("./cn").then((x) => x.default);
const en = () => import("./en").then((x) => x.default);

export const languages = languageDictionary({
  cn,
  en,
});

export const { Localized, Provider, i, p, useI18n } = createI18n(languages);
```

3. Wrap the component tree with `Provider` component
    - A `Language` object and its corresponding id must be provided for the `Provider` compoennt
    - In some circumstances (like SSR), rather than importing `Language` directly, `Language` can be asyncly loaded and provided.

```tsx
// ./src/Root.tsx
import React from "react";
import en from "./i18n/en";
import { Provider } from "./i18n";
import App from "./App";

export default () => {
  return (
    <Provider initialLanguage={{
      id: "en",
      definitions: en,
    }}>
      <App />
    </Provider>
  );
}
```

4. Use `Localized` in places of raw texts
    - Use `args` prop to interpolate args into the placeholders
    - A type error will be reported if the id is not valid
    - The `Localized` must be imported from where the `createI18n` is called (for example, `./src/i18n`)
    - The below displays: Hello **AAA** World **BBB**

```tsx
// ./src/App.tsx
import React from "react";
import { Localized } from "./src/i18n";

export default () => {
  return (
    <div>
      <p>
        <Localized
          id="hello.world"
          args={[
            <strong key="1">AAA</strong>,
            <strong key="2">BBB</strong>,
          ]}
        />
      </p>
    </div>
  );
}
```

5. Use `useI18n` hook to get helper functions like `setLanguageById`
    - After clicking the button, the p will displays: 你好 **AAA** 世界 **BBB**

```tsx
// ./src/App.tsx
import React from "react";
import { Localized, useI18n } from "./src/i18n";

export default () => {
  const { setLanguageById } = useI18n();
  return (
    <div>
      <p>
        <Localized
          id="hello.world"
          args={[
            <strong key="1">AAA</strong>,
            <strong key="2">BBB</strong>,
          ]}
        />
      </p>
      <button onClick={() => setLanguageById("cn")}>
        Change to cn
      </button>
    </div>
  );
}
```

## License

MIT
