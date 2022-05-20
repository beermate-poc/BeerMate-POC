#! /bin/sh

# Created by Adrian Ioana using bash scripting, sfdx-cli, sfpowerscripts, Node, GitHub Actions
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

# Run specified tests
# The pipeline will output all the classes part of the delta package in a text file.
# Going forward, the .cls suffix of the classes will be replaced with Test.cls and stored in a variable.
# The variable $SPECIFIEDTESTS will be used as a --testlevel parameter during the deployment.
# Example: A.cls,B.cls are part of the package. The pipeline will store ATest.cls and BTest.cls in $SPECIFIEDTESTS
# TODO:
    # Skip the suffix update for the test classes already present in the package.
    # Find a similar solution for all classes flagged as className_Test, className_TEST, classNameTEST, etc.

# # Open the delta classes folder. To be replaced with delta/force-app/main/default/classes
# cd force-app/main/default/classes
# # Find all the classes that DO NOT contain the word "Test" in different forms and print them in a text file
# find . ! \( -name '*Test*' -o -name '*TEST*' -o -name '*test*' -o -name '*.cls-meta.xml' \) -print > classes.txt
# # Remove the ./ characters from the text file
# CLASSES=`sed 's,\./, ,g' < classes.txt`
# echo $CLASSES > classes.txt
# # Remove the .(followed by space) characters from the text file
# CLASSES=`sed 's,\. ,,g' < classes.txt`
# echo $CLASSES > classes.txt
# # Replace the spacing between classes with comma
# CLASSES=`sed -e "s/ /,/g" < classes.txt`
# echo $CLASSES > classes.txt
# # Replace .cls with Test.cls
# CLASSES=`sed -e "s/.cls/Test.cls/g" < classes.txt`
# echo $CLASSES > classes.txt
# # TODO:
#     # A FOR loop to go through all the test classes from the text file and check if they exist in force-app/main/default/classes


# # Create a folder to store all the test classes to be run later
# mkdir -p runspecifiedtests/ 
# # Copy the test classes part of the delta package in the new folder. To be replaced with delta/force-app/main/default/classes
# cp force-app/main/default/classes/*Test*.cls force-app/main/default/classes/*TEST*.cls force-app/main/default/classes/*test*.cls runspecifiedtests/ > abc.txt
# # Output the list of test classes from the new folder, in a text file
# ls runspecifiedtests/ > specifiedtests.txt
# # Move all class names on one line
# SPECIFIEDTESTS=`sed -e "s/ /,/g" < specifiedtests.txt`
# echo $SPECIFIEDTESTS > specifiedtests.txt
# # Replace the spacing between classes with comma
# SPECIFIEDTESTS=`sed -e "s/ /,/g" < specifiedtests.txt`
# echo $SPECIFIEDTESTS > specifiedtests.txt

# echo Outputing the test classes to be run as part of RunSpecifiedTests feature, depending on the classes present in the delta package: echo $SPECIFIEDTESTS. Work in progress...
# echo

# Deploy the package
sfdx force:mdapi:deploy -d delta/convertmdapi -l $TESTLEVEL -u $USERNAME --ignorewarnings -w 60 > deploy.txt
if grep -R "Error" deploy.txt
then
    echo The Deploy step has failed! The errors might require your attention.
    exit 1
else
    cat deploy.txt
fi
echo

# Add a new tag
echo ================================= Adding a new deployment tag ==================================
current_version=`git tag -l $TAG* --sort=creatordate | tail -n1 | awk -F'v' '{print $NF}'`
echo CURRENT VERSION $TAG$current_version
major=`echo $current_version | cut -d'.' -f 1`
major=`expr $major + 1`
next_version=`echo $major`
echo NEXT VERSION $TAG$next_version
git tag `echo $TAG$next_version`
git push $REPOSITORY --tags