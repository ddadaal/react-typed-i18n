import React, { useState } from "react";
import { languages, Localized, p, Provider, useI18n } from "./i18n";
import en from "./i18n/en";

const buttonRoot = p("button.");

function Root() {

  return (
    <Provider initial={{
      info: languages.en[0],
      definitions: en,
    }}
    >
      <App />
    </Provider>
  );
}

function App() {

  const i18n = useI18n();
  const [times, setTimes] = useState(0);

  return (
    <div className="App">
      <h1>
        {i18n.translate("title")}
      </h1>
      <h2>
        <Localized id="clicked" args={[times]} />
      </h2>
      <button onClick={() => setTimes((b) => b+1)}>
        <Localized id={buttonRoot(times % 2 == 0 ? "active" : "inactive")} />
      </button>
      <div>
        <select
          value={i18n.currentLanguage.info.name}
          onChange={(e) => {
            const spec = Object.entries(languages)
              .find(([, [info]]) => info.name === e.target.value);

            if (spec) {
              i18n.changeLanguage(spec[1]);
            }
          }}
        >
          {Object.entries(languages).map(([id, [info]]) => (
            <option key={id} value={info.name}>
              {info.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default Root;
