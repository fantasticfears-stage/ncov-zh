import React, { useRef, useEffect } from 'react';
import * as d3 from "d3";
import { ExtendedFeature } from 'd3';

interface IGraphRendererProps<FeatureType extends ExtendedFeature = ExtendedFeature> {
  features: FeatureType[];
  fillFn: (d: d3.ExtendedFeature) => string;
  geoGenerator: d3.GeoPath<any, d3.GeoPermissibleObjects>;
  eventHandlers: Array<[string, (feature: ExtendedFeature) => void]>;
};

const GraphRenderer: React.FunctionComponent<IGraphRendererProps> = ({features, fillFn, geoGenerator, eventHandlers}) => {
  const ref = useRef<SVGGElement>(null);

  const renderGraph = () => {
    d3.selectAll("g > *").remove(); // TODO: seems we have to remove the nodes before repainting

    if (!ref.current) { return; }
    
    const u = d3.select(ref.current)
      .selectAll('path')
      .data(features);
    
    // u.enter is not available, I'm not sure about the type about u at that time.
    if (!u || !u.enter) { return; }
  
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
