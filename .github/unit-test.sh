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
# SFDX_MAX_QUERY_LIMIT=30000 sfdx force:apex:test:run --codecoverage --resultformat human -u $USERNAME > exec.txt
# if grep -R -i "Test Run Id" exec.txt
# then
#     execution_id=`grep "Test Run Id" exec.txt | cut -d ' ' -f 13`
#     echo $execution_id
# else
#     echo I am failing in getting the test execution ID. Please contact the release manager.
#     exit 1
# fi
# sfdx force:apex:test:report -i $execution_id -u $USERNAME > report.txt

sfdx force:apex:test:report -i 7077500000MjnNaAAJ -u $USERNAME > report.txt

failed_tests="`grep -c -ow "\bFail\b" report.txt`" # Search for the work "Fail" in report.txt
num=1 # Variable used as the word "Fail" is also present in the "Fail Rate" metrics; Subtract 1 from the total nr of occurences 
echo 
echo You have a total of $[failed_tests - num] failed tests.

# Uncomment if only the Failed Tests are required in the report.
# sfdx force:apex:test:report -i $execution_report -u $USERNAME > tempreport1.txt
# sed '/ Pass /d' tempreport1.txt > tempreport2.txt
# sed 's/Test Results/Failed Tests/' tempreport2.txt > report.txt
echo