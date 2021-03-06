import React, { useEffect } from 'react';
import { WithStyles } from "@material-ui/styles/withStyles";
import createStyles from "@material-ui/styles/createStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from '@material-ui/core/CssBaseline';
import { RouteComponentProps, navigate } from "@reach/router";
import { useIntl, defineMessages } from "react-intl";
import { useAsync } from "react-use";
import * as d3 from "d3";
import { ExtendedFeatureCollection } from 'd3';
import NationTabVisualizer from "./NationTabVisualizer";
import { AreaCsvItem, PROVINCE_META_MAP, FilterType, STRIP_KEY_PARTS } from './models';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';
import ProvinceTabVisualizer from './ProvinceTabVisualizer';
import About from "./About";
import ErrorBoundary from './ErrorBoundary';

const styles = ({ spacing, mixins }: Theme) => createStyles({
  appBarSpacer: {
    minHeight: spacing(3)
  }
});

interface IGeoVisualizerRoutes {

}

type TabType = 'nation-tab' | 'region-tab' | 'about-tab';

interface IGeoVisualizerProps extends RouteComponentProps<IGeoVisualizerRoutes>, WithStyles<typeof styles> {

};

const messages = defineMessages({
  region: {
    id: "geovisualizer.region",
    description: "filter for region",
    defaultMessage: "点击地图选择地区"
  },
  nation: {
    id: "geovisualizer.nation",
    description: "default (nation) filter for region",
    defaultMessage: "全国"
  },
  about: {
    id: "geovisualizer.about",
    description: "about tab",
    defaultMessage: "关于"
  }
});

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;
  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`wrapped-tabpanel-${index}`}
      aria-labelledby={`wrapped-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </Typography>
  );
}
function a11yProps(index: string) {
  return {
    id: `wrapped-tab-${index}`,
    'aria-controls': `wrapped-tabpanel-${index}`,
  };
}
const _GeoVisualizer: React.FunctionComponent<IGeoVisualizerProps> = ({ classes, location, path }) => {
  const intl = useIntl();

  const state = useAsync<ExtendedFeatureCollection>(async () => {
    return d3.json("/data/china.json");
  });

  const dataState = useAsync<d3.DSVParsedArray<AreaCsvItem>>(async () => {
    return d3.csv("/data/provinces.csv", (d) => {
      // drop missing item
      if (!d.name || !d.confirmed || !d.discharged || !d.deceased || !d.suspected || !d.updatedAtDate) {
        return null;
      }
      const item: AreaCsvItem = {
        name: d.name,
        confirmed: parseInt(d.confirmed),
        discharged: parseInt(d.discharged),
        deceased: parseInt(d.deceased),
        suspected: parseInt(d.suspected),
        updatedAtDate: d.updatedAtDate
      };
      return item;
    });
  });

  const params = new URLSearchParams(location?.search);
  const [region, setRegion] = React.useState<string | null>(params.get('province'));
  let defaultValue: TabType = "nation-tab";
  if (path?.startsWith("/about")) {
    defaultValue = "about-tab";
  } else if (path?.startsWith("/region")) {
    defaultValue = 'region-tab';
  }
  const [value, setValue] = React.useState<TabType>(defaultValue);

  const stateProvince = useAsync<ExtendedFeatureCollection>(React.useCallback(async () => {
    const regionKey: string = STRIP_KEY_PARTS.reduce((acc: string, v) => { return acc.replace(v, "") }, region || "");

    return Object.keys(PROVINCE_META_MAP).indexOf(regionKey) === -1 ?
      new Promise<ExtendedFeatureCollection>((resolve, reject) => { reject(); }) :
      d3.json(`/data/provinces/${PROVINCE_META_MAP[regionKey].filenamePrefix}_geo.json`);
  }, [region]));

  const handleChange = (event: React.ChangeEvent<{}>, newValue: any) => {
    setValue(newValue);
  };

  const getRegionUrl = React.useCallback((regionName: string) => {
    params.set('province', regionName);
    const redirectUrl = `region?${params}`;
    return redirectUrl;
  }, [params]);

  const moveOverRegionPanel = React.useCallback((regionName: string) => {
    setRegion(regionName);
    const redirectUrl = getRegionUrl(regionName);
    navigate(redirectUrl);
  }, [getRegionUrl]);

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));

  const routeFilter = params.get("filter")?.trim() || "";
  let defaultFilter: FilterType = "confirmed";
  if (['confirmed', 'deceased', 'discharged'].indexOf(routeFilter) !== -1) {
    defaultFilter = routeFilter as FilterType;
  }
  const [filter, setFilter] = React.useState<FilterType>(defaultFilter);
  useEffect(() => {
    if (params.get('filter') !== filter) {
      params.set('filter', filter);
    }
  }, [filter, params]);
  const setFilterPushingHistory = (value: FilterType) => {
    setFilter(value);
    params.set("filter", value);
    navigate(`${location?.pathname || "/"}?${params}`);
  };

  const now = new Date();
  const paramDate = params.get('date');
  const defaultDate = paramDate !== null ? new Date(paramDate) : now;
  const [selectedDate, setSelectedDate] = React.useState(defaultDate);

  const handleDateChange = React.useCallback((date: Date) => {
    setSelectedDate(date);

    console.log(date);
    params.set('date', date.toISOString().substr(0, 10));
    navigate(`${path}?${params}`);
  }, [params, path]);

  return <div>
    <CssBaseline />
    <ErrorBoundary>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} centered={matches}>
          <Tab
            value="nation-tab"
            label={intl.formatMessage(messages.nation)}
            onClick={() => {
              // params.delete('province');
              navigate(`/?${params}`);
            }}
            {...a11yProps('nation-tab')}
          />
          <Tab
            value="region-tab"
            disabled={!region}
            label={region === null ? intl.formatMessage(messages.region) : region}
            onClick={() => { navigate(`/region?${params}`) }}
            {...a11yProps('region-tab')}
          />
          <Tab
            value="about-tab"
            label={intl.formatMessage(messages.about)}
            onClick={() => { navigate(`/about?${params}`) }}
            {...a11yProps('about-tab')}
          />
        </Tabs>
      </AppBar>
      <div className={classes.appBarSpacer} />
      <TabPanel value={value} index="nation-tab">
        <NationTabVisualizer
          params={params}
          state={state}
          dataState={dataState}
          moveOverRegionPanel={moveOverRegionPanel}
          filter={filter}
          setFilter={setFilterPushingHistory}
          selectedDate={selectedDate}
          handleDateChange={handleDateChange}
        />
      </TabPanel>
      <TabPanel value={value} index="region-tab">
        <ProvinceTabVisualizer
          params={params}
          state={stateProvince}
          filter={filter}
          setFilter={setFilterPushingHistory}
          selectedDate={selectedDate}
          handleDateChange={handleDateChange}
        />
      </TabPanel>
      <TabPanel value={value} index="about-tab">
        <About
        />
      </TabPanel>
    </ErrorBoundary>
  </div>;
}

const GeoVisualizer = withStyles(styles)(_GeoVisualizer);

export default GeoVisualizer;
