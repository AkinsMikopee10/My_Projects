import React from "react";
import ReactDom from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Analytics } from "@vercel/analytics/react";

ReactDom.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>
);
