#! /bin/sh

# Created by Adrian Ioana using bash scripting, sfdx-cli, Node, GitHub Actions
# Last modified date 13th May 2022

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

# Identify the delta changes
execution_id=`sfdx force:data:soql:query -q "SELECT AsyncApexJobId FROM ApexTestRunResult where Status='Completed' order by EndTime desc limit 1" -t -u $USERNAME`
execution_report=`echo "$execution_id" | grep ^707*`
(sfdx force:apex:test:report -i $execution_report -u $USERNAME | sed '/ Pass /d' | sed 's/Test Results/Failed Tests/') &> report.txt

# execution_id=`sfdx force:data:soql:query -q "SELECT AsyncApexJobId FROM ApexTestRunResult where Status='Completed' order by EndTime desc limit 1" -t -u adrian.ioana@molsoncoors.com.prod.uat`
# execution_report=`echo "$execution_id" | grep ^707*`
# (sfdx force:apex:test:report -i $execution_report -u adrian.ioana@molsoncoors.com.prod.uat | sed '/ Pass /d' | sed 's/Test Results/Failed Tests/') &> report.txt