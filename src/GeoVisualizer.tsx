import React, { useRef, useEffect } from 'react';
import { WithStyles } from "@material-ui/styles/withStyles";
import createStyles from "@material-ui/styles/createStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles from "@material-ui/core/styles/withStyles";
import { RouteComponentProps } from "@reach/router";
import { useIntl, defineMessages } from "react-intl";
import { useTitle, useEffectOnce, useAsync } from "react-use";
import * as d3 from "d3";
import { ExtendedFeatureCollection, ExtendedGeometryCollection, ExtendedFeature } from 'd3';
import Provinces from "./Provinces";
import Cities from './Cities';
import DisplayBoard from './DisplayBoard';
import { IRegionData } from './models';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

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

const GEO_MAP = {
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
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}
function a11yProps(index: string) {
  return {
    id: `wrapped-tab-${index}`,
    'aria-controls': `wrapped-tabpanel-${index}`,
  };
}

const _GeoVisualizer: React.FunctionComponent<IGeoVisualizerProps> = (classes) => {
  const intl = useIntl();
  const regionLabel = intl.formatMessage(messages.filters.nation);
  useTitle(intl.formatMessage(messages.title, { region: regionLabel }));

  const state = useAsync<ExtendedFeatureCollection>(async () => {
    return d3.json("data/china.json");
  });
  const ref = useRef<SVGSVGElement>(null);

  const stateProvince = useAsync<ExtendedFeatureCollection>(async () => {
    return d3.json("data/province/an_hui_geo.json");
  });

  useEffectOnce(() => {
    d3.csv("data/DXYArea.csv").then((row) => {

      console.log(row);
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
  const [region, setRegion] = React.useState<string | null>(null);
  const [city, setCity] = React.useState<string | null>(null);
  const [value, setValue] = React.useState<'nation-tab' | 'region-tab'>('nation-tab');

  const handleChange = (event: React.ChangeEvent<{}>, newValue: any) => {
    setValue(newValue);
  };

  const moveOverRegionPanel = (d: ExtendedFeature) => {
    console.log(d);
    setRegion(d?.properties?.name as string);
    setValue("region-tab");
  }

  return <div>
    <AppBar position="static">
      <Tabs value={value} onChange={handleChange} aria-label="wrapped label tabs example">
        <Tab
          value="nation-tab"
          label={intl.formatMessage(messages.filters.nation)}
          wrapped
          {...a11yProps('nation-tab')}
        />
        <Tab
          value="region-tab"
          disabled={!region}
          label={region === null ? intl.formatMessage(messages.filters.region) : region}
          {...a11yProps('region-tab')}
        />
      </Tabs>
    </AppBar>
    <TabPanel value={value} index="nation-tab">
      <Container>
        <Grid container>
          <Grid item md={4} xs={12}>
            <DisplayBoard name={province || intl.formatMessage(messages.filters.nation)} data={data} />
          </Grid>
          <Grid item md={8} xs={12}>
            <svg width={1000} height={1000} className="container" ref={ref}>
              {state.loading ? "loading" : <Provinces
                moveOverRegionPanel={moveOverRegionPanel}
                geoGenerator={geoGenerator}
                context={d3.select(ref.current)}
                features={state?.value?.features!}
                setProvince={setProvince} />}
            </svg>
          </Grid>
        </Grid>
      </Container>
    </TabPanel>
    <TabPanel value={value} index="region-tab">
      <Container>
        <Grid container>
          <Grid item md={4} xs={12}>
            <DisplayBoard name={city ? `${province} / ${city}` : province || intl.formatMessage(messages.filters.nation)} data={data} />
          </Grid>
          <Grid item md={8} xs={12}>
            <svg width={1000} height={1000} className="container" ref={ref}>
              {!stateProvince.loading && <Cities
                geoGenerator={geoGenerator}
                context={d3.select(ref.current)}
                features={stateProvince?.value?.features!}
                setCity={setCity}
                setProvince={setProvince} />}
            </svg>
          </Grid>
        </Grid>
      </Container>
    </TabPanel>
  </div>;
}

const GeoVisualizer = withStyles(styles)(_GeoVisualizer);

export default GeoVisualizer;
