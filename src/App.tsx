import React from 'react';
import './App.css';
import { Router } from "@reach/router";
import GeoVisualizer from "./GeoVisualizer";
import { IntlProvider } from 'react-intl';

const App = () => {
  let locale = "zh";

  return <IntlProvider locale={locale}>
    <Router>
      <GeoVisualizer path="/" />
    </Router>
  </IntlProvider>;
}

export default App;
