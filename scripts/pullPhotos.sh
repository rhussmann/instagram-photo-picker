#!/usr/bin/env bash
IFS=', ' read -r -a array < photos.csv
for element in "${array[@]}"
do
    wget -P photos/ "$element"
done
