import React, { useState } from "react";
import { Localized, r, p, useI18n } from "./i18n";

const buttonRoot = p("button.");

function App() {

  const i18n = useI18n();
  const [times, setTimes] = useState(0);

  return (
    <div className="App">
      <h1>{i18n.translate("title")}</h1>
      <h2><Localized id="clicked" args={[times]} /></h2>
      <button onClick={() => setTimes((b) => b+1)}>
        <Localized id={r(buttonRoot, times % 2 == 0 ? "active" : "inactive")} />
      </button>
    </div>
  );
}

export default App;
