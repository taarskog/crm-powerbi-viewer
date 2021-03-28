window.Samples = window.Samples || {};
Samples.Filters = Samples.Filters || {};

Samples.Filters.testvisual = function (/*report*/) {
    const filter = {
        $schema: "http://powerbi.com/product/schema#basic",
        target: {
            table: "TripPinAirports",
            column: "City"
        },
        operator: "In",
        values: ["San Francisco", "Los Angeles"]
    };

    return [filter];

    // console.log("*****");
    // console.log(report);
    // console.log("*****");

    // let filteredSet = false
    // report.on('rendered', () => {
    //     if (filteredSet) return;
    //     filteredSet = true;
    //     console.log("***** Redered");
    //     report.setFilters([])

    //     //   activePage.setFilters([filter])
    //     //     .then(function () {
    //     //         console.log("Page filter was set.");
    //     //     })
    //     //     .catch(function (errors) {
    //     //         console.error(errors);
    //     //     });
    // });
};

Samples.Filters.test = function (report) {
    const filter = {
        $schema: "http://powerbi.com/product/schema#basic",
        target: {
            table: "TripPinAirports",
            column: "City"
        },
        operator: "In",
        values: ["San Francisco", "Los Angeles"]
    };

    let filteredSet = false
    // TA: This call will happen only once (when report has been rendered)
    report.on('rendered', () => {
        if (filteredSet) return;
        filteredSet = true;
        report.getPages()
            .then(function (pages) {
                // Retrieve active page.
                var activePage = pages.find(function (page) { return page.isActive });

                // TA: Add page filter on initial page
                Samples.Filters.addFilterToPage(filter, activePage);
            })
            .catch(function (errors) { console.error(errors); });
    });

    // TA: This call will happen only once (when report has been loaded)
    report.on("loaded", event => {

        // TA: Here you now add your filter to the full report
        Samples.Filters.addFilterToReport(filter, report);

        // TA: If you need to set filters after the user has changed the page you add the following event
        //     May be useful if you want to re-apply filters when user changes page...
        report.off("pageChanged");
        report.on("pageChanged", function (event) {
            var page = event.detail.newPage;
            console.log(`Page changed to '${page.displayName}' (${page.name})`);

            // TA: Here you can add filter on a specific page (when the user opens it)
            if (page.displayName === "Page 1") {
                // TA: Note that calling this multiple times will add the same filter several times
                //     Thus you need to add handling of duplicates...
                Samples.Filters.addFilterToPage(filter, page);
            }
        });

    });
}

Samples.Filters.addFilterToReport = function (filter, report) {
    Samples.Filters.addFilterToItem(filter, report)
        .then(function () {
            console.log("Report filter was set.");
        })
        .catch(function (errors) {
            console.error(errors);
        });
}

Samples.Filters.addFilterToPage = function (filter, page) {
    Samples.Filters.addFilterToItem(filter, page)
        .then(function () {
            console.log("Page filter was set.");
        })
        .catch(function (errors) {
            console.error(errors);
        });
}

Samples.Filters.addFilterToItem = function (filter, item) {
    return item.getFilters()
        .then(filters => {
            filters.push(filter);
            return item.setFilters(filters)
        });
}

Samples.Filters.testOld = function (report) {
    const filter = {
        $schema: "http://powerbi.com/product/schema#basic",
        target: {
            table: "TripPinAirports",
            column: "City"
        },
        operator: "In",
        values: ["San Francisco", "Los Angeles"]
    };

    let filteredSet = false
    report.on('rendered', () => {
        console.log(`Report rendered`);
        if (filteredSet) return;
        filteredSet = true;
        report.getPages()
            .then(function (pages) {
                // Retrieve active page.
                var activePage = pages.find(function (page) {
                    return page.isActive
                });

                activePage.setFilters([filter])
                    .then(function () {
                        console.log("Page filter was set.");
                    })
                    .catch(function (errors) {
                        console.error(errors);
                    });
            })
            .catch(function (errors) {
                console.error(errors);
            });
    });

    report.off("loaded");
    report.on("loaded", function (loadedEvent) {
        console.log(`Report loaded`);
        //debugger;
        //console.log(loadedEvent);

        // console.log("Set empty filters on report");
        // report.setFilters([]);


        //console.log("Setting report again");
        //report = powerbi.get(loadedEvent.currentTarget);

        try {
            console.log("Remove filters on report");
            report.removeFilters();
        }
        catch (errors) {
            console.error(errors);
        }

        //debugger;


        report.off("pageChanged");
        report.on("pageChanged", function (event) {

            var page = event.detail.newPage;
            // console.log("Remove filters on page");
            // page.removeFilters();

            console.log(`Page changed to '${page.displayName}' (${page.name})`);

            if (page.displayName === "Page 1") {
                page.setFilters([filter]);
            }
        });
    });
}

    // report.off("pageChanged");
    // report.on("pageChanged", function (event) {
    //     //report.setFilters();

    //     let page = event.detail.newPage;
    //     page.removeFilters();
    //     console.log("Remove filters on page");

    //     console.log(`Page changed to '${page.displayName}' (${page.name})`);
    //     console.log(event);

    //     if (page.displayName === "Page 1") {
    //         const filter = {
    //             $schema: "http://powerbi.com/product/schema#basic",
    //             target: {
    //                 table: "TripPinAirports",
    //                 column: "City"
    //             },
    //             operator: "In",
    //             values: ["San Francisco", "Los Angeles"]
    //         };

    //         page.setFilters([filter]);
    //     }
    // });

//     report.on("error", function (event) {
//         console.error("*** REPORT ERROR ***");
//         console.error(event.detail);

//         report.off("error");
//     });
// }