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

    report.on("loaded", function (loadedEvent) {
        report.removeFilters(); // For some reason this needs to be done before setting page filters (August 2018)

        report.on("pageChanged", function(pageChangedEvent) {
            let page = pageChangedEvent.detail.newPage;
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
    });
}
