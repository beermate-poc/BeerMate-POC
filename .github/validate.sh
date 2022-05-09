#! /bin/sh

# Created by Adrian Ioana using bash scripting, sfdx-cli, sfpowerscripts, Node, Bitbucket actions
# Last modified date 9th May 2022

# Install sfpowerkit - not required if a dxatscale image is being used in the yml file
# echo 'y' | sfdx plugins:install sfpowerkit

# Identify the delta changes
git rev-parse --abbrev-ref HEAD
LATEST_STABLE_TAG=`git tag -l $TAG*  --sort=creatordate | tail -n1`
echo The last stable tag is $LATEST_STABLE_TAG
CURRENT_COMMIT_ID=`git rev-parse --verify HEAD`
echo The current commit ID is $CURRENT_COMMIT_ID
sfdx sfpowerkit:project:diff -t $CURRENT_COMMIT_ID -r $LATEST_STABLE_TAG -d delta -x
echo  

# Authorize the target org & abort the pipeline if auth is failing 
echo "$SERVER_KEY" > server.key
sfdx force:auth:jwt:grant --clientid $CLIENTID --jwtkeyfile=server.key --username $USERNAME --instanceurl $URL --json > auth.txt
if grep -R "Error" auth.txt
then
    echo The Authorize Org step has failed! Please contact the release manager.
    exit 1
else
    echo Successfully authorized the target org!
fi
echo      

# Prepare the deployment package
cd delta
mkdir convertmdapi
mkdir -p force-app
cd ..
cp destructiveChanges/destructiveChangesPre.xml destructiveChanges/destructiveChangesPost.xml destructiveChanges/package.xml delta/convertmdapi/
cd delta
sfdx force:source:convert -r force-app -d convertmdapi
cd convertmdapi
echo 

# Display the deployment folder 
echo ========================== The structure of the convertmdapi folder ===========================      
ls -d $PWD/*
cd ..
cd ..
echo 

# Display the deployment package
echo ================================ The final deployment package ================================= 
echo ===============================================================================================
echo ================================== Pre-destructive changes ==================================== 
cat delta/convertmdapi/destructiveChangesPre.xml
echo ===============================================================================================
echo
echo ================================== Delta deployment package ===================================
cat delta/convertmdapi/package.xml
echo ===============================================================================================
echo 
echo ================================= Post-destructive changes ====================================
cat delta/convertmdapi/destructiveChangesPost.xml
echo ===============================================================================================
echo 

# Deploy the package
sfdx force:mdapi:deploy --checkonly -d delta/convertmdapi -l $TESTLEVEL -u $USERNAME --ignorewarnings -w 60 > deploy.txt
if grep -R "Error" deploy.txt
then
    echo The Validation step has failed! The errors might require your attention.
    exit 1
else
    cat deploy.txt
    echo Successfully validated your package! 
fi
echo