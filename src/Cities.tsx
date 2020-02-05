import React, { useRef, useEffect } from 'react';
import { RouteComponentProps } from "@reach/router";
import { useIntl, defineMessages } from "react-intl";
import { useTitle, useEffectOnce, useUpdateEffect } from "react-use";
import * as d3 from "d3";
import { Selection, ExtendedFeature } from 'd3';

interface ICitiesProps<FeatureType extends ExtendedFeature = ExtendedFeature> {
  features: FeatureType[];
  geoGenerator: d3.GeoPath<any, d3.GeoPermissibleObjects>;
  setCity: React.Dispatch<React.SetStateAction<string | null>>;
  setProvince: React.Dispatch<React.SetStateAction<string | null>>;
};

const messages = defineMessages({
});

const Cities: React.FunctionComponent<ICitiesProps> = ({features, geoGenerator, setProvince, setCity}) => {
  const ref = useRef<SVGGElement>(null);
  console.log(features);

  const renderGraph = () => {
    if (!features) { return; }
    const u = d3.select(ref.current)
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
    
    u.exit().remove();
  }
  useEffect(renderGraph);

  function onMouseOver(d: ExtendedFeature) {
    console.log("over", d?.properties?.name);
  }

  function onMouseClick(d: ExtendedFeature) {
    console.log("click", d);
  }

  function onMouseOut(d: ExtendedFeature) {
    console.log("out", d);
  }

  return <g ref={ref}/>
}

export default Cities;
