#!/bin/bash

cd $1
for k in *
do
cat $k >> ../year.json
done
cd ..
