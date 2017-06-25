---
layout: page
title: CRM Power BI Viewer
tagline: add the Power of BI to Dynamics 365
description: Embed Power BI reports/tiles into Dynamics CRM dashboards and forms.
---

[Download](https://github.com/taarskog/crm-powerbi-viewer/releases/latest/) \| [Source](https://github.com/taarskog/crm-powerbi-viewer)
{: style="text-align: center"}

**Note** Documentation for previous version 0.3 is moved [here](pages/v0.3/index.html) 
{: .alert .alert-information }
<br />

[Power BI](http://powerbi.com) is the best tool for visualising your business data. As a customer of Dynamics 365 you obviously want to take advantage of Power BI inside your dashboards and forms.

Today Dynamics 365 support showing Power BI reports and dashboards in your personal dashboards. But the functionality is limited. The goal of
[crm-powerbi-viewer](https://github.com/taarskog/crm-powerbi-viewer/releases) is to provide as much of the Power BI functionality as possible.

Below is a list of enhancements provided by crm-powerbi-viewer that for the time being is _not_ available by using the built-in PowerBI integration in Dynamics 365.

<br />
[![]({{BASE_PATH}}/assets/images/v1.0/samples/sample-montage-dashboards.png)]({{BASE_PATH}}/assets/images/v1.0/samples/sample-montage-dashboards.png)
<br />
<br />
<br />

**Enhancements:**
- Embed Power BI to any dashboard (not only personal)
- Embed Power BI to both dashboards and forms
- Works with on-premise Dynamics 365 installations
- Supports opening reports on any page
- Support for custom filters and interactions. Enabling:
    - Open related Dynamics 365 records when clicking on data in a report
    - Filter reports on Dynamics 365 data (e.g. filter on account id when showing reports on an account form)
- Hide report navigation and filter panes
- Mix and match multiple Power BI elements with Dynamics 365 elements on a single dashboard/form

<br />
[![]({{BASE_PATH}}/assets/images/v1.0/samples/sample-multi-tiles-on-dash.png)]({{BASE_PATH}}/assets/images/v1.0/samples/sample-multi-tiles-on-dash.png)
<br />
<br />
<br />

## Installation

### Prerequisits
You have of course already created a Power BI report or dashboard with tiles you want to embed into your Dynamics 365 instance? 
If not go ahead and do that now. You should create your content in a Workspace for easy sharing with users of Dynamics 365.

As the solution needs to authenticate users against Power BI you need proper rights to add an application
to your Azure Active Directory (AAD). Without such rights you will not be able to make this work.
Reach out to your Azure or Office 365 Admin if you do not have the proper rights.

### Installation steps:

[<span class="badge badge-info">AAD</span> Add crm-powerbi-viewer as an application in Azure AD](pages/azure-ad.html)  
[<span class="badge badge-info">CRM</span> Install and configure crm-powerbi-viewer in Dynamics 365 Sales and Service](pages/install-solution.html)

<br />

### Basic Configuration

The guide below describe how to add Power BI elements to Dynamics 365 Dashboards.

[<span class="badge badge-info">Dash</span> Add a Power BI View to a CRM Dashboard](pages/add-view-to-dashboard.html)   

<br />

**Note** You can apply exactly the same steps to CRM Forms.
{: .alert .alert-info }

[![]({{BASE_PATH}}/assets/images/v0.3/samples/sample-crm-montage-3.png)]({{BASE_PATH}}/assets/images/v0.3/samples/sample-crm-montage-3.png)
<br />

### Advanced Configuration

_Documentation to be added_

<!--
[<span class="badge badge-info">...</span> ...](pages/.html)
[<span class="badge badge-info">...</span> ...](pages/.html)
[<span class="badge badge-info">...</span> ...](pages/.html)
[<span class="badge badge-info">...</span> ...](pages/.html)
[<span class="badge badge-info">...</span> ...](pages/.html)
[<span class="badge badge-info">...</span> ...](pages/.html)
[<span class="badge badge-info">...</span> ...](pages/.html)
[<span class="badge badge-info">...</span> ...](pages/.html)
-->