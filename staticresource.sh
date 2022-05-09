#!/bin/bash

# Created by Adrian Ioana using bash scripting, sfdx-cli, sfpowerscripts, Node, Bitbucket actions
# Last modified date 9th May 2022

# Build static resources
echo "${PWD##*/}"
ls
cd deploy_scripts
ant prepareStaticResourcesZip
echo

# Commit static resources
mkdir -force force-app/main/default/staticresources # Adding -force in mkdir to avoid errors in the folder already exists 
cp src/staticresources/*.resource* force-app/main/default/staticresources
git config user.email "automated@process"
git config user.name "Automated Process"
git add force-app/main/default/staticresources
git commit -m 'Commit the B2B built static resources'
git push ${{secrets.repository}}