---
layout: page
title: Add a Power BI Report
tagline: to Dynamics CRM
description: How to add a report from Power BI to a dashboard in Dynamics CRM.
---

[![]({{BASE_PATH}}/assets/images/v0.3/samples/sample-crm-montage.png)]({{BASE_PATH}}/assets/images/v0.3/samples/sample-crm-montage.png)

You embed a Power BI report by referencing the Power BI report id. Alternatively you can reference the report by name, just be aware
that if multiple reports have the same name the first found will be used.

The easiest approach to find reports you have access to and the required CRM configuration is by going to the solution
configuration page.

The configuration page lists available tiles and reports. Both those you have access to through your workspace and those through
group membership(s). Click preview to see how the report looks inside Dynamics CRM (note: shown inside the configuration page).

1. When you have found the report you want to use you need to copy the configuration values. Click the clipboard icon to copy the configuration values to the clipboard. 

   > [![]({{BASE_PATH}}/assets/images/v0.3/crm-config/crm-config-get-tile-params-2.png)]({{BASE_PATH}}/assets/images/v0.3/crm-config/crm-config-get-tile-params-2.png)

   > [![]({{BASE_PATH}}/assets/images/v0.3/crm-config/crm-config-dash-add-web-resource.png)]({{BASE_PATH}}/assets/images/v0.3/crm-config/crm-config-dash-add-web-resource.png)

2. Next create a new dashboard and add the web resource named **'his_/powerBiViewer.html'**.
3. Give the resource a meaningful name and label.
4. Paste the configuration from step 1 into *'Custom parameter (data)'*.
5. Save and publish the dashboard.
6. You are done! The result should be similar to the image below.

   > [![]({{BASE_PATH}}/assets/images/v0.3/samples/sample-crm-sales-performance.png)]({{BASE_PATH}}/assets/images/v0.3/samples/sample-crm-sales-performance.png)
 

#### The parameter construct is:

   > type=report&reportId=*\<reportId\>*[&groupId=*\<groupId\>*]

   > type=tile&dashboardId=*\<dashboardId\>*&tileId=*\<tileId\>*[&groupId=*\<groupId\>*]

#### and if you want to reference by name:
(groups currently not supported when using names)

   > type=report&reportName=*\<reportName\>*

   > type=tile&dashboardName=*\<dashboardName\>*&tileName=*\<tileName\>*
