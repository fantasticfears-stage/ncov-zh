import React, { useRef, useEffect } from 'react';
import { RouteComponentProps } from "@reach/router";
import { useIntl, defineMessages } from "react-intl";
import { useTitle, useEffectOnce, useAsync } from "react-use";
import * as d3 from "d3";
import { Selection, ExtendedFeature } from 'd3';

interface ICitiesProps<FeatureType extends ExtendedFeature = ExtendedFeature> {
  context: Selection<SVGSVGElement | null, any, null, undefined>;
  features: FeatureType[];
  geoGenerator: d3.GeoPath<any, d3.GeoPermissibleObjects>;
  setCity: React.Dispatch<React.SetStateAction<string>>;
  setProvince: React.Dispatch<React.SetStateAction<string | null>>;
};

const messages = defineMessages({
});

const Cities: React.FunctionComponent<ICitiesProps> = ({context, features, geoGenerator, setProvince, setCity}) => {
  const ref = useRef<SVGPathElement>(null);
  console.log(features);

  useEffectOnce(() => {
    const u = context
      .selectAll("g#a")
      .selectAll('path')
      .data(features);
  
    u.enter()
      .append('path')
      .attr('d', geoGenerator)
      .attr('stroke-width', 1)
      .attr('stroke', "#ffffff")
      .on("mouseover", onMouseOver)
      .on("click", onMouseClick)
      .on("mouseout", onMouseOut);
  });

  function onMouseOver(d: ExtendedFeature) {
    console.log("over", d?.properties?.name);
  }

  function onMouseClick(d: ExtendedFeature) {
    console.log("click", d);
  }

  function onMouseOut(d: ExtendedFeature) {
    console.log("out", d);
  }

  return <g id="a"/>
}

export default Cities;
