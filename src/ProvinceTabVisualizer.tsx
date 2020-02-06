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
import { IRegionData, AreaCsvItem, FilterType, FILL_FN_MAP, PROVINCE_META_MAP } from './models';
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

interface IProvinceTabVisualizer extends WithStyles<typeof styles> {
  dataState: AsyncState<d3.DSVParsedArray<AreaCsvItem>>;
  state: AsyncState<ExtendedFeatureCollection>;
  params: URLSearchParams;
  filter: FilterType;
  setFilter: (value: FilterType) => void;
};


function PluckDataByFilter(data: IRegionData, filter: FilterType) {
  return data[filter] || 0;
}

function TryGetDataFromPrefix(byMapped: d3.Map<IRegionData>, prefix: string) {
  const keys = byMapped.keys();
  const idx = keys.findIndex(p => p.startsWith(prefix));
  if (idx !== -1) {
    const data = byMapped.get(keys[idx]);
    return data;
  }
  return undefined;
}
const _ProvinceTabVisualizer: React.FunctionComponent<IProvinceTabVisualizer> = ({ filter, setFilter, params, dataState, state }) => {
  const intl = useIntl();


    // geoGenerator: d3.GeoPath<any, d3.GeoPermissibleObjects>;
  const geoGenerator = d3.geoPath();
  const [province, setProvince] = React.useState<string | null>(params.get("province"));
  if (province !== null && Object.keys(PROVINCE_META_MAP).indexOf(province) !== -1) {
    geoGenerator.projection(PROVINCE_META_MAP[province].projection);
  };
  const [city, setCity] = React.useState<string | null>(null);
  const [byProvince, setByProvince] = React.useState<d3.Map<IRegionData>>(d3.map<IRegionData>({}));
  const [byCity, setByCity] = React.useState<d3.Map<IRegionData>>(d3.map<IRegionData>({}));
  useEffect(() => {
    const extracted = (d3.nest<AreaCsvItem, IRegionData>().key(d => d.cityName).rollup(d => {
      // asserts d.length > 0
      return {
        confirmed: d[0].city_confirmedCount,
        discharged: d[0].city_curedCount,
        deceased: d[0].city_deadCount,
        suspected: d[0].city_suspectedCount
      };
    }).map(dataState.value?.filter(f => f.provinceName.startsWith(province || "")) || []));
    setByCity(extracted);
  }, [dataState, province]);

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
    if (city) {
      // TODO: looks more cleansing to do
      const data = TryGetDataFromPrefix(byCity, city.replace('市', ''));
      console.log(city, byCity, city, data);
      if (data) {
        setData(data);
      }
    } else {
      const total = byCity.entries().reduce((acc, item) => {
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

  }, [city, byCity]);

  const [pinned, setPinned] = React.useState<boolean>(false);

  const onMouseOver = React.useCallback(function (this: SVGPathElement, d: ExtendedFeature) {
    d3.selectAll(".region-item")
      .transition()
      .duration(200)
      .style("opacity", 0.5);
    d3.select<SVGPathElement, ExtendedFeature>(this)
      .transition()
      .duration(200)
      .style("opacity", 1)
      .style("stroke", "black");
    if (pinned) { return; }
    const name = d?.properties?.name;
    if (name) {
      setCity(name);
    }
  }, [pinned]);

  function onMouseClick(d: ExtendedFeature) {
    setPinned(true);

    const name = d?.properties?.name;
    if (name) {
      setCity(name);
    }
    // moveOverRegionPanel(d);
  }

  const onMouseOut = React.useCallback((d: ExtendedFeature) => {
    if (pinned) { return; }

    setCity(null);
  }, [pinned]);

  const eventHandlers: Array<[string, (feature: ExtendedFeature) => void]> = [
    ["mouseover", onMouseOver],
    ["click", onMouseClick],
    ["mouseout", onMouseOut]
  ];

  return <Container>
    <Grid container>
      <Grid item md={4} xs={12}>
        <DisplayBoard onClick={handleFilterClicked} name={city === null ? province || "" : `${province} / ${city}`} data={data} />
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

const ProvinceTabVisualizer = withStyles(styles)(_ProvinceTabVisualizer);
export default ProvinceTabVisualizer;
