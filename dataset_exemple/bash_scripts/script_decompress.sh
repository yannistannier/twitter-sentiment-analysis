#!/bin/bash

for i in *
do
if [ -d $i ]
then
cd $i
for j in *
do
if [ -d $j ]
then
cd $j
for k in *
do
if [ -d $k ]
then
cd $k
for l in *
do
if [ -d $l ]
then
cd $l
for m in *
do
echo $i/$j/$k/$l/$m
bzip2 -d $m
done
cd ..
fi
done
cd ..
fi
done
cd ..
fi
done
cd ..
fi
done
