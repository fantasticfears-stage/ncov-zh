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
  projectionMobile: d3.GeoConicProjection;
  showMobileRegion?: (label: string) => boolean;
  showRegion?: (label: string) => boolean;
}

export interface IDimension {
  width: number;
  height: number;
}


export const MOBILE_WIDTH_BREAKPOINT = 550;

const filterRegionNameByListAndLength = (label: string, length: number | null, blackList: Array<string> | null, whiteList: Array<string> | null) => {
  let display = true;
  if (length) {
    display = label.length <= length;
  }
  if (blackList && display) {
    display = blackList.indexOf(label) === -1;
  }
  if (whiteList && !display) {
    display = whiteList.indexOf(label) !== -1;
  }
  return display;
}

export const PROVINCE_META_MAP: Record<string, IProvinceMeta> = {
  '安徽': {
    filenamePrefix: 'an_hui',
    projection: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(5500)
      .center([11, 148]),
    projectionMobile: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(4500)
      .center([12.5, 148.5]),
    showMobileRegion: (label) => filterRegionNameByListAndLength(label, 3, ['淮北市', '淮南市', '铜陵市'], null),
  },
  '澳门': {
    filenamePrefix: 'ao_men',
    projection: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(3000)
      .center([10.1, 140.6]),
    projectionMobile: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(5500)
      .center([11, 148])
  },
  '北京': {
    filenamePrefix: 'bei_jing',
    projection: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(17000)
      .center([7.7, 139.7]),
    projectionMobile: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(13000)
      .center([8.43, 140]),
    showMobileRegion: (label) => filterRegionNameByListAndLength(label, null, ['石景山区', '西城区', '东城区'], null),
    showRegion: (label) => filterRegionNameByListAndLength(label, null, ['石景山区', '西城区', '东城区'], null),
  },
  '重庆': {
    filenamePrefix: 'chong_qing',
    projection: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(6500)
      .center([0.4, 149.8]),
    projectionMobile: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(4500)
      .center([2.8, 150.4]),
    showMobileRegion: (label) => (label.length < 4 && ['大足县', '垫江县', '奉节县', '铜梁县', '璧山县', '梁平县', '巫山县', '荣昌县'].indexOf(label) === -1 && label.indexOf('区') === -1) || ["江津区", "南川区", "北碚区", "涪陵区", '万州区'].indexOf(label) !== -1,
    showRegion: (label) => (label.length < 4 && ['垫江县', '奉节县', '璧山县', '梁平县', '巫山县', '荣昌县'].indexOf(label) === -1 && label.indexOf('区') === -1) || ["江津区", "南川区", "北碚区", "涪陵区", '巴南区', '万州区'].indexOf(label) !== -1,
  },
  '福建': {
    filenamePrefix: 'fu_jian',
    projection: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(6300)
      .center([11, 153.9]),
    projectionMobile: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(4700)
      .center([12.7, 154.7]),
  },
  '甘肃': {
    filenamePrefix: 'gan_su',
    projection: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(2200)
      .center([-0.5, 142]),
    projectionMobile: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(1500)
      .center([7.5, 145]),
    showMobileRegion: (label) => filterRegionNameByListAndLength(label, 4, ['平凉市', '白银市', '金昌市'], null),
    showRegion: (label) => filterRegionNameByListAndLength(label, 4, ['平凉市', '白银市', '金昌市'], null),
  },
  '广东': {
    filenamePrefix: 'guang_dong',
    projection: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(3800)
      .center([7.7, 158]),
    projectionMobile: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(2600)
      .center([11.0, 160]),
    showMobileRegion: (label) => filterRegionNameByListAndLength(label, null, ['东莞市', '中山市', '惠州市', '揭阳市', '江门市', '阳江市'], null),
  },
  '广西': {
    filenamePrefix: 'guang_xi',
    projection: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(4000)
      .center([2.3, 157]),
    projectionMobile: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(2800)
      .center([5.5, 158.5]),
  },
  '贵州': {
    filenamePrefix: 'gui_zhou',
    projection: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(5000)
      .center([0, 153.3]),
    projectionMobile: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(3500)
      .center([2.8, 154.5]),
    showMobileRegion: (label) => filterRegionNameByListAndLength(label, 6, null, null),
    showRegion: (label) => filterRegionNameByListAndLength(label, null, ['黔南布依族苗族自治州'], null),
  },
  '海南': {
    filenamePrefix: 'hai_nan',
    projection: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(10000)
      .center([1.5, 161]),
    projectionMobile: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(7000)
      .center([2.7, 161.6]),
    showMobileRegion: (label) => filterRegionNameByListAndLength(label, 4, ['澄迈县'], null),
  },
  '河北': {
    filenamePrefix: 'he_bei',
    projection: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(4000)
      .center([12, 140.6]),
    projectionMobile: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(4000)
      .center([13, 140.6]),
  },
  '河南': {
    filenamePrefix: 'he_nan',
    projection: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(5500)
      .center([6.9, 146]),
    projectionMobile: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(3800)
      .center([9.6, 147.2]),
    showMobileRegion: (label) => filterRegionNameByListAndLength(label, 3, ['鹤壁市'], ['驻马店市'])
  },
  '黑龙江': {
    filenamePrefix: 'hei_long_jiang',
    projection: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(3000)
      .center([25.5, 132]),
    projectionMobile: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(2100)
      .center([30.8, 134.5]),
    showMobileRegion: (label) => filterRegionNameByListAndLength(label, null, ['七台河市', '伊春市', '佳木斯市'], null),
    showRegion: (label) => filterRegionNameByListAndLength(label, null, ['七台河市'], null),
  },
  '湖北': {
    filenamePrefix: 'hu_bei',
    projection: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(4200)
      .center([6.5, 150]),
    projectionMobile: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(2900)
      .center([9.8, 151.5]),
      showMobileRegion: (label) => filterRegionNameByListAndLength(label, 4, ['仙桃市', '鄂州市', '孝感市', '天门市', '黄石市'], null),
    showRegion: (label) => filterRegionNameByListAndLength(label, 6, ['仙桃市', '鄂州市'], null),
  },
  '湖南': {
    filenamePrefix: 'hu_nan',
    projection: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(5500)
      .center([4.8, 152.3]),
    projectionMobile: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(4000)
      .center([6.8, 153.2]),
    showMobileRegion: (label) => filterRegionNameByListAndLength(label, 5, null, null),
    showRegion: (label) => filterRegionNameByListAndLength(label, null, ['湘西土家族苗族自治州'], null),
  },
  '吉林': {
    filenamePrefix: 'ji_lin',
    projection: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(4000)
      .center([21.4, 137.5]),
    projectionMobile: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(2800)
      .center([25, 139.7]),
    showMobileRegion: (label) => filterRegionNameByListAndLength(label, 4, null, null),
  },
  '江苏': {
    filenamePrefix: 'jiang_su',
    projection: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(5600)
      .center([12.4, 147.4]),
    projectionMobile: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(3800)
      .center([15.1, 148.7]),
    showMobileRegion: (label) => filterRegionNameByListAndLength(label, null, ['泰州市', '镇江市', '无锡市', '常州市'], null),
    showRegion: (label) => filterRegionNameByListAndLength(label, null, ['无锡市'], null),
  },
  '江西': {
    filenamePrefix: 'jiang_xi',
    projection: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(5000)
      .center([9, 152.5]),
    projectionMobile: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(4300)
      .center([11, 153.2]),
  },
  '辽宁': {
    filenamePrefix: 'liao_ning',
    projection: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(5500)
      .center([16, 139]),
    projectionMobile: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(4000)
      .center([18.6, 140.2]),
  },
  '内蒙古': {
    filenamePrefix: 'nei_meng_gu',
    projection: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(1500)
      .center([15.2, 135.5]),
    projectionMobile: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(1000)
      .center([26.8, 141]),
    showMobileRegion: (label) => filterRegionNameByListAndLength(label, 4, ['乌海市'], ['鄂尔多斯市', '锡林郭勒盟', '呼伦贝尔市']),
    showRegion: (label) => filterRegionNameByListAndLength(label, 4, ['乌海市'], ['鄂尔多斯市', '锡林郭勒盟', '呼伦贝尔市']),
  },
  '宁夏': {
    filenamePrefix: 'ning_xia',
    projection: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(6500)
      .center([0, 142.5]),
    projectionMobile: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(5500)
      .center([11, 148])
  },
  '青海': {
    filenamePrefix: 'qing_hai',
    projection: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(2500)
      .center([-6, 145]),
    projectionMobile: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(1700)
      .center([0.8, 147]),
    showMobileRegion: (label) => filterRegionNameByListAndLength(label, null, ['海东地区'], null),
  },
  '山东': {
    filenamePrefix: 'shan_dong',
    projection: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(4600)
      .center([12.8, 144.5]),
    projectionMobile: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(3300)
      .center([15.8, 145.5]),
    showMobileRegion: (label) => filterRegionNameByListAndLength(label, null, ['淄博市', '枣庄市', '日照市', '莱芜市', '东营市'], null),
  },
  '山西': {
    filenamePrefix: 'shan_xi_1',
    projection: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(4500)
      .center([8, 141.9]),
    projectionMobile: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(4500)
      .center([8, 142.2]),
  },
  '陕西': {
    filenamePrefix: 'shan_xi_3',
    projection: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(4000)
      .center([3.5, 143.5]),
    projectionMobile: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(4200)
      .center([4.1, 143.4]),
  },
  '上海': {
    filenamePrefix: 'shang_hai',
    projection: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(26000)
      .center([12.2, 148.7]),
    projectionMobile: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(18000)
      .center([12.7, 148.9]),
    showMobileRegion: (label) => filterRegionNameByListAndLength(label, null, ['普陀区', '长宁区', '静安区', '徐汇区', '虹口区'], null),
    showRegion: (label) => filterRegionNameByListAndLength(label, null, ['普陀区', '长宁区', '虹口区'], null),
  },
  '四川': {
    filenamePrefix: 'si_chuan',
    projection: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(3000)
      .center([-1, 149.5]),
    projectionMobile: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(2100)
      .center([4, 151.5]),
    showMobileRegion: (label) => filterRegionNameByListAndLength(label, null, ['泸州市', '德阳市', '遂宁市', '自贡市', '资阳市', '达州市', '雅安市'], null),
  },
  '台湾': {
    filenamePrefix: 'tai_wan',
    projection: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(6800)
      .center([12.5, 156]),
    projectionMobile: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(6000)
      .center([14.5, 157]),
  },
  '天津': {
    filenamePrefix: 'tian_jin',
    projection: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(17000)
      .center([9, 140.5]),
    projectionMobile: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(16000)
      .center([9, 140.6]),
    showMobileRegion: (label) => filterRegionNameByListAndLength(label, null, ['红桥区', '南开区', '河东区', '和平区', '河北区', '河西区'], null),
  },
  '西藏': {
    filenamePrefix: 'xi_zang',
    projection: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(1700)
      .center([-10.5, 149]),
    projectionMobile: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(1100)
      .center([-0.5, 153]),
  },
  '香港': {
    filenamePrefix: 'xiang_gang',
    projection: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(3000)
      .center([10.1, 140.6]),
    projectionMobile: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(5500)
      .center([11, 148])
  },
  '新疆': {
    filenamePrefix: 'xin_jiang',
    projection: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(1600)
      .center([-12.5, 138]),
    projectionMobile: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(1100)
      .center([-1.3, 140]),
    showMobileRegion: (label) => filterRegionNameByListAndLength(label, 5, ['阿克苏地区', '塔城地区', '五家渠市', '吐鲁番地区', '图木舒克市'], ['巴音郭楞蒙古自治州']),
    showRegion: (label) => filterRegionNameByListAndLength(label, 5, ['阿克苏地区', '塔城地区', '五家渠市', '吐鲁番地区', '图木舒克市'], ['巴音郭楞蒙古自治州']),
  },
  '云南': {
    filenamePrefix: 'yun_nan',
    projection: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(3500)
      .center([-3.6, 153.8]),
    projectionMobile: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(2500)
      .center([-.2, 155.3]),
    showMobileRegion: (label) => filterRegionNameByListAndLength(label, 6, null, ['大理白族自治州']),
    showRegion: (label) => filterRegionNameByListAndLength(label, 9, ['楚雄彝族自治州'], null),
  },
  '浙江': {
    filenamePrefix: 'zhe_jiang',
    projection: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(6700)
      .center([13, 151]),
    projectionMobile: d3.geoConicEqualArea()
      .parallels([15, 65])
      .rotate([-110, 0])
      .scale(4700)
      .center([15, 152]),
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

export const MOBILE_DISPLAY_PROVINCE = ['湖北省', '广东省', '四川省', '青海省', '新疆维吾尔自治区', '西藏自治区', '山西省', '黑龙江省', '浙江省', '云南省'];
export const NOT_MOBILE_REJECT_PROVINCE = ['北京市', '天津市', '上海市', '甘肃省'];
export const NOT_MOBILE_ACCEPT_PROVINCE = ['新疆维吾尔自治区', '西藏自治区', '内蒙古自治区'];

export const DATE_RANGE = [new Date(2020, 0, 24), new Date(2020, 1, 12)];

export enum TextLabelDisplayLevel {
  Disabled = 0,
  Auto = 10,
  Enabled = 20
}
