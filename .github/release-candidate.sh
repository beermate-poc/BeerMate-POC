#! /bin/bash

# Created by Adrian Ioana using bash scripting, git, GitHub Actions
# Last modified date 3rd June 2022


echo ================================= Creating a release candidate ==================================
echo $BRANCH | echo $SQL | sed -e "s/\feature/release/g"
echo $BRANCH
# git checkout origin/master
# git checkout -b 
