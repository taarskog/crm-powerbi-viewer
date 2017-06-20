---
layout: page
title: CRM Power BI Viewer
tagline: add the Power of BI to Dynamics CRM
description: Embed Power BI reports/tiles into Dynamics CRM dashboards and forms.
---

[Download](https://github.com/taarskog/crm-powerbi-viewer/releases/latest/) \| [Source](https://github.com/taarskog/crm-powerbi-viewer)
{: style="text-align: center"}
<br />

**Note** Documentation for version 0.3 is moved [here](pages/v0.3/index.html) 
{: .alert .alert-information }

[Power BI](http://powerbi.com) is a great tool for visualising your business data. An often requested feature is to make these great visuals available inside Dynamics 365.

Today you can embed Power BI in your personal dashboards in Dynamics 365. But the functionality is very limited. The goal of
[crm-powerbi-viewer](https://github.com/taarskog/crm-powerbi-viewer/releases) is to provide as much of the Power BI functionality as possible. 

**Added functionality in crm-powerbi-viewer:**
- Can be added to any dashboard (not only personal)
- Can be added to both Dashboards and Forms
- Works with on-premise Dynamics 365 installations
- Open reports on specific page
- Add custom filters and interactions:
    - Open Dynamics 365 records when clicked in a report 
    - Filter reports on Dynamics 365 data (e.g. filter on account id when showing reports on an account form)

<br />
[![]({{BASE_PATH}}/assets/images/v0.3/samples/sample-crm-montage-4.png)]({{BASE_PATH}}/assets/images/v0.3/samples/sample-crm-montage-4.png)
<br />
<br />
<br />

## Installation
You have of course already created a Power BI report or dashboard with tiles you want to embed into your 
Dynamics 365 instance?

As the solution needs to authenticate users against Power BI you need proper rights to add an application
to your Azure Active Directory (AAD). Without such rights you will not be able to make this work.
Reach out to your Office 365 Admin if you do not have the proper rights.

**Installation steps:**

[<span class="badge badge-info">AAD</span> Add crm-powerbi-viewer as an application in Azure AD](pages/azure-ad.html)  
[<span class="badge badge-info">CRM</span> Install and configure crm-powerbi-viewer in Dynamics CRM](pages/install-solution.html)

<br />

## Basic Configuration

The guides below describe how to add Power BI elements to Dynamics 365 Dashboards.

[<span class="badge badge-info">Report</span> Add a Power BI report](pages/add-report-to-dashboard.html)     
[<span class="badge badge-info">Dashboard</span> Add a Power BI Dashboard](pages/add-dashboard-to-dashboard.html)   
[<span class="badge badge-info">Tile</span> Add a Power BI dashboard tile](pages/add-tile-to-dashboard.html)   

<br />

**Note** You can apply exactly the same steps to CRM Forms.
{: .alert .alert-info }

[![]({{BASE_PATH}}/assets/images/v0.3/samples/sample-crm-montage-3.png)]({{BASE_PATH}}/assets/images/v0.3/samples/sample-crm-montage-3.png)
<br />

## Advanced Configuration
[<span class="badge badge-info">...</span> ...](pages/.html)
[<span class="badge badge-info">...</span> ...](pages/.html)
[<span class="badge badge-info">...</span> ...](pages/.html)
[<span class="badge badge-info">...</span> ...](pages/.html)
[<span class="badge badge-info">...</span> ...](pages/.html)
[<span class="badge badge-info">...</span> ...](pages/.html)
[<span class="badge badge-info">...</span> ...](pages/.html)
[<span class="badge badge-info">...</span> ...](pages/.html)
