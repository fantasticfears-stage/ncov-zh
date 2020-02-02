import React from 'react';
import './App.css';
import { Router } from "@reach/router";
import GeoVisualizer from "./GeoVisualizer";
import { IntlProvider } from 'react-intl';

const App = () => {
  let locale = "en"; // default is en by react-intl. this trick should work for a while if translation is ever needed

  return <IntlProvider locale={locale}>
    <Router>
      <GeoVisualizer path="/" />
    </Router>
  </IntlProvider>;
}

export default App;
