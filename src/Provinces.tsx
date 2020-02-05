import React, { useRef, useEffect } from 'react';
import { RouteComponentProps } from "@reach/router";
import { useIntl, defineMessages } from "react-intl";
import { useTitle, useEffectOnce, useAsync, useUpdateEffect } from "react-use";
import * as d3 from "d3";
import { ExtendedFeature, ExtendedFeatureCollection, ValueFn } from 'd3';
import Cities from './Cities';
import { AsyncState } from 'react-use/lib/useAsync';

interface IProvincesProps<FeatureType extends ExtendedFeature = ExtendedFeature> {
  features: FeatureType[];
  data?: d3.DSVRowArray<string>;
  geoGenerator: d3.GeoPath<any, d3.GeoPermissibleObjects>;
  setProvince: React.Dispatch<React.SetStateAction<string | null>>;
  moveOverRegionPanel: (d: ExtendedFeature) => void; 
};

const messages = defineMessages({
});

const Provinces: React.FunctionComponent<IProvincesProps> = ({features, data, geoGenerator, setProvince, moveOverRegionPanel}) => {
  const ref = useRef<SVGGElement>(null);

  // formula: (cut, dProp) => +data[cut].conNum,
  // dataDefault: +raw.data.gntotal,
  console.log("province", data);
  const fillFn =  d3.scalePow()
    .interpolate(() => d3.interpolateViridis)
    .exponent(0.3)
    .domain([0, 1500]);
  
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
      .attr('fill', fillFn(100))
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
