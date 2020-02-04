import React, { useRef, useEffect } from 'react';
import { RouteComponentProps } from "@reach/router";
import { useIntl, defineMessages } from "react-intl";
import { useTitle, useEffectOnce, useAsync } from "react-use";
import * as d3 from "d3";
import { Selection, ExtendedGeometryCollection, ExtendedFeature, ExtendedFeatureCollection } from 'd3';
import Cities from './Cities';

interface IProvincesProps<FeatureType extends ExtendedFeature = ExtendedFeature> {
  context: Selection<SVGSVGElement | null, any, null, undefined>;
  features: FeatureType[];
  geoGenerator: d3.GeoPath<any, d3.GeoPermissibleObjects>;
  setProvince: React.Dispatch<React.SetStateAction<string>>;
};

const messages = defineMessages({
});

const Provinces: React.FunctionComponent<IProvincesProps> = ({context, features, geoGenerator, setProvince}) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffectOnce(() => {
  
    const u = context
      .select("g")
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
    const name = d?.properties?.name;
    if (name) {
      setProvince(name);
    }
  }

  function onMouseClick(d: ExtendedFeature) {
    console.log("click", d);
  }

  function onMouseOut(d: ExtendedFeature) {
    setProvince("");
  }

  return <g>
  </g>
}

export default Provinces;
