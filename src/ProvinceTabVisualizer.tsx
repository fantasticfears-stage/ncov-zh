import React, { useEffect, useCallback } from 'react';
import { WithStyles } from "@material-ui/styles/withStyles";
import createStyles from "@material-ui/styles/createStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles from "@material-ui/core/styles/withStyles";
import { useIntl, defineMessages, FormattedMessage } from "react-intl";
import { useTitle, useAsync } from "react-use";
import * as d3 from "d3";
import DisplayBoard from './DisplayBoard';
import { IRegionData, AreaCsvItem, FilterType, FILL_FN_PROVINCE_MAP, PROVINCE_META_MAP, FILTER_MESSAGES, EMPTY_REGION_DATA, IProvinceMeta } from './models';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import GraphRenderer from './GraphRenderer';
import { AsyncState } from 'react-use/lib/useAsyncFn';
import { ExtendedFeatureCollection, ExtendedFeature } from 'd3';
import { useMeasures } from './helpers/useMeasures';
import { stripRegionNameForKey } from './helpers/sanitizers';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { emphasize } from "@material-ui/core/styles/colorManipulator";

const styles = ({ spacing, palette }: Theme) => createStyles({
  container: {},
  highlightRow: {
    backgroundColor: emphasize(palette.background.default, 0.3)
  }
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
  prefix = stripRegionNameForKey(prefix);
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
  all: {
    id: "provinces.all",
    description: "province display card",
    defaultMessage: '所有地区'
  }
});

function getProvinceMeta(key: string): IProvinceMeta | null {
  if (Object.keys(PROVINCE_META_MAP).indexOf(key) !== -1) {
    return PROVINCE_META_MAP[key];
  }
  return null;
}

const _ProvinceTabVisualizer: React.FunctionComponent<IProvinceTabVisualizer> = ({ classes, filter, setFilter, params, state, selectedDate, handleDateChange }) => {
  const intl = useIntl();

  const geoGenerator = d3.geoPath();
  const [province] = React.useState<string | null>(params.get("province"));
  const provinceKey = stripRegionNameForKey(province);
  const provinceMeta = getProvinceMeta(provinceKey);
  if (provinceMeta === null) {
    throw new Error("似乎出问题了。找不到这个省份。试试退后上一页或者刷新。");
  };
  geoGenerator.projection(provinceMeta.projection);

  const [city, setCity] = React.useState<string | null>(null);
  const [byCity, setByCity] = React.useState<d3.Map<IRegionData>>(d3.map<IRegionData>({}));
  const name = city === null ? province || "" : `${province} / ${city}`;
  useTitle(intl.formatMessage(messages.title, { region: name, filter: intl.formatMessage(messages.filters[filter]) }));

  const dataState = useAsync<d3.DSVParsedArray<AreaCsvItem>>(async () => {
    if (!provinceKey || provinceKey.length === 0) { return new Promise(resolve => { }); }

    return d3.csv(`/data/provinces/${provinceMeta.filenamePrefix}.csv`, (d) => {
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
    const byDate = data.reduce((h: Record<string, AreaCsvItem[]>, obj: AreaCsvItem) => Object.assign(h, { [obj.updatedAtDate]: (h[obj.updatedAtDate] || []).concat(obj) }), {})

    let chosenDate = selectedDate.toISOString().substr(0, 10);
    const extracted = byDate[chosenDate];
    if (!extracted) {
      const newDate = Object.keys(byDate)[0];
      if (!newDate) { return; }
      console.log(`error date ${chosenDate}, switching to ${newDate}`);
      handleDateChange(new Date(newDate));
      return;
    }
    const byCity = d3.nest<AreaCsvItem, IRegionData>().key(d => d.name).rollup(d => d[0]).map(extracted);
    setByCity(byCity);
  }, [dataState, selectedDate, handleDateChange]);

  const fn = useCallback((d: ExtendedFeature) => {
    const values = byCity.values().map(d => d[filter]);
    const domain = [0, d3.max(values) || 60];

    const fillFn = FILL_FN_PROVINCE_MAP[filter]
      .domain(domain);

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

  const [data, setData] = React.useState<IRegionData | null>(null);

  React.useEffect(() => {
    if (city) {
      // TODO: looks more cleansing to do
      const data = TryGetDataFromPrefix(byCity, city.replace('市', ''));
      if (data) {
        setData(data);
      }
    } else {
      if (byCity.size() === 0) {
        return;
      }
      const total = byCity.entries().reduce((acc, item) => {
        const { value } = item;
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
      .duration(300)
      .style("opacity", 0.5);
    d3.select<SVGPathElement, ExtendedFeature>(this)
      .transition()
      .duration(300)
      .style("opacity", 1)
      .style("stroke", "black");
    if (pinned) { return; }
    const name = d?.properties?.name;
    if (name) {
      setCity(name);
    }
  }, [pinned]);

  const onMouseClick = React.useCallback((d: ExtendedFeature) => {

    const name = d?.properties?.name;
    if (name) {
      if (city === name) {
        setPinned(!pinned);
      } else {
        setPinned(true);
      }
      setCity(name);
    }
    // moveOverRegionPanel(d);
  }, [city, pinned]);

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

  return <Container ref={containerRef} className={classes.container}>
    <Grid container spacing={3}>
      <Grid item md={4} xs={12}>
        <DisplayBoard
          filter={filter}
          onClick={handleFilterClicked}
          name={province}
          subName={city || intl.formatMessage(messages.all)}
          data={data}
          selectedDate={selectedDate}
          handleDateChange={handleDateChange}
        />
      </Grid>
      <Grid item md={8} xs={12}>
        <Paper ref={measureRef}>
          {state.loading || dataState.loading ? <CircularProgress /> :
            <svg width={dimension.width} height={dimension.height} className="container">
              <GraphRenderer
                geoGenerator={geoGenerator}
                features={state.value?.features!}
                fillFn={fn}
                eventHandlers={eventHandlers} />
            </svg>}
        </Paper>
      </Grid>
      {!(state.loading || dataState.loading) && <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <FormattedMessage
                    id="geovisualizer.region"
                    description="filter region"
                    defaultMessage="地区"
                  />
                </TableCell>
                <TableCell align="right">{intl.formatMessage(FILTER_MESSAGES.confirmed)}</TableCell>
                <TableCell align="right">{intl.formatMessage(FILTER_MESSAGES.discharged)}</TableCell>
                <TableCell align="right">{intl.formatMessage(FILTER_MESSAGES.deceased)}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {byCity.values().map((row, idx) => { return <TableRow key={idx} className={row.name === stripRegionNameForKey(city) ? classes.highlightRow : undefined}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell align="right">{row.confirmed}</TableCell>
                  <TableCell align="right">{row.discharged}</TableCell>
                  <TableCell align="right">{row.deceased}</TableCell>
                </TableRow> })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>}
    </Grid>
  </Container>;
}

const ProvinceTabVisualizer = withStyles(styles)(_ProvinceTabVisualizer);
export default ProvinceTabVisualizer;
