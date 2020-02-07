import os
import urllib.request

OUTPUT_PATH = "public/data"
AREA_FILENAME = 'DXYArea.csv'
PROVINCE_FILENAME = 'provinces.csv'


def download_github():
  url = 'https://github.com/BlankerL/DXY-2019-nCoV-Data/raw/master/csv/DXYArea.csv'
  response = urllib.request.urlopen(url)
  data = response.read()
  if (len(data) > 1024 * 1024):  # 1MB
    text = data.decode('utf-8')
    with open(os.path.join(OUTPUT_PATH, AREA_FILENAME), 'w') as f:
      f.write(text)


if __name__ == "__main__":
  download_github()
