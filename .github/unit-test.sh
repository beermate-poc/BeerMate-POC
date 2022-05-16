#! /bin/sh

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
execution_id=$(sfdx force:data:soql:query -q "SELECT AsyncApexJobId FROM ApexTestRunResult where Status='Completed' order by EndTime desc limit 1" -t --username $USERNAME)
execution_report=$(echo "$execution_id" | grep ^707*)
(sfdx force:apex:test:report -i $execution_report --username $USERNAME | sed '/ Pass /d' | sed 's/Test Results/Failed Tests/') &> report.txt