# Introduction 
Brief description of the setup steps for a Salesforce CICD pipeline.
Created by Dhanoji, Mamatha <mamatha.dhanoji@molsoncoors.com> and Ioana, Adrian <Adrian.Ioana@molsoncoors.com>.

# Getting Started
In this section we will talk about:
1.  Create a Private Key and Self-Signed Digital Certificate;
2.	Create a connected app;
3.	Branch management;
4.	Additional actions;
5.	Create a GitHub workflow to deploy to your Sandbox;
6.	Update a GitHub workflow;
7.	Test a GitHub workflow;
8.  User access management in GitHub;	


# Create a Private Key and Self-Signed Digital Certificate
The OAuth 2.0 JWTbearer authorization flow requires a digital certificate and the private key used to sign the certificate. You upload the digital certificate to the custom connected app that is also required for the JWT bearer authorization flow. You can use your own private key and certificate issued by a certification authority. 

To create the certificate follow the steps described in https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_auth_key_and_cert.htm

# Create a connected app 
  1. Create a System Administrator Deployment User in the target Salesforce Sandboxes & Production;
  Alternatively, you can use your own user, if you have System Administrator rights (not recommended);
  2. Create a DevOps connected app in Salesforce
      - Enable OAuth Settings;
      - Callback URL: http://localhost:1717/OauthRedirect;
      - Use digital signatures - Upload the server.crt file in here;
      - Selected OAuth Scopes	
        * Manage user data via APIs (api);
        *	Manage user data via Web browsers (web);
        * Perform requests at any time (refresh_token, offline_access);
      - Save
        * Manage - Edit Policies - OAuth Policies - Permitted Users - Admin approved users are pre-authorized - Save;
        * Manage - Profiles - Manage profiles - Add System Administrator;

# Branch management
1. GitHub - Repository - Settings - Branches - Rename the "main" branch to "master";
2. Clone the repository on your local machine using IDE tools (Visual Studio Code, IntelliJ etc), SourceTree, GitHub Desktop or command line;
In case challenges are faced at this point, follow the next steps:
  - Create a GitHub Personal Access Token: Your Profile (top right) - Settings - Developer Settings - Personal Access Token - Generate new token;
  - Open Terminal on your local and execute the following command: 
    git clone https://PAT@github.com/organization/repository.git;
  - Authorize the connection opened in your browser;
  - The repository should have been now cloned;
3. Export the full Production configuration in sfdx format and commit to master;
4. Remove any unwanted metadata types from the force-app package (E.g., reports, dashboards, etc);
5. Copy-Paste the following files & folders from the POC repository to the Enterprise one:
  - .github folder
  - deploy_scripts
  - destructiveChanges
  - src (before the Salesforce-GitHub Go-Live, the static resources present in the subfolder have to be updated with the Azure version)
  - .gitignore
  - README.md
  - sfdx-project.json
6. Commit the above changes to master and tag the latest commit as in the below example:
  - DEVINT/v1 
  - TEST/v1
  - PROD/v1
  - BUILDCHK/v1
  - HOTFIXDEV/v1
  - HOTFIXTEST/v1
 Note: 
 If any of the tags already exist, try to increment the number. 

7. Push all changes to GitHub;
8. Create a develop branch from master;
Note:
For committing and tagging, SourceTree or GitHub Desktop apps can be used on both Windows and Mac.


# Additional actions (Release Manager only)
1. GitHub - Settings - Environments - Create an environment for each Salesforce Sandbox & Production; E.g., BUILDCHK, DEVINT, TEST, PROD
2. For each environment created earlier, add the Environment secrets, usually the ones mentioned below:
    - **CLIENTID**, where ORG will take the name of the environment you are currently setting up.
    - **USERNAME**, where ORG will take the name of the environment you are currently setting up.
    <img width="1138" alt="image" src="https://user-images.githubusercontent.com/48366727/170464749-50e63bfe-73be-4815-bd1e-88a05895ef07.png">

3. Now, add the global repository secrets in Github - Settings - Secrets - Actions - New repository secret
4. Create or update the following Repository secrets:
    - **NOTESTRUN** will take the value NoTestRun (Case Sensitive);
    - **RUNLOCALTESTS** will take the value RunLocalTests (Case Sensitive);
    - **RUNSPECIFIEDTESTS** will take the value RunSpecifiedTests -r testClass1,testClass2,etc, based on your needs (Case Sensitive);
    - **TEST_ORG_URL** will take the value https://test.salesforce.com;
    - **PROD_ORG_URL** will take the value https://login.salesforce.com;
    - **SERVER_KEY** will be the certificate value that identifies with the DevOps app digital certificate server.crt;
    - **REPOSITORY** will take the value https://github.com/organization/repository.git or https://PAT@github.com/organization/repository.git;
5. The deploy_scripts/Compiler.xml have to be updated with the new repository details. E.g., D:\a\newRepository\newRepository\;
6. Similarly, deploy_scripts/minimalize.bat have to be updated. E.g., D:\a\newRepository\newRepository\;
7. GitHub - Repository - Settings - Actions - General
  - Workflow permissions: Enable Read and write permissions, if possible;
  - Workflow permissions: Enable Allow GitHub Actions to create and approve pull requests, if possible;

Note: 
Action nr 7 required as the Static Resources feature will have to commit the built resources to the branch. 
However, if the last actions are not possible, the "permissions: write-all" property has been added in the workflows.


# Create a GitHub workflow (Release Manager only)
1. Create a feature branch from develop and create a new or clone an existing workflow from .github/workflows;
2. Make use of the new or updated secrets in your new workflow;
3. Checkout your feature branch and add a new tag for your environment on the latest commit (eg. DEVINT/v1);
4. Push the changes to GitHub;


# Update an existing GitHub workflow (Release Manager only)
1. Create a feature branch from develop;
2. Ideally, the variables mentioned in the "Update the GitHub secrets" step will be the only change you will perform;
3. Create a Pull-request from feature to develop;
4. Request a Pull-request review before merging;
5. Test the workflow after your update;


# Test a GitHub workflow
1. Create a new branch out of your feature branch, naming it as specified in the new workflow. In the example below, our new branch will be called **develop** - in your case the "develop" branch might have been created already by the Release Manager. In this case a new feature branch can be created.

![image](https://user-images.githubusercontent.com/48366727/164461682-d10cc756-399a-4eb0-b296-7a068d33cee5.png)

2. Create a dummy commit in force-app/main/default (you can add an extra line on one of the cls-meta.xml files).
3. Monitor the workflow in GitHub - Actions tab.


# User access management in GitHub
There are multiple levels of access for a GitHub Repositoy:
![image](https://user-images.githubusercontent.com/105660670/169281363-3fe0e2c7-3f1b-43b9-8684-f26635fc51a9.png)

To receive Repository access, a user will follow the steps highlighted below:
1. Request **organization** access to Peters, David <David.Peters@molsoncoors.com>;
2. Request **repository** access to Dhanoji, Mamatha <mamatha.dhanoji@molsoncoors.com> or Ioana, Adrian <Adrian.Ioana@molsoncoors.com>;

Repository access will be granted from the Repository Settings - Teams.
All the developers will require **WRITE** access to read, clone and push to repositories.

![image](https://user-images.githubusercontent.com/105660670/169281185-212b19e1-b808-4d79-b3f0-2acff2466d77.png)


Note: 
If the repository has been created as **"Internal"** then **all the Molson Coors Brewing EMU members will be able to READ it**.
Alternatively, if the repository has been created as **"Private"**, the users **will not be able to see it** unless access has been granted to them on the same.

