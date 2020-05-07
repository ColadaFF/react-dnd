import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import BoxConfigurer from "./box-configurer";
import store from "./store";

const App = () => {
  return (
    <Provider store={store}>
      <BoxConfigurer />
    </Provider>
  );
};

const root = document.getElementById("root");

render(<App />, root);
