# crm-powerbi-viewer
Embed tiles and reports from Power BI into Dynamics CRM Forms and Dashboards.

[![](http://crm-powerbi-viewer.heiigjen.com/assets/images/samples/sample-crm-montage-3.png](http://crm-powerbi-viewer.heiigjen.com)

Read more on what the solution provides and how to get started at [crm-powerbi-viewer.heiigjen.com](http://crm-powerbi-viewer.heiigjen.com).   



## Dev

This is still a fairly young project and I've not had time to add proper development documentation. Reach out if you have questions/trouble getting the code up and running. 

To test locally you need to copy the **powerBiConfig.js** found under 

   > solutionSrc\WebResources\his_\scripts*

into 

   > src\wwwroot\scripts

and set the clientId in the copy. Remember to also update the list of reply urls to include **https://local.heiigjen.com:4343/**. You also need to add a certificate.