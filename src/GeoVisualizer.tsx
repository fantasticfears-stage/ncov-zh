import React, { useRef, useEffect } from 'react';
import { WithStyles } from "@material-ui/styles/withStyles";
import createStyles from "@material-ui/styles/createStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles from "@material-ui/core/styles/withStyles";
import { RouteComponentProps, navigate } from "@reach/router";
import { useIntl, defineMessages } from "react-intl";
import { useTitle, useEffectOnce, useAsync } from "react-use";
import * as d3 from "d3";
import { ExtendedFeatureCollection, ExtendedGeometryCollection, ExtendedFeature } from 'd3';
import NationTabVisualizer from "./NationTabVisualizer";
import Cities from './Cities';
import DisplayBoard from './DisplayBoard';
import { IRegionData, AreaCsvItem, PROVINCE_META_MAP } from './models';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';
import ProvinceTabVisualizer from './ProvinceTabVisualizer';

const styles = ({ spacing, transitions }: Theme) => createStyles({
});

interface IGeoVisualizerRoutes {

}

interface IGeoVisualizerProps extends RouteComponentProps<IGeoVisualizerRoutes>, WithStyles<typeof styles> {

};

const messages = defineMessages({
  title: {
    id: "geovisualizer.title",
    description: "title for geovisualizer",
    defaultMessage: "{region}地区"
  },
  filters: {
    nation: {
      id: "geovisualizer.filters.nation",
      description: "default (nation) filter for region",
      defaultMessage: "全国"
    },
    region: {
      id: "geovisualizer.filters.region",
      description: "filter for region",
      defaultMessage: "地区"
    }
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
  const regionLabel = intl.formatMessage(messages.filters.nation);
  useTitle(intl.formatMessage(messages.title, { region: regionLabel }));

  const state = useAsync<ExtendedFeatureCollection>(async () => {
    return d3.json("data/china.json");
  });

  const dataState = useAsync<d3.DSVParsedArray<AreaCsvItem>>(async () => {
    return d3.csv("data/DXYArea.csv", (csv) => {
      if (csv.cityName === undefined || csv.provinceName === undefined) {
        return null;
      }
      const item = {
        cityName: csv.cityName,
        city_confirmedCount: parseInt(csv.city_confirmedCount || "0"),
        city_curedCount: parseInt(csv.city_curedCount || "0"),
        city_deadCount: parseInt(csv.city_deadCount || "0"),
        city_suspectedCount: parseInt(csv.city_suspectedCount || "0"),
        provinceName: csv.provinceName,
        province_confirmedCount: parseInt(csv.province_confirmedCount || "0"),
        province_curedCount: parseInt(csv.province_curedCount || "0"),
        province_deadCount: parseInt(csv.province_deadCount || "0"),
        province_suspectedCount: parseInt(csv.province_suspectedCount || "0"),
        updateTime: csv.updateTime ? new Date(Date.parse(csv.updateTime)) : new Date()
      };
      return item;
    });
  });

  const projection = d3.geoConicEqualArea();
  projection
    .rotate([-70, 20])
    .scale(800)
    .center([60.1, 125.6]);
  const geoGenerator = d3.geoPath()
    .projection(projection);

  const data: IRegionData = {
    confirmed: 0,
    cured: 0,
    death: 0,
    suspected: 0
  }
  const [province, setProvince] = React.useState<string | null>(null);
  const params = new URLSearchParams(location?.search);
  const [region, setRegion] = React.useState<string | null>(params.get('province'));
  const [city, setCity] = React.useState<string | null>(null);
  const [value, setValue] = React.useState<'nation-tab' | 'region-tab'>(region === null ? 'nation-tab' : 'region-tab');

  const stateProvince = useAsync<ExtendedFeatureCollection>(async () => {
    return region === null || Object.keys(PROVINCE_META_MAP).indexOf(region) === -1 ?
      new Promise<ExtendedFeatureCollection>((resolve, reject) => { reject(); }) :
      d3.json(`data/province/${PROVINCE_META_MAP[region].featureFilename}`);
  }, [region]);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: any) => {
    setValue(newValue);
  };

  const getRegionUrl = (regionName: string) => {
    const redirectUrl = `region?province=${encodeURIComponent(regionName)}`;
    return redirectUrl;
  }

  const moveOverRegionPanel = (d: ExtendedFeature) => {
    const regionName = d?.properties?.name as string;
    setRegion(regionName);
    const redirectUrl = getRegionUrl(regionName);
    navigate(redirectUrl);
  }

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));

  return <div>
    <AppBar position="static">
      <Tabs value={value} onChange={handleChange} centered={matches}>
        <Tab
          value="nation-tab"
          label={intl.formatMessage(messages.filters.nation)}
          onClick={() => { path?.startsWith("/region") && navigate("..") }}
          {...a11yProps('nation-tab')}
        />
        <Tab
          value="region-tab"
          disabled={!region}
          label={region === null ? intl.formatMessage(messages.filters.region) : region}
          onClick={() => { path?.startsWith("/region") && navigate("..") }}
          {...a11yProps('region-tab')}
        />
      </Tabs>
    </AppBar>
    <TabPanel value={value} index="nation-tab">
      <NationTabVisualizer
        state={state}
        dataState={dataState}
        moveOverRegionPanel={moveOverRegionPanel}
      />
    </TabPanel>
    <TabPanel value={value} index="region-tab">
      <ProvinceTabVisualizer
        params={params}
        dataState={dataState}
        state={stateProvince}
      />
    </TabPanel>
  </div>;
}

const GeoVisualizer = withStyles(styles)(_GeoVisualizer);

export default GeoVisualizer;
