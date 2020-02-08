import React, { useEffect, useCallback } from 'react';
import { WithStyles } from "@material-ui/styles/withStyles";
import createStyles from "@material-ui/styles/createStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles from "@material-ui/core/styles/withStyles";
import { useIntl, defineMessages } from "react-intl";
import { useTitle, useAsync } from "react-use";
import * as d3 from "d3";
import DisplayBoard from './DisplayBoard';
import { IRegionData, AreaCsvItem, FilterType, FILL_FN_MAP, PROVINCE_META_MAP, FILTER_MESSAGES, EMPTY_REGION_DATA } from './models';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import GraphRenderer from './GraphRenderer';
import { AsyncState } from 'react-use/lib/useAsyncFn';
import { ExtendedFeatureCollection, ExtendedFeature } from 'd3';
import { useMeasures } from './helpers/useMeasures';

const styles = ({ spacing, transitions }: Theme) => createStyles({
});

interface IProvinceTabVisualizer extends WithStyles<typeof styles> {
  state: AsyncState<ExtendedFeatureCollection>;
  params: URLSearchParams;
  filter: FilterType;
  setFilter: (value: FilterType) => void;
  selectedDate: Date;
  handleDateChange: (date: Date) => void;
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

const messages = defineMessages({
  filters: FILTER_MESSAGES,
  title: {
    id: "geovisualizer.title",
    description: "title for geovisualizer",
    defaultMessage: "{region}地区 - {filter}"
  },
});

const _ProvinceTabVisualizer: React.FunctionComponent<IProvinceTabVisualizer> = ({ filter, setFilter, params, state, selectedDate, handleDateChange }) => {
  const intl = useIntl();

  const geoGenerator = d3.geoPath();
  const [province] = React.useState<string | null>(params.get("province"));
  if (province !== null && Object.keys(PROVINCE_META_MAP).indexOf(province) !== -1) {
    geoGenerator.projection(PROVINCE_META_MAP[province].projection);
  };
  const [city, setCity] = React.useState<string | null>(null);
  const [byCity, setByCity] = React.useState<d3.Map<IRegionData>>(d3.map<IRegionData>({}));
  const name = city === null ? province || "" : `${province} / ${city}`;
  useTitle(intl.formatMessage(messages.title, { region: name, filter: intl.formatMessage(messages.filters[filter]) }));

  const dataState = useAsync<d3.DSVParsedArray<AreaCsvItem>>(async () => {
    if (!province) { return new Promise(resolve => {  }); }

    return d3.csv(`/data/provinces/${PROVINCE_META_MAP[province].filenamePrefix}.csv`, (d) => {
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

  useEffect(() => {
    const data = dataState?.value;
    if (!data) { return; }
    const byDate = data.reduce((h: Record<string, AreaCsvItem[]>, obj: AreaCsvItem) => Object.assign(h, { [obj.updatedAtDate]: ( h[obj.updatedAtDate] || [] ).concat(obj) }), {})

    let chosenDate = selectedDate.toISOString().substr(0, 10);
    if (!byDate[chosenDate]) {
      chosenDate = Object.keys(byDate)[0];
      handleDateChange(new Date(chosenDate));
    } else {
      console.log("error date");
    }
    const extracted = byDate[chosenDate];
    const byCity = d3.nest<AreaCsvItem, IRegionData>().key(d => d.name).rollup(d => d[0]).map(extracted);
    setByCity(byCity);
  }, [dataState, selectedDate, handleDateChange]);

  const fn = useCallback((d: ExtendedFeature) => {
    const fillFn = FILL_FN_MAP[filter];

    const provinceName = d.properties?.name as string;
    let num = 0;
    const data = TryGetDataFromPrefix(byCity, provinceName);
    if (data) {
      num = PluckDataByFilter(data, filter);
    }
    return fillFn ? fillFn(num) : '#eeeeee';
  }, [byCity, filter]);

  const handleFilterClicked = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, filter: FilterType) => {
    e.preventDefault();
    setFilter(filter);
  };

  const [data, setData] = React.useState<IRegionData>(EMPTY_REGION_DATA);

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
      }, EMPTY_REGION_DATA);
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

  const [containerRef, measureRef, dimension] = useMeasures(geoGenerator, state.value!);

  return <Container ref={containerRef}>
    <Grid container>
      <Grid item md={4} xs={12}>
        <DisplayBoard
          filter={filter}
          onClick={handleFilterClicked}
          name={name}
          data={data}
          selectedDate={selectedDate}
          handleDateChange={handleDateChange}
        />
      </Grid>
      <Grid item md={8} xs={12} ref={measureRef}>
        <svg width={dimension.width} height={dimension.height} className="container">
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
