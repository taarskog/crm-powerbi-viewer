# crm-powerbi-viewer
Embed tiles and reports from Power BI into Dynamics CRM Forms and Dashboards.

This is still a fairly young project and I've not had time to add proper documentation just yet. A more detailed guide will be added soon.

## Getting started

~~If you just want the solution embedded into your CRM instance you should head over to the wiki to read the full guide~~ (also in the works).

A detailed guide on configuring Azure AD can be found at <http://crm-powerbi-viewer.heiigjen.com/pages/azure-ad.html>.

###For experienced CRM devs (with Azure AD knowledge) this is the quick intro:

**Installation**

1. Download the latest managed release and import it into your Dynamics CRM instance.
1. Create an application in Azure AD and:
  1. Give it permission to the *Power BI Service*. Give at least:

           [x] View all Reports
           [x] View all Dashboards
  1. Set the reply url to your CRM URL (such as *https://mycrmonline/crm4.dynamics.com*)
  1. Allow Implicit Flow for oAuth2:
    * Download Manifest by clicking Manage Manifest (button at the bottom of the screen).
    * Open it in a text editor and change the value of "oauth2AllowImplicitFlow" from **false** to **true**.
    * Save the manifest and upload the changes (by clicking Manage Manifest once more and choosing Upload).
  1. Copy the client id.
1. In Dynamics CRM either create a new solution or use an existing unmanaged and add the existing web resource named *'his_/scripts/powerBiConfig.js'*.
1. Update the newly added web resource with the client id from Azure AD (remember to remove the comment (//).

**Add to form or dashboard in Dynamics CRM**

1. On a CRM form or dashboard add a web resource and point in to *'his_/powerBiViewer.html'*.
1. If you want to embed a Power BI report you set the data parameters to *type=report&reportId=\<PBI_report_GUID\>*.
1. Or if you want to embed a Power BI tile from a dashboard yo set the data parameters to *type=tile&dashboardId=\<PBI_dashboard_GUID\>&tileId=\<PBI_tile_GUID\>*.
1. If you want to reference the reports/tiles by name you change Id to Name and input that instead - just remember that the names need to be unique.


## Dev

To test locally you need to copy the powerBiConfig.js found under solutionSrc\WebResources\his_\scripts into src\wwwroot\scripts and set the clientId in the copy.
   Remember to also update the list of reply urls to include http://localhost:5000.