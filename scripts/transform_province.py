import os
import pandas
from csvdata import OUTPUT_PATH, AREA_FILENAME, PROVINCE_FILENAME


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

  # %%
  df.to_csv(os.path.join(OUTPUT_PATH, PROVINCE_FILENAME), index=False)


if __name__ == "__main__":
  transform_province()
