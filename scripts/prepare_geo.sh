#!/bin/bash

rm -f public/data/province/index.js
newext="json"
for file in public/data/province/*.js
do 
 ext="${file##*.}"
 next=$(echo "$file" | sed -e "s|$ext|$newext|g")
 
 tail $file | cut -c 16- | awk '{sub(/;$/,"")}1' > "$next"
 rm -f "$file"
done
