var customConfig = {
	///////////////////////////////
	//
	// ITEMS THAT MUST BE CHANGED
	//
	///////////////////////////////

	// See documentation on how to register the application in Azure AD and get a client id.
	auth_client_id: null,


	///////////////////////////////////////////
	//
	// CAN USUALLY BE LEFT UNCHANGED 
	// (unless specified in the documentation)
	//
	///////////////////////////////////////////

	// Setting this false enables alternative popup authentication for on-premise installations. Default is true.
	online: null,

    // Auto-refresh access - may cause page reload if token cannot be updated silently. Default is true.
	auto_refresh_token: null,

	// Where to cache tokens. Valid values are 'sessionStorage' and 'localStorage'. Default is 'sessionStorage'.
	auth_cache_location: null,

	// Logging of Adal authentication process [Valid values are 0-3] (0=ERROR, 1=WARNING, 2=INFO, 3=VERBOSE). Default is 0.
	auth_log_level: null,

	// Log level for Power BI Viewer [Valid values are 0-3] (0=ERROR, 1=WARNING, 2=INFO, 3=DEBUG). Default is 0.
	// (is not affected by and does not affect auth_log_level)
	log_level: null,

	// Array of custom scripts to load. Functions in these scripts can be referenced for report filtering etc.
    custom_scripts: null
};