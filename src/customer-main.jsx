import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import CustomerApp from "./app/CustomerApp";
import { store } from "./shared/Store.js";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <CustomerApp />
    </Provider>
  </React.StrictMode>
);