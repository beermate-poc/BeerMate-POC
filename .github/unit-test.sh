#! /bin/sh

# Authorize the target org
echo "$SERVER_KEY" > server.key
sfdx force:auth:jwt:grant --clientid "$CLIENTID" --jwtkeyfile=server.key --username "$USERNAME" --instanceurl "$URL" --json > auth.txt
if grep -R "Error" auth.txt
then
    echo The Authorize Org step has failed! Please contact the release manager.
    exit 1
else
    echo Successfully authorized the target org!
fi
echo

# Run the tests and export the result
execution_id=$(sfdx force:data:soql:query -q "SELECT AsyncApexJobId FROM ApexTestRunResult where Status='Completed' order by EndTime desc limit 1" -t -u "$USERNAME")
echo The execution initial ID is "$execution_id"
execution_report=`grep ^707* | echo "$execution_id"`
echo The execution final ID is "$execution_report"
(sfdx force:apex:test:report -i "$execution_report" -u "$USERNAME" | sed '/ Pass /d' | sed 's/Test Results/Failed Tests/') &> report.txt

