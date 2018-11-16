---
layout: page
title: Azure AD using simplified flow by Power BI 
description: Add crm-powerbi-viewer as an application in Azure AD
---
To be able to authenticate with Power BI a token is required. The token is delivered by Azure AD and to get it crm-powerbi-viewer must be registered as a valid application.

### Power BI Simplified Flow
The Power BI team has created a schema that simplifies the creation of an application in Azure AD. You still need to perform a few steps in the Azure portal but the 
flow is easier with fewer steps.

If you encounter issues following this flow - please validate the created application using the [original guide](azure-ad.html) making sure that all values are set as
described in that guide.
{: .alert .alert-warning }

### Steps

1. Go to the <a href="https://dev.powerbi.com/apps/" target="_blank">Power BI App Registration Tool</a>.
2. Follow all the steps to register the app
3. Click [Register App] and copy the client id (you will need it later).

   > [![]({{BASE_PATH}}/assets/images/v1.0/aad/aad-simple-reg-app.png)]({{BASE_PATH}}/assets/images/v1.0/aad/aad-simple-reg-app.png)

   The Power BI team is currently adjusting the list of permissions. The simplified flow does not always include all relevant permissions. Thus you may need to visit 
   the [original guide](azure-ad.html) step #13-15 to verify the list of permissions you need to set.
   {: .alert .alert-warning }

4. Go to the <a href="https://portal.azure.com" target="_blank">Azure portal</a>. 
5. Navigate to your Active Directory.
6. Then to App Registrations
7. Show all apps
8. Open the newly registered app

   > [![]({{BASE_PATH}}/assets/images/v1.0/aad/aad-simple-open-app-info.png)]({{BASE_PATH}}/assets/images/v1.0/aad/aad-simple-open-app-info.png)

9. Two changes to the manifest are required
0. Change the following from false to true:

   ```json
   "oauth2AllowImplicitFlow": true,
   "oauth2AllowUrlPathMatching": true,
   ```
1. And save.

   > [![]({{BASE_PATH}}/assets/images/v1.0/aad/aad-simple-modify-manifest.png)]({{BASE_PATH}}/assets/images/v1.0/aad/aad-simple-modify-manifest.png)


2. Final step is to grant permissions to all users. *Go to settings* > *Required permissions*
3. Press *Grant permissions*

   > [![]({{BASE_PATH}}/assets/images/v1.0/aad/aad-simple-grant-permissions.png)]({{BASE_PATH}}/assets/images/v1.0/aad/aad-simple-open-app-info.png)


<br/>
<br/>

Next step is to [install and configure crm-powerbi-viewer](install-solution.html) in Dynamics 365.
{: .alert .alert-info }
