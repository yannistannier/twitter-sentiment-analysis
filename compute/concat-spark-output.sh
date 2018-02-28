#!/bin/bash

for i in csv/part-*
do
	cat $i >> full.csv
done
