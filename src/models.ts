export interface IRegionData {
  confirmed: number;
  cured: number;
  death: number;
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

export type FilterType = "confirmed" | "cured" | "death" | "suspected";
