---
layout: page
title: Azure AD
description: Add crm-powerbi-viewer as an application in Azure AD
---
To be able to authenticate with Power BI a token is required. The token is delivered by Azure AD and to get it crm-powerbi-viewer must be registered as a valid application.

### Steps

1. Go to the old Azure portal at <https://manage.windowsazure.com> (this is the old portal as AAD is currently not available in the new). 
2. Navigate to your Active Directory.

   > ![]({{BASE_PATH}}/assets/images/aad/AAD_in_old_Azure_portal_menu.png)

3. Open the Azure Active Directory where you want to place your application and navigate to the application tab   

   > ![]({{BASE_PATH}}/assets/images/aad/AAD_add_application.png)

4. Click ADD at the bottom of the page to add a new application
5. Choose "Add an application my organization is developing"
  
   > ![]({{BASE_PATH}}/assets/images/aad/AAD_add_app_from_org.png)

6. Name the application "CRM Power BI Viewer" and set the type to "WEB APPLICATION" then go to the next page (click the arrow).
  
   > ![]({{BASE_PATH}}/assets/images/aad/AAD_name_app.png)

7. Set sign-on url to the URL of your Dynamics CRM instance

   > **https://*yourinstancename*{: style="color: #ED7D31"}.crm*?*{: style="color: #ED7D31"}.dynamics.com**
   
   Set app id uri to something unique such as 
   
   > **https://*yourorg*{: style="color: #ED7D31"}.onmicrosoft.com/CrmPowerBiViewer**
   
   > ![]({{BASE_PATH}}/assets/images/aad/AAD_app_props.png)
   
   Complete the wizard (click the check mark).
   
8. The following step is not available from the user interface so you need to download the manifest and open it in a text editor. 
   Change the following from false to true, save and upload the file.

   > "oauth2AllowImplicitFlow": true,
   
   > ![]({{BASE_PATH}}/assets/images/aad/AAD_manifest_changes.png)
   
9. Next we need to give the application access to Power BI. Go to the configure tab and scroll down to the bottom of the page. Click "Add Application".

   > ![]({{BASE_PATH}}/assets/images/aad/AAD_add_pbi_permissions.png)
   
1. Find "Power BI Service" and click the (+) it will turn to a green check mark. Finally click the gray check mark (lower right).

   > ![]({{BASE_PATH}}/assets/images/aad/AAD_add_pbi_permissions2.png)
   
1. Give the app at least delegated permissions to view all reports and dashboards (recommend future proofing this by also adding view all groups).

   > ![]({{BASE_PATH}}/assets/images/aad/AAD_add_pbi_delegated_permissions.png)
   
1. Finally scroll up to the **client id** and copy it as you will need the id when installing the solution in Dynamics CRM.

   > ![]({{BASE_PATH}}/assets/images/aad/AAD_clientid.png)

1. All done here continue to [install and configure crm-powerbi-viewer](install-solution.html) 