#! /bin/bash

# Created by Adrian Ioana using bash scripting, git, GitHub Actions
# Last modified date 3rd June 2022


echo ================================= Creating a release candidate ==================================
echo $BRANCH > feature.txt
sed 's/feature/release/' feature.txt
cat feature.txt
# echo $BRANCH
# # git checkout origin/master


# git checkout -b $BRANCH
# git push $REPOSITORY