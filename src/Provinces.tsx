import React, { useRef, useEffect } from 'react';
import { RouteComponentProps } from "@reach/router";
import { useIntl, defineMessages } from "react-intl";
import { useTitle, useEffectOnce, useAsync } from "react-use";
import * as d3 from "d3";
import { ExtendedGeometryCollection, ExtendedFeature } from 'd3';

interface IProvincesProps<FeatureType extends ExtendedFeature = ExtendedFeature> {
  features?: FeatureType[] ;
};

const messages = defineMessages({
});

const Provinces: React.FunctionComponent<IProvincesProps> = (features) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffectOnce(() => {
    const context: any = d3.select(ref.current);

    const projection = d3.geoConicEqualArea();
    projection
      .rotate([-70, 20])
      .scale(800)
      .center([60.1, 125.6]);
    const geoGenerator = d3.geoPath()
      .projection(projection);
  
    const u = context
      .selectAll('path')
      .data(features.features);
  
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

  return <svg width={1000} height={1000} ref={ref}/>
}

export default Provinces;
