---
layout: page
title: Instrumentation
tagline: metrics collected
description: Information on metrics collected to improve the solution.
---

A few usage metrics are collected when using crm-powerbi-viewer. This help improve the solution and understand usage patterns. Logged information are such as
major events (e.g. login success/failure) and what type of views displayed (tile, dashboard, report, admin). A hashed, and thus not identifiable, version of the user 
id is connected to these events to help pinpoint issues. By installing and configuring crm-powerbi-viewer it is assumed that you agree to the above.

To see what is logged from your environment you can add
```js
analytics_local_view: true,
```

to your config file. This will log all metrics to the browser console with "**[PBIA]**" as prefix.
