---
layout: page
title: Troubleshooting
tagline: 
description: Answers to common issues.
---

If you don't find an answer here - [report your issue](https://github.com/taarskog/crm-powerbi-viewer/issues).
<br />
<br />
#### Refused to display 'https://login.microsoftonline.com/common/oauth2/authorize?*...*' in a frame because it set 'X-Frame-Options' to 'deny'.
Will occur if you are on-premise and have forgot to set **auth_mode** to **"popup"** in the config.

The message may also occur if you are logged in to another Power BI instance (in another tenant). Log out and try again.

#### Does not work on Mobile devices
Unfortunately that is currently not possible ref. known issues on [iFrame and web resource support in Dynamics 365 for tablets](https://docs.microsoft.com/en-us/dynamics365/customer-engagement/mobile-app/v8/go-mobile/admin-troubleshoot/iframe-web-resource-support#known-issues)

> Authentication for embedded sites isn’t available.

#### Error message on configuration page
On the solution configuration you get: _"An error has occurred. Please try again and finally contact your administrator. More details may be found in the debug console (if appropriate logging level has been set)."_

Take a look at the debug console (press F12). Best guess is that you have forgotten quotes (") around the client id in the config file. If that is not the case and the debug console does not provide hints I suggest increasing the log level to verbose.