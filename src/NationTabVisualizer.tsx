import React, { useEffect, useCallback } from 'react';
import { WithStyles } from "@material-ui/styles/withStyles";
import createStyles from "@material-ui/styles/createStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles from "@material-ui/core/styles/withStyles";
import { useIntl, defineMessages } from "react-intl";
import { useTitle } from "react-use";
import * as d3 from "d3";
import DisplayBoard from './DisplayBoard';
import { NOT_MOBILE_ACCEPT_PROVINCE, NOT_MOBILE_REJECT_PROVINCE, MOBILE_DISPLAY_PROVINCE, TextLabelDisplayLevel, IRegionData, AreaCsvItem, FilterType, FILL_FN_MAP, FILTER_MESSAGES, EMPTY_REGION_DATA, MOBILE_WIDTH_BREAKPOINT } from './models';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import GraphRenderer from './GraphRenderer';
import { AsyncState } from 'react-use/lib/useAsyncFn';
import { ExtendedFeatureCollection, ExtendedFeature } from 'd3';
import { useMeasures } from './helpers/useMeasures';
import isMobile from "./helpers/isMobile";

const styles = ({ spacing, transitions }: Theme) => createStyles({
});

interface INationTabVisualizer extends WithStyles<typeof styles> {
  params: URLSearchParams;
  state: AsyncState<ExtendedFeatureCollection>;
  dataState: AsyncState<d3.DSVParsedArray<AreaCsvItem>>;
  moveOverRegionPanel: (name: string) => void;
  filter: FilterType;
  setFilter: (value: FilterType) => void;
  selectedDate: Date;
  handleDateChange: (date: Date) => void;
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
  filters: FILTER_MESSAGES,
  title: {
    id: "geovisualizer.title",
    description: "title for geovisualizer",
    defaultMessage: "{region}地区 - {filter}"
  },
  nation: {
    id: "geovisualizer.nation",
    description: "default (nation) filter for region",
    defaultMessage: "全国"
  }
});

interface IHoverItem {
  duration: Date;
  feature: ExtendedFeature;
}

