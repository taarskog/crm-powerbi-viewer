---
layout: page
title: Filter Reports
tagline: on CRM data
description: Filter reports on CRM data or using a custom javascript.
---

Reports shown inside CRM can be filtered by:

1. Setting a static filter.
2. Using attributes from the form where the report is embedded.
3. Creating a custom function that returns the filter. 
<br/>
<br/>

**Note 1.** Currently Power BI supports setting a single filter. Feedback from the team at Build 2016 is that they have plans to add support for multiple filters in a future release.
{: .alert .alert-info }

**Note 2.** Filtering  tiles is not supported by Power BI.
{: .alert .alert-info }

### Static Filter
Static filters is set by adding the following to the end of the CRM data parameters:

    &filter=<table>/<column> eq '<filtervalue>'
   
   |||
   | :---: | --- | 
   | **\<table\>** | Power BI table |
   | **\<column\>** | Power BI column |
   | **\<filtervalue\>** | Filter Value  |
    
**Sample**

    &filter=OpportunitySet/statecode eq 'Open'

### CRM attributes
Power BI reports can also be filtered on a freely defined CRM attribute using the same construct as above but replacing filtervalue with the logical name
of a CRM attribute visible on the form.

    &filter=<table>/<column> eq '{{<logicalname>[#F|T]}}'
   
   |||
   | :---: | --- | 
   | **\<table\>** | Power BI table |
   | **\<column\>** | Power BI column |
   | **\<logicalname\>** | Logical name of an attribute visible on the form. Use \{\{id\}\} to reference the form record. |
   | **#F** | Use the name of a lookup/optionset instead of the value |
   | **#T** | Use logical name of the referenced entity in a lookup |

  <br/>    
**Sample**

    &filter=OpportunitySet/statecode eq '{{parentcontactid#F}}'

**Note.** This method will not work on CRM Dasboards as Dashboards doesn't have CRM attributes to filter on.
{: .alert .alert-info }

### Custom Function
If none of the above methods meets your requirements you have the option of adding your own custom function that returns a filter string. The function should be placed in **/scripts/powerBiConfig.js**
- the same file you modified during [installation](install-solution.html).


**Sample Function**
```js
function opportunityFilter() {
    /// TODO: Add your custom logic to build the filter - such as using parent.Xrm or calling external APIs.
    var filter = "OpportunitySet/Status eq 'Won'";
    
    /// The function must return a string with a valid Power BI filter or null if no filter should be added. 
    return filter;
}
```

You reference the function by adding the following to the end of your CRM data parameters:

    &filterFn=<functionname>'
   
   replacing \<functionname\> with the name of the filter function. The name can be namespaced (*MyFilters.Account.CustomerSalesFilter()* 
    
**Sample**

    &filter=OpportunitySet/statecode eq 'Open'



You can create several functions and reference different filter functions on the various locations you add a report in CRM.
