#! /bin/bash

# Created by Adrian Ioana using bash scripting, git, GitHub Actions
# Last modified date 3rd June 2022


echo ================================= Creating a release candidate ==================================
echo $BRANCH > feature.txt
sed 's/feature/release/' feature.txt > rc.txt
RCBRANCH=`cat rc.txt | grep ^release`
echo Creating $RCBRANCH from master...
git checkout origin/master
git checkout -b $RCBRANCH
git push $REPOSITORY
echo I am currently checked-out on:
git rev-parse --abbrev-ref HEAD
echo