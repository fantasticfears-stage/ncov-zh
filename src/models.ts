import * as d3 from "d3";

export interface IRegionData {
  confirmed: number;
  discharged: number;
  deceased: number;
  suspected: number;
  name?: string;
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
    .exponent(0.3),
  "deceased": d3.scalePow()
    .interpolate(() => d3.interpolatePurples)
    .exponent(0.2),
  "confirmed": d3.scalePow()
    .interpolate(() => d3.interpolateOranges)
    .exponent(0.1),
  "suspected": d3.scalePow()
    .interpolate(() => d3.interpolateInferno)
    .exponent(0.3),
};

export const FILL_FN_PROVINCE_MAP: Record<string, d3.ScalePower<number, string>> = {
  "discharged": d3.scalePow()
    .interpolate(() => d3.interpolateGreens)
    .exponent(1.2),
  "deceased": d3.scalePow()
    .interpolate(() => d3.interpolatePurples)
    .exponent(1.5),
  "confirmed": d3.scalePow()
    .interpolate(() => d3.interpolateOranges)
    .exponent(2),
  "suspected": d3.scalePow()
    .interpolate(() => d3.interpolateInferno)
    .exponent(0.3),
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
      .center([11, 148])
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
    .center([7.7, 139.7])
  },
  '重庆': {
    filenamePrefix: 'chong_qing',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(6500)
    .center([0.4, 149.8])
  },
  '福建': {
    filenamePrefix: 'fu_jian',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(6300)
    .center([11, 153.9])
  },
  '甘肃': {
    filenamePrefix: 'gan_su',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(2200)
    .center([-0.5, 142])
  },
  '广东': {
    filenamePrefix: 'guang_dong',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(3800)
    .center([7.7, 158])
  },
  '广西': {
    filenamePrefix: 'guang_xi',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(4000)
    .center([2.3, 157])
  },
  '贵州': {
    filenamePrefix: 'gui_zhou',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(5000)
    .center([0, 153.3])
  },
  '海南': {
    filenamePrefix: 'hai_nan',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(10000)
    .center([1.5, 161])
  },
  '河北': {
    filenamePrefix: 'he_bei',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(4000)
    .center([12, 140.6])
  },
  '河南': {
    filenamePrefix: 'he_nan',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(5500)
    .center([6.9, 146])
  },
  '黑龙江': {
    filenamePrefix: 'hei_long_jiang',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(3000)
    .center([25.5, 132])
  },
  '湖北': {
    filenamePrefix: 'hu_bei',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(4200)
    .center([6.5, 150])
  },
  '湖南': {
    filenamePrefix: 'hu_nan',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(5500)
    .center([4.8, 152.3])
  },
  '吉林': {
    filenamePrefix: 'ji_lin',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(4000)
    .center([21.4, 137.5])
  },
  '江苏': {
    filenamePrefix: 'jiang_su',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(5600)
    .center([12.4, 147.4])
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
    .center([16, 139])
  },
  '内蒙古': {
    filenamePrefix: 'nei_meng_gu',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(1500)
    .center([15.2, 135.5])
  },
  '宁夏': {
    filenamePrefix: 'ning_xia',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(6500)
    .center([0, 142.5])
  },
  '青海': {
    filenamePrefix: 'qing_hai',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(2500)
    .center([-6, 145])
  },
  '山东': {
    filenamePrefix: 'shan_dong',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(4600)
    .center([12.8, 144.5])
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
    .scale(3000)
    .center([-1, 149.5])
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
    .center([9, 140.5])
  },
  '西藏': {
    filenamePrefix: 'xi_zang',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(1700)
    .center([-10.5, 149])
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
    .scale(1600)
    .center([-12.5, 138])
  },
  '云南': {
    filenamePrefix: 'yun_nan',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(3500)
    .center([-3.6, 153.8])
  },
  '浙江': {
    filenamePrefix: 'zhe_jiang',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(6700)
    .center([13, 151])
  }
}

export const FILTER_MESSAGES: Record<FilterType, any> = {
  confirmed: {
    id: "models.filters.confirmed",
    description: "type filter for region",
    defaultMessage: "确诊"
  },
  deceased: {
    id: "models.filters.deceased",
    description: "type filter for region",
    defaultMessage: "死亡"
  },
  discharged: {
    id: "models.filters.discharged",
    description: "type filter for region",
    defaultMessage: "治愈"
  },
  suspected: {
    id: "models.filters.suspected",
    description: "type filter for region",
    defaultMessage: "疑似"
  }
}

export const STRIP_KEY_PARTS = ['省', '市', '自治区', '回族', '维吾尔', '壮族'];

export const DATE_RANGE = [new Date(2020, 0, 24), new Date(2020, 1, 11)];
