---
layout: page
title: CRM Power BI Viewer
tagline: Add Power BI to Dynamics CRM
description: Embed Power BI reports/tiles into Dynamics CRM dashboards and forms.
---

[![]({{BASE_PATH}}/assets/images/samples/sample-crm-montage.png)]({{BASE_PATH}}/assets/images/samples/sample-crm-montage.png)

## Installation
This is how you make it possible to show Power BI reports and tiles in your CRM Online installation.

### First things

You have of course already created a Power BI report or dashboard with tiles you want to embed into your Dynamics CRM instance?

As the solution needs to authenticate users against Power BI you must verify that you have the proper rights to add an 
application to your Azure Active Directory (AAD). Without such rights you will not be able to make this work.

### Let's get going

1. [Add crm-powerbi-viewer as an application in Azure AD](pages/azure-ad.html)
1. [Install and configure crm-powerbi-viewer in Dynamics CRM](pages/install-solution.html)

## Configuration *(currently incomplete)*

The guides below shows how to add Power BI elements to CRM Dashboards. You can apply the same steps to CRM Forms.

1. [Add a Power BI report to a Dynamics CRM dashboard](pages/add-report-to-dashboard.html)
1. [Add a Power BI dashboard tile to a dashboard in Dynamics CRM](pages/add-tile-to-dashboard.html)
