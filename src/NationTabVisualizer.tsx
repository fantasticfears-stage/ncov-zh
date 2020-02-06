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
  name: string;
  data: IRegionData;
  state: AsyncState<ExtendedFeatureCollection>;
  dataState: AsyncState<d3.DSVParsedArray<AreaCsvItem>>;
  geoGenerator: d3.GeoPath<any, d3.GeoPermissibleObjects>;
  setProvince: React.Dispatch<React.SetStateAction<string | null>>;
  moveOverRegionPanel: (d: ExtendedFeature) => void;
};

function PluckDataByFilter(data: IRegionData, filter: FilterType) {
  return data[filter] || 0;
}

const _NationTabVisualizer: React.FunctionComponent<INationTabVisualizer> = ({ name, data, dataState, state, geoGenerator, moveOverRegionPanel, setProvince }) => {
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
    const keys = byProvince.keys();
    const idx = keys.findIndex(p => p.startsWith(provinceName));
    let num = 0;
    if (idx !== -1) {
      const data = byProvince.get(keys[idx]);
      if (data) {
        num = PluckDataByFilter(data, filter);
      }
    }
    return fillFn ? fillFn(num) : '#eeeeee';
  }, [byProvince, filter]);

  const handleFilterClicked = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, filter: FilterType) => {
    e.preventDefault();
    setFilter(filter);
  };

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
