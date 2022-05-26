#! /bin/bash

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

# Run apex tests
SFDX_MAX_QUERY_LIMIT=30000 sfdx force:apex:test:run --codecoverage --resultformat human -u $USERNAME > exec.txt
# If condition required to get the Test Run Id of the current test execution
if grep -R -i "Test Run Id" exec.txt
then
    execution_id=`grep "Test Run Id" exec.txt | cut -d ' ' -f 13`
    echo $execution_id
    echo
else
    echo
    echo I am failing in getting the test execution ID. Please contact the release manager.
    exit 1
fi

# # If condition required to get the Org Wide Coverage of the current test execution
# if grep -R -i "Org Wide Coverage" exec.txt
# then
#     execution_id=`grep "Org Wide Coverage" exec.txt | cut -d ' ' -f 13`
#     echo $org_coverage
#     echo
# else
#     echo I am failing in getting the org wide coverage. Please contact the release manager.
#     echo 
# fi

# Remove the passed tests from the report
sed '/ Pass /d' exec.txt &> report.txt

# Search for the work "Fail" in report.txt
failed_tests="`grep -c -ow "\bFail\b" report.txt`"
num=1 # Variable used as the word "Fail" is also present in the "Fail Rate" metrics; Subtract 1 from the total nr of occurences 
echo 
echo You have a total of $[failed_tests - num] failed tests.
echo