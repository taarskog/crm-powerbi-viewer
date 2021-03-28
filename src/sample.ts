import {Report, Page, models} from "powerbi-client";

class Filters {
    currentUser(report: Report) {
        report.on("pageChanged", event => {
            let page = <Page>(<any>event).detail.newPage;
            console.log(`Page changed to '${page.displayName}' (${page.name})`);

            if (page.displayName === "Sales Pipeline Leaderboard") {
                const filter = new models.BasicFilter(
                    {
                        table: "User",
                        column: "Full Name" },
                    "In",
                    ["Trond Aarskog"]
                );

                page.setFilters(<any>[filter]);
            }
        });
    }

    test(report: Report) {
        report.on("pageChanged", event => {
            let page = <Page>(<any>event).detail.newPage;
            console.log(`Page changed to '${page.displayName}' (${page.name})`);

            if (page.displayName === "Sales Pipeline Leaderboard") {
                const filter = new models.BasicFilter(
                    {
                        table: "User",
                        column: "Full Name" },
                    "In",
                    ["Trond Aarskog"]
                );

                page.setFilters(<any>[filter]);
            }
        });
    }
}

let Sample;
Sample = Sample || {
    Custom: {
        Filters: new Filters()
    }
};
(<any>window).Sample = Sample;
