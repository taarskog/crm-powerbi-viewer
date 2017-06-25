---
layout: page
title: Azure AD
description: Add crm-powerbi-viewer as an application in Azure AD
---
To be able to authenticate with Power BI a token is required. The token is delivered by Azure AD and to get it crm-powerbi-viewer must be registered as a valid application.

### Steps

1. Go to the Azure portal at <https://portal.azure.com>. 

   > [![]({{BASE_PATH}}/assets/images/v1.0/aad/aad-add-app.png)]({{BASE_PATH}}/assets/images/v1.0/aad/aad-add-app.png)

2. Navigate to your Active Directory.
3. Then to App Registrations
4. Add new

   > [![]({{BASE_PATH}}/assets/images/v1.0/aad/aad-add-app-details.png)]({{BASE_PATH}}/assets/images/v1.0/aad/aad-add-app-details.png)

5. Enter details. Name the application "**CRM Power BI Viewer**", set the type to "**Web app / API**", and set sign-on url to the URL 
of your Dynamics CRM instance **https://*yourinstancename*{: style="color: #ED7D31"}.crm*?*{: style="color: #ED7D31"}.dynamics.com**
        
6. Create the app

   > [![]({{BASE_PATH}}/assets/images/v1.0/aad/aad-open-app-info.png)]({{BASE_PATH}}/assets/images/v1.0/aad/aad-open-app-info.png)

7. Open the newly created app

    > [![]({{BASE_PATH}}/assets/images/v1.0/aad/aad-add-app-permissions.png)]({{BASE_PATH}}/assets/images/v1.0/aad/aad-add-app-permissions.png)


8. The application needs access to Power BI. Go to required permissions, and ...
9. add new

   > [![]({{BASE_PATH}}/assets/images/v1.0/aad/aad-add-pbi-api-access.png)]({{BASE_PATH}}/assets/images/v1.0/aad/aad-add-pbi-api-access.png)

10. Select API, and ...
11. choose "Power BI Service"

   **Can't find the service?** You remembered to create a report or dashboard in Power BI right? If not it might be that Power BI has not 
   been associated with your environment. Login to Power BI and try again...
   {: .alert .alert-warning }

   > [![]({{BASE_PATH}}/assets/images/v1.0/aad/aad-set-pbi-permissions.png)]({{BASE_PATH}}/assets/images/v1.0/aad/aad-set-pbi-permissions.png)

12. Next step is setting Power BI permissions

13. What we need is rights to view.

14. Set the new permissions...

15. And you are (almost) done

   > [![]({{BASE_PATH}}/assets/images/v1.0/aad/aad-modify-manifest.png)]({{BASE_PATH}}/assets/images/v1.0/aad/aad-modify-manifest.png)

16. A minor change to the manifest is required

17. Change the following from false to true.

   > "oauth2AllowImplicitFlow": true,
   
18. And save.

   > [![]({{BASE_PATH}}/assets/images/v1.0/aad/aad-copy-clientid.png)]({{BASE_PATH}}/assets/images/v1.0/aad/aad-copy-clientid.png)

19. Finally copy the application id as this will be required when configuring the solution in Dynamics 365.

   > Next step is to [install and configure crm-powerbi-viewer](install-solution.html) in Dynamics 365.
