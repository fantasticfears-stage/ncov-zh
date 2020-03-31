import os
import pandas
from csvdata import OUTPUT_PATH, AREA_FILENAME, PROVINCE_FILENAME
from functools import reduce

PROVINCE_NAMING_MAP = {
  '安徽': 'an_hui',
  '澳门': 'ao_men',
  '北京': 'bei_jing',
  '重庆': 'chong_qing',
  '福建': 'fu_jian',
  '甘肃': 'gan_su',
  '广东': 'guang_dong',
  '广西': 'guang_xi',
  '贵州': 'gui_zhou',
  '海南': 'hai_nan',
  '河北': 'he_bei',
  '河南': 'he_nan',
  '黑龙江': 'hei_long_jiang',
  '湖北': 'hu_bei',
  '湖南': 'hu_nan',
  '吉林': 'ji_lin',
  '江苏': 'jiang_su',
  '江西': 'jiang_xi',
  '辽宁': 'liao_ning',
  '内蒙古': 'nei_meng_gu',
  '宁夏': 'ning_xia',
  '青海': 'qing_hai',
  '山东': 'shan_dong',
  '山西': 'shan_xi_1',
  '陕西': 'shan_xi_3',
  '上海': 'shang_hai',
  '四川': 'si_chuan',
  '台湾': 'tai_wan',
  '天津': 'tian_jin',
  '西藏': 'xi_zang',
  '香港': 'xiang_gang',
  '新疆': 'xin_jiang',
  '云南': 'yun_nan',
  '浙江': 'zhe_jiang'
}

STRIP_KEY_PARTS = ['省', '市', '自治区', '回族', '维吾尔', '壮族']


def transform_city():
  df = pandas.read_csv(os.path.join(OUTPUT_PATH, AREA_FILENAME))
  # safety precautious although already sorted.
  df = df.sort_values(ascending=False, by=['updateTime'])

  df['updateTime'] = df['updateTime'].apply(lambda x: x[0:10])

  # %%

  provinceNames = df['provinceName'].unique()
  for name in provinceNames:
    cities = df[df['provinceName'] == name]

    cities = cities[[
        'cityName', 'city_confirmedCount', 'city_suspectedCount',
        'city_curedCount', 'city_deadCount', 'updateTime'
    ]]
    cities = cities.drop_duplicates(subset=['cityName', 'updateTime'], keep="first")
    cities = cities.rename(
        columns={
            "cityName": "name",
            "city_confirmedCount": "confirmed",
            'city_suspectedCount': 'suspected',
            'city_curedCount': 'discharged',
            'city_deadCount': 'deceased',
            'updateTime': 'updatedAtDate'
        })
    name = reduce(lambda res, x: res.replace(x, ''), STRIP_KEY_PARTS, name)

    if name not in PROVINCE_NAMING_MAP: continue
    cities.to_csv(os.path.join(OUTPUT_PATH, 'provinces', f'{PROVINCE_NAMING_MAP[name]}.csv'), index=False)


# %%


if __name__ == "__main__":
  transform_city()
