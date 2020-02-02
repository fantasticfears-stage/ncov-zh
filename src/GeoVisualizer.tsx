import React, { useRef, useEffect } from 'react';
import { RouteComponentProps } from "@reach/router";
import { useIntl, defineMessages } from "react-intl";
import { useTitle, useEffectOnce, useAsync } from "react-use";
import * as d3 from "d3";
import { ExtendedFeatureCollection, ExtendedGeometryCollection } from 'd3';
import Provinces from "./Provinces";
import Cities from './Cities';

interface IGeoVisualizerRoutes {

}

interface IGeoVisualizerProps extends RouteComponentProps<IGeoVisualizerRoutes> {

};

const messages = defineMessages({
  title: {
    id: "geovisualizer.title",
    description: "title for geovisualizer",
    defaultMessage: "{region}地区"
  },
  filters: {
    nation: {
      id: "geovisualizer.filters.nation",
      description: "default (nation) filter for region",
      defaultMessage: "全国"
    }
  }
});

const GEO_MAP = {
  '安徽': 'an_hui_geo',
  '澳门': 'ao_men_geo',
  '北京': 'bei_jing_geo',
  '重庆': 'chong_qing_geo',
  '福建': 'fu_jian_geo',
  '甘肃': 'gan_su_geo',
  '广东': 'guang_dong_geo',
  '广西': 'guang_xi_geo',
  '贵州': 'gui_zhou_geo',
  '海南': 'hai_nan_geo',
  '河北': 'he_bei_geo',
  '河南': 'he_nan_geo',
  '黑龙江': 'hei_long_jiang_geo',
  '湖北': 'hu_bei_geo',
  '湖南': 'hu_nan_geo',
  '吉林': 'ji_lin_geo',
  '江苏': 'jiang_su_geo',
  '江西': 'jiang_xi_geo',
  '辽宁': 'liao_ning_geo',
}

const GeoVisualizer: React.FunctionComponent<IGeoVisualizerProps> = () => {
  const intl = useIntl();
  const region = intl.formatMessage(messages.filters.nation);
  useTitle(intl.formatMessage(messages.title, { region: region }));

  const state = useAsync<ExtendedFeatureCollection>(async () => {
    return d3.json("data/china.json");
  });
  const ref = useRef<SVGSVGElement>(null);

  const stateProvince = useAsync<ExtendedFeatureCollection>(async () => {
    return d3.json("data/province/an_hui_geo.json");
  });

  const projection = d3.geoConicEqualArea();
  projection
    .rotate([-70, 20])
    .scale(800)
    .center([60.1, 125.6]);
  const geoGenerator = d3.geoPath()
    .projection(projection);

  return (
    <svg width={1000} height={1000} className="container" ref={ref}>
      {state.loading ? "loading" : <Provinces geoGenerator={geoGenerator} context={d3.select(ref.current)} features={state?.value?.features!} />}
      {!stateProvince.loading && <Cities geoGenerator={geoGenerator} context={d3.select(ref.current)} features={stateProvince?.value?.features!} />}
    </svg>
  );
}

export default GeoVisualizer;
