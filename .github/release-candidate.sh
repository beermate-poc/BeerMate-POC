#! /bin/bash

# Created by Adrian Ioana using bash scripting, git, GitHub Actions
# Last modified date 3rd June 2022


echo ================================= Creating a release candidate ==================================
echo $BRANCH > feature.txt
sed 's/feature/release/' feature.txt > rc.txt
RCBRANCH=`cat rc.txt | grep ^release`
echo Creating $RCBRANCH from master...
git checkout origin/master
echo I am currently checked-out on:
git rev-parse --abbrev-ref HEAD
echo
git checkout -f $RCBRANCH
echo I am currently checked-out on:
git rev-parse --abbrev-ref HEAD
echo
echo Pushing the new branch to remote...
git push $REPOSITORY --set-upstream origin $RCBRANCH
echo