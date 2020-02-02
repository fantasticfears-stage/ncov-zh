import React, { useRef, useEffect } from 'react';
import { RouteComponentProps } from "@reach/router";
import { useIntl, defineMessages } from "react-intl";
import { useTitle, useEffectOnce, useAsync } from "react-use";
import * as d3 from "d3";
import { ExtendedFeatureCollection, ExtendedGeometryCollection } from 'd3';
import Provinces from "./Provinces";

interface IGeoVisualizerRoutes {

}

interface IGeoVisualizerProps extends RouteComponentProps<IGeoVisualizerRoutes> {

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
    }
  }
});

const GeoVisualizer: React.FunctionComponent<IGeoVisualizerProps> = () => {
  const intl = useIntl();
  const region = intl.formatMessage(messages.filters.nation);
  useTitle(intl.formatMessage(messages.title, { region: region }));

  const state = useAsync<ExtendedFeatureCollection>(async () => {
    return d3.json("data/china.json");
  });

  return (
    <div className="container">
      {state.loading ? "loading" : <Provinces features={state?.value?.features} />}
    </div>
  );
}

export default GeoVisualizer;
