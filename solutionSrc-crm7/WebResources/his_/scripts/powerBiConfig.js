var powerBiViewerConfig = {
	// See documentation on how to register the application in Azure AD and get a client id. Uncomment the line below and insert your client id.
	//clientId: "<Get Client Id from Azure AD>",

	// Where to cache tokens. Valid values are 'sessionStorage' or 'localStorage'. You will typically use session.
	tokenCacheLocation: 'sessionStorage',

	// Set true to cache http requests (should be no reason to change it - keep it on true).
	enableHttpCache: true,

	// Logging of Adal authentication process [Valid values are 0-3] (0=ERROR, 1=WARNING, 2=INFO, 3=VERBOSE)
	adalLogLevel: 0
};
