#!/bin/bash

REPO_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." >/dev/null 2>&1 && pwd )"

echo "Downloads public/data/DXYArea.csv"
python3 $REPO_ROOT/scripts/csvdata.py

echo "Transform provinces.csv"
python3 $REPO_ROOT/scripts/transform_province.py

echo "Transform provinces/{city*}.csv"
python3 $REPO_ROOT/scripts/transform_city.py
