import * as d3 from "d3";

export interface IRegionData {
  confirmed: number;
  discharged: number;
  deceased: number;
  suspected: number;
}

export const EMPTY_REGION_DATA: IRegionData = {
  confirmed: 0,
  discharged: 0,
  deceased: 0,
  suspected: 0
}

export interface AreaCsvLine {
  name: string;
  confirmed: number;
  discharged: number;
  deceased: number;
  suspected: number;
  updatedAtDate: string;
}

export interface AreaCsvItem {
  name: string;
  confirmed: number;
  discharged: number;
  deceased: number;
  suspected: number;
  updatedAtDate: string;
}

export type FilterType = "confirmed" | "discharged" | "deceased" | "suspected";

export const FILL_FN_MAP: Record<string, d3.ScalePower<number, string>> = {
  "discharged": d3.scalePow()
    .interpolate(() => d3.interpolateGreens)
    .exponent(0.3)
    .domain([0, 100]),
  "deceased": d3.scalePow()
    .interpolate(() => d3.interpolatePurples)
    .exponent(0.2)
    .domain([0, 1000]),
  "confirmed": d3.scalePow()
    .interpolate(() => d3.interpolateOranges)
    .exponent(0.3)
    .domain([0, 1500]),
  "suspected": d3.scalePow()
    .interpolate(() => d3.interpolateInferno)
    .exponent(0.3)
    .domain([0, 1.5])
};

export interface IProvinceMeta {
  filenamePrefix: string;
  projection: d3.GeoConicProjection;
}

export interface IDimension {
  width: number;
  height: number;
}


export const PROVINCE_META_MAP: Record<string, IProvinceMeta> = {
  '安徽': {
    filenamePrefix: 'an_hui',
    projection: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(5500)
      .center([9, 147.5])
  },
  '澳门': {
    filenamePrefix: 'ao_men',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(3000)
    .center([10.1, 140.6])
  },
  '北京': {
    filenamePrefix: 'bei_jing',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(17000)
    .center([7, 139.7])
  },
  '重庆': {
    filenamePrefix: 'chong_qing',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(7500)
    .center([-1, 149.5])
  },
  '福建': {
    filenamePrefix: 'fu_jian',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(6300)
    .center([10.5, 153.9])
  },
  '甘肃': {
    filenamePrefix: 'gan_su',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(2800)
    .center([-5.1, 141])
  },
  '广东': {
    filenamePrefix: 'guang_dong',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(5300)
    .center([5.2, 157])
  },
  '广西': {
    filenamePrefix: 'guang_xi',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(6000)
    .center([0, 155.5])
  },
  '贵州': {
    filenamePrefix: 'gui_zhou',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(5500)
    .center([-1, 153])
  },
  '海南': {
    filenamePrefix: 'hai_nan',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(13000)
    .center([0.5, 160.7])
  },
  '河北': {
    filenamePrefix: 'he_bei',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(4000)
    .center([10.1, 140.6])
  },
  '河南': {
    filenamePrefix: 'he_nan',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(5500)
    .center([6.5, 146])
  },
  '黑龙江': {
    filenamePrefix: 'hei_long_jiang',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(3300)
    .center([22, 131])
  },
  '湖北': {
    filenamePrefix: 'hu_bei',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(5500)
    .center([4.5, 149])
  },
  '湖南': {
    filenamePrefix: 'hu_nan',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(5500)
    .center([3.5, 152])
  },
  '吉林': {
    filenamePrefix: 'ji_lin',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(5300)
    .center([19, 136])
  },
  '江苏': {
    filenamePrefix: 'jiang_su',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(7000)
    .center([10.5, 146.5])
  },
  '江西': {
    filenamePrefix: 'jiang_xi',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(5000)
    .center([9, 152.5])
  },
  '辽宁': {
    filenamePrefix: 'liao_ning',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(5500)
    .center([15, 139])
  },
  '内蒙古': {
    filenamePrefix: 'nei_meng_gu',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(1800)
    .center([10.1, 133])
  },
  '宁夏': {
    filenamePrefix: 'ning_xia',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(6500)
    .center([-3.1, 142.5])
  },
  '青海': {
    filenamePrefix: 'qing_hai',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(3200)
    .center([-10, 143.5])
  },
  '山东': {
    filenamePrefix: 'shan_dong',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(6000)
    .center([10.5, 143.5])
  },
  '山西': {
    filenamePrefix: 'shan_xi_1',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(4500)
    .center([8, 141.9])
  },
  '陕西': {
    filenamePrefix: 'shan_xi_3',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(4000)
    .center([3.5, 143.5])
  },
  '上海': {
    filenamePrefix: 'shang_hai',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(26000)
    .center([12.2, 148.7])
  },
  '四川': {
    filenamePrefix: 'si_chuan',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(3500)
    .center([-5, 149])
  },
  '台湾': {
    filenamePrefix: 'tai_wan',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(6800)
    .center([12.5, 156])
  },
  '天津': {
    filenamePrefix: 'tian_jin',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(17000)
    .center([8, 140.5])
  },
  '西藏': {
    filenamePrefix: 'xi_zang',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(2300)
    .center([-18.1, 147])
  },
  '香港': {
    filenamePrefix: 'xiang_gang',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(3000)
    .center([10.1, 140.6])
  },
  '新疆': {
    filenamePrefix: 'xin_jiang',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(2000)
    .center([-20.1, 136.6])
  },
  '云南': {
    filenamePrefix: 'yun_nan',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(4000)
    .center([-5, 153.5])
  },
  '浙江': {
    filenamePrefix: 'zhe_jiang',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(7000)
    .center([13, 150.5])
  }
}

export const FILTER_MESSAGES: Record<FilterType, any> = {
  confirmed: {
    id: "geovisualizer.filters.confirmed",
    description: "type filter for region",
    defaultMessage: "确诊"
  },
  deceased: {
    id: "geovisualizer.filters.deceased",
    description: "type filter for region",
    defaultMessage: "去世"
  },
  discharged: {
    id: "geovisualizer.filters.discharged",
    description: "type filter for region",
    defaultMessage: "治愈"
  },
  suspected: {
    id: "geovisualizer.filters.suspected",
    description: "type filter for region",
    defaultMessage: "疑似"
  }
}
