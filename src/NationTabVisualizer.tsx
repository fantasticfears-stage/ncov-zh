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
import { IRegionData, AreaCsvItem, FilterType, FILL_FN_MAP } from './models';
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

interface INationTabVisualizer extends WithStyles<typeof styles> {
  params: URLSearchParams;
  state: AsyncState<ExtendedFeatureCollection>;
  dataState: AsyncState<d3.DSVParsedArray<AreaCsvItem>>;
  moveOverRegionPanel: (d: ExtendedFeature) => void;
  filter: FilterType;
  setFilter: (value: FilterType) => void;
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

const _NationTabVisualizer: React.FunctionComponent<INationTabVisualizer> = ({ filter, setFilter, dataState, state, moveOverRegionPanel }) => {
  const intl = useIntl();

  const projection = d3.geoConicEqualArea();
  projection
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(800)
    .center([10.1, 140.6]);

    // geoGenerator: d3.GeoPath<any, d3.GeoPermissibleObjects>;
  const geoGenerator = d3.geoPath()
    .projection(projection);

  const [province, setProvince] = React.useState<string | null>(null);
  const name = province || intl.formatMessage(messages.filters.nation);
  const [byProvince, setByProvince] = React.useState<d3.Map<IRegionData>>(d3.map<IRegionData>({}));
  useEffect(() => {
    const data: AreaCsvItem[] = dataState.value || [];
    const ts = data.map(d => d.updateTime.toISOString().substr(0, 10));
    const timestampSet = new Set<string>(ts);
    const timestamps = Array.from(timestampSet).sort();
    
    // const dates = (dataState.value || []).map<AreaCsvItem>(i => i.updateTime)
    // const lastDay = 
    const extracted = (d3.nest<AreaCsvItem, IRegionData>().key(d => d.provinceName).rollup(d => {
      // asserts d.length > 0
      return {
        confirmed: d[0].province_confirmedCount,
        discharged: d[0].province_curedCount,
        deceased: d[0].province_deadCount,
        suspected: d[0].province_suspectedCount
      };
    }).map(data.filter(d => d.updateTime.toISOString().substr(0, 10) === timestamps[timestamps.length - 1])));
    setByProvince(extracted);
  }, [dataState]);

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
    discharged: 0,
    deceased: 0,
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
          discharged: acc.discharged + value.discharged,
          deceased: acc.deceased + value.deceased,
          suspected: acc.suspected + value.suspected
        }
      }, {
        confirmed: 0,
        discharged: 0,
        deceased: 0,
        suspected: 0
      });
      setData(total);
    }

  }, [province, byProvince]);

  const [pinned, setPinned] = React.useState<boolean>(false);

  const onMouseOver = React.useCallback((d: ExtendedFeature) => {
    if (pinned) { return; }
    const name = d?.properties?.name;
    if (name) {
      setProvince(name);
    }
  }, [pinned]);

  function onMouseClick(d: ExtendedFeature) {
    setPinned(true);

    const name = d?.properties?.name;
    if (name) {
      setProvince(name);
    }
    moveOverRegionPanel(d);
  }

  const onMouseOut = React.useCallback((d: ExtendedFeature) => {
    if (pinned) { return; }

    setProvince(null);
  }, [pinned]);

  const eventHandlers: Array<[string, (feature: ExtendedFeature) => void]> = [
    ["mouseover", onMouseOver],
    ["click", onMouseClick],
    ["mouseout", onMouseOut]
  ];

  return <Container>
    <Grid container>
      <Grid item md={4} xs={12}>
        <DisplayBoard onClick={handleFilterClicked} name={name} data={data} />
      </Grid>
      <Grid item md={8} xs={12}>
        <svg width={700} height={600} className="container">
          {state.loading && dataState.loading ? "loading" : <GraphRenderer
            geoGenerator={geoGenerator}
            features={state.value?.features!}
            fillFn={fn}
            eventHandlers={eventHandlers} />}
        </svg>
      </Grid>
    </Grid>
  </Container>;
}
const NationTabVisualizer = withStyles(styles)(_NationTabVisualizer);
export default NationTabVisualizer;
