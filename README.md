# Introduction 
Brief description of the setup steps for a Salesforce CICD pipeline.

# Getting Started
In this section we will talk about:
1.  Create a Private Key and Self-Signed Digital Certificate
2.	Create a connected app
3.	Update the GitHub secrets with your Sandbox's credentials
4.	Create a GitHub workflow to deploy to your Sandbox


# Create a Private Key and Self-Signed Digital Certificate
The OAuth 2.0 JWTbearer authorization flow requires a digital certificate and the private key used to sign the certificate. You upload the digital certificate to the custom connected app that is also required for the JWT bearer authorization flow. You can use your own private key and certificate issued by a certification authority. 

To create the certificate follow the steps described in https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_auth_key_and_cert.htm

# Create a connected app 
  1. Create a System Administrator Deployment User in the target Salesforce Sandboxes & Production. 
  Alternatively, you can use your own user, if you have System Administrator rights (not recommended)
  3. Create a DevOps connected app in Salesforce
      - Enable OAuth Settings
      - Callback URL: http://localhost:1717/OauthRedirect
      - Use digital signatures - Upload the server.crt file in here.
      - Selected OAuth Scopes	
        * Manage user data via APIs (api)
        *	Manage user data via Web browsers (web)
        * Perform requests at any time (refresh_token, offline_access)
      - Save
        * Manage - Edit Policies - OAuth Policies - Permitted Users - Admin approved users are pre-authorized - Save
        * Manage - Profiles - Manage profiles - Add System Administrator


# Additional actions (Release Manager only)
1. Create a GitHub Personal Access Token
    - Your Profile (top right) - Settings - Developer Settings - Personal Access Token - Generate new token
2. Github - Settings - Secrets - Actions - New repository secret
3. Create or update the following environment variables:
    - ORG_CLIENTID, where ORG will take the name of the environment you are currently setting up. E.g., UAT_CLIENTID
    - ORG_USERNAME, where ORG will take the name of the environment you are currently setting up. E.g., UAT_USERNAME
    - NOTESTRUN will take the value NOTESTRUN
    - RUNLOCALTESTS will take the value RUNLOCALTESTS
    - RUNSPECIFIEDTESTS will take the value RUNSPECIFIEDTESTS -r testClass1,testClass2,etc, based on your needs
    - TEST_ORG_URL will take the value https://test.salesforce.com
    - PROD_ORG_URL will take the value https://login.salesforce.com
    - SERVER_KEY will be the certificate value that identifies with the DevOps app digital certificate server.crt
    - REPOSITORY will take the value https://github.com/organization/repository.git
4. The deploy_scripts/Compiler.xml have to be updated with the new repository details. E.g., D:\a\newRepository\newRepository\.
5. Similarly, deploy_scripts/minimalize.bat have to be updated. E.g., D:\a\newRepository\newRepository\.
6. GitHub - Repository - Settings - Actions - General
  - Workflow permissions: Enable Read and write permissions
  - Workflow permissions: Enable Allow GitHub Actions to create and approve pull requests

Note: Action nr 6 required as the Static Resources feature will have to commit the built resources to the branch.


# Update an existing GitHub workflow (Release Manager only)
1. Create a feature branch from develop
2. Ideally, only update the variables mentioned in the "Update the GitHub secrets" step.
3. Create a Pull-request from feature to develop
4. Request a Pull-request review before merging
5. Test the workflow after your update


# Create a GitHub workflow (Release Manager only)
1. Create a feature branch from develop and create a new or clone an existing workflow from .github/workflows
2. Make use of the new or updated secrets in your new workflow
3. Install and open GitHub Desktop - checkout your feature branch - History and add a new tag for your environment on the latest commit (eg. DEVINT/v1)
4. Push the changes to GitHub

# Test the GitHub workflow
1. Create a new branch out of your feature branch, naming it as specified in the new workflow. In the example below, our new branch will be called **develop**

![image](https://user-images.githubusercontent.com/48366727/164461682-d10cc756-399a-4eb0-b296-7a068d33cee5.png)

2. Create a dummy commit in force-app/main/default (you can add an extra line on one of the cls-meta.xml files)
3. Monitor the workflow in GitHub - Actions tab
