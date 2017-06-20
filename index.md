---
layout: page
title: CRM Power BI Viewer
tagline: add the Power of BI to Dynamics CRM
description: Embed Power BI reports/tiles into Dynamics CRM dashboards and forms.
---

[Download](https://github.com/taarskog/crm-powerbi-viewer/releases/latest/) \| [Source](https://github.com/taarskog/crm-powerbi-viewer)
{: style="text-align: center"}
<br />

[Power BI](http://powerbi.com) is a great tool for visualising your business data such as those stored
in Dynamics CRM.

An often requested feature is to make these great visuals available inside CRM.

Currently there is no out-of-the-box solution to embed Power BI into Dynamics CRM. The goal of
[crm-powerbi-viewer](https://github.com/taarskog/crm-powerbi-viewer/releases) is to add this much
requested feature.

In its current state crm-powerbi-viewer makes it possible to embed both reports and tiles from a
Power BI dashboard into a form or dashboard in Dynamics CRM.

When creating a dashboard for your users you can embed a group report or tile into a CRM dashboard. And
for self-service dashboards users can embed report and tiles from their personal workspace they have 
created in Power BI.

<br />
[![]({{BASE_PATH}}/assets/images/v0.3/samples/sample-crm-montage-4.png)]({{BASE_PATH}}/assets/images/v0.3/samples/sample-crm-montage-4.png)
<br />
<br />
<br />

**Important** The code is primarily built to support [CRM Online / Dynamics 365](https://www.microsoft.com/en-us/dynamics/crm-office-365.aspx)
and has not been properly tested for Dynamics CRM on-premises. It will run but may have limited functionality - such as embedding multiple tiles/reports on the same page.
Documentation for on-premise is not available - though the most important/only difference is setting crmOnline to false in the configuration web resource.
{: .alert .alert-warning }

<br />

## Installation
You have of course already created a Power BI report or dashboard with tiles you want to embed into your 
Dynamics CRM instance?

As the solution needs to authenticate users against Power BI you need proper rights to add an application
to your Azure Active Directory (AAD). Without such rights you will not be able to make this work.
Reach out to your Office 365 Admin if you do not have the proper rights.

**Installation steps:**

<span class="badge badge-info">AAD</span> [Add crm-powerbi-viewer as an application in Azure AD](pages/v0.3/pages/azure-ad.html)  
<span class="badge badge-info">CRM</span> [Install and configure crm-powerbi-viewer in Dynamics CRM](pages/v0.3/pages/install-solution.html)

<br />

## Configuration

The guides below describe how to add Power BI elements to CRM Dashboards.

<span class="badge badge-info">Report</span> [Add a Power BI report to a Dynamics CRM dashboard](pages/v0.3/pages/add-report-to-dashboard.html)     
<span class="badge badge-info">Filter</span> [Add report filtering](pages/v0.3/pages/filter-reports.html)   
<span class="badge badge-info">Tile</span> [Add a Power BI dashboard tile to a dashboard in Dynamics CRM](pages/v0.3/pages/add-tile-to-dashboard.html)   

<br />

**Note** You can apply exactly the same steps to CRM Forms.
{: .alert .alert-info }

[![]({{BASE_PATH}}/assets/images/v0.3/samples/sample-crm-montage-3.png)]({{BASE_PATH}}/assets/images/v0.3/samples/sample-crm-montage-3.png)
<br />