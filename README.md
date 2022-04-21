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


# Update the GitHub secrets
1. Github - Settings - Secrets - Actions - New repository secret
2. Create or update the environment variables for:
    - Sandbox Consumer Key (Client ID)
    - Sandbox Username
    - Sandbox Test Level


# Create a GitHub workflow
1. Create a new or clone an existing workflow from .github - workflows
2. Make use of the new or updated secrets in your new pipeline

## Part 1: Choosing a Development Model

abc

### Package Development Model

abc
