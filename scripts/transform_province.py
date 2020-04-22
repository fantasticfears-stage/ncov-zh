import os
import pandas
from csvdata import OUTPUT_PATH, AREA_FILENAME, PROVINCE_FILENAME

PROVINCES = [
  '河北省',
  '山西省',
  '辽宁省',
  '吉林省',
  '黑龙江省',
  '江苏省',
  '浙江省',
  '安徽省',
  '福建省',
  '江西省',
  '山东省',
  '河南省',
  '湖北省',
  '湖南省',
  '广东省',
  '海南省',
  '四川省',
  '贵州省',
  '云南省',
  '陕西省',
  '甘肃省',
  '青海省',
  '台湾',
  '内蒙古自治区',
  '广西壮族自治区',
  '西藏自治区',
  '宁夏回族自治区',
  '新疆维吾尔自治区',
  '北京市',
  '天津市',
  '上海市',
  '重庆市',
  '香港',
  '澳门'
]

def transform_province():
  df = pandas.read_csv(os.path.join(OUTPUT_PATH, AREA_FILENAME))
  # safety precautious although already sorted.
  df = df.sort_values(ascending=False, by=['updateTime'])

  df['updateTime'] = df['updateTime'].apply(lambda x: x[0:10])

  # %%
  df = df[[
      'provinceName', 'province_confirmedCount', 'province_suspectedCount',
      'province_curedCount', 'province_deadCount', 'updateTime'
  ]]
  df = df.drop_duplicates(subset=['provinceName', 'updateTime'], keep="first")
  df = df.rename(
      columns={
          "provinceName": "name",
          "province_confirmedCount": "confirmed",
          'province_suspectedCount': 'suspected',
          'province_curedCount': 'discharged',
          'province_deadCount': 'deceased',
          'updateTime': 'updatedAtDate'
      })
  df = df[df.name.str.contains("|".join(PROVINCES), regex=True)]

  # %%
  df.to_csv(os.path.join(OUTPUT_PATH, PROVINCE_FILENAME), index=False)


if __name__ == "__main__":
  transform_province()
