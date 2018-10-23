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
    report.on('rendered', () => {
        if (filteredSet) return;
        filteredSet = true;
        report.getPages()
        .then(function (pages) {
          // Retrieve active page.
          var activePage = pages.find(function(page) {
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
        catch(errors)
        {
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