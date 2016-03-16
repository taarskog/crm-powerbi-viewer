---
layout: page
title: Add a Power BI dashboard tile
tagline: to Dynamics CRM
description: How to add a tile from a Power BI dashboard to a dashboard in Dynamics CRM.
---

[![]({{BASE_PATH}}/assets/images/samples/sample-crm-montage-3.png)]({{BASE_PATH}}/assets/images/samples/sample-crm-montage-3.png)

You embed a Power BI dashboard tile by referencing the Power BI tile id and the corresponding dashboard id. Alternatively you can
reference the dashboard and tile by name, just be aware that if multiple dashboards and/or tiles have the same name the first matching name will be used.

The easiest approach to find tiles you have access to and the required CRM configuration is by going to the solution
configuration page (image below shows an early version of this page).

   > [![]({{BASE_PATH}}/assets/images/crm-config/crm-config-get-tile-params.png)]({{BASE_PATH}}/assets/images/crm-config/crm-config-get-tile-params.png)

The configuration page lists available tiles and reports. Both those you have access to through your workspace and those through
group membership(s). Click preview to see how the tile looks inside Dynamics CRM (note: shown inside the configuration page).

1. When you have found the tile you want to use you need to copy the configuration values 
(text marked 1 in the picture above - all text between the pipes).

   > [![]({{BASE_PATH}}/assets/images/crm-config/crm-config-dash-add-web-resource.png)]({{BASE_PATH}}/assets/images/crm-config/crm-config-dash-add-web-resource.png)

2. Next create a new dashboard and add the web resource named **'his_/powerBiViewer.html'**.
3. Give the resource a meaningful name and label.
4. Paste the configuration from step 1 into *'Custom parameter (data)'*.
5. Save and publish the dashboard.
6. You are done! The result should be similar to the image below.

[![]({{BASE_PATH}}/assets/images/samples/sample-crm-tiles-on-dashboard.png)]({{BASE_PATH}}/assets/images/samples/sample-crm-tiles-on-dashboard.png)
 

#### The parameter construct is:

   > type=report&reportId=*\<reportId\>*[&groupId=*\<groupId\>*]

   > type=tile&dashboardId=*\<dashboardId\>*&tileId=*\<tileId\>*[&groupId=*\<groupId\>*]

#### and if you want to reference by name:
(groups currently not supported when using names)

   > type=report&reportName=*\<reportName\>*

   > type=tile&dashboardName=*\<dashboardName\>*&tileName=*\<tileName\>*
