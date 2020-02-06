import React, { useRef, useEffect, useCallback } from 'react';
import { RouteComponentProps } from "@reach/router";
import { useIntl, defineMessages } from "react-intl";
import { useTitle, useEffectOnce, useAsync, useUpdateEffect } from "react-use";
import * as d3 from "d3";
import { ExtendedFeature, ExtendedFeatureCollection, ValueFn, Area } from 'd3';
import Cities from './Cities';
import { AsyncState } from 'react-use/lib/useAsync';
import { AreaCsvItem, IRegionData } from './models';
import { stringify } from 'querystring';

interface IGraphRendererProps<FeatureType extends ExtendedFeature = ExtendedFeature> {
  features: FeatureType[];
  fillFn: (d: d3.ExtendedFeature) => string;
  geoGenerator: d3.GeoPath<any, d3.GeoPermissibleObjects>;
  setProvince: React.Dispatch<React.SetStateAction<string | null>>;
  moveOverRegionPanel: (d: ExtendedFeature) => void; 
};


const messages = defineMessages({
});

const GraphRenderer: React.FunctionComponent<IGraphRendererProps> = ({features, fillFn, geoGenerator, setProvince, moveOverRegionPanel}) => {
  const ref = useRef<SVGGElement>(null);

  const renderGraph = () => {
    d3.selectAll("g > *").remove(); // TODO: seems we have to remove the nodes before repainting

    const u = d3.select(ref.current)
      .selectAll('path')
      .data(features);
  
    u.enter()
      .append('path')
      .attr('d', geoGenerator)
      .attr('stroke-width', 1)
      .attr('stroke', "#ffffff")
      .attr('fill', fillFn)
      .on("mouseover", onMouseOver)
      .on("click", onMouseClick)
      .on("mouseout", onMouseOut);
    
      u.exit().remove();
  };
  useEffect(renderGraph, [fillFn]);

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

export default GraphRenderer;
