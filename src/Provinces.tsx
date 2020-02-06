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

interface IProvincesProps<FeatureType extends ExtendedFeature = ExtendedFeature> {
  features: FeatureType[];
  data?: d3.DSVParsedArray<AreaCsvItem>;
  geoGenerator: d3.GeoPath<any, d3.GeoPermissibleObjects>;
  setProvince: React.Dispatch<React.SetStateAction<string | null>>;
  moveOverRegionPanel: (d: ExtendedFeature) => void; 
};


const messages = defineMessages({
});

const Provinces: React.FunctionComponent<IProvincesProps> = ({features, data, geoGenerator, setProvince, moveOverRegionPanel}) => {
  const ref = useRef<SVGGElement>(null);
  
  const fillFn = d3.scalePow()
    .interpolate(() => d3.interpolateViridis)
    .exponent(0.3)
    .domain([0, 1500]);
  
  const renderGraph = () => {
    const byProvince = d3.nest<AreaCsvItem, IRegionData>().key(d => d.provinceName).rollup(d => {
      // asserts d.length > 0
      return {
        confirmed: d[0].province_confirmedCount,
        cured: d[0].province_curedCount,
        death: d[0].province_deadCount,
        suspected: d[0].province_suspectedCount
      };
    }).map(data || []);
    d3.selectAll("g > *").remove(); // TODO: seems we have to remove the nodes before repainting

    const u = d3.select(ref.current)
      .selectAll('path')
      .data(features);
  
    u.enter()
      .append('path')
      .attr('d', geoGenerator)
      .attr('stroke-width', 1)
      .attr('stroke', "#ffffff")
      .attr('fill', (d: ExtendedFeature) => {
        const provinceName = d.properties?.name as string;
        const keys = byProvince.keys();
        const idx = keys.findIndex(p => p.startsWith(provinceName));
        const num = idx === -1 ? 0 : byProvince.get(keys[idx]).cured;
        return fillFn(num);
      })
      .on("mouseover", onMouseOver)
      .on("click", onMouseClick)
      .on("mouseout", onMouseOut);
    
      u.exit().remove();
  };
  useEffect(renderGraph, [data]);

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
