import React from 'react';
import { RouteComponentProps } from "@reach/router";
import { useIntl, defineMessages } from "react-intl";
import { useTitle } from "react-use";

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

  return <div>geo</div>;
}

export default GeoVisualizer;
