---
layout: page
title: Filter Reports
tagline: on CRM data
description: Filter reports on CRM data or using a custom javascript.
---

**Reports shown inside CRM can be filtered by:**

<span class="badge badge-info">1</span> Setting a static filter.   
<span class="badge badge-info">2</span> Using attributes from the form where the report is embedded.   
<span class="badge badge-info">3</span> Creating a custom function that returns the filter.   

[![]({{BASE_PATH}}/assets/images/crm-config/crm-config-report-filter.png)]({{BASE_PATH}}/assets/images/crm-config/crm-config-report-filter.png)


**Note 1.** Currently Power BI supports setting a single filter. Feedback from the team during Build 2016 was that they have plans to add support for multiple filters in a future release.
{: .alert .alert-info }

**Note 2.** Filtering  tiles is not supported by Power BI.
{: .alert .alert-info }

### 1. Static Filter
Static filters is set by adding the following to the end of the CRM data parameters.

#### Format
{% raw %}
    &filter=<table>/<column> eq '<filtervalue>'
{% endraw %}
| **table** | Power BI table (cannot contain spaces) |
| **column** | Power BI column (cannot contain spaces) |
| **filtervalue** | Filter Value  |
{: .table .table-condensed .table-bordered .table-hover}

#### Sample
   > `&filter=OpportunitySet/statecode eq 'Open'`

### 2. CRM attributes
Power BI reports can also be filtered on a freely defined CRM attribute using the same construct as above but replacing filtervalue with the logical name
of a CRM attribute visible on the form.

#### Format
{% raw %}
    &filter=<table>/<column> eq '{{<logicalname>[#F|T]}}'
{% endraw %}

| **table** | Power BI table (cannot contain spaces) |
| **column** | Power BI column (cannot contain spaces) |
| **logicalname** | Logical name of an attribute visible on the form. Use \{\{id\}\} to reference the form record |
| **#F** | Use the name of a lookup/optionset instead of the value |
| **#T** | Use logical name of the referenced entity in a lookup |
{: .table .table-condensed .table-bordered .table-hover}

#### Sample

   > `&filter=OpportunitySet/statecode eq '{% raw %}{{parentcontactid#F}}{% endraw %}'`

**Note.** This method will not work on CRM Dashboards as Dashboards doesn't have CRM attributes to filter on.
{: .alert .alert-warning }

### 3. Custom Function
If none of the above methods meet your requirements you have the option of adding your own custom function that returns a filter string. The function should be placed in the web resource named **his_/scripts/powerBiConfig.js**
- the same file you modified during [installation](install-solution.html).

#### Sample Function
```js
function opportunityFilter() {
    // TODO: Add your custom logic to build the filter. 
    // - such as using parent.Xrm or calling external APIs.
    var filter = "OpportunitySet/Status eq 'Won'";
        
    // The function must return a string with a valid 
    // Power BI filter or null if no filter should be added.
    //
    // Remember that Power BI does not support spaces on table
    // and column names when filtering through the API
    return filter;
}
```

#### Format

Reference the function by adding the following to the end of your CRM data parameters.

{% raw %}
    &filterFn=<functionname>'
{% endraw %}

| **functionname** | Name of the filter function. The name can be namespaced (*MyFilters.Account.CustomerSalesFilter()* |
{: .table .table-condensed .table-bordered .table-hover}

#### Sample

   > &filter=OpportunitySet/statecode eq 'Open'


**Note.** You can create several functions and reference different filter functions on the various locations you add a report in CRM.
{: .alert .alert-warning }