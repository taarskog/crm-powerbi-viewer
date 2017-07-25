---
layout: page
title: Installation in Dynamics 365 Sales and Service
description: How to install and configure crm-powerbi-viewer in Dynamics 365.
---

Before installing the solution in Dynamics 365 it is recommended that you configure Azure Active Directory. Often this step takes time as other people
with the appropriate access to AAD needs to be involved and you should get that ball running as soon as possible :-) 

It is assumed that you have experience with Dynamics 365 configuration and know how to import and create solutions. If not, you need to call a friend. 

### Steps

1. Download the most recent managed [PowerBIViewer](https://github.com/taarskog/crm-powerbi-viewer/releases) release.
2. Import it into your Dynamics 365 instance.

    **Upgrading from v0.3?**<br/>You need to take special care if you have an existing version already installed (i.e. v0.3.3 or lower). The application has been completly 
    rewritten and a few extra steps are required. <br/><br/>When importing you must **"stage for upgrade"** and **"owerwrite customizations"**. Once imported you then need to update
    all locations where you have embedded Power BI and reference the new viewer.html making sure to use the new configuration values. Once complete and verified you should
    **"Apply Solution Upgrade"** to complete the installation.
    {: .alert .alert-warning }

3. Next you need to create a solution to hold the configuration. You can of course also use any existing unamanged solution you already have on the instance.  

   > [![]({{BASE_PATH}}/assets/images/v1.0/crm-install/crm-inst-new-solution.png)]({{BASE_PATH}}/assets/images/v1.0/crm-install/crm-inst-new-solution.png)
   
4. Get the configuration template by adding the existing configuration web resource from the crm-powerbi-viewer solution.

   > [![]({{BASE_PATH}}/assets/images/v1.0/crm-install/crm-inst-add-existing-resource.png)]({{BASE_PATH}}/assets/images/v1.0/crm-install/crm-inst-add-existing-resource.png)

5. Find, select and add the resource named:

   > his_/powerbi/scripts/config.js

   > [![]({{BASE_PATH}}/assets/images/v1.0/crm-install/crm-inst-select-config-resource.png)]({{BASE_PATH}}/assets/images/v1.0/crm-install/crm-inst-select-config-resource.png)

6. Open the resource and edit its contents by clicking the button [Text Editor]

   > [![]({{BASE_PATH}}/assets/images/v1.0/crm-install/crm-inst-open-config.png)]({{BASE_PATH}}/assets/images/v1.0/crm-install/crm-inst-open-config.png)

7. Find the line with **auth_client_id** and replace null with the id you copied when configuring Azure AD (enclose the id with double quotes).
   
   > [![]({{BASE_PATH}}/assets/images/v1.0/crm-install/crm-inst-edit-config.png)]({{BASE_PATH}}/assets/images/v1.0/crm-install/CRM-inst-edit-config.png)

   If you are **not** on Dynamics 365 Online (i.e. your instance is on-premise or hosted by a partner) you also need to set **auth_mode** from null to **"popup"**.
   {: .alert .alert-info }

8. Click [ok], [save] and [publish].

9. All done here. You are now ready to [add a Power BI view](add-view-to-dashboard.html) to a CRM dashboard or form.