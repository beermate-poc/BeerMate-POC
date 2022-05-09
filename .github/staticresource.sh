#! /bin/sh

# Static Resource builder functionality built by the MCBC B2B team
# Script created by Adrian Ioana using Bash, GIT and GitHub Actions
# Last modified date 9th May 2022

# Build the static resources
echo "${PWD##*/}"
ls
cd deploy_scripts
ant prepareStaticResourcesZip
cd ..

# Commit the built static resources
mkdir -force force-app/main/default/staticresources
cp src/staticresources/*.resource* force-app/main/default/staticresources
git config user.email "automated@process"
git config user.name "Automated Process"
git add force-app/main/default/staticresources
git commit -m 'Commit the B2B built static resources'
git push $REPOSITORY