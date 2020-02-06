import * as d3 from "d3";

export interface IRegionData {
  confirmed: number;
  discharged: number;
  deceased: number;
  suspected: number;
}

export interface AreaCsvLine {
  cityName: string;
  city_confirmedCount: string;
  city_curedCount: string;
  city_deadCount: string;
  city_suspectedCount: string;
  provinceName: string;
  province_confirmedCount: string;
  province_curedCount: string;
  province_deadCount: string;
  province_suspectedCount: string;
  updateTime: string;
}

export interface AreaCsvItem {
  cityName: string;
  city_confirmedCount: number;
  city_curedCount: number;
  city_deadCount: number;
  city_suspectedCount: number;
  provinceName: string;
  province_confirmedCount: number;
  province_curedCount: number;
  province_deadCount: number;
  province_suspectedCount: number;
  updateTime: Date;
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
  featureFilename: string;
  projection: d3.GeoConicProjection;
}

export const PROVINCE_META_MAP: Record<string, IProvinceMeta> = {
  '安徽': {
    featureFilename: 'an_hui_geo.json',
    projection: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(5500)
      .center([9, 147.5])
  },
  '澳门': {
    featureFilename: 'ao_men_geo.json',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(3000)
    .center([10.1, 140.6])
  },
  '北京': {
    featureFilename: 'bei_jing_geo.json',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(17000)
    .center([7, 139.7])
  },
  '重庆': {
    featureFilename: 'chong_qing_geo.json',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(7500)
    .center([-1, 149.5])
  },
  '福建': {
    featureFilename: 'fu_jian_geo.json',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(6300)
    .center([10.5, 153.9])
  },
  '甘肃': {
    featureFilename: 'gan_su_geo.json',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(2800)
    .center([-5.1, 141])
  },
  '广东': {
    featureFilename: 'guang_dong_geo.json',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(5300)
    .center([5.2, 157])
  },
  '广西': {
    featureFilename: 'guang_xi_geo.json',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(6000)
    .center([0, 155.5])
  },
  '贵州': {
    featureFilename: 'gui_zhou_geo.json',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(5500)
    .center([-1, 153])
  },
  '海南': {
    featureFilename: 'hai_nan_geo.json',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(13000)
    .center([0.5, 160.7])
  },
  '河北': {
    featureFilename: 'he_bei_geo.json',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(4000)
    .center([10.1, 140.6])
  },
  '河南': {
    featureFilename: 'he_nan_geo.json',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(5500)
    .center([6.5, 146])
  },
  '黑龙江': {
    featureFilename: 'hei_long_jiang_geo.json',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(3300)
    .center([22, 131])
  },
  '湖北': {
    featureFilename: 'hu_bei_geo.json',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(5500)
    .center([4.5, 149])
  },
  '湖南': {
    featureFilename: 'hu_nan_geo.json',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(5500)
    .center([3.5, 152])
  },
  '吉林': {
    featureFilename: 'ji_lin_geo.json',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(5300)
    .center([19, 136])
  },
  '江苏': {
    featureFilename: 'jiang_su_geo.json',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(7000)
    .center([10.5, 146.5])
  },
  '江西': {
    featureFilename: 'jiang_xi_geo.json',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(5000)
    .center([9, 152.5])
  },
  '辽宁': {
    featureFilename: 'liao_ning_geo.json',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(5500)
    .center([15, 139])
  },
  '内蒙古': {
    featureFilename: 'nei_meng_gu_geo.json',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(1800)
    .center([10.1, 133])
  },
  '宁夏': {
    featureFilename: 'ning_xia_geo.json',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(6500)
    .center([-3.1, 142.5])
  },
  '青海': {
    featureFilename: 'qing_hai_geo.json',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(3200)
    .center([-10, 143.5])
  },
  '山东': {
    featureFilename: 'shan_dong_geo.json',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(6000)
    .center([10.5, 143.5])
  },
  '山西': {
    featureFilename: 'shan_xi_1_geo.json',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(4500)
    .center([8, 141.9])
  },
  '陕西': {
    featureFilename: 'shan_xi_3_geo.json',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(4000)
    .center([3.5, 143.5])
  },
  '上海': {
    featureFilename: 'shang_hai_geo.json',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(26000)
    .center([12.2, 148.7])
  },
  '四川': {
    featureFilename: 'si_chuan_geo.json',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(3500)
    .center([-5, 149])
  },
  '台湾': {
    featureFilename: 'tai_wan_geo.json',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(6800)
    .center([12.5, 156])
  },
  '天津': {
    featureFilename: 'tian_jin_geo.json',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(17000)
    .center([8, 140.5])
  },
  '西藏': {
    featureFilename: 'xi_zang_geo.json',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(2300)
    .center([-18.1, 147])
  },
  '香港': {
    featureFilename: 'xiang_gang_geo.json',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(3000)
    .center([10.1, 140.6])
  },
  '新疆': {
    featureFilename: 'xin_jiang_geo.json',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(2000)
    .center([-20.1, 136.6])
  },
  '云南': {
    featureFilename: 'yun_nan_geo.json',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(4000)
    .center([-5, 153.5])
  },
  '浙江': {
    featureFilename: 'zhe_jiang_geo.json',
    projection: d3.geoConicEqualArea()
    .parallels([15, 65])
    .rotate([-110, 0])
    .scale(7000)
    .center([13, 150.5])
  }
}
