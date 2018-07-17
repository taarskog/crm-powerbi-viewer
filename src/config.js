var customConfig = {
	///////////////////////////////
	// ITEMS THAT MUST BE CHANGED
	///////////////////////////////

	// See documentation on how to register the application in Azure AD and get a client id (remember to enclose with quotes - see sample).
	// Sample: auth_client_id: "12345678-1234-abcd-1234-11aabb22cc",
	auth_client_id: null,


	///////////////////////////////////////////
	// CAN USUALLY BE LEFT UNCHANGED 
	// (unless specified in the documentation)
	///////////////////////////////////////////

    // How to perform authentication - valid values are "inline" or "popup". Default is "inline" (rember to enclose with quotes).
    // You should typically use "inline" on Dynamics 365 Online with users located in your Azure AD and "popup" when on-premise (might also be required if you have invited external parties to your Azure AD).
	auth_mode: null,

    // Auto-refresh access - may cause page reload if token cannot be updated silently [valid values are true or false]. Default is true.
	auto_refresh_token: null,

	// Where to cache tokens. Valid values are 'sessionStorage' and 'localStorage'. Default is 'sessionStorage'.
	auth_cache_location: null,

	// Logging of Adal authentication process [Valid values are 0-3] (0=ERROR, 1=WARNING, 2=INFO, 3=VERBOSE). Default is 0.
	auth_log_level: null,

	// Log level for Power BI Viewer [Valid values are 0-3] (0=ERROR, 1=WARNING, 2=INFO, 3=DEBUG). Default is 0.
	// (is not affected by and does not affect auth_log_level)
	log_level: null,

	// Array of custom scripts to load. Functions in these scripts can be referenced for report filtering etc.
	// Sample: custom_scripts: ["../../new_myfilter?ver=1", "../../demo_/powerbi/filters/account.js?ver=1"]
    custom_scripts: null
};