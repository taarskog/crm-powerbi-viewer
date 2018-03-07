---
layout: page
title: Azure AD
description: Add crm-powerbi-viewer as an application in Azure AD
---
To be able to authenticate with Power BI a token is required. The token is delivered by Azure AD and to get it crm-powerbi-viewer must be registered as a valid application.

### _(new)_ Power BI Simplified Flow
The Power BI team has created a schema that simplifies the creation of an application in Azure AD. You still need to perform a few steps in the Azure portal but the 
flow is easier and with fewer steps. The guide on this page is the original one with all the steps taking place in Azure. The new guide using the Power BI schema can be found [here](azure-ad-simple.html).

If you encounter issues following the new flow - please validate the created application using the guide on this page.
{: .alert .alert-warning }

### Steps

1. Go to the Azure portal at <https://portal.azure.com>. 
2. Navigate to your Active Directory.
3. Then to App Registrations
4. Add new

   > [![]({{BASE_PATH}}/assets/images/v1.0/aad/aad-add-app.png)]({{BASE_PATH}}/assets/images/v1.0/aad/aad-add-app.png)

5. Enter details. Name the application "**Dynamics 365 Power BI Viewer**", set the type to "**Web app / API**", and set sign-on url to the URL 
of your Dynamics CRM instance **https://*yourinstancename*{: style="color: #ED7D31"}.crm*?*{: style="color: #ED7D31"}.dynamics.com/\***
6. Create the app

   > [![]({{BASE_PATH}}/assets/images/v1.0/aad/aad-add-app-details.png)]({{BASE_PATH}}/assets/images/v1.0/aad/aad-add-app-details.png)

7. Open the newly created app

   > [![]({{BASE_PATH}}/assets/images/v1.0/aad/aad-open-app-info.png)]({{BASE_PATH}}/assets/images/v1.0/aad/aad-open-app-info.png)

8. The application needs access to Power BI. Go to required permissions, and ...
9. add new

   > [![]({{BASE_PATH}}/assets/images/v1.0/aad/aad-add-app-permissions.png)]({{BASE_PATH}}/assets/images/v1.0/aad/aad-add-app-permissions.png)

0. Select API, and ...
1. choose "Power BI Service"

   > [![]({{BASE_PATH}}/assets/images/v1.0/aad/aad-add-pbi-api-access.png)]({{BASE_PATH}}/assets/images/v1.0/aad/aad-add-pbi-api-access.png)

   **Can't find the service?** You remembered to create a report or dashboard in Power BI right? If not it might be that Power BI has not 
   been associated with your environment. Login to Power BI before re-trying...
   {: .alert .alert-warning }

2. Next step is setting Power BI permissions
3. What you need is rights to view.
4. Click select to set the new permissions...
5. and click done as that is what you are (almost)

   > [![]({{BASE_PATH}}/assets/images/v1.0/aad/aad-set-pbi-permissions.png)]({{BASE_PATH}}/assets/images/v1.0/aad/aad-set-pbi-permissions.png)

   **15b Grant Permissions.** After setting permissions you need to grant them to all users. Press the button named "Grant Permissions" (see 15b).
   {: .alert .alert-error }

   > [![]({{BASE_PATH}}/assets/images/v1.0/aad/aad-grant-permissions.png)]({{BASE_PATH}}/assets/images/v1.0/aad/aad-grant-permissions.png)

6. Two changes to the manifest are required
7. Change the following from false to true:

   ```json
   "oauth2AllowImplicitFlow": true,
   "oauth2AllowUrlPathMatching": true,
   ```

8. And save.

   > [![]({{BASE_PATH}}/assets/images/v1.0/aad/aad-modify-manifest.png)]({{BASE_PATH}}/assets/images/v1.0/aad/aad-modify-manifest.png)

9. Finally copy the application id as this will be required when configuring the solution in Dynamics 365.

   > [![]({{BASE_PATH}}/assets/images/v1.0/aad/aad-copy-clientid.png)]({{BASE_PATH}}/assets/images/v1.0/aad/aad-copy-clientid.png)

<br/>
<br/>

Next step is to [install and configure crm-powerbi-viewer](install-solution.html) in Dynamics 365.
{: .alert .alert-info }
