import React, { useRef, useEffect, useCallback } from 'react';
import { WithStyles } from "@material-ui/styles/withStyles";
import createStyles from "@material-ui/styles/createStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles from "@material-ui/core/styles/withStyles";
import { RouteComponentProps } from "@reach/router";
import { useIntl, defineMessages } from "react-intl";
import { useTitle, useEffectOnce, useAsync } from "react-use";
import * as d3 from "d3";
import DisplayBoard from './DisplayBoard';
import { IRegionData, AreaCsvItem, FilterType } from './models';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import GraphRenderer from './GraphRenderer';
import { AsyncState } from 'react-use/lib/useAsyncFn';
import { ExtendedFeatureCollection, ExtendedGeometryCollection, ExtendedFeature } from 'd3';

const styles = ({ spacing, transitions }: Theme) => createStyles({
});

const FILL_FN_MAP: Record<string, d3.ScalePower<number, string>> = {
  "cured": d3.scalePow()
    .interpolate(() => d3.interpolateGreens)
    .exponent(0.3)
    .domain([0, 100]),
  "death": d3.scalePow()
    .interpolate(() => d3.interpolateGreys)
    .exponent(0.2)
    .domain([0, 1000]),
  "confirmed": d3.scalePow()
    .interpolate(() => d3.interpolateOranges)
    .exponent(0.3)
    .domain([0, 1500]),
  "suspected": d3.scalePow()
    .interpolate(() => d3.interpolateInferno)
    .exponent(0.3)
    .domain([0, 1.5])
};

interface INationTabVisualizer extends WithStyles<typeof styles> {
  state: AsyncState<ExtendedFeatureCollection>;
  dataState: AsyncState<d3.DSVParsedArray<AreaCsvItem>>;
  geoGenerator: d3.GeoPath<any, d3.GeoPermissibleObjects>;
  moveOverRegionPanel: (d: ExtendedFeature) => void;
};

function PluckDataByFilter(data: IRegionData, filter: FilterType) {
  return data[filter] || 0;
}

function TryGetDataFromPrefix(byProvince: d3.Map<IRegionData>, prefix: string) {
  const keys = byProvince.keys();
  const idx = keys.findIndex(p => p.startsWith(prefix));
  if (idx !== -1) {
    const data = byProvince.get(keys[idx]);
    return data;
  }
  return undefined;
}

const messages = defineMessages({
  filters: {
    nation: {
      id: "geovisualizer.filters.nation",
      description: "default (nation) filter for region",
      defaultMessage: "全国"
    }
  }
});

const _NationTabVisualizer: React.FunctionComponent<INationTabVisualizer> = ({ dataState, state, geoGenerator, moveOverRegionPanel }) => {
  const intl = useIntl();

  const [province, setProvince] = React.useState<string | null>(null);
  const name = province || intl.formatMessage(messages.filters.nation);
  const [byProvince, setByProvince] = React.useState<d3.Map<IRegionData>>(d3.map<IRegionData>({}));
  useEffect(() => {
    const extracted = (d3.nest<AreaCsvItem, IRegionData>().key(d => d.provinceName).rollup(d => {
      // asserts d.length > 0
      return {
        confirmed: d[0].province_confirmedCount,
        cured: d[0].province_curedCount,
        death: d[0].province_deadCount,
        suspected: d[0].province_suspectedCount
      };
    }).map(dataState.value || []));
    setByProvince(extracted);
  }, [dataState]);

  const [filter, setFilter] = React.useState<FilterType>("confirmed");

  const fn = useCallback((d: ExtendedFeature) => {
    const fillFn = FILL_FN_MAP[filter];

    const provinceName = d.properties?.name as string;
    let num = 0;
    const data = TryGetDataFromPrefix(byProvince, provinceName);
    if (data) {
      num = PluckDataByFilter(data, filter);
    }
    return fillFn ? fillFn(num) : '#eeeeee';
  }, [byProvince, filter]);

  const handleFilterClicked = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, filter: FilterType) => {
    e.preventDefault();
    setFilter(filter);
  };

  const [data, setData] = React.useState<IRegionData>({
    confirmed: 0,
    cured: 0,
    death: 0,
    suspected: 0
  });

  React.useEffect(() => {
    if (province) {
      const data = TryGetDataFromPrefix(byProvince, province);
      if (data) {
        setData(data);
      }
    } else {
      const total = byProvince.entries().reduce((acc, item) => {
        const {value} = item;
        return {
          confirmed: acc.confirmed + value.confirmed,
          cured: acc.cured + value.cured,
          death: acc.death + value.death,
          suspected: acc.suspected + value.suspected
        }
      }, {
        confirmed: 0,
        cured: 0,
        death: 0,
        suspected: 0
      });
      setData(total);
    }

  }, [province, byProvince]);

  return <Container>
    <Grid container>
      <Grid item md={4} xs={12}>
        <DisplayBoard onClick={handleFilterClicked} name={name} data={data} />
      </Grid>
      <Grid item md={8} xs={12}>
        <svg width={1000} height={1000} className="container">
          {state.loading && dataState.loading ? "loading" : <GraphRenderer
            moveOverRegionPanel={moveOverRegionPanel}
            geoGenerator={geoGenerator}
            features={state.value?.features!}
            fillFn={fn}
            setProvince={setProvince} />}
        </svg>
      </Grid>
    </Grid>
  </Container>
}
const NationTabVisualizer = withStyles(styles)(_NationTabVisualizer);
export default NationTabVisualizer;
