import React, { useState } from "react";
import { Localized, p, Provider, useI18n } from "./i18n";
import en from "./i18n/en";

const buttonRoot = p("button.");

function Root() {
  return (
    <Provider initialLanguage={en}>
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
    </div>
  );
}

export default Root;
