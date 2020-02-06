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
import { IRegionData, AreaCsvItem } from './models';
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

const GEO_MAP: Record<string, string> = {
  '安徽': 'an_hui_geo',
  '澳门': 'ao_men_geo',
  '北京': 'bei_jing_geo',
  '重庆': 'chong_qing_geo',
  '福建': 'fu_jian_geo',
  '甘肃': 'gan_su_geo',
  '广东': 'guang_dong_geo',
  '广西': 'guang_xi_geo',
  '贵州': 'gui_zhou_geo',
  '海南': 'hai_nan_geo',
  '河北': 'he_bei_geo',
  '河南': 'he_nan_geo',
  '黑龙江': 'hei_long_jiang_geo',
  '湖北': 'hu_bei_geo',
  '湖南': 'hu_nan_geo',
  '吉林': 'ji_lin_geo',
  '江苏': 'jiang_su_geo',
  '江西': 'jiang_xi_geo',
  '辽宁': 'liao_ning_geo',
  '内蒙古': 'nei_meng_gu_geo',
  '宁夏': 'ning_xia_geo',
  '青海': 'qing_hai_geo',
  '山东': 'shan_dong_geo',
  '山西': 'shan_xi_1_geo',
  '陕西': 'shan_xi_3_geo',
  '上海': 'shang_hai_geo',
  '四川': 'si_chuan_geo',
  '台湾': 'tai_wan_geo',
  '天津': 'tian_jin_geo',
  '西藏': 'xi_zang_geo',
  '香港': 'xiang_gang_geo',
  '新疆': 'xin_jiang_geo',
  '云南': 'yun_nan_geo',
  '浙江': 'zhe_jiang_geo'
}

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
    return region === null ?
      new Promise<ExtendedFeatureCollection>((resolve, reject) => { reject(); }) :
      d3.json(`data/province/${GEO_MAP[region]}.json`);
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
        geoGenerator={geoGenerator}
      />
    </TabPanel>
    <TabPanel value={value} index="region-tab">
      <ProvinceTabVisualizer
        name={city ? `${province} / ${city}` : province || intl.formatMessage(messages.filters.nation)}
        data={data}
        state={stateProvince}
        geoGenerator={geoGenerator}
        features={stateProvince?.value?.features!}
        setCity={setCity}
        setProvince={setProvince}
      />
    </TabPanel>
  </div>;
}

const GeoVisualizer = withStyles(styles)(_GeoVisualizer);

export default GeoVisualizer;
