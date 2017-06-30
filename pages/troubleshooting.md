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