---
layout: page
title: Advanced Configuration
tagline: Introduction
description: How to add custom logic to embedded Power BI views in Dynamics 365.
---

With crm-powerbi-viewer you can add custom logic to any Power BI view.

First you put your filter and event handling logic in functions inside one or more scripts (web resources). These you reuse across
embedded views by referencing the functions. You tell crm-powerbi-viewer about your scripts by referencing them in the crm-powerbi-viewer application config.

## Steps
To call custom logic you need to:

0. Create a javascript webresource with a function that takes the embedded Power BI object as first and only argument. In this function you add [filters](https://github.com/Microsoft/PowerBI-JavaScript/wiki/Filters) and/or [event handlers](https://github.com/Microsoft/PowerBI-JavaScript/wiki/Handling-Events) to the embedded object (see below for a sample function).
0. Add a reference to the new web resource in crm-powerbi-viewer config:
   0. Open the power bi viewer config file and locate **custom_scripts**
   0. Change null to an array of scripts to load. It is recommended that these scripts are web resources

      ```javascript
      custom_scripts: ["samples/filters.js?ver=1", "../../prefix_/scripts/eventhandlers.js?ver=1"]
      ```

      **?ver=1** added so cache can be invalidated on new versions. Currently scripts are not cached but that may change in a future release.
      Increase the value when releasing updates to the script.

      It is recommended to use relative urls. They are relative to viewer.html.

0. Then add **&customFn=\<functionname\>** to the web resource custom parameter (dot notation is supported on functionname).<br /><br />

   > [![]({{BASE_PATH}}/assets/images/v1.0/crm-advanced/sample-filterbyuser-customfn.png)]({{BASE_PATH}}/assets/images/v1.0/crm-advanced/sample-filterbyuser-customfn.png)

<br />

You can have multiple functions in a script file and each embedded view may call different functions. Thus various filters and events can be set for each view.

<br />
<br />

## Sample functions
### Filter report page by user name

```javascript
window.Samples = window.Samples || {};
Samples.Filters = Samples.Filters || {};

/**
 * Filter on user by name whenever a specific page is shown.
 * 
 * Note: This resets the filter whenever the user navigates to the specific page. 
 * Remove the event logic and set the filter once to avoid resetting on every navigation.
 * 
 * Suggested modifications:
 * - In your own code you should check against page name and not displayname to avoid 
 *   breaking the code if someone changes the displayname
 * - Filters should be on ID and not name
 * - Using Xrm get name/id from current user or owner if view is embedded to a form.
 */
Samples.Filters.filterOnUser = function (report) {
    report.on("pageChanged", function(event) {
        let page = event.detail.newPage;
        console.log(`Page changed to '${page.displayName}' (${page.name})`);

        if (page.displayName === "Top Won/Lost Deals") {
            const filter = {
                $schema: "http://powerbi.com/product/schema#basic",
                target: {
                    table: "User",
                    column: "Full Name"
                },
                operator: "In",
                values: ["Trond Aarskog"]
            };

            page.setFilters([filter]);
        }
    });
}
```

