import React from 'react';
import './App.css';
import { Router } from "@reach/router";
import GeoVisualizer from "./GeoVisualizer";
import { IntlProvider } from 'react-intl';
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { palette, typography } from "./theme";
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers/MuiPickersUtilsProvider';
import { useEffectOnce } from 'react-use';
import moment from 'moment';
import 'moment/locale/zh-cn';

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

  useEffectOnce(() => {
    moment.updateLocale('zh-cn', {
      longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'YYYY-MM-DD',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd D MMMM YYYY HH:mm'
      },
    });
  });

  return <IntlProvider locale={locale}>
    <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Router>
          <GeoVisualizer path="/" />
          <GeoVisualizer path="/region" />
          <GeoVisualizer path="/about" />
        </Router>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  </IntlProvider>;
}

export default App;
