import React from 'react';
import './App.css';
import { Router } from "@reach/router";
import GeoVisualizer from "./GeoVisualizer";
import { IntlProvider } from 'react-intl';
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { palette, typography } from "./theme";

const App = () => {
  let locale = "en"; // default is en by react-intl. this trick should work for a while if translation is ever needed
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: Object.assign({
          type: prefersDarkMode ? 'dark' : 'light',
        }, palette),
        typography
      }),
    [prefersDarkMode],
  );

  return <IntlProvider locale={locale}>
    <ThemeProvider theme={theme}>
      <Router>
        <GeoVisualizer path="/" />
      </Router>
    </ThemeProvider>

  </IntlProvider>;
}

export default App;
