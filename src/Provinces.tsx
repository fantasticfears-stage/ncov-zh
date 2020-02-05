import React, { useRef, useEffect } from 'react';
import { RouteComponentProps } from "@reach/router";
import { useIntl, defineMessages } from "react-intl";
import { useTitle, useEffectOnce, useAsync, useUpdateEffect } from "react-use";
import * as d3 from "d3";
import { Selection, ExtendedGeometryCollection, ExtendedFeature, ExtendedFeatureCollection } from 'd3';
import Cities from './Cities';

interface IProvincesProps<FeatureType extends ExtendedFeature = ExtendedFeature> {
  features: FeatureType[];
  geoGenerator: d3.GeoPath<any, d3.GeoPermissibleObjects>;
  setProvince: React.Dispatch<React.SetStateAction<string | null>>;
  moveOverRegionPanel: (d: ExtendedFeature) => void; 
};

const messages = defineMessages({
});

const Provinces: React.FunctionComponent<IProvincesProps> = ({features, geoGenerator, setProvince, moveOverRegionPanel}) => {
  const ref = useRef<SVGGElement>(null);

  console.log("province");
  const renderGraph = () => {
  
    const u = d3.select(ref.current)
      .selectAll('path')
      .data(features);
    console.log(features);

  
    u.enter()
      .append('path')
      .attr('d', geoGenerator)
      .attr('stroke-width', 1)
      .attr('stroke', "#ffffff")
      .on("mouseover", onMouseOver)
      .on("click", onMouseClick)
      .on("mouseout", onMouseOut);
    
      u.exit().remove();
  };
  useEffect(renderGraph);

  function onMouseOver(d: ExtendedFeature) {
    const name = d?.properties?.name;
    if (name) {
      setProvince(name);
    }
  }

  function onMouseClick(d: ExtendedFeature) {
    moveOverRegionPanel(d);
  }

  function onMouseOut(d: ExtendedFeature) {
    setProvince(null);
  }

  return <g ref={ref}></g>
}

export default Provinces;
