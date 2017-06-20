---
layout: page
title: Installation in Dynamics CRM
description: How to install and configure crm-powerbi-viewer in Dynamics CRM.
---

Before installing the solution in Dynamics CRM it is recommended that you configure Azure Active Directory. Often this step takes time as other people
with the appropriate access to AAD needs to be ionvolved and you should get that ball running as soon as possible :-) 

It is assumed that you have experience with Dynamics CRM configuration and know how to import and create solutions. If not, you need to call a friend. 

### Steps

1. Download the most recent managed [PowerBIViewer](https://github.com/taarskog/crm-powerbi-viewer/releases/latest/) release.
2. Import it into your Dynamics CRM instance.
3. Next you need to create a solution to hold the configuration. You can of course also use any existing unamanged solution you already have on the instance.  

   > [![]({{BASE_PATH}}/assets/images/v0.3/crm-install/CRM-inst-new-solution.png)]({{BASE_PATH}}/assets/images/v0.3/crm-install/CRM-inst-new-solution.png)
   
4. Get the configuration template by adding the existing configuration web resource from the crm-powerbi-viewer solution.

   > [![]({{BASE_PATH}}/assets/images/v0.3/crm-install/CRM-inst-add-existing-resource.png)]({{BASE_PATH}}/assets/images/v0.3/crm-install/CRM-inst-add-existing-resource.png)

5. Find, select and add the resource named:

   > his_/scripts/powerBiConfig.js

   > [![]({{BASE_PATH}}/assets/images/v0.3/crm-install/CRM-inst-select-config-resource.png)]({{BASE_PATH}}/assets/images/v0.3/crm-install/CRM-inst-select-config-resource.png)

6. Open the resource and edit its contents by clicking the button [Text Editor]

   > [![]({{BASE_PATH}}/assets/images/v0.3/crm-install/CRM-inst-open-config.png)]({{BASE_PATH}}/assets/images/v0.3/crm-install/CRM-inst-open-config.png)

7. Find the line with the client id and do the following two steps:

   * replace the text **\<Get Client Id from Azure AD\>** qith your client id (the one you copied when configuring Azure AD).
   * remove the two // at the beginning og the line you just edited.  
   
   > [![]({{BASE_PATH}}/assets/images/v0.3/crm-install/CRM-inst-edit-config.png)]({{BASE_PATH}}/assets/images/v0.3/crm-install/CRM-inst-edit-config.png)

8. The final config should look similar to the picture above but with the x's replaced with your client id.

9. All done here. You are now ready to add a Power BI [report](add-report-to-dashboard.html) or add a [dashboard tile](add-tile-to-dashboard.html) to a CRM dashboard or form.