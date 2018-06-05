#!/bin/bash

sum=0
for i in *.json
do
mois=$(cat $i | cut -f 5 -d ',' | uniq | wc -l)
echo "Pour le mois $i, le nombre d'utilisateurs : $mois"
sum=$(($sum+$mois))
done
echo "Somme totale: $sum"
