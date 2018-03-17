#!/bin/bash


for i in *.json
do
cat $i | cut -f 5 -d ',' >> allUsers.json
done