const _NationTabVisualizer: React.FunctionComponent<INationTabVisualizer> = ({ params, selectedDate, handleDateChange, filter, setFilter, dataState, state, moveOverRegionPanel }) => {
  const intl = useIntl();

  const geoGenerator = d3.geoPath();
  const [containerRef, measureRef, dimension] = useMeasures(geoGenerator, state.value!);

  const projection = d3.geoConicEqualArea();
  projection
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(dimension.width > MOBILE_WIDTH_BREAKPOINT ? 800 : 450)
    .center(dimension.width > MOBILE_WIDTH_BREAKPOINT ? [10.1, 140.6] : [39, 160]);

  geoGenerator.projection(projection);

  const [province, setProvince] = React.useState<string | null>(null);
  const name = province || intl.formatMessage(messages.nation);
  useTitle(intl.formatMessage(messages.title, { region: name, filter: intl.formatMessage(messages.filters[filter]) }));

  const [byProvince, setByProvince] = React.useState<d3.Map<IRegionData>>(d3.map<IRegionData>({}));

  useEffect(() => {
    const data = dataState.value;
    if (!data) { return; }
    const byDate = data.reduce((h: Record<string, AreaCsvItem[]>, obj: AreaCsvItem) => Object.assign(h, { [obj.updatedAtDate]: (h[obj.updatedAtDate] || []).concat(obj) }), {})

    let chosenDate = selectedDate.toISOString().substr(0, 10);
    const extracted = byDate[chosenDate];
    if (!extracted) {
      const newDate = Object.keys(byDate)[0];
      console.log(`error date ${chosenDate}, switching to ${newDate}`);
      handleDateChange(new Date(newDate));
      return;
    }
    const byProvince = d3.nest<AreaCsvItem, IRegionData>().key(d => d.name).rollup(d => d[0]).map(extracted);
    setByProvince(byProvince);
  }, [dataState, selectedDate, handleDateChange]);

  const fn = useCallback((d: ExtendedFeature) => {
    const values = byProvince.values().map(d => d[filter]);
    const domain = [d3.min(values) || 0, d3.max(values) || 1000];

    const fillFn = FILL_FN_MAP[filter]
      .domain(domain);
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

  const [data, setData] = React.useState<IRegionData | null>(null);

  React.useEffect(() => {
    if (province) {
      const data = TryGetDataFromPrefix(byProvince, province);
      if (data) {
        setData(data);
      }
    } else {
      if (byProvince.size() === 0) {
        return;
      }
      const total = byProvince.entries().reduce((acc, item) => {
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

  }, [province, byProvince]);

  const [pinned, setPinned] = React.useState<boolean>(false);
  const [hovered, setHovered] = React.useState<IHoverItem | null>(null);

  const onItemOver = React.useCallback((ele: SVGPathElement, d: ExtendedFeature) => {
    d3.selectAll(".region-item")
      .transition()
      .duration(300)
      .style("opacity", 0.5);
    d3.select<SVGPathElement, ExtendedFeature>(ele)
      .transition()
      .duration(300)
      .style("opacity", 1)
      .style("stroke", "black");
    if (pinned) { return; }
    const name = d?.properties?.name;
    if (name) {
      setProvince(name);
    }
  }, [pinned]);

  const onMouseOver = React.useCallback(function (this: SVGPathElement, d: ExtendedFeature) {
    onItemOver(this, d);
  }, [onItemOver]);

  const onMouseClick = React.useCallback((d: ExtendedFeature) => {
    if (hovered?.duration || hovered?.feature?.properties?.name === d?.properties?.name) {
      const now = new Date();
      const diff = now.getTime() - (hovered !== null ? hovered.duration.getTime() : 0);
      console.log("click ", diff);
      if (diff <= 500) {
        return;
      }
    }

    setPinned(true);

    const name = d?.properties?.name;
    if (name) {
      setProvince(name);
      moveOverRegionPanel(name);
    }

    setHovered(null);

  }, [hovered, moveOverRegionPanel]);

  const onMouseOut = React.useCallback((d: ExtendedFeature) => {
    if (pinned) { return; }

    setProvince(null);
  }, [pinned]);

  const eventHandlers: Array<[string, (feature: ExtendedFeature) => void]> = [
    ["mouseover", onMouseOver],
    ["click", onMouseClick],
    ["mouseout", onMouseOut]
  ];

  const redirectionHint = () => {
    if (province) {
      moveOverRegionPanel(province);
    }
  }
  
  const isMobileDevice = isMobile();
  const [textLabelLevel, setTextLabelLevel] = React.useState<number>(TextLabelDisplayLevel.Auto);
  const showTextLabel = React.useCallback((label: string) => {
    if (textLabelLevel <= 0) { return false; }
    else if (textLabelLevel > 10) { return true; }
    
    if (isMobileDevice) {
      return MOBILE_DISPLAY_PROVINCE.indexOf(label) !== -1;
    } else {
      return (label.length <= 4 && NOT_MOBILE_REJECT_PROVINCE.indexOf(label) === -1) || NOT_MOBILE_ACCEPT_PROVINCE.indexOf(label) !== -1;
    }
  }, [textLabelLevel, isMobileDevice]);

  return <Container ref={containerRef}>
    <Grid container spacing={3}>
      <Grid item md={4} xs={12}>
        <DisplayBoard
          filter={filter}
          onClick={handleFilterClicked}
          name={name}
          data={data}
          selectedDate={selectedDate}
          handleDateChange={handleDateChange}
          textLabelLevel={textLabelLevel}
          setTextLabelLevel={setTextLabelLevel}
          redirectionHint={province && isMobile() ? redirectionHint : undefined}
        />
      </Grid>
      <Grid item md={8} xs={12}>
        <Paper ref={measureRef}>
          {state.loading || dataState.loading ? <CircularProgress /> :
            <svg width={dimension.width} height={dimension.height} className="container">
              <GraphRenderer
                geoGenerator={geoGenerator}
                features={state.value?.features!}
                showTextLabel={showTextLabel}
                fillFn={fn}
                eventHandlers={eventHandlers} />
            </svg>}
        </Paper>
      </Grid>
    </Grid>
  </Container>;
}
const NationTabVisualizer = withStyles(styles)(_NationTabVisualizer);
export default NationTabVisualizer;
