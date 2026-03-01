import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import {applyDebugBorders} from "./config/debug.ts";
import {applyTheme} from "./config/theme.ts";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
);

applyTheme();
applyDebugBorders()
