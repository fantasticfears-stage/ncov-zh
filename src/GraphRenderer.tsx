import React, { useRef, useEffect, useCallback } from 'react';
import { RouteComponentProps } from "@reach/router";
import { useIntl, defineMessages } from "react-intl";
import { useTitle, useEffectOnce, useAsync, useUpdateEffect } from "react-use";
import * as d3 from "d3";
import { ExtendedFeature, ExtendedFeatureCollection, ValueFn, Area } from 'd3';
import { GeoJsonProperties } from 'geojson';
import { AsyncState } from 'react-use/lib/useAsync';
import { AreaCsvItem, IRegionData } from './models';
import { stringify } from 'querystring';

interface IGraphRendererProps<FeatureType extends ExtendedFeature = ExtendedFeature> {
  features: FeatureType[];
  fillFn: (d: d3.ExtendedFeature) => string;
  geoGenerator: d3.GeoPath<any, d3.GeoPermissibleObjects>;
  eventHandlers: Array<[string, (feature: ExtendedFeature) => void]>;
};


const messages = defineMessages({
});

const GraphRenderer: React.FunctionComponent<IGraphRendererProps> = ({features, fillFn, geoGenerator, eventHandlers}) => {
  const ref = useRef<SVGGElement>(null);

  const renderGraph = () => {
    d3.selectAll("g > *").remove(); // TODO: seems we have to remove the nodes before repainting

    const u = d3.select(ref.current)
      .selectAll('path')
      .data(features);
    
    if (!u) { return; }
  
    const p = u.enter()
      .append('path')
      .attr('d', geoGenerator)
      .attr("class", "region-item")
      .attr('stroke-width', 1)
      .attr('stroke', "#ffffff")
      .attr('fill', fillFn);
    
    
    eventHandlers.forEach(([typenames, listener]) => {
      p.on(typenames, listener);
    });

    u.exit().remove();
  };
  useEffect(renderGraph, [fillFn, eventHandlers]);

  return <g ref={ref}></g>
}

export default GraphRenderer;
